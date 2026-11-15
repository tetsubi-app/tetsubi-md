// The library's screens: the three tabs, search results, and the album,
// artist and playlist pages.

import React, { useState } from 'react';

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import ButtonBase from '@mui/material/ButtonBase';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import Typography from '@mui/material/Typography';
import { GridView as GridViewIcon } from '@mui/icons-material';
import { ViewList as ViewListIcon } from '@mui/icons-material';

import * as library from '../../jellyfin/library';
import { ALBUM_SORTS, Album, AlbumSort, Artist, Playlist, Track } from '../../jellyfin/library';
import { colors } from '../../tetsubi/theme';
import { useClient, useLoad, usePaged, useWhenVisible } from './library-hooks';
import { adoptPlaylist, useDiscList } from '../../disc-list/store';
import { AddAllButton, AddTrackButton } from './add-buttons';
import { AlbumRow, AlbumTile, Art, SectionTitle, Status, TrackRow, listSx, tileGridSx } from './library-parts';

export type Route =
    | { kind: 'album'; id: string; name: string }
    | { kind: 'artist'; id: string; name: string }
    | { kind: 'playlist'; id: string; name: string };

export interface Navigation {
    open: (route: Route) => void;
}

const openAlbum = (nav: Navigation) => (album: Album) => nav.open({ kind: 'album', id: album.Id, name: album.Name });

function remembered<T extends string>(key: string, allowed: readonly T[], fallback: T): T {
    try {
        const value = localStorage.getItem(key) as T | null;
        if (value && allowed.includes(value)) return value;
    } catch {
        // Fall through.
    }
    return fallback;
}

function remember(key: string, value: string) {
    try {
        localStorage.setItem(key, value);
    } catch {
        // Not remembered.
    }
}

// MARK: Tabs

export const AlbumsTab = ({ nav }: { nav: Navigation }) => {
    const client = useClient();
    const [sort, setSort] = useState<AlbumSort>(() =>
        remembered(
            'tetsubi.library.albumSort',
            ALBUM_SORTS.map((s) => s.value),
            'name'
        )
    );
    const [view, setView] = useState<'grid' | 'list'>(() => remembered('tetsubi.library.albumView', ['grid', 'list'] as const, 'grid'));
    const paged = usePaged((start, limit) => library.albums(client, { sort, start, limit }), [client, sort]);
    const sentinel = useWhenVisible(paged.more, !paged.done && !paged.error, paged.items.length);

    return (
        <Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2 }}>
                <Typography sx={{ flex: '1 1 auto', color: colors.text3, fontSize: 14 }} aria-live="polite">
                    {paged.total === null ? '' : `${paged.total.toLocaleString()} ${paged.total === 1 ? 'album' : 'albums'}`}
                </Typography>
                <Select
                    value={sort}
                    onChange={(event) => {
                        const value = event.target.value as AlbumSort;
                        setSort(value);
                        remember('tetsubi.library.albumSort', value);
                    }}
                    size="small"
                    variant="outlined"
                    inputProps={{ 'aria-label': 'Sort albums by' }}
                    sx={{ fontSize: 14 }}
                >
                    {ALBUM_SORTS.map((option) => (
                        <MenuItem key={option.value} value={option.value}>
                            {option.label}
                        </MenuItem>
                    ))}
                </Select>
                <ToggleButtonGroup
                    value={view}
                    exclusive
                    size="small"
                    aria-label="Show albums as"
                    onChange={(_, value: 'grid' | 'list' | null) => {
                        if (!value) return;
                        setView(value);
                        remember('tetsubi.library.albumView', value);
                    }}
                >
                    <ToggleButton value="grid" aria-label="Grid">
                        <GridViewIcon fontSize="small" />
                    </ToggleButton>
                    <ToggleButton value="list" aria-label="List">
                        <ViewListIcon fontSize="small" />
                    </ToggleButton>
                </ToggleButtonGroup>
            </Box>

            {view === 'grid' ? (
                <Box component="ul" sx={tileGridSx}>
                    {paged.items.map((album) => (
                        <AlbumTile key={album.Id} album={album} onOpen={openAlbum(nav)} />
                    ))}
                </Box>
            ) : (
                <Box component="ul" sx={listSx}>
                    {paged.items.map((album) => (
                        <AlbumRow key={album.Id} album={album} onOpen={openAlbum(nav)} />
                    ))}
                </Box>
            )}
            <Status
                loading={paged.loading}
                error={paged.error}
                onRetry={paged.more}
                empty={paged.total === 0 ? 'No albums in this library yet.' : null}
            />
            <div ref={sentinel} />
        </Box>
    );
};

const ArtistRow = ({ artist, nav }: { artist: Artist; nav: Navigation }) => {
    const client = useClient();
    return (
        <Box component="li">
            <ButtonBase
                onClick={() => nav.open({ kind: 'artist', id: artist.Id, name: artist.Name })}
                sx={{
                    display: 'flex',
                    width: '100%',
                    alignItems: 'center',
                    gap: 1.5,
                    justifyContent: 'flex-start',
                    textAlign: 'left',
                    py: 0.75,
                    px: 1,
                    borderRadius: '8px',
                    '&:hover': { backgroundColor: 'action.hover' },
                }}
            >
                <Art src={library.albumArt(client, artist, 112)} kind="artist" round size={44} />
                <Typography noWrap sx={{ fontWeight: 600 }}>
                    {artist.Name}
                </Typography>
            </ButtonBase>
        </Box>
    );
};

export const ArtistsTab = ({ nav }: { nav: Navigation }) => {
    const client = useClient();
    const paged = usePaged((start, limit) => library.albumArtists(client, { start, limit }), [client], 200);
    const sentinel = useWhenVisible(paged.more, !paged.done && !paged.error, paged.items.length);

    return (
        <Box>
            <Typography sx={{ color: colors.text3, fontSize: 14, mb: 1.5 }} aria-live="polite">
                {paged.total === null ? '' : `${paged.total.toLocaleString()} ${paged.total === 1 ? 'artist' : 'artists'}`}
            </Typography>
            <Box component="ul" sx={listSx}>
                {paged.items.map((artist) => (
                    <ArtistRow key={artist.Id} artist={artist} nav={nav} />
                ))}
            </Box>
            <Status loading={paged.loading} error={paged.error} onRetry={paged.more} empty={paged.total === 0 ? 'No artists in this library yet.' : null} />
            <div ref={sentinel} />
        </Box>
    );
};

const PlaylistRow = ({ playlist, nav }: { playlist: Playlist; nav: Navigation }) => {
    const client = useClient();
    const seconds = library.ticksToSeconds(playlist.CumulativeRunTimeTicks ?? playlist.RunTimeTicks);
    return (
        <Box component="li">
            <ButtonBase
                onClick={() => nav.open({ kind: 'playlist', id: playlist.Id, name: playlist.Name })}
                sx={{
                    display: 'flex',
                    width: '100%',
                    alignItems: 'center',
                    gap: 1.5,
                    justifyContent: 'flex-start',
                    textAlign: 'left',
                    py: 0.75,
                    px: 1,
                    borderRadius: '8px',
                    '&:hover': { backgroundColor: 'action.hover' },
                }}
            >
                <Art src={library.albumArt(client, playlist, 112)} kind="playlist" size={48} />
                <Box sx={{ minWidth: 0 }}>
                    <Typography noWrap sx={{ fontWeight: 600 }}>
                        {playlist.Name}
                    </Typography>
                    {playlist.ChildCount !== undefined ? (
                        <Typography noWrap sx={{ fontSize: 14, color: colors.text3 }}>
                            {library.summaryText(playlist.ChildCount, seconds)}
                        </Typography>
                    ) : null}
                </Box>
            </ButtonBase>
        </Box>
    );
};

export const PlaylistsTab = ({ nav }: { nav: Navigation }) => {
    const client = useClient();
    const { data, loading, error, retry } = useLoad(() => library.playlists(client), [client]);
    return (
        <Box>
            <Box component="ul" sx={listSx}>
                {data?.map((playlist) => <PlaylistRow key={playlist.Id} playlist={playlist} nav={nav} />)}
            </Box>
            <Status loading={loading} error={error} onRetry={retry} empty={data?.length === 0 ? 'No playlists yet.' : null} />
        </Box>
    );
};

// MARK: Search

export const SearchResults = ({ term, nav }: { term: string; nav: Navigation }) => {
    const client = useClient();
    const { data, loading, error, retry } = useLoad(() => library.search(client, term), [client, term]);
    const nothing = data && !data.artists.length && !data.albums.length && !data.tracks.length && !data.playlists.length;

    if (!data || error) return <Status loading={loading} error={error} onRetry={retry} />;
    if (nothing) return <Status empty={`Nothing found for “${term}”.`} />;

    return (
        <Box sx={{ opacity: loading ? 0.6 : 1, transition: 'opacity 0.15s', '& > h3:first-of-type': { mt: 0 } }}>
            {data.artists.length ? (
                <>
                    <SectionTitle>Artists</SectionTitle>
                    <Box component="ul" sx={listSx}>
                        {data.artists.map((artist) => (
                            <ArtistRow key={artist.Id} artist={artist} nav={nav} />
                        ))}
                    </Box>
                </>
            ) : null}
            {data.albums.length ? (
                <>
                    <SectionTitle>Albums</SectionTitle>
                    <Box component="ul" sx={tileGridSx}>
                        {data.albums.map((album) => (
                            <AlbumTile key={album.Id} album={album} onOpen={openAlbum(nav)} />
                        ))}
                    </Box>
                </>
            ) : null}
            {data.tracks.length ? (
                <>
                    <SectionTitle>Songs</SectionTitle>
                    <Box component="ul" sx={listSx}>
                        {data.tracks.map((track) => (
                            <TrackRow key={track.Id} track={track} art={library.trackArt(client, track, 96)} showArtist trailing={<AddTrackButton track={track} />} />
                        ))}
                    </Box>
                </>
            ) : null}
            {data.playlists.length ? (
                <>
                    <SectionTitle>Playlists</SectionTitle>
                    <Box component="ul" sx={listSx}>
                        {data.playlists.map((playlist) => (
                            <PlaylistRow key={playlist.Id} playlist={playlist} nav={nav} />
                        ))}
                    </Box>
                </>
            ) : null}
        </Box>
    );
};

// MARK: Pages

const PageHeader = ({
    art,
    title,
    lines,
    actions,
}: {
    art: React.ReactNode;
    title: string;
    lines: (string | null | undefined)[];
    actions?: React.ReactNode;
}) => (
    <Box sx={{ display: 'flex', gap: 2.5, alignItems: 'flex-end', mb: 2.5, flexWrap: 'wrap' }}>
        <Box sx={{ flex: '0 0 auto', width: 'min(180px, 40%)', boxShadow: '0 12px 32px rgba(0, 0, 0, 0.45)', borderRadius: '10px' }}>{art}</Box>
        <Box sx={{ minWidth: 0, flex: '1 1 180px' }}>
            <Typography component="h2" sx={{ fontSize: 26, fontWeight: 700, lineHeight: 1.15, overflowWrap: 'anywhere' }}>
                {title}
            </Typography>
            {lines.filter(Boolean).map((line, index) => (
                <Typography key={index} sx={{ color: index === 0 ? colors.text2 : colors.text3, mt: index === 0 ? 0.5 : 0 }}>
                    {line}
                </Typography>
            ))}
            {actions ? <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mt: 1.5 }}>{actions}</Box> : null}
        </Box>
    </Box>
);

function totalSeconds(tracks: Track[]): number {
    return tracks.reduce((sum, track) => sum + library.ticksToSeconds(track.RunTimeTicks), 0);
}

export const AlbumPage = ({ id, name }: { id: string; name: string }) => {
    const client = useClient();
    const info = useLoad(() => library.album(client, id), [client, id]);
    const tracks = useLoad(() => library.albumTracks(client, id), [client, id]);
    const album = info.data;
    const groups = tracks.data ? library.groupByDisc(tracks.data) : [];
    const artist = album ? library.albumArtistName(album) : '';
    // On an album by several artists, say who each song is by.
    const showArtists = !!tracks.data && new Set(tracks.data.map((t) => library.trackArtistName(t))).size > 1;

    return (
        <Box>
            <PageHeader
                art={<Art src={album ? library.albumArt(client, album, 480) : null} />}
                title={album?.Name ?? name}
                lines={[artist, album?.ProductionYear ? String(album.ProductionYear) : null, tracks.data ? library.summaryText(tracks.data.length, totalSeconds(tracks.data)) : null]}
                actions={<AddAllButton tracks={tracks.data} label="Add album" />}
            />
            {groups.map((group) => (
                <Box key={group.disc}>
                    {groups.length > 1 ? <SectionTitle>Disc {group.disc}</SectionTitle> : null}
                    <Box component="ol" sx={listSx}>
                        {group.tracks.map((track, index) => (
                            <TrackRow
                                key={track.Id}
                                track={track}
                                number={track.IndexNumber ?? index + 1}
                                showArtist={showArtists}
                                trailing={<AddTrackButton track={track} />}
                            />
                        ))}
                    </Box>
                </Box>
            ))}
            <Status
                loading={tracks.loading}
                error={tracks.error ?? info.error}
                onRetry={() => {
                    info.retry();
                    tracks.retry();
                }}
                empty={tracks.data?.length === 0 ? 'This album has no songs.' : null}
            />
        </Box>
    );
};

export const ArtistPage = ({ id, name, nav }: { id: string; name: string; nav: Navigation }) => {
    const client = useClient();
    const { data, loading, error, retry } = useLoad(() => library.albumsByArtist(client, id), [client, id]);
    return (
        <Box>
            <Typography component="h2" sx={{ fontSize: 26, fontWeight: 700, lineHeight: 1.15, overflowWrap: 'anywhere' }}>
                {name}
            </Typography>
            <Typography sx={{ color: colors.text3, mb: 2.5 }}>{data ? `${data.length} ${data.length === 1 ? 'album' : 'albums'}` : ' '}</Typography>
            <Box component="ul" sx={tileGridSx}>
                {data?.map((album) => <AlbumTile key={album.Id} album={album} onOpen={openAlbum(nav)} showArtist={false} />)}
            </Box>
            <Status loading={loading} error={error} onRetry={retry} empty={data?.length === 0 ? 'No albums by this artist.' : null} />
        </Box>
    );
};

export const PlaylistPage = ({ id, name }: { id: string; name: string }) => {
    const client = useClient();
    const list = useDiscList();
    const { data, loading, error, retry } = useLoad(() => library.playlistTracks(client, id), [client, id]);
    const isDiscList = list.playlistId === id;
    return (
        <Box>
            <Typography component="h2" sx={{ fontSize: 26, fontWeight: 700, lineHeight: 1.15, overflowWrap: 'anywhere' }}>
                {name}
            </Typography>
            <Typography sx={{ color: colors.text3 }}>{data ? library.summaryText(data.length, totalSeconds(data)) : ' '}</Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 1, mt: 1.5, mb: 2 }}>
                {isDiscList ? (
                    <Typography sx={{ color: colors.text2 }}>This playlist is the disc list.</Typography>
                ) : (
                    <>
                        <AddAllButton tracks={data} label="Add all" />
                        <Button variant="outlined" color="inherit" disabled={!data || data.length === 0} onClick={() => data && adoptPlaylist({ Id: id, Name: name }, data)}>
                            Use as the disc list
                        </Button>
                    </>
                )}
            </Box>
            <Box component="ol" sx={listSx}>
                {data?.map((track, index) => (
                    <TrackRow
                        key={track.PlaylistItemId ?? `${track.Id}-${index}`}
                        track={track}
                        art={library.trackArt(client, track, 96)}
                        showArtist
                        trailing={isDiscList ? undefined : <AddTrackButton track={track} />}
                    />
                ))}
            </Box>
            <Status loading={loading} error={error} onRetry={retry} empty={data?.length === 0 ? 'This playlist is empty.' : null} />
        </Box>
    );
};
