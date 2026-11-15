import React, { useCallback, useEffect, useRef, useState } from 'react';

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import Link from '@mui/material/Link';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import Alert from '@mui/material/Alert';

import { JellyfinClient, JellyfinError, AuthenticationResponse } from '../../jellyfin/api';
import { resolve } from '../../jellyfin/server-address';
import { deviceId, lastServer, signIn, useJellyfin } from '../../jellyfin/session';
import discUrl from '../../tetsubi/images/disc.svg?url';

/** How often to ask the server whether the Quick Connect code was approved. */
const POLL_MS = 2000;

type Server = { url: string; name?: string };
type Mode = 'quickConnect' | 'password';
type QuickConnect = { state: 'idle' } | { state: 'starting' } | { state: 'waiting'; code: string } | { state: 'unavailable' };

function messageOf(e: unknown): string {
    return e instanceof JellyfinError ? e.message : 'Something went wrong. Please try again.';
}

/** "123456" as "123 456", easier to read across to another device. */
function spacedCode(code: string): string {
    return code.length === 6 ? `${code.slice(0, 3)} ${code.slice(3)}` : code;
}

export const SignIn = () => {
    const { notice } = useJellyfin();

    const [address, setAddress] = useState(lastServer);
    const [server, setServer] = useState<Server | null>(null);
    const [finding, setFinding] = useState(false);
    const [mode, setMode] = useState<Mode>('quickConnect');
    const [quickConnect, setQuickConnect] = useState<QuickConnect>({ state: 'idle' });
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [signingIn, setSigningIn] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Each Quick Connect attempt gets a number; a stale one stops polling.
    const attempt = useRef(0);
    useEffect(() => () => void attempt.current++, []);

    const finish = useCallback((found: Server, response: AuthenticationResponse) => {
        signIn({
            serverUrl: found.url,
            serverName: found.name,
            userId: response.User.Id,
            userName: response.User.Name,
            accessToken: response.AccessToken,
        });
    }, []);

    const startQuickConnect = useCallback(
        async (found: Server) => {
            const mine = ++attempt.current;
            const client = new JellyfinClient({ serverUrl: found.url, deviceId: deviceId() });
            setError(null);
            setQuickConnect({ state: 'starting' });
            try {
                if (!(await client.quickConnectEnabled())) {
                    if (mine !== attempt.current) return;
                    setQuickConnect({ state: 'unavailable' });
                    setMode('password');
                    return;
                }
                const start = await client.startQuickConnect();
                if (mine !== attempt.current) return;
                setQuickConnect({ state: 'waiting', code: start.Code });
                while (mine === attempt.current) {
                    await new Promise((done) => setTimeout(done, POLL_MS));
                    if (mine !== attempt.current) return;
                    if (await client.pollQuickConnect(start.Secret)) {
                        const response = await client.authenticateWithQuickConnect(start.Secret);
                        if (mine === attempt.current) finish(found, response);
                        return;
                    }
                }
            } catch (e) {
                if (mine !== attempt.current) return;
                if (e instanceof JellyfinError && e.kind === 'quickConnectDisabled') {
                    setQuickConnect({ state: 'unavailable' });
                    setMode('password');
                } else {
                    setQuickConnect({ state: 'idle' });
                    setError(messageOf(e));
                }
            }
        },
        [finish]
    );

    const findServer = useCallback(
        async (event?: React.FormEvent) => {
            event?.preventDefault();
            attempt.current++;
            setError(null);
            setServer(null);
            setQuickConnect({ state: 'idle' });
            setFinding(true);
            const result = await resolve(address);
            setFinding(false);
            if (!result.ok) {
                setError(result.message);
                return;
            }
            const found = { url: result.url, name: result.serverName };
            setServer(found);
            setMode('quickConnect');
            startQuickConnect(found);
        },
        [address, startQuickConnect]
    );

    const changeServer = useCallback(() => {
        attempt.current++;
        setServer(null);
        setError(null);
        setQuickConnect({ state: 'idle' });
    }, []);

    const usePassword = useCallback(() => {
        attempt.current++;
        setError(null);
        setMode('password');
    }, []);

    const useQuickConnect = useCallback(() => {
        setMode('quickConnect');
        if (server) startQuickConnect(server);
    }, [server, startQuickConnect]);

    const signInWithPassword = useCallback(
        async (event: React.FormEvent) => {
            event.preventDefault();
            if (!server || !username) return;
            setError(null);
            setSigningIn(true);
            try {
                const client = new JellyfinClient({ serverUrl: server.url, deviceId: deviceId() });
                finish(server, await client.authenticateByName(username, password));
            } catch (e) {
                setError(messageOf(e));
                setSigningIn(false);
            }
        },
        [server, username, password, finish]
    );

    return (
        <Box sx={{ height: '100%', overflowY: 'auto', display: 'flex', alignItems: 'center', justifyContent: 'center', p: 3 }}>
            <Box sx={{ width: '100%', maxWidth: 380, textAlign: 'center' }}>
                <Box component="img" src={discUrl} alt="" sx={{ width: 96, height: 96, mb: 2 }} />
                <Typography component="h2" variant="h5" sx={{ fontWeight: 700 }}>
                    Sign in to Jellyfin
                </Typography>
                <Typography sx={{ color: 'text.secondary', mb: 3 }}>Browse your library and add music to a MiniDisc.</Typography>

                {notice && !error ? (
                    <Alert severity="info" sx={{ mb: 2, textAlign: 'left' }}>
                        {notice}
                    </Alert>
                ) : null}
                {error ? (
                    <Alert severity="error" sx={{ mb: 2, textAlign: 'left' }} role="alert">
                        {error}
                    </Alert>
                ) : null}

                {!server ? (
                    <Box component="form" onSubmit={findServer} noValidate>
                        <TextField
                            label="Server address"
                            placeholder="https://music.example.com"
                            value={address}
                            onChange={(e) => setAddress(e.target.value)}
                            variant="outlined"
                            fullWidth
                            autoFocus
                            autoComplete="url"
                            inputProps={{ autoCapitalize: 'none', autoCorrect: 'off', spellCheck: false, inputMode: 'url' }}
                        />
                        <Button type="submit" variant="contained" fullWidth size="large" sx={{ mt: 2 }} disabled={finding || !address.trim()}>
                            {finding ? 'Finding server…' : 'Continue'}
                        </Button>
                    </Box>
                ) : (
                    <>
                        <Typography sx={{ color: 'text.secondary', mb: 2, overflowWrap: 'anywhere' }}>
                            {server.name ? `${server.name} · ` : ''}
                            {server.url.replace(/^https?:\/\//, '')}{' '}
                            <Link component="button" type="button" onClick={changeServer} sx={{ verticalAlign: 'baseline' }}>
                                Change
                            </Link>
                        </Typography>

                        {mode === 'quickConnect' ? (
                            <Box>
                                <Typography component="h3" variant="subtitle1" sx={{ fontWeight: 600 }}>
                                    Quick Connect
                                </Typography>
                                {quickConnect.state === 'waiting' ? (
                                    <>
                                        <Typography
                                            aria-label={`Code ${quickConnect.code.split('').join(' ')}`}
                                            sx={{ fontSize: 44, fontWeight: 700, letterSpacing: '0.08em', lineHeight: 1.3, my: 1 }}
                                        >
                                            {spacedCode(quickConnect.code)}
                                        </Typography>
                                        <Typography sx={{ color: 'text.secondary' }}>
                                            Enter this code in Jellyfin on a device you're already signed in to, under Quick Connect in
                                            your user menu.
                                        </Typography>
                                        <Box
                                            sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1, mt: 2, color: 'text.secondary' }}
                                            role="status"
                                        >
                                            <CircularProgress size={16} color="inherit" />
                                            <Typography variant="body2">Waiting for approval…</Typography>
                                        </Box>
                                    </>
                                ) : quickConnect.state === 'starting' ? (
                                    <Box
                                        sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1, my: 3, color: 'text.secondary' }}
                                        role="status"
                                    >
                                        <CircularProgress size={16} color="inherit" />
                                        <Typography variant="body2">Requesting a code…</Typography>
                                    </Box>
                                ) : (
                                    <Button variant="contained" fullWidth size="large" sx={{ mt: 2 }} onClick={useQuickConnect}>
                                        Get a new code
                                    </Button>
                                )}
                                <Link component="button" type="button" onClick={usePassword} sx={{ mt: 3 }}>
                                    Sign in with username and password
                                </Link>
                            </Box>
                        ) : (
                            <Box component="form" onSubmit={signInWithPassword} noValidate>
                                {quickConnect.state === 'unavailable' ? (
                                    <Typography variant="body2" sx={{ color: 'text.secondary', mb: 2 }}>
                                        Quick Connect is switched off on this server.
                                    </Typography>
                                ) : null}
                                <TextField
                                    label="Username"
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    variant="outlined"
                                    fullWidth
                                    autoFocus
                                    autoComplete="username"
                                    inputProps={{ autoCapitalize: 'none', autoCorrect: 'off', spellCheck: false }}
                                />
                                <TextField
                                    label="Password"
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    variant="outlined"
                                    fullWidth
                                    autoComplete="current-password"
                                    sx={{ mt: 2 }}
                                />
                                <Button type="submit" variant="contained" fullWidth size="large" sx={{ mt: 2 }} disabled={signingIn || !username}>
                                    {signingIn ? 'Signing in…' : 'Sign in'}
                                </Button>
                                {quickConnect.state !== 'unavailable' ? (
                                    <Link component="button" type="button" onClick={useQuickConnect} sx={{ mt: 3 }}>
                                        Use Quick Connect instead
                                    </Link>
                                ) : null}
                            </Box>
                        )}
                    </>
                )}
            </Box>
        </Box>
    );
};
