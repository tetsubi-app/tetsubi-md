import { describe, expect, it } from 'vitest';
import { JellyfinClient } from '../api';
import * as library from '../library';

function clientWith(answers: unknown[]) {
    const urls: URL[] = [];
    const client = new JellyfinClient({
        serverUrl: 'https://music.example.com',
        deviceId: 'd',
        deviceName: 'Test',
        accessToken: 'tok',
        userId: 'u1',
        fetch: (async (url: RequestInfo | URL) => {
            urls.push(new URL(String(url)));
            return new Response(JSON.stringify(answers.shift() ?? {}), { status: 200 });
        }) as typeof fetch,
    });
    return { client, urls };
}

describe('library queries', () => {
    it('pages albums with the chosen sort', async () => {
        const { client, urls } = clientWith([{ Items: [{ Id: 'a1', Name: 'One' }], TotalRecordCount: 250 }]);
        const page = await library.albums(client, { sort: 'year', start: 100, limit: 100 });
        expect(page).toEqual({ items: [{ Id: 'a1', Name: 'One' }], total: 250 });
        expect(urls[0].pathname).toBe('/Users/u1/Items');
        const q = urls[0].searchParams;
        expect(q.get('IncludeItemTypes')).toBe('MusicAlbum');
        expect(q.get('Recursive')).toBe('true');
        expect(q.get('SortBy')).toBe('ProductionYear,PremiereDate,SortName');
        expect(q.get('SortOrder')).toBe('Descending');
        expect(q.get('StartIndex')).toBe('100');
        expect(q.get('Limit')).toBe('100');
    });

    it('copes with an answer that has no items or count', async () => {
        const { client } = clientWith([{}]);
        expect(await library.albums(client, { sort: 'name', start: 0, limit: 100 })).toEqual({ items: [], total: 0 });
    });

    it('drops songs from other albums', async () => {
        const { client, urls } = clientWith([
            {
                Items: [
                    { Id: 't1', Name: 'A', AlbumId: 'ALB' },
                    { Id: 't2', Name: 'B', AlbumId: 'other' },
                    { Id: 't3', Name: 'C' },
                ],
            },
        ]);
        const tracks = await library.albumTracks(client, 'alb');
        expect(tracks.map((t) => t.Id)).toEqual(['t1', 't3']);
        expect(urls[0].searchParams.get('ParentId')).toBe('alb');
        expect(urls[0].searchParams.get('SortBy')).toBe('ParentIndexNumber,IndexNumber,SortName');
    });

    it('reads a playlist in its own order, for this user', async () => {
        const { client, urls } = clientWith([{ Items: [{ Id: 't1', Name: 'A', PlaylistItemId: 'p1' }] }]);
        const tracks = await library.playlistTracks(client, 'pl');
        expect(tracks[0].PlaylistItemId).toBe('p1');
        expect(urls[0].pathname).toBe('/Playlists/pl/Items');
        expect(urls[0].searchParams.get('userId')).toBe('u1');
    });

    it('searches artists, albums, songs and playlists together', async () => {
        const { client, urls } = clientWith([{ Items: [] }, { Items: [] }, { Items: [] }, { Items: [] }]);
        const results = await library.search(client, '  blue  ');
        expect(results).toEqual({ artists: [], albums: [], tracks: [], playlists: [] });
        expect(urls.map((u) => u.pathname + ':' + (u.searchParams.get('IncludeItemTypes') ?? 'artists')).sort()).toEqual([
            '/Artists/AlbumArtists:artists',
            '/Users/u1/Items:Audio',
            '/Users/u1/Items:MusicAlbum',
            '/Users/u1/Items:Playlist',
        ]);
        expect(urls.every((u) => (u.searchParams.get('SearchTerm') ?? u.searchParams.get('searchTerm')) === 'blue')).toBe(true);
    });

    it('asks nothing for an empty search', async () => {
        const { client, urls } = clientWith([]);
        await library.search(client, '   ');
        expect(urls).toEqual([]);
    });
});

describe('artwork', () => {
    const { client } = clientWith([]);

    it('builds a cover address, or null without a picture', () => {
        expect(library.albumArt(client, { Id: 'a1', Name: 'One', ImageTags: { Primary: 'tag1' } }, 360)).toBe(
            'https://music.example.com/Items/a1/Images/Primary?maxWidth=360&quality=90&tag=tag1'
        );
        expect(library.albumArt(client, { Id: 'a1', Name: 'One' }, 360)).toBeNull();
    });

    it("falls back to the album's cover for a song", () => {
        expect(library.trackArt(client, { Id: 't1', Name: 'A', AlbumId: 'a1', AlbumPrimaryImageTag: 'tag1' }, 96)).toContain('/Items/a1/Images/Primary');
        expect(library.trackArt(client, { Id: 't1', Name: 'A', ImageTags: { Primary: 'own' }, AlbumId: 'a1', AlbumPrimaryImageTag: 'tag1' }, 96)).toContain(
            '/Items/t1/Images/Primary'
        );
        expect(library.trackArt(client, { Id: 't1', Name: 'A' }, 96)).toBeNull();
    });
});

describe('wording', () => {
    it('formats lengths', () => {
        expect(library.durationText(187)).toBe('3:07');
        expect(library.durationText(59.6)).toBe('1:00');
        expect(library.durationText(3765)).toBe('1:02:45');
        expect(library.ticksToSeconds(1_870_000_000)).toBe(187);
        expect(library.ticksToSeconds(undefined)).toBe(0);
    });

    it('summarises song counts and playing time', () => {
        expect(library.summaryText(1, 200)).toBe('1 song · 3 min');
        expect(library.summaryText(12, 3900)).toBe('12 songs · 1 hr 5 min');
        expect(library.summaryText(20, 7200)).toBe('20 songs · 2 hr');
        expect(library.summaryText(0, 0)).toBe('0 songs');
    });

    it('names artists', () => {
        expect(library.albumArtistName({ Id: 'a', Name: 'n', AlbumArtists: [{ Id: '1', Name: 'A' }, { Id: '2', Name: 'B' }] })).toBe('A, B');
        expect(library.albumArtistName({ Id: 'a', Name: 'n', AlbumArtist: 'Solo' })).toBe('Solo');
        expect(library.trackArtistName({ Id: 't', Name: 'n', Artists: [], AlbumArtist: 'Solo' })).toBe('Solo');
    });

    it('groups songs by disc', () => {
        const t = (Id: string, ParentIndexNumber?: number) => ({ Id, Name: Id, ParentIndexNumber });
        expect(library.groupByDisc([t('a', 1), t('b', 1), t('c', 2)]).map((g) => [g.disc, g.tracks.length])).toEqual([
            [1, 2],
            [2, 1],
        ]);
        expect(library.groupByDisc([t('a'), t('b')]).length).toBe(1);
    });
});
