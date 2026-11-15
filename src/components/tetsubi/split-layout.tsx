import React, { useCallback, useEffect, useRef, useState } from 'react';

import Box from '@mui/material/Box';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import Typography from '@mui/material/Typography';
import useMediaQuery from '@mui/material/useMediaQuery';

import { colors } from '../../tetsubi/theme';
import discUrl from '../../tetsubi/images/disc.svg?url';

const RATIO_KEY = 'tetsubi.layout.split';
const TAB_KEY = 'tetsubi.layout.tab';
const MIN_RATIO = 0.25;
const MAX_RATIO = 0.75;
/** Below this width the two halves become tabs. */
const NARROW = '(max-width: 899.95px)';

function loadRatio(): number {
    try {
        const value = Number(localStorage.getItem(RATIO_KEY));
        if (value >= MIN_RATIO && value <= MAX_RATIO) return value;
    } catch {
        // Fall through to the default.
    }
    return 0.5;
}

function remember(key: string, value: string) {
    try {
        localStorage.setItem(key, value);
    } catch {
        // Not remembered; nothing else depends on it.
    }
}

const panelSx = {
    minWidth: 0,
    minHeight: 0,
    overflow: 'hidden',
    backgroundColor: colors.box,
    border: `1px solid ${colors.line}`,
    borderRadius: '16px',
    backdropFilter: 'blur(8px)',
} as const;

/**
 * The app's frame: a header, then the library and the MiniDisc side by side
 * with a divider that can be dragged (or moved with the arrow keys).
 */
export const SplitLayout = ({ library, minidisc }: { library: React.ReactNode; minidisc: React.ReactNode }) => {
    const narrow = useMediaQuery(NARROW);
    const [ratio, setRatio] = useState(loadRatio);
    const [tab, setTab] = useState<'library' | 'minidisc'>(() => {
        try {
            return localStorage.getItem(TAB_KEY) === 'minidisc' ? 'minidisc' : 'library';
        } catch {
            return 'library';
        }
    });
    const [dragging, setDragging] = useState(false);
    const row = useRef<HTMLDivElement>(null);

    const changeRatio = useCallback((value: number) => {
        const next = Math.min(MAX_RATIO, Math.max(MIN_RATIO, value));
        setRatio(next);
        remember(RATIO_KEY, String(next));
    }, []);

    useEffect(() => {
        if (!dragging) return;
        const move = (event: PointerEvent) => {
            const box = row.current?.getBoundingClientRect();
            if (box && box.width > 0) changeRatio((event.clientX - box.left) / box.width);
        };
        const stop = () => setDragging(false);
        window.addEventListener('pointermove', move);
        window.addEventListener('pointerup', stop);
        window.addEventListener('pointercancel', stop);
        return () => {
            window.removeEventListener('pointermove', move);
            window.removeEventListener('pointerup', stop);
            window.removeEventListener('pointercancel', stop);
        };
    }, [dragging, changeRatio]);

    const onDividerKey = useCallback(
        (event: React.KeyboardEvent) => {
            if (event.key === 'ArrowLeft') changeRatio(ratio - 0.02);
            else if (event.key === 'ArrowRight') changeRatio(ratio + 0.02);
            else if (event.key === 'Home') changeRatio(MIN_RATIO);
            else if (event.key === 'End') changeRatio(MAX_RATIO);
            else return;
            event.preventDefault();
        },
        [ratio, changeRatio]
    );

    const changeTab = useCallback((_: unknown, value: 'library' | 'minidisc') => {
        setTab(value);
        remember(TAB_KEY, value);
    }, []);

    return (
        <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
            <Box component="header" sx={{ flex: '0 0 auto', display: 'flex', alignItems: 'center', gap: 1.25, px: 2.5, pt: 1.5, pb: 0.5 }}>
                <Box component="img" src={discUrl} alt="" sx={{ width: 30, height: 30 }} />
                <Typography component="h1" sx={{ fontSize: 20, fontWeight: 700, letterSpacing: '0.01em' }}>
                    Tetsubi{' '}
                    <Box
                        component="span"
                        sx={{
                            backgroundImage: `linear-gradient(100deg, ${colors.pink}, ${colors.blue})`,
                            backgroundClip: 'text',
                            WebkitBackgroundClip: 'text',
                            color: 'transparent',
                        }}
                    >
                        MD
                    </Box>
                </Typography>
            </Box>

            {narrow ? (
                <>
                    <Tabs value={tab} onChange={changeTab} variant="fullWidth" aria-label="Sections" sx={{ flex: '0 0 auto', px: 1.5 }}>
                        <Tab value="library" label="Library" id="tab-library" aria-controls="panel-library" />
                        <Tab value="minidisc" label="MiniDisc" id="tab-minidisc" aria-controls="panel-minidisc" />
                    </Tabs>
                    {/* Both stay mounted, so a write in progress or a sign-in isn't lost by switching. */}
                    <Box
                        role="tabpanel"
                        id="panel-library"
                        aria-labelledby="tab-library"
                        hidden={tab !== 'library'}
                        sx={{ ...panelSx, flex: '1 1 auto', m: 1.5, display: tab === 'library' ? 'block' : 'none' }}
                    >
                        {library}
                    </Box>
                    <Box
                        role="tabpanel"
                        id="panel-minidisc"
                        aria-labelledby="tab-minidisc"
                        hidden={tab !== 'minidisc'}
                        sx={{ ...panelSx, flex: '1 1 auto', m: 1.5, display: tab === 'minidisc' ? 'block' : 'none' }}
                    >
                        {minidisc}
                    </Box>
                </>
            ) : (
                <Box
                    ref={row}
                    sx={{
                        flex: '1 1 auto',
                        minHeight: 0,
                        display: 'flex',
                        p: 1.5,
                        userSelect: dragging ? 'none' : undefined,
                        cursor: dragging ? 'col-resize' : undefined,
                    }}
                >
                    <Box component="section" aria-label="Jellyfin library" sx={{ ...panelSx, flex: `0 0 calc(${ratio * 100}% - 8px)` }}>
                        {library}
                    </Box>
                    <Box
                        role="separator"
                        aria-orientation="vertical"
                        aria-label="Resize the two halves"
                        aria-valuemin={Math.round(MIN_RATIO * 100)}
                        aria-valuemax={Math.round(MAX_RATIO * 100)}
                        aria-valuenow={Math.round(ratio * 100)}
                        tabIndex={0}
                        onPointerDown={(event) => {
                            event.preventDefault();
                            setDragging(true);
                        }}
                        onDoubleClick={() => changeRatio(0.5)}
                        onKeyDown={onDividerKey}
                        sx={{
                            flex: '0 0 16px',
                            cursor: 'col-resize',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            touchAction: 'none',
                            '&::after': {
                                content: '""',
                                width: 4,
                                height: 48,
                                borderRadius: 2,
                                backgroundColor: dragging ? colors.blue : 'rgba(255, 255, 255, 0.25)',
                                transition: 'background-color 0.15s',
                            },
                            '&:hover::after, &:focus-visible::after': { backgroundColor: colors.blue },
                        }}
                    />
                    <Box component="section" aria-label="MiniDisc" sx={{ ...panelSx, flex: '1 1 0' }}>
                        {minidisc}
                    </Box>
                </Box>
            )}
        </Box>
    );
};
