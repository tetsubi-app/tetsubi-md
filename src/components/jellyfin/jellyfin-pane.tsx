import React, { useEffect } from 'react';

import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import Typography from '@mui/material/Typography';

import { checkSavedSession, useJellyfin } from '../../jellyfin/session';
import { Library } from './library';
import { SignIn } from './sign-in';

/** The left half: the Jellyfin library, or the sign-in screen. */
export const JellyfinPane = () => {
    const { status, session } = useJellyfin();

    useEffect(() => {
        checkSavedSession();
    }, []);

    if (status === 'checking') {
        return (
            <Box sx={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1.5, color: 'text.secondary' }} role="status">
                <CircularProgress size={18} color="inherit" />
                <Typography>Connecting to {session?.serverName ?? 'your server'}…</Typography>
            </Box>
        );
    }

    if (status === 'signedOut' || !session) {
        return <SignIn />;
    }

    // Keyed by account, so another server or user starts with a fresh library.
    return <Library key={`${session.serverUrl}|${session.userId}`} />;
};
