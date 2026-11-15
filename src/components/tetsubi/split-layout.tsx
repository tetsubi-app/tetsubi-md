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
    // No backdrop blur here: it would make this box the anchor for fixed-position
    // children, which throws off rows while they're being dragged.
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
                <Box
                    component="a"
                    href="https://tetsubi.app/"
                    aria-label="Tetsubi home page"
                    sx={{ display: 'flex', borderRadius: '50%', transition: 'opacity 0.15s', '&:hover': { opacity: 0.8 } }}
                >
                    <Box component="img" src={discUrl} alt="" sx={{ width: 30, height: 30 }} />
                </Box>
                <Typography component="h1" sx={{ fontSize: 20, fontWeight: 700, letterSpacing: '0.01em' }}>
                    Tetsubi MD{' '}
                    <span aria-hidden="true">💽</span>
                </Typography>
            </Box>

            {narrow ? (
                <Tabs value={tab} onChange={changeTab} variant="fullWidth" aria-label="Sections" sx={{ flex: '0 0 auto', px: 1.5 }}>
                    <Tab value="library" label="Library" id="tab-library" aria-controls="panel-library" />
                    <Tab value="minidisc" label="MiniDisc" id="tab-minidisc" aria-controls="panel-minidisc" />
                </Tabs>
            ) : null}

            {/*
              One tree for both layouts, so resizing the window across the
              breakpoint never remounts a half (which would lose a sign-in in
              progress, the place in the library, or a write to the disc).
              When narrow, the half that isn't chosen is only hidden.
            */}
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
                <Box
                    component="section"
                    id="panel-library"
                    role={narrow ? 'tabpanel' : undefined}
                    aria-label={narrow ? undefined : 'Jellyfin library'}
                    aria-labelledby={narrow ? 'tab-library' : undefined}
                    sx={{
                        ...panelSx,
                        flex: narrow ? '1 1 0' : `0 0 calc(${ratio * 100}% - 8px)`,
                        display: narrow && tab !== 'library' ? 'none' : 'block',
                    }}
                >
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
                        display: narrow ? 'none' : 'flex',
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
                <Box
                    component="section"
                    id="panel-minidisc"
                    role={narrow ? 'tabpanel' : undefined}
                    aria-label={narrow ? undefined : 'MiniDisc'}
                    aria-labelledby={narrow ? 'tab-minidisc' : undefined}
                    sx={{ ...panelSx, flex: '1 1 0', display: narrow && tab !== 'minidisc' ? 'none' : 'block' }}
                >
                    {minidisc}
                </Box>
            </Box>
        </Box>
    );
};
