import { describe, expect, it } from 'vitest';
import { JellyfinClient } from '../../jellyfin/api';
import { Entry, isOnDisc } from '../store';
import { adaptiveFilesFor, extensionFor, fileNameFor, Encoder } from '../write';

const entry = (id: string, extra: Partial<Entry> = {}): Entry => ({ key: `k-${id}`, trackId: id, name: `Song ${id}`, artist: 'Artist', album: 'Album', seconds: 200, container: 'flac', ...extra });
const params = { format: { codec: 'PCM' } } as never;
const client = (calls: string[], answer: (url: URL) => Response | Promise<Response>) => ({
    client: new JellyfinClient({ serverUrl: 'https://music.example.com', deviceId: 'd', deviceName: 'Test', accessToken: 'tok', userId: 'u1' }),
    fetch: (async (url: RequestInfo | URL, init?: RequestInit) => {
        const u = new URL(String(url));
        calls.push(`${u.pathname}${(init?.headers as Record<string, string>)?.Authorization?.includes('Token="tok"') ? '' : ' (no token)'}`);
        return answer(u);
    }) as typeof fetch,
});
const bytes = (text: string) => new Response(new TextEncoder().encode(text), { status: 200 });
const decoded = (data: ArrayBuffer) => new TextDecoder().decode(data);

describe('file names', () => {
    it('picks an extension from the container', () => {
        expect(extensionFor('flac')).toBe('flac');
        expect(extensionFor('mov,mp4,m4a,3gp,3g2,mj2')).toBe('m4a');
        expect(extensionFor('MP3')).toBe('mp3');
        expect(extensionFor(undefined)).toBe('audio');
        expect(extensionFor('we/ird')).toBe('audio');
    });

    it('names the file "Artist - Title", keeping dots in the title', () => {
        expect(fileNameFor({ name: 'Mr. Blue Sky', artist: 'ELO', container: 'flac' })).toBe('ELO - Mr. Blue Sky.flac');
        expect(fileNameFor({ name: 'AC/DC Song', artist: '', container: 'mp3' })).toBe('AC-DC Song.mp3');
    });
});

describe('adaptive files', () => {
    const echo: Encoder = { transcode: async (source) => new TextEncoder().encode('enc:' + new TextDecoder().decode(source)) };

    it('downloads the original with the session token and converts it', async () => {
        const calls: string[] = [];
        const { client: c, fetch } = client(calls, (u) => bytes(`audio ${u.pathname.split('/')[2]}`));
        const stages: string[] = [];
        const [file] = adaptiveFilesFor([entry('a')], { client: c, fetch, encoder: () => echo, onWritten: () => {} });
        expect([file.name, file.title, file.artist, file.album, file.duration]).toEqual(['Artist - Song a.flac', 'Song a', 'Artist', 'Album', 200]);
        const data = await file.getForEncoding(params, (p) => stages.push(p.stage));
        expect(decoded(data)).toBe('enc:audio a');
        expect(calls).toEqual(['/Items/a/Download']);
        expect(stages).toContain('Downloading from Jellyfin');
    });

    it('falls back to a FLAC copy when the original cannot be converted', async () => {
        const calls: string[] = [];
        const { client: c, fetch } = client(calls, (u) => bytes(u.pathname.includes('stream.flac') ? 'flac' : 'odd'));
        const picky: Encoder = {
            transcode: async (source, name) => {
                if (!name.endsWith('.flac')) throw new Error('unsupported');
                return new TextEncoder().encode('enc:' + new TextDecoder().decode(source));
            },
        };
        const [file] = adaptiveFilesFor([entry('a', { container: 'ape' })], { client: c, fetch, encoder: () => picky, onWritten: () => {} });
        expect(decoded(await file.getForEncoding(params))).toBe('enc:flac');
        expect(calls).toEqual(['/Items/a/Download', '/Audio/a/stream.flac']);
    });

    it('fetches the file as a stream when the account may not download', async () => {
        const calls: string[] = [];
        const { client: c, fetch } = client(calls, (u) => (u.pathname.endsWith('/Download') ? new Response('', { status: 403 }) : bytes('streamed')));
        const [file] = adaptiveFilesFor([entry('a')], { client: c, fetch, encoder: () => echo, onWritten: () => {} });
        expect(decoded(await file.getForEncoding(params))).toBe('enc:streamed');
        expect(calls).toEqual(['/Items/a/Download', '/Audio/a/stream']);
    });

    it('explains a failed download and an expired session', async () => {
        const { client: c, fetch } = client([], () => new Response('', { status: 500 }));
        const [file] = adaptiveFilesFor([entry('a')], { client: c, fetch, encoder: () => echo, onWritten: () => {} });
        const error = await file.getForEncoding(params).catch((e) => e);
        expect(file.describeError!(error)).toBe('Song a: the server refused the download (HTTP 500).');

        const expired = client([], () => new Response('', { status: 401 }));
        const [file2] = adaptiveFilesFor([entry('b')], { client: expired.client, fetch: expired.fetch, encoder: () => echo, onWritten: () => {} });
        expect(file2.describeError!(await file2.getForEncoding(params).catch((e) => e))).toContain('session expired');
    });

    it('only fetches a few songs ahead of the upload, and records each one written', async () => {
        const calls: string[] = [];
        const { client: c, fetch } = client(calls, () => bytes('x'));
        const written: string[] = [];
        const files = adaptiveFilesFor(['a', 'b', 'c', 'd', 'e'].map((id) => entry(id)), {
            client: c,
            fetch,
            encoder: () => echo,
            onWritten: (e, title) => written.push(`${e.trackId}=${title}`),
        });
        const settle = async () => {
            for (let i = 0; i < 20; i++) await new Promise((done) => setTimeout(done, 0));
        };
        const started = files.map((file) => file.getForEncoding(params));
        await settle();
        expect(calls.length).toBe(3); // a, b and c; d and e wait
        files[0].onUploaded!('A');
        await settle();
        expect(calls.length).toBe(4);
        files[1].onUploaded!('B');
        await settle();
        expect(calls.length).toBe(5);
        await Promise.all(started);
        expect(written).toEqual(['a=A', 'b=B']);
    });

    it("isn't held up by songs taken out in the convert dialog", async () => {
        const calls: string[] = [];
        const { client: c, fetch } = client(calls, () => bytes('x'));
        const files = adaptiveFilesFor(['a', 'b', 'c', 'd', 'e', 'f'].map((id) => entry(id)), { client: c, fetch, encoder: () => echo, onWritten: () => {} });
        // Only the last two are kept; they must start at once.
        await Promise.all([files[4].getForEncoding(params), files[5].getForEncoding(params)]);
        expect(calls).toEqual(['/Items/e/Download', '/Items/f/Download']);
    });
});

describe('isOnDisc', () => {
    it('trusts the record when no disc can be checked, and the disc when one can', () => {
        const written = entry('a', { writtenTitle: 'Artist - Song a' });
        expect(isOnDisc(entry('b'), null)).toBe(false);
        expect(isOnDisc(written, null)).toBe(true);
        expect(isOnDisc(written, new Set(['Artist - Song a']))).toBe(true);
        expect(isOnDisc(written, new Set(['Something else']))).toBe(false);
    });
});
