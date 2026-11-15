import { describe, expect, it } from 'vitest';
import { candidates, isJellyfinInfo, resolve } from '../server-address';

describe('candidates', () => {
    it('rejects things that are not addresses', () => {
        expect(candidates('')).toEqual([]);
        expect(candidates('   ')).toEqual([]);
        expect(candidates('my server')).toEqual([]);
        expect(candidates('ftp://example.com')).toEqual([]);
    });

    it('tries the usual ports for a bare host', () => {
        expect(candidates('192.168.1.20')).toEqual([
            'http://192.168.1.20:8096',
            'https://192.168.1.20',
            'http://192.168.1.20',
            'https://192.168.1.20:8920',
        ]);
    });

    it('keeps a given port, with https as the fallback when no scheme was typed', () => {
        expect(candidates('jellyfin-box:8096')).toEqual(['http://jellyfin-box:8096', 'https://jellyfin-box:8096']);
        expect(candidates('http://jellyfin-box:8096/')).toEqual(['http://jellyfin-box:8096']);
    });

    it('keeps an explicit default port', () => {
        expect(candidates('https://music.example.com:443')).toEqual(['https://music.example.com:443']);
    });

    it('tries the plain address first when a scheme was typed', () => {
        expect(candidates('https://music.example.com')).toEqual(['https://music.example.com', 'https://music.example.com:8920']);
        expect(candidates('http://music.example.com')).toEqual(['http://music.example.com', 'http://music.example.com:8096']);
    });

    it('keeps a base path and drops trailing slashes', () => {
        expect(candidates('https://example.com/jellyfin//')).toEqual(['https://example.com/jellyfin', 'https://example.com:8920/jellyfin']);
    });

    it('leaves out http addresses on a secure page, except localhost', () => {
        expect(candidates('music.example.com', true)).toEqual(['https://music.example.com', 'https://music.example.com:8920']);
        expect(candidates('http://192.168.1.20:8096', true)).toEqual([]);
        expect(candidates('http://localhost:8096', true)).toEqual(['http://localhost:8096']);
    });
});

describe('isJellyfinInfo', () => {
    it('needs an ID and a version', () => {
        expect(isJellyfinInfo({ Id: 'abc', Version: '10.9.0', ProductName: 'Jellyfin Server' })).toBe(true);
        expect(isJellyfinInfo({ Id: 'abc', Version: '10.9.0' })).toBe(true);
        expect(isJellyfinInfo({ Version: '10.9.0' })).toBe(false);
        expect(isJellyfinInfo(null)).toBe(false);
    });

    it('turns away other products', () => {
        expect(isJellyfinInfo({ Id: 'abc', Version: '4.8', ProductName: 'Emby Server' })).toBe(false);
    });
});

describe('resolve', () => {
    const jellyfin = { Id: 'abc', Version: '10.9.0', ProductName: 'Jellyfin Server', ServerName: 'Home' };

    it('uses the first address that answers as Jellyfin', async () => {
        const tried: string[] = [];
        const result = await resolve('music.example.com', false, async (url) => {
            tried.push(url);
            return url === 'https://music.example.com' ? jellyfin : null;
        });
        expect(result).toEqual({ ok: true, url: 'https://music.example.com', serverName: 'Home' });
        expect(tried).toEqual(['http://music.example.com:8096', 'https://music.example.com']);
    });

    it('explains an http address on a secure page', async () => {
        const result = await resolve('http://192.168.1.20:8096', true, async () => jellyfin);
        expect(result.ok).toBe(false);
        expect(!result.ok && result.reason).toBe('insecure');
    });

    it('reports nothing found and bad input differently', async () => {
        const none = await resolve('music.example.com', false, async () => null);
        expect(!none.ok && none.reason).toBe('notFound');
        const bad = await resolve('not an address', false, async () => jellyfin);
        expect(!bad.ok && bad.reason).toBe('invalid');
    });
});
