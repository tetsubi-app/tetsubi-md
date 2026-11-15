// Pieces shared by the library screens: covers, status lines, album tiles and song rows.

import React, { useState } from 'react';

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import ButtonBase from '@mui/material/ButtonBase';
import CircularProgress from '@mui/material/CircularProgress';
import Typography from '@mui/material/Typography';
import { Album as AlbumIcon } from '@mui/icons-material';
import { Person as PersonIcon } from '@mui/icons-material';
import { QueueMusic as QueueMusicIcon } from '@mui/icons-material';

import { Album, Track, albumArt, albumArtistName, durationText, ticksToSeconds, trackArtistName } from '../../jellyfin/library';
import { colors } from '../../tetsubi/theme';
import { useClient } from './library-hooks';

const PLACEHOLDER_ICONS = { album: AlbumIcon, artist: PersonIcon, playlist: QueueMusicIcon };

/** A square cover, or a quiet placeholder when there is none (or it fails to load). */
export const Art = ({
    src,
    kind = 'album',
    round = false,
    size,
}: {
    src: string | null;
    kind?: keyof typeof PLACEHOLDER_ICONS;
    round?: boolean;
    /** Fixed size in px; omit to fill the width of the parent. */
    size?: number;
}) => {
    const [failed, setFailed] = useState(false);
    const Icon = PLACEHOLDER_ICONS[kind];
    return (
        <Box
            sx={{
                position: 'relative',
                width: size ?? '100%',
                height: size,
                aspectRatio: '1 / 1',
                flex: size ? `0 0 ${size}px` : undefined,
                borderRadius: round ? '50%' : size && size < 64 ? '6px' : '10px',
                overflow: 'hidden',
                backgroundColor: 'rgba(255, 255, 255, 0.07)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
            }}
        >
            {src && !failed ? (
                <Box
                    component="img"
                    src={src}
                    alt=""
                    loading="lazy"
                    decoding="async"
                    onError={() => setFailed(true)}
                    sx={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }}
                />
            ) : (
                <Icon sx={{ width: '45%', height: '45%', color: 'rgba(255, 255, 255, 0.3)' }} />
            )}
        </Box>
    );
};

/** What to show in place of a list: still loading, failed (with a retry), or empty. */
export const Status = ({
    loading,
    error,
    empty,
    onRetry,
}: {
    loading?: boolean;
    error?: string | null;
    /** Shown when there's nothing to list. */
    empty?: string | null;
    onRetry?: () => void;
}) => {
    if (error) {
        return (
            <Box role="alert" sx={{ textAlign: 'center', py: 4, px: 2 }}>
                <Typography sx={{ color: colors.text2 }}>{error}</Typography>
                {onRetry ? (
                    <Button variant="outlined" color="inherit" onClick={onRetry} sx={{ mt: 1.5 }}>
                        Try again
                    </Button>
                ) : null}
            </Box>
        );
    }
    if (loading) {
        return (
            <Box role="status" sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1.5, py: 4, color: 'text.secondary' }}>
                <CircularProgress size={18} color="inherit" />
                <Typography>Loading…</Typography>
            </Box>
        );
    }
    if (empty) {
        return <Typography sx={{ textAlign: 'center', py: 4, px: 2, color: 'text.secondary' }}>{empty}</Typography>;
    }
    return null;
};

export const SectionTitle = ({ children }: { children: React.ReactNode }) => (
    <Typography component="h3" sx={{ fontSize: 18, fontWeight: 700, mt: 3, mb: 1.5 }}>
        {children}
    </Typography>
);

export const tileGridSx = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(132px, 1fr))',
    gap: 2,
    listStyle: 'none',
    p: 0,
    m: 0,
} as const;

const twoLines = {
    display: '-webkit-box',
    WebkitLineClamp: 2,
    WebkitBoxOrient: 'vertical',
    overflow: 'hidden',
} as const;

/** One album in a grid: cover, title, artist and year. */
export const AlbumTile = ({ album, onOpen, showArtist = true }: { album: Album; onOpen: (album: Album) => void; showArtist?: boolean }) => {
    const client = useClient();
    const artist = albumArtistName(album);
    return (
        <Box component="li" sx={{ minWidth: 0 }}>
            <ButtonBase
                onClick={() => onOpen(album)}
                sx={{ display: 'block', width: '100%', textAlign: 'left', borderRadius: '10px', '&:hover img': { opacity: 0.85 } }}
            >
                <Art src={albumArt(client, album, 360)} />
                <Typography sx={{ fontSize: 14, fontWeight: 600, lineHeight: 1.25, mt: 1, ...twoLines }}>{album.Name}</Typography>
                {showArtist && artist ? (
                    <Typography noWrap sx={{ fontSize: 13, color: colors.text2 }}>
                        {artist}
                    </Typography>
                ) : null}
                {album.ProductionYear ? <Typography sx={{ fontSize: 13, color: colors.text3 }}>{album.ProductionYear}</Typography> : null}
            </ButtonBase>
        </Box>
    );
};

/** One album as a row: small cover, then title, artist and year. */
export const AlbumRow = ({ album, onOpen }: { album: Album; onOpen: (album: Album) => void }) => {
    const client = useClient();
    const artist = albumArtistName(album);
    return (
        <Box component="li">
            <ButtonBase
                onClick={() => onOpen(album)}
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
                <Art src={albumArt(client, album, 112)} size={48} />
                <Box sx={{ minWidth: 0, flex: '1 1 auto' }}>
                    <Typography noWrap sx={{ fontWeight: 600 }}>
                        {album.Name}
                    </Typography>
                    <Typography noWrap sx={{ fontSize: 14, color: colors.text3 }}>
                        {[artist, album.ProductionYear].filter(Boolean).join(' · ')}
                    </Typography>
                </Box>
            </ButtonBase>
        </Box>
    );
};

export const listSx = { listStyle: 'none', p: 0, m: 0 } as const;

/** One song: its number (or cover), title, artist where it helps, and length. */
export const TrackRow = ({
    track,
    number,
    art,
    showArtist,
    trailing,
}: {
    track: Track;
    /** The number to show at the start of the row. */
    number?: number;
    /** A cover to show at the start instead of a number. */
    art?: string | null;
    showArtist?: boolean;
    /** Something to put at the end of the row, after the length. */
    trailing?: React.ReactNode;
}) => {
    const artist = trackArtistName(track);
    const second = showArtist ? [artist, art !== undefined ? track.Album : null].filter(Boolean).join(' · ') : '';
    return (
        <Box
            component="li"
            sx={{ display: 'flex', alignItems: 'center', gap: 1.5, py: 0.75, px: 1, borderRadius: '8px', '&:hover': { backgroundColor: 'action.hover' } }}
        >
            {art !== undefined ? (
                <Art src={art} size={40} />
            ) : (
                <Typography sx={{ flex: '0 0 28px', textAlign: 'right', color: colors.text3, fontVariantNumeric: 'tabular-nums' }}>{number ?? ''}</Typography>
            )}
            <Box sx={{ minWidth: 0, flex: '1 1 auto' }}>
                <Typography noWrap>{track.Name}</Typography>
                {second ? (
                    <Typography noWrap sx={{ fontSize: 13, color: colors.text3 }}>
                        {second}
                    </Typography>
                ) : null}
            </Box>
            <Typography sx={{ flex: '0 0 auto', color: colors.text3, fontSize: 14, fontVariantNumeric: 'tabular-nums' }}>
                {track.RunTimeTicks ? durationText(ticksToSeconds(track.RunTimeTicks)) : ''}
            </Typography>
            {trailing}
        </Box>
    );
};
