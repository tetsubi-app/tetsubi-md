// The signed-in Jellyfin session, kept in the browser.
//
// This lives outside the app's redux store on purpose: that store is reset
// whenever the recorder disconnects, which must not sign the user out.
// No password is ever stored, only the token the server issued.

import { useSyncExternalStore } from 'react';
import { JellyfinClient, JellyfinError } from './api';

const SESSION_KEY = 'tetsubi.jellyfin.session';
const DEVICE_ID_KEY = 'tetsubi.jellyfin.deviceId';
const LAST_SERVER_KEY = 'tetsubi.jellyfin.lastServer';

export interface JellyfinSession {
    serverUrl: string;
    serverName?: string;
    userId: string;
    userName: string;
    accessToken: string;
}

export interface JellyfinState {
    /** 'checking' while a saved session is being confirmed with the server. */
    status: 'signedOut' | 'checking' | 'signedIn';
    session: JellyfinSession | null;
    /** Why the user was signed out, if it wasn't their choice. */
    notice: string | null;
}

function read(key: string): string | null {
    try {
        return localStorage.getItem(key);
    } catch {
        return null;
    }
}

function write(key: string, value: string | null) {
    try {
        if (value === null) localStorage.removeItem(key);
        else localStorage.setItem(key, value);
    } catch {
        // Private windows can refuse storage; the session then lasts for this page only.
    }
}

/** A stable ID for this browser, so the server sees one device across visits. */
export function deviceId(): string {
    let id = read(DEVICE_ID_KEY);
    if (!id) {
        id = typeof crypto?.randomUUID === 'function' ? crypto.randomUUID() : `${Date.now()}-${Math.random().toString(16).slice(2)}`;
        write(DEVICE_ID_KEY, id);
    }
    return id;
}

export function loadSession(): JellyfinSession | null {
    const raw = read(SESSION_KEY);
    if (!raw) return null;
    try {
        const value = JSON.parse(raw);
        if (value && typeof value.serverUrl === 'string' && typeof value.userId === 'string' && typeof value.accessToken === 'string') {
            return value as JellyfinSession;
        }
    } catch {
        // Fall through.
    }
    return null;
}

/** The server address last signed in to, to prefill the sign-in form. */
export function lastServer(): string {
    return read(LAST_SERVER_KEY) ?? '';
}

// MARK: Store

const saved = loadSession();
let state: JellyfinState = { status: saved ? 'checking' : 'signedOut', session: saved, notice: null };
const listeners = new Set<() => void>();

function setState(next: JellyfinState) {
    state = next;
    listeners.forEach((listener) => listener());
}

export function getJellyfinState(): JellyfinState {
    return state;
}

export function subscribe(listener: () => void): () => void {
    listeners.add(listener);
    return () => listeners.delete(listener);
}

export function useJellyfin(): JellyfinState {
    return useSyncExternalStore(subscribe, getJellyfinState);
}

/** A client for the signed-in session, or null when signed out. */
export function currentClient(): JellyfinClient | null {
    const session = state.session;
    if (!session) return null;
    return new JellyfinClient({
        serverUrl: session.serverUrl,
        deviceId: deviceId(),
        accessToken: session.accessToken,
        userId: session.userId,
    });
}

export function signIn(session: JellyfinSession) {
    write(SESSION_KEY, JSON.stringify(session));
    write(LAST_SERVER_KEY, session.serverUrl);
    setState({ status: 'signedIn', session, notice: null });
}

/** Signs out here and, when asked, on the server too. */
export async function signOut(options: { notice?: string; tellServer?: boolean } = {}) {
    const client = options.tellServer === false ? null : currentClient();
    write(SESSION_KEY, null);
    setState({ status: 'signedOut', session: null, notice: options.notice ?? null });
    await client?.logout();
}

/**
 * Confirms a saved session with the server. A rejected token signs the user
 * out; a server that can't be reached keeps them signed in, as it may be back.
 */
export async function checkSavedSession() {
    const client = currentClient();
    if (!client || state.status !== 'checking') return;
    try {
        const user = await client.me();
        const session = state.session;
        if (session) signIn({ ...session, userName: user.Name ?? session.userName });
    } catch (e) {
        if (e instanceof JellyfinError && e.kind === 'expiredToken') {
            await signOut({ notice: 'Your session expired. Please sign in again.', tellServer: false });
        } else if (state.session) {
            setState({ status: 'signedIn', session: state.session, notice: null });
        }
    }
}
