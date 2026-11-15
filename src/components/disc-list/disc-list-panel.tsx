import React, { useEffect, useState } from 'react';
import { DragDropContext, Draggable, Droppable, DropResult } from '@hello-pangea/dnd';

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import InputBase from '@mui/material/InputBase';
import LinearProgress from '@mui/material/LinearProgress';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Snackbar from '@mui/material/Snackbar';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import { CloudDone as SavedIcon } from '@mui/icons-material';
import { Close as RemoveIcon } from '@mui/icons-material';
import { DragIndicator as DragIcon } from '@mui/icons-material';
import { ErrorOutline as ErrorIcon } from '@mui/icons-material';
import { MoreVert as MoreIcon } from '@mui/icons-material';
import { Sync as SavingIcon } from '@mui/icons-material';

import { MODES, MODE_FACTOR, RecordingMode, UNTITLED, minutesText, modeThatFits } from '../../disc-list/naming';
import {
    Entry,
    currentPlaylistName,
    flush,
    moveEntry,
    newDiscList,
    removeEntry,
    renameDisc,
    setMode,
    totalSeconds,
    useDiscList,
} from '../../disc-list/store';
import { useShallowEqualSelector } from '../../frontend-utils';
import { durationText, imageUrl, songCountText } from '../../jellyfin/library';
import { currentClient } from '../../jellyfin/session';
import serviceRegistry from '../../services/registry';
import { colors } from '../../tetsubi/theme';
import { Art } from '../jellyfin/library-parts';

/** Whether the list fits, in words, and how full the disc would be (0 to 1, or more when it doesn't fit). */
function fit(seconds: number, mode: RecordingMode, discSecondsFree: number | null): { text: string; fill: number; over: boolean } | null {
    if (seconds <= 0) return null;
    const room = (discSecondsFree ?? 80 * 60) * MODE_FACTOR[mode];
    const over = seconds > room;
    const fill = room > 0 ? seconds / room : 2;
    const where = discSecondsFree === null ? 'an 80-minute disc' : 'this disc';
    if (!over) {
        return { text: `Fits ${where} in ${mode}, with ${minutesText(room - seconds)} to spare.`, fill, over };
    }
    const better = modeThatFits(seconds, discSecondsFree ?? undefined);
    const by = `Too long for ${where} in ${mode} by ${minutesText(seconds - room)}.`;
    return { text: better ? `${by} It fits in ${better}.` : `${by} It won't fit in any mode.`, fill, over };
}

const SyncBadge = () => {
    const { sync, playlistId } = useDiscList();
    if (sync.status === 'error') {
        return (
            <Button size="small" color="warning" startIcon={<ErrorIcon />} onClick={() => flush()} sx={{ flex: '0 0 auto' }}>
                Retry save
            </Button>
        );
    }
    if (sync.status === 'saving') {
        return (
            <Box role="status" sx={{ display: 'flex', alignItems: 'center', gap: 0.5, color: colors.text3, flex: '0 0 auto' }}>
                <SavingIcon sx={{ fontSize: 18 }} />
                <Typography sx={{ fontSize: 13 }}>Saving…</Typography>
            </Box>
        );
    }
    if (!playlistId) return null;
    return (
        <Tooltip title="Saved to your Jellyfin playlist">
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, color: colors.text3, flex: '0 0 auto' }}>
                <SavedIcon sx={{ fontSize: 18 }} />
                <Typography sx={{ fontSize: 13 }}>Saved</Typography>
            </Box>
        </Tooltip>
    );
};

/** The disc's name. Typing is kept local; the playlist is renamed on Enter or on leaving the field. */
const NameField = () => {
    const { name } = useDiscList();
    const [draft, setDraft] = useState(name);
    useEffect(() => setDraft(name), [name]);
    return (
        <InputBase
            value={draft}
            onChange={(event) => setDraft(event.target.value)}
            onBlur={() => renameDisc(draft)}
            onKeyDown={(event) => {
                if (event.key === 'Enter') (event.target as HTMLInputElement).blur();
                if (event.key === 'Escape') setDraft(name);
            }}
            placeholder={UNTITLED}
            inputProps={{ 'aria-label': 'Disc name', maxLength: 120 }}
            sx={{
                flex: '1 1 auto',
                minWidth: 0,
                fontSize: 20,
                fontWeight: 700,
                borderRadius: '8px',
                px: 1,
                ml: -1,
                '&:hover, &.Mui-focused': { backgroundColor: 'rgba(255, 255, 255, 0.07)' },
            }}
        />
    );
};

const Row = ({ entry, index }: { entry: Entry; index: number }) => {
    const client = currentClient();
    const art = client ? imageUrl(client, entry.artItemId, entry.artTag, 96) : null;
    return (
        <Draggable draggableId={entry.key} index={index}>
            {(provided, snapshot) => (
                <Box
                    component="li"
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    sx={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 1,
                        py: 0.5,
                        pr: 0.5,
                        borderRadius: '8px',
                        backgroundColor: snapshot.isDragging ? colors.surface : 'transparent',
                        boxShadow: snapshot.isDragging ? '0 8px 24px rgba(0, 0, 0, 0.5)' : 'none',
                        '&:hover': { backgroundColor: snapshot.isDragging ? colors.surface : 'action.hover' },
                    }}
                >
                    <Box
                        {...provided.dragHandleProps}
                        aria-label={`Move ${entry.name}`}
                        sx={{ display: 'flex', alignItems: 'center', color: colors.text3, cursor: 'grab', px: 0.25, borderRadius: '6px' }}
                    >
                        <DragIcon fontSize="small" />
                    </Box>
                    <Typography sx={{ flex: '0 0 22px', textAlign: 'right', color: colors.text3, fontSize: 14, fontVariantNumeric: 'tabular-nums' }}>
                        {index + 1}
                    </Typography>
                    <Art src={art} size={36} />
                    <Box sx={{ minWidth: 0, flex: '1 1 auto' }}>
                        <Typography noWrap sx={{ fontSize: 15 }}>
                            {entry.name}
                        </Typography>
                        <Typography noWrap sx={{ fontSize: 13, color: colors.text3 }}>
                            {[entry.artist, entry.album].filter(Boolean).join(' · ')}
                        </Typography>
                    </Box>
                    <Typography sx={{ flex: '0 0 auto', color: colors.text3, fontSize: 14, fontVariantNumeric: 'tabular-nums' }}>
                        {entry.seconds ? durationText(entry.seconds) : ''}
                    </Typography>
                    <IconButton size="small" aria-label={`Remove ${entry.name}`} onClick={() => removeEntry(entry.key)}>
                        <RemoveIcon fontSize="small" />
                    </IconButton>
                </Box>
            )}
        </Draggable>
    );
};

/** The songs chosen for the disc, mirrored by a Jellyfin playlist. Shown under the recorder. */
export const DiscListPanel = () => {
    const list = useDiscList();
    const disc = useShallowEqualSelector((state) => state.main.disc);
    const [menu, setMenu] = useState<HTMLElement | null>(null);

    if (!list.account) return null;

    // A NetMD disc reports its free time in SP seconds; Hi-MD counts bytes, which don't map to a time.
    const timed = serviceRegistry.netmdSpec?.measurementUnits !== 'bytes';
    const discSecondsFree = disc && timed ? disc.left : null;
    const seconds = totalSeconds(list);
    const fits = disc && !timed ? null : fit(seconds, list.mode, discSecondsFree);

    const onDragEnd = (result: DropResult) => {
        if (result.destination) moveEntry(result.source.index, result.destination.index);
    };

    return (
        <Box component="section" aria-label="Disc list" sx={{ flex: '1 1 auto', display: 'flex', flexDirection: 'column', minHeight: 0 }}>
            <Box sx={{ px: 3, pt: 2 }}>
                <Typography sx={{ fontSize: 12, fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', color: colors.text3 }}>
                    To write
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <NameField />
                    <SyncBadge />
                    <IconButton aria-label="Disc list options" aria-haspopup="menu" onClick={(event) => setMenu(event.currentTarget)} edge="end">
                        <MoreIcon />
                    </IconButton>
                    <Menu anchorEl={menu} open={!!menu} onClose={() => setMenu(null)}>
                        <MenuItem
                            disabled={list.entries.length === 0 && !list.name}
                            onClick={() => {
                                setMenu(null);
                                newDiscList();
                            }}
                        >
                            Start a new disc list
                        </MenuItem>
                    </Menu>
                </Box>
                {list.sync.status === 'error' ? (
                    <Typography role="alert" sx={{ fontSize: 13, color: 'warning.main' }}>
                        {list.sync.message}
                    </Typography>
                ) : list.entries.length > 0 || list.playlistId ? (
                    <Typography noWrap sx={{ fontSize: 13, color: colors.text3 }}>
                        Playlist: {currentPlaylistName(list)}
                    </Typography>
                ) : null}

                {list.entries.length > 0 ? (
                    <Box sx={{ mt: 1.5 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                            <Typography sx={{ flex: '1 1 auto', fontSize: 14, color: colors.text2 }}>
                                {songCountText(list.entries.length)} · {minutesText(seconds)}
                            </Typography>
                            <ToggleButtonGroup
                                value={list.mode}
                                exclusive
                                size="small"
                                aria-label="Recording mode"
                                onChange={(_, value: RecordingMode | null) => value && setMode(value)}
                            >
                                {MODES.map((mode) => (
                                    <ToggleButton key={mode} value={mode} sx={{ py: 0.25, px: 1.25, fontSize: 13 }}>
                                        {mode}
                                    </ToggleButton>
                                ))}
                            </ToggleButtonGroup>
                        </Box>
                        {fits ? (
                            <>
                                <LinearProgress
                                    variant="determinate"
                                    value={Math.min(100, fits.fill * 100)}
                                    color={fits.over ? 'warning' : 'primary'}
                                    aria-hidden="true"
                                    sx={{ mt: 1, height: 6, borderRadius: 3 }}
                                />
                                <Typography sx={{ mt: 0.5, fontSize: 13, color: fits.over ? 'warning.main' : colors.text3 }} aria-live="polite">
                                    {fits.text}
                                </Typography>
                            </>
                        ) : null}
                    </Box>
                ) : null}
            </Box>

            <Box sx={{ flex: '1 1 auto', minHeight: 0, overflowY: 'auto', px: 2, py: 1 }}>
                {list.entries.length === 0 ? (
                    <Typography sx={{ color: colors.text3, textAlign: 'center', py: 3, px: 2 }}>
                        Add albums or songs from your library. They're saved as a Jellyfin playlist named after this disc.
                    </Typography>
                ) : (
                    <DragDropContext onDragEnd={onDragEnd}>
                        <Droppable droppableId="disc-list">
                            {(provided) => (
                                <Box component="ol" ref={provided.innerRef} {...provided.droppableProps} sx={{ listStyle: 'none', p: 0, m: 0 }}>
                                    {list.entries.map((entry, index) => (
                                        <Row key={entry.key} entry={entry} index={index} />
                                    ))}
                                    {provided.placeholder}
                                </Box>
                            )}
                        </Droppable>
                    </DragDropContext>
                )}
            </Box>
        </Box>
    );
};

/** Says what the last change to the disc list was. Useful when the list itself is out of sight. */
export const DiscListToast = () => {
    const { notice } = useDiscList();
    const [shown, setShown] = useState<number | null>(null);
    useEffect(() => {
        if (notice) setShown(notice.id);
    }, [notice]);
    return (
        <Snackbar
            key={notice?.id}
            open={!!notice && shown === notice.id}
            autoHideDuration={3500}
            onClose={(_, reason) => reason !== 'clickaway' && setShown(null)}
            message={notice?.text}
            anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
        />
    );
};
