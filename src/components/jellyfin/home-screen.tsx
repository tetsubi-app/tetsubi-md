// Home, as in the Tetsubi app: rows of albums to dip into, and the
// Favourites tab that Home's own row leads to.

import React, { useState } from 'react';

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import ButtonBase from '@mui/material/ButtonBase';
import IconButton from '@mui/material/IconButton';
import Skeleton from '@mui/material/Skeleton';
import Typography from '@mui/material/Typography';
import { ChevronRight as MoreIcon } from '@mui/icons-material';
import { Shuffle as ShuffleIcon } from '@mui/icons-material';

import { useFavouritesVersion } from '../../jellyfin/favourites';
import * as library from '../../jellyfin/library';
import { Album, Playlist } from '../../jellyfin/library';
import { colors } from '../../tetsubi/theme';
import { Loaded, useClient, useLoad } from './library-hooks';
import { AlbumTile, Art, Status, tileGridSx } from './library-parts';
import type { Navigation } from './library-screens';

const CARD = 132;

const rowSx = {
    display: 'flex',
    gap: 2,
    listStyle: 'none',
    p: 0,
    m: 0,
    pb: 1,
    overflowX: 'auto',
    scrollSnapType: 'x proximity',
    '& > li': { flex: `0 0 ${CARD}px`, scrollSnapAlign: 'start' },
} as const;

const SectionHeader = ({ title, action }: { title: string; action?: React.ReactNode }) => (
    <Box sx={{ display: 'flex', alignItems: 'center', mt: 3, mb: 1, minHeight: 36, '&:first-of-type': { mt: 0 } }}>
        <Typography component="h3" sx={{ flex: '1 1 auto', fontSize: 18, fontWeight: 700 }}>
            {title}
        </Typography>
        {action}
    </Box>
);

const ViewAll = ({ title, onClick }: { title: string; onClick: () => void }) => (
    <IconButton size="small" aria-label={`View all ${title}`} onClick={onClick} sx={{ color: colors.blue }}>
        <MoreIcon />
    </IconButton>
);

/** Grey cards in place of a row that is still loading. */
const RowPlaceholder = () => (
    <Box sx={{ display: 'flex', gap: 2, overflow: 'hidden' }} role="status" aria-label="Loading">
        {Array.from({ length: 6 }, (_, index) => (
            <Box key={index} sx={{ flex: `0 0 ${CARD}px` }}>
                <Skeleton variant="rounded" width={CARD} height={CARD} sx={{ borderRadius: '10px' }} />
                <Skeleton width="80%" sx={{ mt: 1, mx: 'auto' }} />
                <Skeleton width="55%" sx={{ mx: 'auto' }} />
            </Box>
        ))}
    </Box>
);

/** One row of Home: album cards side by side, scrolling sideways. */
function AlbumRow<T>({
    loaded,
    albumOf,
    badgeOf,
    empty,
    nav,
}: {
    loaded: Loaded<T[]>;
    albumOf: (item: T) => Album;
    /** A lozenge on the cover, such as "30 years ago". */
    badgeOf?: (item: T) => string;
    empty: string;
    nav: Navigation;
}) {
    const { data, loading, error, retry } = loaded;
    if (!data) return loading ? <RowPlaceholder /> : <Status error={error} onRetry={retry} />;
    if (data.length === 0) return <Typography sx={{ color: colors.text3, py: 1 }}>{empty}</Typography>;
    return (
        <Box component="ul" sx={{ ...rowSx, opacity: loading ? 0.6 : 1, transition: 'opacity 0.15s' }}>
            {data.map((item) => {
                const album = albumOf(item);
                return (
                    <AlbumTile key={album.Id} album={album} badge={badgeOf?.(item)} onOpen={(a) => nav.open({ kind: 'album', id: a.Id, name: a.Name })} />
                );
            })}
        </Box>
    );
}

const PlaylistCard = ({ playlist, nav }: { playlist: Playlist; nav: Navigation }) => {
    const client = useClient();
    return (
        <Box component="li" sx={{ minWidth: 0 }}>
            <ButtonBase
                onClick={() => nav.open({ kind: 'playlist', id: playlist.Id, name: playlist.Name })}
                sx={{ display: 'block', width: '100%', textAlign: 'center', borderRadius: '10px', '&:hover img': { opacity: 0.85 } }}
            >
                <Art src={library.albumArt(client, playlist, 360)} kind="playlist" />
                <Typography sx={{ fontSize: 14, fontWeight: 600, lineHeight: 1.25, mt: 1, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                    {playlist.Name}
                </Typography>
                {playlist.ChildCount !== undefined ? (
                    <Typography sx={{ fontSize: 13, color: colors.text3 }}>{library.songCountText(playlist.ChildCount)}</Typography>
                ) : null}
            </ButtonBase>
        </Box>
    );
};

const sameAlbum = (album: Album) => album;

export const HomeTab = ({ nav }: { nav: Navigation }) => {
    const client = useClient();
    const favouritesVersion = useFavouritesVersion();

    const onThisDay = useLoad(() => library.onThisDayAlbums(client), [client]);
    const favourites = useLoad(() => library.favouriteAlbums(client), [client, favouritesVersion]);
    const random = useLoad(() => library.randomAlbums(client), [client]);
    const playlists = useLoad(() => library.playlists(client), [client]);
    const played = useLoad(() => library.recentlyPlayedAlbums(client), [client]);
    const added = useLoad(() => library.recentlyAddedAlbums(client), [client]);

    // Hidden unless an album was released on today's date (shown while it's still finding out).
    const showOnThisDay = onThisDay.loading || (onThisDay.data?.length ?? 0) > 0;

    return (
        <Box>
            {showOnThisDay ? (
                <>
                    <SectionHeader title="On This Day" />
                    <AlbumRow loaded={onThisDay} albumOf={(entry) => entry.album} badgeOf={(entry) => library.anniversaryText(entry.yearsAgo)} empty="" nav={nav} />
                </>
            ) : null}

            <SectionHeader title="Favourites" action={<ViewAll title="Favourites" onClick={() => nav.showTab('favourites')} />} />
            <AlbumRow loaded={favourites} albumOf={sameAlbum} empty="No favourite albums yet." nav={nav} />

            <SectionHeader title="Random Albums" action={<ViewAll title="Random Albums" onClick={() => nav.open({ kind: 'random', name: 'Random Albums' })} />} />
            <AlbumRow loaded={random} albumOf={sameAlbum} empty="No albums in this library yet." nav={nav} />

            {playlists.data && playlists.data.length > 0 ? (
                <>
                    <SectionHeader title="Playlists" action={<ViewAll title="Playlists" onClick={() => nav.showTab('playlists')} />} />
                    <Box component="ul" sx={rowSx}>
                        {playlists.data.map((playlist) => (
                            <PlaylistCard key={playlist.Id} playlist={playlist} nav={nav} />
                        ))}
                    </Box>
                </>
            ) : null}

            <SectionHeader title="Recently Played" />
            <AlbumRow loaded={played} albumOf={sameAlbum} empty="No recently played music yet." nav={nav} />

            <SectionHeader title="Recently Added" />
            <AlbumRow loaded={added} albumOf={sameAlbum} empty="No recently added music." nav={nav} />
        </Box>
    );
};

/** How many albums the Random Albums page picks at a time. */
const RANDOM_COUNT = 24;

/** A page of albums picked at random, with a button to pick again. */
export const RandomPage = ({ nav }: { nav: Navigation }) => {
    const client = useClient();
    const [round, setRound] = useState(0);
    const { data, loading, error, retry } = useLoad(() => library.randomAlbums(client, RANDOM_COUNT), [client, round]);
    return (
        <Box>
            <Typography component="h2" sx={{ fontSize: 26, fontWeight: 700, lineHeight: 1.15, mb: 2.5 }}>
                Random Albums
            </Typography>
            <Box component="ul" sx={{ ...tileGridSx, opacity: loading && data ? 0.6 : 1, transition: 'opacity 0.15s' }}>
                {data?.map((album) => <AlbumTile key={album.Id} album={album} onOpen={(a) => nav.open({ kind: 'album', id: a.Id, name: a.Name })} />)}
            </Box>
            <Status loading={loading && !data} error={error} onRetry={retry} empty={data?.length === 0 ? 'No albums in this library yet.' : null} />
            {data && data.length > 0 ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3, mb: 1 }}>
                    <Button variant="contained" startIcon={<ShuffleIcon />} disabled={loading} onClick={() => setRound((n) => n + 1)}>
                        Randomise
                    </Button>
                </Box>
            ) : null}
        </Box>
    );
};

export const FavouritesTab = ({ nav }: { nav: Navigation }) => {
    const client = useClient();
    const favouritesVersion = useFavouritesVersion();
    const { data, loading, error, retry } = useLoad(() => library.favouriteAlbums(client), [client, favouritesVersion]);
    return (
        <Box>
            <Typography sx={{ color: colors.text3, fontSize: 14, mb: 2, minHeight: 21 }} aria-live="polite">
                {data ? `${data.length.toLocaleString()} ${data.length === 1 ? 'album' : 'albums'}` : ''}
            </Typography>
            <Box component="ul" sx={tileGridSx}>
                {data?.map((album) => <AlbumTile key={album.Id} album={album} onOpen={(a) => nav.open({ kind: 'album', id: a.Id, name: a.Name })} />)}
            </Box>
            <Status
                loading={loading && !data}
                error={error}
                onRetry={retry}
                empty={data?.length === 0 ? 'No favourite albums yet. Use the heart on an album to add one.' : null}
            />
        </Box>
    );
};
