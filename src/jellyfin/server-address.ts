// Turns what the user typed into a working Jellyfin server address.
//
// People type "192.168.1.20", "jellyfin-box:8096" or "music.example.com".
// This works out the likely full addresses and uses the first one where a
// Jellyfin server answers `/System/Info/Public` (which needs no sign-in).
//
// Same rules as the Tetsubi app, with one difference: a page served over
// https cannot talk to an http server (the browser blocks it), so there the
// http guesses are dropped and https comes first.

export const HTTP_PORT = 8096;
export const HTTPS_PORT = 8920;

export type ResolveResult = { ok: true; url: string; serverName?: string } | { ok: false; reason: 'invalid' | 'insecure' | 'notFound'; message: string };

export interface PublicInfo {
    Id?: string;
    Version?: string;
    ProductName?: string;
    ServerName?: string;
}

/** Fetches a server's public info, or null on any failure. Swappable for tests. */
export type FetchPublicInfo = (baseUrl: string) => Promise<PublicInfo | null>;

/**
 * The addresses to try, most likely first, with no trailing slash.
 * Empty if `input` can't be an address. `pageIsSecure` is whether this page
 * itself is on https, in which case http addresses are left out.
 */
export function candidates(input: string, pageIsSecure = false): string[] {
    let text = input.trim();
    while (text.endsWith('/')) text = text.slice(0, -1);
    if (!text || /\s/.test(text)) return [];

    const lower = text.toLowerCase();
    const hadScheme = lower.startsWith('http://') || lower.startsWith('https://');
    if (!hadScheme) {
        // "jellyfin-box:8096" would otherwise read as scheme "jellyfin-box".
        if (text.includes('://')) return [];
        text = 'http://' + text;
    }

    let parts: URL;
    try {
        parts = new URL(text);
    } catch {
        return [];
    }
    if (!parts.hostname) return [];
    const scheme = parts.protocol.replace(':', '');
    // URL drops a port that is the scheme's default, so read it from the text.
    const portMatch = text.match(/^https?:\/\/(?:\[[^\]]+\]|[^/:]+):(\d+)/i);
    const port = portMatch ? Number(portMatch[1]) : null;
    const path = parts.pathname === '/' ? '' : parts.pathname.replace(/\/+$/, '');

    const url = (s: string, p: number | null) => `${s}://${parts.hostname}${p === null ? '' : ':' + p}${path}`;

    let list: string[];
    if (port !== null) {
        // Port given: use it; without a scheme, https is the fallback.
        list = [url(scheme, port)];
        if (!hadScheme) list.push(url('https', port));
    } else if (!hadScheme) {
        list = [url('http', HTTP_PORT), url('https', null), url('http', null), url('https', HTTPS_PORT)];
    } else if (scheme === 'https') {
        list = [url('https', null), url('https', HTTPS_PORT)];
    } else {
        list = [url('http', null), url('http', HTTP_PORT)];
    }

    if (pageIsSecure) list = list.filter((u) => u.startsWith('https://') || isLocalhost(u));
    return Array.from(new Set(list));
}

/** Browsers allow http to localhost even from an https page. */
function isLocalhost(url: string): boolean {
    try {
        const host = new URL(url).hostname;
        return host === 'localhost' || host === '127.0.0.1' || host === '[::1]';
    } catch {
        return false;
    }
}

/** Whether `/System/Info/Public` came from a Jellyfin server. */
export function isJellyfinInfo(info: PublicInfo | null): boolean {
    if (!info || typeof info !== 'object') return false;
    if (!info.Id || typeof info.Version !== 'string') return false;
    return info.ProductName ? info.ProductName.toLowerCase().includes('jellyfin') : true;
}

/** Short timeout: an address that doesn't exist shouldn't keep the user waiting long per guess. */
export const fetchPublicInfo: FetchPublicInfo = async (baseUrl) => {
    try {
        const response = await fetch(`${baseUrl}/System/Info/Public`, { signal: AbortSignal.timeout(5000) });
        if (!response.ok) return null;
        return (await response.json()) as PublicInfo;
    } catch {
        return null;
    }
};

/** The first candidate address where a Jellyfin server answers. */
export async function resolve(
    input: string,
    pageIsSecure = window.location.protocol === 'https:',
    fetchInfo: FetchPublicInfo = fetchPublicInfo
): Promise<ResolveResult> {
    const all = candidates(input, false);
    if (all.length === 0) {
        return { ok: false, reason: 'invalid', message: "Enter your server's address, e.g. https://music.example.com" };
    }
    const list = candidates(input, pageIsSecure);
    if (list.length === 0) {
        return {
            ok: false,
            reason: 'insecure',
            message: 'This page is secure (https), so it can only reach a Jellyfin server that also has an https address.',
        };
    }
    for (const base of list) {
        const info = await fetchInfo(base);
        if (isJellyfinInfo(info)) return { ok: true, url: base, serverName: info?.ServerName };
    }
    const hint = pageIsSecure ? ' From this page the server needs an https address.' : ' Check the address, and the port (usually 8096).';
    return { ok: false, reason: 'notFound', message: `Couldn't find a Jellyfin server at ${input.trim()}.${hint}` };
}
