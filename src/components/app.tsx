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
        flex: '1 1 auto',
        minHeight: 0,
        padding: theme.spacing(2),
        background: 'transparent',
        boxShadow: 'none',
        [forAnyDesktop(theme)]: {
            padding: theme.spacing(3),
        },
    },
    pane: {
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
    },
    copyrightTypography: {
        flex: '0 0 auto',
        textAlign: 'center',
        padding: theme.spacing(0, 2, 1.5),
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
    const { classes } = useStyles();

    return (
        <div className={classes.pane}>
            <Paper className={classes.paper} elevation={0} square>
                {mainView === 'WELCOME' ? <Welcome /> : null}
                {mainView === 'MAIN' ? <Main /> : null}
                {mainView === 'FACTORY' ? <Toc /> : null}

                <Box className={classes.controlsContainer}>{mainView === 'MAIN' ? <Controls /> : null}</Box>
            </Paper>
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
