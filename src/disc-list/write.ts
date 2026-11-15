// Writing the disc list to the disc.
//
// Each waiting song becomes one of upstream's "adaptive files": an object
// the convert dialog and upload routine already understand, which fetches
// and converts its audio only when its turn comes. So the songs go through
// the same convert dialog, encoders and upload as files dropped from disk.

import { JellyfinClient, JellyfinError } from '../jellyfin/api';
import serviceRegistry from '../services/registry';
import type { AudioEncoderV1ExportParams } from '../services/audio/apiv1/external-interface';
import type { AdaptiveFile } from '../utils';
import type { Entry } from './store';

type Progress = (object: { stage: string; progress: number; total: number }) => void;

// MARK: Handing files to the recorder side

type WriteListener = (files: AdaptiveFile[]) => void;
const listeners = new Set<WriteListener>();

/** The recorder's main view listens here for songs to put through its convert dialog. */
export function onWriteRequest(listener: WriteListener): () => void {
    listeners.add(listener);
    return () => listeners.delete(listener);
}

/** True if something is listening, that is, a recorder is connected and showing its disc. */
export function canRequestWrite(): boolean {
    return listeners.size > 0;
}

export function requestWrite(files: AdaptiveFile[]) {
    listeners.forEach((listener) => listener(files));
}

// MARK: Names

/** A file extension for Jellyfin's container name, which can be a list such as "mov,mp4,m4a". */
export function extensionFor(container: string | undefined): string {
    const names = (container ?? '').toLowerCase().split(',').filter(Boolean);
    if (names.includes('m4a') || names.includes('mp4')) return 'm4a';
    const first = names[0] ?? '';
    return /^[a-z0-9]{1,5}$/.test(first) ? first : 'audio';
}

/**
 * The name the song would have as a file. The convert dialog's default
 * title is the file name without its extension, so this is "Artist - Title".
 */
export function fileNameFor(entry: Pick<Entry, 'name' | 'artist' | 'container'>): string {
    const base = entry.artist ? `${entry.artist} - ${entry.name}` : entry.name;
    return `${base.replace(/[\\/]/g, '-')}.${extensionFor(entry.container)}`;
}

// MARK: Fetching audio

export class DownloadError extends Error {
    constructor(
        message: string,
        public status?: number
    ) {
        super(message);
        this.name = 'DownloadError';
    }
}

/** Fetches a URL with the session's sign-in, reporting bytes as they arrive. */
async function download(client: JellyfinClient, url: string, onBytes: (received: number, total: number) => void, fetchImpl: typeof fetch): Promise<Uint8Array<ArrayBuffer>> {
    let response: Response;
    try {
        response = await fetchImpl(url, { headers: { Authorization: client.authorizationHeader() } });
    } catch {
        throw new DownloadError("couldn't reach your Jellyfin server.");
    }
    if (response.status === 401) throw new JellyfinError('expiredToken', 'your Jellyfin session expired. Sign in again, then write the rest.', 401);
    if (!response.ok) throw new DownloadError(`the server refused the download (HTTP ${response.status}).`, response.status);

    const total = Number(response.headers.get('Content-Length')) || 0;
    if (!response.body) {
        const all = new Uint8Array(await response.arrayBuffer());
        onBytes(all.byteLength, all.byteLength);
        return all;
    }
    const reader = response.body.getReader();
    const chunks: Uint8Array[] = [];
    let received = 0;
    try {
        for (;;) {
            const { done, value } = await reader.read();
            if (done) break;
            chunks.push(value);
            received += value.byteLength;
            onBytes(received, total);
        }
    } catch {
        throw new DownloadError('the download was interrupted.');
    }
    const all = new Uint8Array(received);
    let offset = 0;
    for (const chunk of chunks) {
        all.set(chunk, offset);
        offset += chunk.byteLength;
    }
    return all;
}

export interface Encoder {
    transcode(source: Uint8Array<ArrayBuffer>, sourceFileName: string, exportParams: AudioEncoderV1ExportParams, callback?: Progress): Promise<Uint8Array<ArrayBuffer>>;
}

export interface WriteOptions {
    client: JellyfinClient;
    /** Called when a song is on the disc, with the title it has there. */
    onWritten: (entry: Entry, title: string) => void;
    encoder?: () => Encoder | undefined;
    fetch?: typeof fetch;
}

/** How many songs may be fetched and converted ahead of the one being sent to the disc. */
const AHEAD = 2;

/**
 * The waiting songs as adaptive files, in order.
 *
 * Each one, when asked: downloads the original file from Jellyfin, converts
 * it with the app's encoder and returns the result. If the encoder can't
 * read the original, it asks Jellyfin for a FLAC copy and tries once more.
 * Songs are held back so that only a few are converted ahead of the upload,
 * rather than the whole list sitting in memory.
 */
export function adaptiveFilesFor(entries: Entry[], options: WriteOptions): AdaptiveFile[] {
    const fetchImpl = options.fetch ?? ((...args) => fetch(...args));
    const encoder = options.encoder ?? (() => serviceRegistry.audioExportService);
    // Songs are asked for in upload order. `begun` counts those let through,
    // `uploaded` those now on the disc; the difference is what's held in memory.
    let begun = 0;
    let uploaded = 0;
    let waiters: (() => void)[] = [];
    const turn = () =>
        new Promise<void>((resolve) => {
            const check = () => {
                if (begun - uploaded <= AHEAD) {
                    begun++;
                    resolve();
                } else {
                    waiters.push(check);
                }
            };
            check();
        });
    const advance = () => {
        uploaded++;
        const waiting = waiters;
        waiters = [];
        waiting.forEach((check) => check());
    };

    return entries.map((entry, index) => {
        const name = fileNameFor(entry);
        // ffmpeg only needs a plain name with the right ending.
        const sourceName = `track${index}.${extensionFor(entry.container)}`;
        return {
            name,
            title: entry.name,
            artist: entry.artist,
            album: entry.album,
            duration: entry.seconds,

            async getForEncoding(params: AudioEncoderV1ExportParams, progress?: Progress): Promise<ArrayBuffer> {
                await turn();
                const service = encoder();
                if (!service) throw new DownloadError('no audio encoder is loaded.');
                const downloading = (stage: string) => (received: number, total: number) =>
                    progress?.({ stage, progress: total ? received : 0, total: total || 1 });

                let original: Uint8Array<ArrayBuffer>;
                try {
                    original = await download(options.client, options.client.url(`Items/${entry.trackId}/Download`), downloading('Downloading from Jellyfin'), fetchImpl);
                } catch (e) {
                    // An account without permission to download files can still play them: fetch the same file as a stream.
                    if (!(e instanceof DownloadError) || e.status !== 403) throw e;
                    const streamUrl = options.client.url(`Audio/${entry.trackId}/stream`, { static: true });
                    original = await download(options.client, streamUrl, downloading('Downloading from Jellyfin'), fetchImpl);
                }
                try {
                    return (await service.transcode(original, sourceName, params, progress)).buffer;
                } catch (firstError) {
                    // The built-in ffmpeg is old and can't read every format. Jellyfin can hand us FLAC instead.
                    console.warn(`Couldn't convert ${name} as it is; asking Jellyfin for FLAC.`, firstError);
                    const flacUrl = options.client.url(`Audio/${entry.trackId}/stream.flac`, { static: false, audioCodec: 'flac', container: 'flac' });
                    const flac = await download(options.client, flacUrl, downloading('Downloading a FLAC copy from Jellyfin'), fetchImpl);
                    return (await service.transcode(flac, `track${index}.flac`, params, progress)).buffer;
                }
            },

            onUploaded(title: string) {
                advance();
                options.onWritten(entry, title);
            },

            describeError(error: unknown): string {
                if (error instanceof DownloadError || error instanceof JellyfinError) return `${entry.name}: ${error.message}`;
                return `${entry.name}: couldn't be converted, even from a FLAC copy.`;
            },
        };
    });
}
