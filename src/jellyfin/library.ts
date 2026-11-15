// Reading the music library: albums, artists, songs, playlists and artwork.
// The queries match the Tetsubi app's, with paging added for long lists.

import { JellyfinClient, JellyfinError } from './api';

export interface NameId {
    Id: string;
    Name: string;
}

export interface Album {
    Id: string;
    Name: string;
    AlbumArtist?: string;
    AlbumArtists?: NameId[];
    ProductionYear?: number;
    ImageTags?: { Primary?: string };
    RunTimeTicks?: number;
    ChildCount?: number;
}

export interface Artist {
    Id: string;
    Name: string;
    ImageTags?: { Primary?: string };
}

export interface MediaSource {
    Id?: string;
    Container?: string;
    Size?: number;
    Bitrate?: number;
}

export interface Track {
    Id: string;
    Name: string;
    IndexNumber?: number;
    /** The disc number within the album. */
    ParentIndexNumber?: number;
    RunTimeTicks?: number;
    Album?: string;
    AlbumId?: string;
    AlbumArtist?: string;
    Artists?: string[];
    AlbumPrimaryImageTag?: string;
    ImageTags?: { Primary?: string };
    MediaSources?: MediaSource[];
    /** Set when the track was read from a playlist: its place in that playlist. */
    PlaylistItemId?: string;
}

export interface Playlist {
    Id: string;
    Name: string;
    ChildCount?: number;
    CumulativeRunTimeTicks?: number;
    RunTimeTicks?: number;
    DateCreated?: string;
    ImageTags?: { Primary?: string };
}

export interface Page<T> {
    items: T[];
    /** How many there are in all, where the server says. */
    total: number;
}

interface ItemsResponse<T> {
    Items?: T[];
    TotalRecordCount?: number;
}

export type AlbumSort = 'name' | 'artist' | 'year' | 'added';

export const ALBUM_SORTS: { value: AlbumSort; label: string }[] = [
    { value: 'name', label: 'Title' },
    { value: 'artist', label: 'Artist' },
    { value: 'year', label: 'Newest release' },
    { value: 'added', label: 'Recently added' },
];

const ALBUM_SORT_QUERY: Record<AlbumSort, { SortBy: string; SortOrder: string }> = {
    name: { SortBy: 'SortName', SortOrder: 'Ascending' },
    artist: { SortBy: 'AlbumArtist,ProductionYear,SortName', SortOrder: 'Ascending' },
    year: { SortBy: 'ProductionYear,PremiereDate,SortName', SortOrder: 'Descending' },
    added: { SortBy: 'DateCreated,SortName', SortOrder: 'Descending' },
};

const ALBUM_FIELDS = 'AlbumArtists,ProductionYear,PremiereDate,ChildCount';
const TRACK_FIELDS = 'MediaSources';
const PLAYLIST_FIELDS = 'ChildCount,CumulativeRunTimeTicks,DateCreated';

function userId(client: JellyfinClient): string {
    if (!client.userId) throw new JellyfinError('expiredToken', 'Please sign in again.');
    return client.userId;
}

function page<T>(response: ItemsResponse<T> | undefined): Page<T> {
    const items = response?.Items ?? [];
    return { items, total: response?.TotalRecordCount ?? items.length };
}

/** One page of the library's albums. */
export async function albums(client: JellyfinClient, options: { sort: AlbumSort; start: number; limit: number }): Promise<Page<Album>> {
    return page(
        await client.get<ItemsResponse<Album>>(`Users/${userId(client)}/Items`, {
            IncludeItemTypes: 'MusicAlbum',
            Recursive: true,
            ...ALBUM_SORT_QUERY[options.sort],
            StartIndex: options.start,
            Limit: options.limit,
            Fields: ALBUM_FIELDS,
            ImageTypeLimit: 1,
            EnableTotalRecordCount: true,
        })
    );
}

/** One page of album artists, by name. */
export async function albumArtists(client: JellyfinClient, options: { start: number; limit: number }): Promise<Page<Artist>> {
    return page(
        await client.get<ItemsResponse<Artist>>('Artists/AlbumArtists', {
            UserId: userId(client),
            SortBy: 'SortName',
            SortOrder: 'Ascending',
            StartIndex: options.start,
            Limit: options.limit,
            ImageTypeLimit: 1,
            EnableTotalRecordCount: true,
        })
    );
}

/** Albums by one album artist, newest release first. */
export async function albumsByArtist(client: JellyfinClient, artistId: string): Promise<Album[]> {
    return page(
        await client.get<ItemsResponse<Album>>('Items', {
            UserId: userId(client),
            AlbumArtistIds: artistId,
            Recursive: true,
            IncludeItemTypes: 'MusicAlbum',
            SortBy: 'ProductionYear,SortName',
            SortOrder: 'Descending',
            Fields: ALBUM_FIELDS,
            ImageTypeLimit: 1,
        })
    ).items;
}

/** One album, for its title, artist and year. */
export function album(client: JellyfinClient, albumId: string): Promise<Album> {
    return client.get<Album>(`Users/${userId(client)}/Items/${albumId}`, { Fields: ALBUM_FIELDS });
}

/** An album's songs, in disc and track order. */
export async function albumTracks(client: JellyfinClient, albumId: string): Promise<Track[]> {
    const { items } = page(
        await client.get<ItemsResponse<Track>>('Items', {
            ParentId: albumId,
            UserId: userId(client),
            IncludeItemTypes: 'Audio',
            SortBy: 'ParentIndexNumber,IndexNumber,SortName',
            SortOrder: 'Ascending',
            Recursive: false,
            Fields: TRACK_FIELDS,
        })
    );
    // Only keep songs that belong to this album, even if the server ignores the filter.
    return items.filter((track) => !track.AlbumId || track.AlbumId.toLowerCase() === albumId.toLowerCase());
}

/** The user's music playlists, by name. */
export async function playlists(client: JellyfinClient): Promise<Playlist[]> {
    const { items } = page(
        await client.get<ItemsResponse<Playlist>>(`Users/${userId(client)}/Items`, {
            IncludeItemTypes: 'Playlist',
            MediaTypes: 'Audio',
            Recursive: true,
            SortBy: 'SortName',
            SortOrder: 'Ascending',
            Fields: PLAYLIST_FIELDS,
        })
    );
    return items;
}

/** A playlist's songs, in playlist order. */
export async function playlistTracks(client: JellyfinClient, playlistId: string): Promise<Track[]> {
    return page(
        await client.get<ItemsResponse<Track>>(`Playlists/${playlistId}/Items`, {
            userId: userId(client),
            Fields: TRACK_FIELDS,
        })
    ).items;
}

export interface SearchResults {
    artists: Artist[];
    albums: Album[];
    tracks: Track[];
    playlists: Playlist[];
}

/** Everything matching `term`. Artists have their own query, as the item search only matches titles. */
export async function search(client: JellyfinClient, term: string): Promise<SearchResults> {
    const text = term.trim();
    if (!text) return { artists: [], albums: [], tracks: [], playlists: [] };
    const user = userId(client);
    const items = <T>(types: string, limit: number, fields: string, extra: Record<string, string> = {}) =>
        client
            .get<ItemsResponse<T>>(`Users/${user}/Items`, {
                SearchTerm: text,
                IncludeItemTypes: types,
                Recursive: true,
                Limit: limit,
                Fields: fields,
                ImageTypeLimit: 1,
                ...extra,
            })
            .then((r) => page(r).items);
    const [artists, albumList, tracks, playlistList] = await Promise.all([
        client
            .get<ItemsResponse<Artist>>('Artists/AlbumArtists', { UserId: user, searchTerm: text, Limit: 5, SortBy: 'SortName' })
            .then((r) => page(r).items),
        items<Album>('MusicAlbum', 48, ALBUM_FIELDS),
        items<Track>('Audio', 50, TRACK_FIELDS),
        items<Playlist>('Playlist', 12, PLAYLIST_FIELDS, { MediaTypes: 'Audio' }),
    ]);
    return { artists, albums: albumList, tracks, playlists: playlistList };
}

// MARK: Artwork

/**
 * The address of an item's cover. Jellyfin serves pictures without sign-in,
 * so a plain <img> works. Null when the item has no picture.
 */
export function imageUrl(client: JellyfinClient, itemId: string | undefined, tag: string | undefined, size: number): string | null {
    if (!itemId || !tag) return null;
    return client.url(`Items/${itemId}/Images/Primary`, { maxWidth: size, quality: 90, tag });
}

export function albumArt(client: JellyfinClient, item: Album | Artist | Playlist, size: number): string | null {
    return imageUrl(client, item.Id, item.ImageTags?.Primary, size);
}

/** A song's cover: its own, or else its album's. */
export function trackArt(client: JellyfinClient, track: Track, size: number): string | null {
    return imageUrl(client, track.Id, track.ImageTags?.Primary, size) ?? imageUrl(client, track.AlbumId, track.AlbumPrimaryImageTag, size);
}

// MARK: Wording

export function albumArtistName(item: Album): string {
    return item.AlbumArtists?.map((artist) => artist.Name).join(', ') || item.AlbumArtist || '';
}

export function trackArtistName(track: Track): string {
    return track.Artists?.join(', ') || track.AlbumArtist || '';
}

/** Jellyfin counts time in ticks of 100 nanoseconds. */
export function ticksToSeconds(ticks: number | undefined): number {
    return ticks ? ticks / 10_000_000 : 0;
}

/** "3:07", or "1:02:45" past the hour. */
export function durationText(seconds: number): string {
    const total = Math.round(seconds);
    const h = Math.floor(total / 3600);
    const m = Math.floor((total % 3600) / 60);
    const s = total % 60;
    const two = (n: number) => String(n).padStart(2, '0');
    return h > 0 ? `${h}:${two(m)}:${two(s)}` : `${m}:${two(s)}`;
}

/** "12 songs", "1 song". */
export function songCountText(count: number): string {
    return `${count} ${count === 1 ? 'song' : 'songs'}`;
}

/** "12 songs · 48 min", or "1 hr 5 min" past the hour. */
export function summaryText(count: number, seconds: number): string {
    const minutes = Math.round(seconds / 60);
    if (minutes <= 0) return songCountText(count);
    const time = minutes < 60 ? `${minutes} min` : `${Math.floor(minutes / 60)} hr${minutes % 60 ? ` ${minutes % 60} min` : ''}`;
    return `${songCountText(count)} · ${time}`;
}

/** Songs grouped by disc, in order. One group when the album has a single disc. */
export function groupByDisc(tracks: Track[]): { disc: number; tracks: Track[] }[] {
    const groups: { disc: number; tracks: Track[] }[] = [];
    for (const track of tracks) {
        const disc = track.ParentIndexNumber ?? 1;
        const last = groups[groups.length - 1];
        if (last && last.disc === disc) last.tracks.push(track);
        else groups.push({ disc, tracks: [track] });
    }
    return groups;
}
