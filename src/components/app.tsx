import React, { lazy, Suspense, useEffect } from 'react';
import { belowDesktop, forAnyDesktop, useDispatch, useShallowEqualSelector } from '../frontend-utils';

import CssBaseline from '@mui/material/CssBaseline';
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';
import { ThemeProvider } from '@mui/material/styles';
import { makeStyles } from 'tss-react/mui';

import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import Link from '@mui/material/Link';
import Box from '@mui/material/Box';
import { SplitLayout } from './tetsubi/split-layout';
import { JellyfinPane } from './jellyfin/jellyfin-pane';
import { tetsubiTheme } from '../tetsubi/theme';
import { DiscListPanel, DiscListToast } from './disc-list/disc-list-panel';
import { startDiscList, useDiscList } from '../disc-list/store';
import { validateAndLoadEncoders } from '../redux/actions';
import { EncoderDownloadDialog } from './encoder-download-dialog';

const Toc = lazy(() => import('./factory/factory'));
const Controls = lazy(() => import('./controls'));
const Welcome = lazy(() => import('./welcome'));
const Main = lazy(() => import('./main'));
const useStyles = makeStyles()((theme) => ({
    // The MiniDisc half: fills its pane, whatever the pane's size.
    paper: {
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        flex: '1 1 0',
        minHeight: 0,
        padding: theme.spacing(2),
        background: 'transparent',
        boxShadow: 'none',
        [forAnyDesktop(theme)]: {
            padding: theme.spacing(3),
        },
    },
    // With nothing connected, the recorder part only needs room for its Connect button.
    paperCompact: {
        flex: '0 0 auto',
        maxHeight: '60%',
        overflowY: 'auto',
    },
    discList: {
        flex: '1 1 0',
        minHeight: 260,
        display: 'flex',
        flexDirection: 'column',
        borderTop: `1px solid ${theme.palette.divider}`,
    },
    // Both parts keep a usable height; in a short window the half scrolls instead of squashing them.
    pane: {
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        overflowY: 'auto',
    },
    paperWithDisc: {
        flex: '1.5 1 0',
        minHeight: 340,
    },
    copyrightTypography: {
        flex: '0 0 auto',
        textAlign: 'center',
        padding: theme.spacing(0.75, 2, 1.5),
    },
    backdrop: {
        zIndex: theme.zIndex.drawer + 1000,
        color: '#fff',
    },
    controlsContainer: {
        flex: '0 0 auto',
        width: '100%',
        paddingRight: theme.spacing(8),
        [belowDesktop(theme)]: {
            paddingLeft: 0,
        },
    },
}));

/** The right half: the MiniDisc recorder, as in Web MiniDisc Pro. */
const MiniDiscPane = () => {
    const { mainView } = useShallowEqualSelector((state) => state.appState);
    const { classes, cx } = useStyles();
    // The disc list sits under the recorder once signed in to Jellyfin (not in factory mode, which needs the room).
    const showList = !!useDiscList().account && mainView !== 'FACTORY';

    return (
        <div className={classes.pane}>
            <Paper
                className={cx(classes.paper, {
                    [classes.paperCompact]: showList && mainView === 'WELCOME',
                    [classes.paperWithDisc]: showList && mainView === 'MAIN',
                })}
                elevation={0}
                square
            >
                {mainView === 'WELCOME' ? <Welcome /> : null}
                {mainView === 'MAIN' ? <Main /> : null}
                {mainView === 'FACTORY' ? <Toc /> : null}

                <Box className={classes.controlsContainer}>{mainView === 'MAIN' ? <Controls /> : null}</Box>
            </Paper>
            {showList ? (
                <div className={classes.discList}>
                    <DiscListPanel />
                </div>
            ) : null}
            <Typography variant="caption" color="textSecondary" className={classes.copyrightTypography}>
                {'MiniDisc side based on '}
                <Link rel="noopener noreferrer" color="inherit" underline="always" target="_blank" href="https://github.com/asivery/webminidisc">
                    Web MiniDisc Pro
                </Link>
                {' © '}
                <Link rel="noopener noreferrer" color="inherit" target="_blank" href="https://stefano.brilli.me/">
                    Stefano Brilli
                </Link>
                {', '}
                <Link rel="noopener noreferrer" color="inherit" target="_blank" href="https://github.com/asivery/">
                    Asivery
                </Link>
                {'.'}
            </Typography>
        </div>
    );
};

const InternalApp = () => {
    const { loading } = useShallowEqualSelector((state) => state.appState);
    const { classes } = useStyles();
    const dispatch = useDispatch();

    // At init, connect to server and check for encoders.
    useEffect(() => {
        dispatch(validateAndLoadEncoders(true));
    }, []);

    // Keep the disc list in step with who is signed in to Jellyfin.
    useEffect(() => startDiscList(), []);

    return (
        <React.Fragment>
            <CssBaseline />

            <Suspense
                fallback={
                    <Backdrop open={true}>
                        <CircularProgress color="info" />
                    </Backdrop>
                }
            >
                <SplitLayout library={<JellyfinPane />} minidisc={<MiniDiscPane />} />
            </Suspense>

            {loading ? (
                <Backdrop className={classes.backdrop} open={loading}>
                    <CircularProgress color="info" />
                </Backdrop>
            ) : null}

            <EncoderDownloadDialog />
            <DiscListToast />
        </React.Fragment>
    );
};

// Tetsubi MD has one look. Upstream's light theme and Windows 95 mode are
// left in the source (to keep merges simple) but are not offered.
const App = () => {
    return (
        <ThemeProvider theme={tetsubiTheme}>
            <InternalApp />
        </ThemeProvider>
    );
};

export default App;
