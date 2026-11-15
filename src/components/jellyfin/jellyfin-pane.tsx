import React, { useEffect } from 'react';

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import Typography from '@mui/material/Typography';

import { checkSavedSession, signOut, useJellyfin } from '../../jellyfin/session';
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

    return (
        <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, px: 3, py: 2, borderBottom: 1, borderColor: 'divider' }}>
                <Box sx={{ flex: '1 1 auto', minWidth: 0 }}>
                    <Typography component="h2" variant="h6" noWrap sx={{ fontWeight: 700 }}>
                        {session.serverName ?? 'Jellyfin'}
                    </Typography>
                    <Typography variant="body2" noWrap sx={{ color: 'text.secondary' }}>
                        Signed in as {session.userName}
                    </Typography>
                </Box>
                <Button variant="outlined" color="inherit" onClick={() => signOut()}>
                    Sign out
                </Button>
            </Box>
            <Box sx={{ flex: '1 1 auto', display: 'flex', alignItems: 'center', justifyContent: 'center', p: 3 }}>
                <Typography sx={{ color: 'text.secondary', textAlign: 'center' }}>Your library will appear here.</Typography>
            </Box>
        </Box>
    );
};
