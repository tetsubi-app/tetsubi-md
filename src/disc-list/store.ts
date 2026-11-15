// The disc list: the Jellyfin songs chosen for a MiniDisc, and the Jellyfin
// playlist that mirrors them.
//
// Every add, removal and reorder is saved to the playlist at once. Saves go
// through a single queue (`flush`), which always sends the latest state, so
// quick edits can't arrive out of order.
//
// Like the session, this lives outside the app's redux store, which upstream
// resets whenever the recorder disconnects.

import { useSyncExternalStore } from 'react';

import { JellyfinClient, JellyfinError } from '../jellyfin/api';
import * as library from '../jellyfin/library';
import { Playlist, Track } from '../jellyfin/library';
import { currentClient, getJellyfinState, signOut, subscribe as subscribeToSession } from '../jellyfin/session';
import { RecordingMode, UNTITLED, localDate, playlistName, splitPlaylistName } from './naming';

export interface Entry {
    /** Unique within the list; the row's identity while dragging. */
    key: string;
    trackId: string;
    name: string;
    artist: string;
    album: string;
    seconds: number;
    /** Jellyfin's name for the file's format, for the download. */
    container?: string;
    /** Set once this song has been written to a disc: the title it was given there. */
    writtenTitle?: string;
    /** The item and tag to ask the server for the cover with. */
    artItemId?: string;
    artTag?: string;
}

export type SyncState = { status: 'saved' } | { status: 'saving' } | { status: 'error'; message: string };

export interface DiscListState {
    /** "server|user" for the signed-in account, or null when signed out. */
    account: string | null;
    /** The disc's name as typed; empty until named. */
    name: string;
    entries: Entry[];
    playlistId: string | null;
    /** The date a song was last added, YYYY-MM-DD. */
    lastAdded: string | null;
    mode: RecordingMode;
    sync: SyncState;
    /** A short message about the last change, for a toast. */
    notice: { id: number; text: string } | null;
}

/** What the server is known to hold, so only real differences are sent. */
interface Synced {
    name: string | null;
    ids: string[] | null;
}

interface Saved {
    name: string;
    entries: Entry[];
    playlistId: string | null;
    lastAdded: string | null;
    mode: RecordingMode;
    synced: Synced;
}

const KEY_PREFIX = 'tetsubi.discList.';

const empty = (account: string | null): DiscListState => ({
    account,
    name: '',
    entries: [],
    playlistId: null,
    lastAdded: null,
    mode: 'SP',
    sync: { status: 'saved' },
    notice: null,
});

let state: DiscListState = empty(null);
let synced: Synced = { name: null, ids: null };
const listeners = new Set<() => void>();

// Swappable for tests.
let clientSource: () => JellyfinClient | null = currentClient;
let today: () => string = () => localDate();
let nextKey = 0;
let noticeId = 0;

function newKey(): string {
    return `${Date.now().toString(36)}-${(nextKey++).toString(36)}`;
}

function save() {
    if (!state.account) return;
    const saved: Saved = {
        name: state.name,
        entries: state.entries,
        playlistId: state.playlistId,
        lastAdded: state.lastAdded,
        mode: state.mode,
        synced,
    };
    try {
        localStorage.setItem(KEY_PREFIX + state.account, JSON.stringify(saved));
    } catch {
        // Not kept for the next visit; the playlist on the server still is.
    }
}

function set(patch: Partial<DiscListState>) {
    state = { ...state, ...patch };
    save();
    listeners.forEach((listener) => listener());
}

function notify(text: string) {
    set({ notice: { id: ++noticeId, text } });
}

export function getDiscList(): DiscListState {
    return state;
}

export function subscribe(listener: () => void): () => void {
    listeners.add(listener);
    return () => listeners.delete(listener);
}

export function useDiscList(): DiscListState {
    return useSyncExternalStore(subscribe, getDiscList);
}

/** The name the playlist has, or will have once there's a song in it. */
export function currentPlaylistName(s: DiscListState = state): string {
    return playlistName(s.name, s.lastAdded);
}

export function totalSeconds(s: DiscListState = state): number {
    return s.entries.reduce((sum, entry) => sum + entry.seconds, 0);
}

// MARK: Account

/** Loads the list kept for `account`, or starts an empty one. Null signs out. */
export function switchAccount(account: string | null) {
    if (account === state.account) return;
    generation++;
    flushing = false;
    synced = { name: null, ids: null };
    let next = empty(account);
    if (account) {
        try {
            const saved = JSON.parse(localStorage.getItem(KEY_PREFIX + account) ?? 'null') as Saved | null;
            if (saved && Array.isArray(saved.entries)) {
                next = {
                    ...next,
                    name: saved.name ?? '',
                    entries: saved.entries,
                    playlistId: saved.playlistId ?? null,
                    lastAdded: saved.lastAdded ?? null,
                    mode: saved.mode ?? 'SP',
                };
                synced = saved.synced ?? { name: null, ids: null };
            }
        } catch {
            // Start empty.
        }
    }
    state = next;
    listeners.forEach((listener) => listener());
    // Finish anything that was still unsaved when the page was last closed.
    if (account) flush();
}

function followSession() {
    const { status, session } = getJellyfinState();
    switchAccount(status === 'signedIn' && session ? `${session.serverUrl}|${session.userId}` : null);
}

/** Keeps the list in step with who is signed in. Call once at start-up. */
export function startDiscList() {
    followSession();
    return subscribeToSession(followSession);
}

// MARK: Changes

function entryFor(track: Track): Entry {
    const ownArt = track.ImageTags?.Primary;
    return {
        key: newKey(),
        trackId: track.Id,
        name: track.Name,
        artist: library.trackArtistName(track),
        album: track.Album ?? '',
        seconds: library.ticksToSeconds(track.RunTimeTicks),
        container: track.MediaSources?.[0]?.Container,
        artItemId: ownArt ? track.Id : track.AlbumId,
        artTag: ownArt ?? track.AlbumPrimaryImageTag,
    };
}

/** Adds songs to the end of the list, leaving out any already in it. Returns how many were added. */
export function addTracks(tracks: Track[]): number {
    if (!state.account) return 0;
    const have = new Set(state.entries.map((entry) => entry.trackId));
    const fresh: Entry[] = [];
    for (const track of tracks) {
        if (have.has(track.Id)) continue;
        have.add(track.Id);
        fresh.push(entryFor(track));
    }
    const skipped = tracks.length - fresh.length;
    const songs = (n: number) => `${n} ${n === 1 ? 'song' : 'songs'}`;
    if (fresh.length === 0) {
        notify(tracks.length === 1 ? 'Already in the disc list.' : 'All of these are already in the disc list.');
        return 0;
    }
    set({ entries: [...state.entries, ...fresh], lastAdded: today() });
    notify(
        `Added ${fresh.length === 1 ? `“${fresh[0].name}”` : songs(fresh.length)} to ${state.name.trim() || 'the disc list'}.` +
            (skipped ? ` ${songs(skipped)} already there.` : '')
    );
    flush();
    return fresh.length;
}

export function removeEntry(key: string) {
    const entries = state.entries.filter((entry) => entry.key !== key);
    if (entries.length === state.entries.length) return;
    set({ entries });
    flush();
}

/** Moves the entry at `from` to position `to`. */
export function moveEntry(from: number, to: number) {
    if (from === to || from < 0 || to < 0 || from >= state.entries.length || to >= state.entries.length) return;
    const entries = [...state.entries];
    const [moved] = entries.splice(from, 1);
    entries.splice(to, 0, moved);
    set({ entries });
    flush();
}

export function renameDisc(name: string) {
    const trimmed = name.trim();
    if (trimmed === state.name) return;
    set({ name: trimmed });
    flush();
}

export function setMode(mode: RecordingMode) {
    set({ mode });
}

/** Starts an empty, unnamed list. The previous list's playlist stays in Jellyfin. */
export function newDiscList() {
    generation++;
    flushing = false;
    synced = { name: null, ids: null };
    set({ name: '', entries: [], playlistId: null, lastAdded: null, sync: { status: 'saved' } });
}

/** Makes an existing playlist the disc list, so further changes are saved to it. */
export function adoptPlaylist(playlist: Playlist, allTracks: Track[]) {
    if (!state.account) return;
    // The disc list holds each song once, even if the playlist had it twice.
    const seen = new Set<string>();
    const tracks = allTracks.filter((track) => !seen.has(track.Id) && !!seen.add(track.Id));
    generation++;
    flushing = false;
    const { discName, lastAdded } = splitPlaylistName(playlist.Name);
    synced = { name: playlist.Name, ids: allTracks.map((track) => track.Id) };
    set({
        name: discName === UNTITLED ? '' : discName,
        entries: tracks.map(entryFor),
        playlistId: playlist.Id,
        lastAdded,
        sync: { status: 'saved' },
    });
    notify(`“${discName}” is now the disc list.`);
    // If duplicates were dropped, bring the playlist into line.
    flush();
}

/** Records that a song is now on the disc, under `title`. */
export function markWritten(key: string, title: string) {
    if (!state.entries.some((entry) => entry.key === key)) return;
    set({ entries: state.entries.map((entry) => (entry.key === key ? { ...entry, writtenTitle: title } : entry)) });
}

/** Forgets that these songs were written, so they wait to be written again. All of them when no keys are given. */
export function markUnwritten(keys?: string[]) {
    set({
        entries: state.entries.map((entry) => (entry.writtenTitle !== undefined && (!keys || keys.includes(entry.key)) ? { ...entry, writtenTitle: undefined } : entry)),
    });
}

/**
 * Whether a song counts as being on the disc. With a disc in the recorder,
 * its titles decide: a song deleted there, or a different disc, makes the
 * song wait again. With no disc to check, the record of the last write stands.
 */
export function isOnDisc(entry: Entry, discTitles: Set<string> | null): boolean {
    if (entry.writtenTitle === undefined) return false;
    return discTitles === null || discTitles.has(entry.writtenTitle);
}

export function inDiscList(trackId: string, s: DiscListState = state): boolean {
    return s.entries.some((entry) => entry.trackId === trackId);
}

// MARK: Saving to Jellyfin

let flushing = false;
// Bumped whenever the list is swapped for another, so a save in flight for the old one is dropped.
let generation = 0;

const sameIds = (a: string[], b: string[] | null) => !!b && a.length === b.length && a.every((id, index) => id === b[index]);

function wantedIds(): string[] {
    return state.entries.map((entry) => entry.trackId);
}

/**
 * Brings the playlist into line with the list: makes it on the first add,
 * then sends the songs and the name whenever either differs from what the
 * server has. Loops until nothing differs, so changes made while a save was
 * in flight are picked up.
 */
export async function flush(): Promise<void> {
    if (flushing || !state.account) return;
    const client = clientSource();
    if (!client) return;
    const mine = generation;
    flushing = true;
    let recreated = false;
    try {
        for (;;) {
            if (mine !== generation) return;
            const ids = wantedIds();
            const name = currentPlaylistName();

            if (!state.playlistId) {
                if (ids.length === 0) break;
                set({ sync: { status: 'saving' } });
                const id = await library.createPlaylist(client, name, ids);
                if (mine !== generation) return;
                synced = { name, ids };
                set({ playlistId: id });
                continue;
            }

            const idsDiffer = !sameIds(ids, synced.ids);
            const nameDiffers = name !== synced.name;
            if (!idsDiffer && !nameDiffers) break;
            set({ sync: { status: 'saving' } });
            try {
                if (idsDiffer) {
                    await library.setPlaylistItems(client, state.playlistId, ids);
                    if (mine !== generation) return;
                    synced = { ...synced, ids };
                } else {
                    await library.renamePlaylist(client, state.playlistId, name);
                    if (mine !== generation) return;
                    synced = { ...synced, name };
                }
                save();
            } catch (e) {
                // The playlist was deleted in Jellyfin: make it again, once.
                if (e instanceof JellyfinError && e.status === 404 && !recreated && mine === generation) {
                    recreated = true;
                    synced = { name: null, ids: null };
                    set({ playlistId: null });
                    continue;
                }
                throw e;
            }
        }
        if (mine === generation) set({ sync: { status: 'saved' } });
    } catch (e) {
        if (mine !== generation) return;
        if (e instanceof JellyfinError && e.kind === 'expiredToken') {
            set({ sync: { status: 'error', message: 'Your session expired before this was saved.' } });
            signOut({ notice: 'Your session expired. Please sign in again.', tellServer: false });
        } else {
            const reason = e instanceof JellyfinError ? e.message : 'Something went wrong.';
            set({ sync: { status: 'error', message: `Couldn't save the playlist. ${reason}` } });
        }
    } finally {
        if (mine === generation) flushing = false;
    }
}

// MARK: For tests

export function resetForTests(options: { client?: () => JellyfinClient | null; today?: () => string } = {}) {
    generation++;
    flushing = false;
    synced = { name: null, ids: null };
    state = empty(null);
    clientSource = options.client ?? currentClient;
    today = options.today ?? (() => localDate());
}
