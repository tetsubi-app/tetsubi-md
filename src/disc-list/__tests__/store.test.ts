import { beforeEach, describe, expect, it } from 'vitest';
import { JellyfinClient } from '../../jellyfin/api';
import { Track } from '../../jellyfin/library';
import * as store from '../store';

/** A fake server that records playlist calls and can hold answers back. */
function fakeServer() {
    const calls: string[] = [];
    let created = 0;
    let fail: number | null = null;
    let gate: Promise<void> | null = null;
    const client = new JellyfinClient({
        serverUrl: 'https://music.example.com',
        deviceId: 'd',
        deviceName: 'Test',
        accessToken: 'tok',
        userId: 'u1',
        fetch: (async (url: RequestInfo | URL, init?: RequestInit) => {
            const path = new URL(String(url)).pathname;
            const body = init?.body ? JSON.parse(init.body as string) : {};
            if (gate) await gate;
            if (fail !== null) {
                const status = fail;
                fail = null;
                calls.push(`${status} ${path}`);
                return new Response('', { status });
            }
            if (path === '/Playlists') {
                calls.push(`create "${body.Name}" [${body.Ids.join(',')}]`);
                return new Response(JSON.stringify({ Id: `pl${++created}` }), { status: 200 });
            }
            const id = path.split('/')[2];
            if (body.Ids) calls.push(`items ${id} [${body.Ids.join(',')}]`);
            if (body.Name) calls.push(`rename ${id} "${body.Name}"`);
            return new Response(null, { status: 204 });
        }) as typeof fetch,
    });
    return {
        client,
        calls,
        failNext: (status: number) => (fail = status),
        /** Holds every answer back until the returned function is called. */
        hold: () => {
            let release!: () => void;
            gate = new Promise((done) => (release = done));
            return () => {
                gate = null;
                release();
            };
        },
    };
}

const track = (id: string, seconds = 180): Track => ({ Id: id, Name: `Song ${id}`, RunTimeTicks: seconds * 1e7, Album: 'Album', AlbumId: 'al', Artists: ['Artist'] });
/** Lets every queued save finish. */
const settle = async () => {
    for (let i = 0; i < 20; i++) await new Promise((done) => setTimeout(done, 0));
};

describe('disc list', () => {
    let server: ReturnType<typeof fakeServer>;
    let date = '2026-11-15';

    beforeEach(() => {
        server = fakeServer();
        date = '2026-11-15';
        store.resetForTests({ client: () => server.client, today: () => date });
        store.switchAccount('https://music.example.com|u1');
    });

    it('makes the playlist on the first add, named after the disc and the date', async () => {
        store.renameDisc('Road Trip');
        await settle();
        expect(server.calls).toEqual([]);
        expect(store.addTracks([track('a'), track('b')])).toBe(2);
        await settle();
        expect(server.calls).toEqual(['create "Road Trip (2026-11-15)" [a,b]']);
        expect(store.getDiscList().playlistId).toBe('pl1');
        expect(store.getDiscList().sync).toEqual({ status: 'saved' });
    });

    it('saves every add, removal and move, and updates the date on an add', async () => {
        store.renameDisc('Road Trip');
        store.addTracks([track('a'), track('b'), track('c')]);
        await settle();
        store.moveEntry(0, 2);
        await settle();
        store.removeEntry(store.getDiscList().entries[0].key);
        await settle();
        date = '2026-11-20';
        store.addTracks([track('d')]);
        await settle();
        expect(server.calls).toEqual([
            'create "Road Trip (2026-11-15)" [a,b,c]',
            'items pl1 [b,c,a]',
            'items pl1 [c,a]',
            'items pl1 [c,a,d]',
            'rename pl1 "Road Trip (2026-11-20)"',
        ]);
    });

    it('renames the playlist when the disc is renamed', async () => {
        store.addTracks([track('a')]);
        await settle();
        store.renameDisc('Mellow');
        await settle();
        expect(server.calls).toEqual(['create "Untitled MiniDisc (2026-11-15)" [a]', 'rename pl1 "Mellow (2026-11-15)"']);
    });

    it('leaves out songs already in the list', async () => {
        store.addTracks([track('a')]);
        expect(store.addTracks([track('a'), track('b'), track('b')])).toBe(1);
        expect(store.addTracks([track('a')])).toBe(0);
        expect(store.getDiscList().entries.map((e) => e.trackId)).toEqual(['a', 'b']);
        expect(store.getDiscList().notice?.text).toBe('Already in the disc list.');
    });

    it('sends only the latest state when edits pile up behind a slow save', async () => {
        const release = server.hold();
        store.addTracks([track('a')]);
        store.addTracks([track('b')]);
        store.addTracks([track('c')]);
        store.moveEntry(2, 0);
        expect(store.getDiscList().sync).toEqual({ status: 'saving' });
        release();
        await settle();
        expect(server.calls).toEqual(['create "Untitled MiniDisc (2026-11-15)" [a]', 'items pl1 [c,a,b]']);
    });

    it('reports a failed save and sends it on retry', async () => {
        store.addTracks([track('a')]);
        await settle();
        server.failNext(500);
        store.addTracks([track('b')]);
        await settle();
        expect(store.getDiscList().sync.status).toBe('error');
        await store.flush();
        expect(store.getDiscList().sync).toEqual({ status: 'saved' });
        expect(server.calls.slice(-1)).toEqual(['items pl1 [a,b]']);
    });

    it('makes the playlist again if it was deleted in Jellyfin', async () => {
        store.addTracks([track('a')]);
        await settle();
        server.failNext(404);
        store.addTracks([track('b')]);
        await settle();
        expect(server.calls.slice(-2)).toEqual(['404 /Playlists/pl1', 'create "Untitled MiniDisc (2026-11-15)" [a,b]']);
        expect(store.getDiscList().playlistId).toBe('pl2');
    });

    it('empties the playlist rather than deleting it', async () => {
        store.addTracks([track('a')]);
        await settle();
        store.removeEntry(store.getDiscList().entries[0].key);
        await settle();
        expect(server.calls.slice(-1)).toEqual(['items pl1 []']);
    });

    it('adopts an existing playlist without changing it', async () => {
        store.adoptPlaylist({ Id: 'old', Name: 'Mellow Evenings (2026-11-01)' }, [track('x'), track('y')]);
        await settle();
        expect(server.calls).toEqual([]);
        const list = store.getDiscList();
        expect([list.name, list.lastAdded, list.playlistId, list.entries.length]).toEqual(['Mellow Evenings', '2026-11-01', 'old', 2]);
        store.addTracks([track('z')]);
        await settle();
        expect(server.calls).toEqual(['items old [x,y,z]', 'rename old "Mellow Evenings (2026-11-15)"']);
    });

    it('lists a song once when the adopted playlist had it twice, and tidies the playlist', async () => {
        store.adoptPlaylist({ Id: 'old', Name: 'Dupes' }, [track('x'), track('x'), track('y')]);
        await settle();
        expect(store.getDiscList().entries.map((e) => e.trackId)).toEqual(['x', 'y']);
        expect(server.calls).toEqual(['items old [x,y]']);
    });

    it('starts a new list without touching the old playlist', async () => {
        store.addTracks([track('a')]);
        await settle();
        store.newDiscList();
        store.addTracks([track('b')]);
        await settle();
        expect(server.calls).toEqual(['create "Untitled MiniDisc (2026-11-15)" [a]', 'create "Untitled MiniDisc (2026-11-15)" [b]']);
        expect(store.getDiscList().playlistId).toBe('pl2');
    });

    it('does nothing when signed out', async () => {
        store.switchAccount(null);
        expect(store.addTracks([track('a')])).toBe(0);
        await settle();
        expect(server.calls).toEqual([]);
    });

    it('adds up the playing time', () => {
        store.addTracks([track('a', 100), track('b', 50)]);
        expect(store.totalSeconds()).toBe(150);
    });
});
