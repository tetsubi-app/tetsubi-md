import React, { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import { AccountCircle as AccountCircleIcon } from '@mui/icons-material';
import { ArrowBackIosNew as ArrowBackIcon } from '@mui/icons-material';
import { Clear as ClearIcon } from '@mui/icons-material';
import { Search as SearchIcon } from '@mui/icons-material';

import { signOut, useJellyfin } from '../../jellyfin/session';
import { useDebounced } from './library-hooks';
import { FavouritesTab, HomeTab, RandomPage } from './home-screen';
import { AlbumPage, AlbumsTab, ArtistPage, ArtistsTab, Navigation, PlaylistPage, PlaylistsTab, Route, SearchResults, TabName } from './library-screens';

const TABS: { value: TabName; label: string }[] = [
    { value: 'home', label: 'Home' },
    { value: 'albums', label: 'Albums' },
    { value: 'artists', label: 'Artists' },
    { value: 'favourites', label: 'Favourites' },
    { value: 'playlists', label: 'Playlists' },
];

const AccountMenu = () => {
    const { session } = useJellyfin();
    const [anchor, setAnchor] = useState<HTMLElement | null>(null);
    return (
        <>
            <IconButton aria-label="Account" aria-haspopup="menu" onClick={(event) => setAnchor(event.currentTarget)}>
                <AccountCircleIcon />
            </IconButton>
            <Menu anchorEl={anchor} open={!!anchor} onClose={() => setAnchor(null)}>
                <Box sx={{ px: 2, py: 1, maxWidth: 280 }}>
                    <Typography noWrap sx={{ fontWeight: 600 }}>
                        {session?.userName}
                    </Typography>
                    <Typography noWrap sx={{ fontSize: 14, color: 'text.secondary' }}>
                        {session?.serverName ?? session?.serverUrl}
                    </Typography>
                </Box>
                <MenuItem
                    onClick={() => {
                        setAnchor(null);
                        signOut();
                    }}
                >
                    Sign out
                </MenuItem>
            </Menu>
        </>
    );
};

/**
 * The signed-in library: tabs and search at the top level, with album,
 * artist and playlist pages opening over them. The top level stays mounted
 * underneath, so going back returns to the same place in the list.
 */
export const Library = () => {
    const [tab, setTabState] = useState<TabName>('home');
    // The tabs share one scrolling area, so each tab's place in it is kept here.
    const tabScroll = useRef<HTMLDivElement>(null);
    const tabPositions = useRef<Partial<Record<TabName, number>>>({});
    const currentTab = useRef(tab);
    const setTab = useCallback((next: TabName) => {
        if (tabScroll.current) tabPositions.current[currentTab.current] = tabScroll.current.scrollTop;
        currentTab.current = next;
        setTabState(next);
    }, []);
    useLayoutEffect(() => {
        if (tabScroll.current) tabScroll.current.scrollTop = tabPositions.current[tab] ?? 0;
    }, [tab]);
    const [query, setQuery] = useState('');
    const term = useDebounced(query.trim(), 300);
    const [stack, setStack] = useState<Route[]>([]);
    const route = stack[stack.length - 1];

    const nav: Navigation = useMemo(
        () => ({
            open: (next) => setStack((old) => [...old, next]),
            showTab: (next) => {
                setStack([]);
                setQuery('');
                setTab(next);
            },
        }),
        [setTab]
    );
    const back = useCallback(() => setStack((old) => old.slice(0, -1)), []);

    // A new page starts at its top; the top level keeps its own scroll position.
    const pageScroll = useRef<HTMLDivElement>(null);
    const backButton = useRef<HTMLButtonElement>(null);
    useEffect(() => {
        if (!route) return;
        pageScroll.current?.scrollTo(0, 0);
        backButton.current?.focus();
    }, [route]);

    const previous = stack.length > 1 ? stack[stack.length - 2].name : term ? 'Search' : TABS.find((t) => t.value === tab)!.label;

    return (
        <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
            {/* Top level */}
            <Box sx={{ display: route ? 'none' : 'flex', flexDirection: 'column', flex: '1 1 auto', minHeight: 0 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, px: 2, pt: 2 }}>
                    <TextField
                        value={query}
                        onChange={(event) => setQuery(event.target.value)}
                        placeholder="Search your library"
                        variant="outlined"
                        size="small"
                        fullWidth
                        type="search"
                        inputProps={{ 'aria-label': 'Search your library' }}
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <SearchIcon fontSize="small" />
                                </InputAdornment>
                            ),
                            endAdornment: query ? (
                                <InputAdornment position="end">
                                    <IconButton size="small" edge="end" aria-label="Clear search" onClick={() => setQuery('')}>
                                        <ClearIcon fontSize="small" />
                                    </IconButton>
                                </InputAdornment>
                            ) : null,
                            sx: { borderRadius: '999px', '& input::-webkit-search-cancel-button': { display: 'none' } },
                        }}
                    />
                    <AccountMenu />
                </Box>
                {term ? null : (
                    <Tabs
                        value={tab}
                        onChange={(_, value: TabName) => setTab(value)}
                        aria-label="Library"
                        variant="scrollable"
                        // In a narrow window the strip scrolls sideways (swipe, or arrow keys between tabs).
                        scrollButtons={false}
                        sx={{ px: 1, borderBottom: 1, borderColor: 'divider', '& .MuiTab-root': { minWidth: 0, px: 1.75 } }}
                    >
                        {TABS.map((item) => (
                            <Tab key={item.value} value={item.value} label={item.label} />
                        ))}
                    </Tabs>
                )}
                <Box ref={tabScroll} sx={{ flex: '1 1 auto', minHeight: 0, overflowY: 'auto', p: 2 }}>
                    {term ? (
                        <SearchResults term={term} nav={nav} />
                    ) : (
                        <>
                            {/* Each tab stays mounted once opened, to keep its place. */}
                            <KeepAlive show={tab === 'home'}>
                                <HomeTab nav={nav} />
                            </KeepAlive>
                            <KeepAlive show={tab === 'albums'}>
                                <AlbumsTab nav={nav} />
                            </KeepAlive>
                            <KeepAlive show={tab === 'artists'}>
                                <ArtistsTab nav={nav} />
                            </KeepAlive>
                            <KeepAlive show={tab === 'favourites'}>
                                <FavouritesTab nav={nav} />
                            </KeepAlive>
                            <KeepAlive show={tab === 'playlists'}>
                                <PlaylistsTab nav={nav} />
                            </KeepAlive>
                        </>
                    )}
                </Box>
            </Box>

            {/* A page opened over the top level */}
            {route ? (
                <Box sx={{ display: 'flex', flexDirection: 'column', flex: '1 1 auto', minHeight: 0 }}>
                    <Box sx={{ px: 1, pt: 1.5 }}>
                        <Button ref={backButton} onClick={back} color="inherit" startIcon={<ArrowBackIcon sx={{ fontSize: '16px !important' }} />} sx={{ maxWidth: '100%' }}>
                            <Box component="span" sx={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                {previous}
                            </Box>
                        </Button>
                    </Box>
                    <Box ref={pageScroll} sx={{ flex: '1 1 auto', minHeight: 0, overflowY: 'auto', p: 2 }}>
                        {route.kind === 'album' ? <AlbumPage key={route.id} id={route.id} name={route.name} /> : null}
                        {route.kind === 'artist' ? <ArtistPage key={route.id} id={route.id} name={route.name} nav={nav} /> : null}
                        {route.kind === 'playlist' ? <PlaylistPage key={route.id} id={route.id} name={route.name} /> : null}
                        {/* Stays mounted under an album opened from it, so going back shows the same picks. */}
                        {stack.some((item) => item.kind === 'random') ? (
                            <Box sx={{ display: route.kind === 'random' ? 'block' : 'none' }}>
                                <RandomPage nav={nav} />
                            </Box>
                        ) : null}
                    </Box>
                </Box>
            ) : null}
        </Box>
    );
};

/** Mounts its children the first time they're shown, then hides rather than unmounts them. */
const KeepAlive = ({ show, children }: { show: boolean; children: React.ReactNode }) => {
    const opened = useRef(show);
    if (show) opened.current = true;
    if (!opened.current) return null;
    return <Box sx={{ display: show ? 'block' : 'none' }}>{children}</Box>;
};
