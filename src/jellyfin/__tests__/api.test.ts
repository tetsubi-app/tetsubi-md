import { describe, expect, it } from 'vitest';
import { browserDeviceName, headerSafe, JellyfinClient, JellyfinError } from '../api';

type Call = { url: string; init: RequestInit };

function stub(answers: Array<{ status: number; body?: unknown }>) {
    const calls: Call[] = [];
    const fetchStub = (async (url: RequestInfo | URL, init?: RequestInit) => {
        calls.push({ url: String(url), init: init ?? {} });
        const answer = answers.shift() ?? { status: 500 };
        const text = answer.body === undefined ? '' : JSON.stringify(answer.body);
        return new Response(answer.status === 204 ? null : text, { status: answer.status });
    }) as typeof fetch;
    return { calls, fetchStub };
}

const auth = (call: Call) => (call.init.headers as Record<string, string>).Authorization;

describe('headerSafe', () => {
    it('straightens quotes, drops accents and anything unsafe', () => {
        expect(headerSafe('Jake’s Mac mini')).toBe("Jake's Mac mini");
        expect(headerSafe('Café "PC"\\')).toBe('Cafe PC');
        expect(headerSafe('日本')).toBe('Device');
    });
});

describe('browserDeviceName', () => {
    it('names the browser and system', () => {
        expect(browserDeviceName('Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 Chrome/130.0 Safari/537.36')).toBe('Chrome on Mac');
        expect(browserDeviceName('Mozilla/5.0 (Windows NT 10.0) AppleWebKit/537.36 Chrome/130.0 Safari/537.36 Edg/130.0')).toBe('Edge on Windows');
    });
});

describe('JellyfinClient', () => {
    const base = { serverUrl: 'https://music.example.com/', deviceId: 'device-1', deviceName: 'Chrome on Mac' };

    it('builds the MediaBrowser header, with the token once signed in', () => {
        const client = new JellyfinClient(base);
        expect(client.authorizationHeader()).toBe('MediaBrowser Client="Tetsubi MD", Device="Chrome on Mac", DeviceId="device-1", Version="0.1.0"');
        client.accessToken = 'tok';
        expect(client.authorizationHeader()).toContain(', Token="tok"');
    });

    it('builds URLs from the server address and query', () => {
        const client = new JellyfinClient({ ...base, serverUrl: 'https://example.com/jellyfin/' });
        expect(client.url('/Users/Me')).toBe('https://example.com/jellyfin/Users/Me');
        expect(client.url('Items', { limit: 5, skip: undefined, term: 'a b' })).toBe('https://example.com/jellyfin/Items?limit=5&term=a+b');
    });

    it('signs in by name and keeps the token', async () => {
        const { calls, fetchStub } = stub([{ status: 200, body: { AccessToken: 'tok', User: { Id: 'u1', Name: 'jake' } } }]);
        const client = new JellyfinClient({ ...base, fetch: fetchStub });
        const response = await client.authenticateByName('jake', 'secret');
        expect(response.User.Name).toBe('jake');
        expect(client.accessToken).toBe('tok');
        expect(client.userId).toBe('u1');
        expect(calls[0].url).toBe('https://music.example.com/Users/AuthenticateByName');
        expect(calls[0].init.method).toBe('POST');
        expect(JSON.parse(calls[0].init.body as string)).toEqual({ Username: 'jake', Pw: 'secret' });
        expect(auth(calls[0])).not.toContain('Token=');
    });

    it('reports a wrong password plainly', async () => {
        const { fetchStub } = stub([{ status: 401 }]);
        const client = new JellyfinClient({ ...base, fetch: fetchStub });
        await expect(client.authenticateByName('jake', 'nope')).rejects.toMatchObject({ kind: 'wrongPassword' });
    });

    it('runs the Quick Connect steps', async () => {
        const { calls, fetchStub } = stub([
            { status: 200, body: true },
            { status: 200, body: { Code: '123456', Secret: 's3', Authenticated: false } },
            { status: 200, body: { Authenticated: false } },
            { status: 200, body: { Authenticated: true } },
            { status: 200, body: { AccessToken: 'tok', User: { Id: 'u1', Name: 'jake' } } },
        ]);
        const client = new JellyfinClient({ ...base, fetch: fetchStub });
        expect(await client.quickConnectEnabled()).toBe(true);
        const start = await client.startQuickConnect();
        expect(start.Code).toBe('123456');
        expect(await client.pollQuickConnect(start.Secret)).toBe(false);
        expect(await client.pollQuickConnect(start.Secret)).toBe(true);
        await client.authenticateWithQuickConnect(start.Secret);
        expect(client.accessToken).toBe('tok');
        expect(calls.map((c) => `${c.init.method} ${c.url}`)).toEqual([
            'GET https://music.example.com/QuickConnect/Enabled',
            'POST https://music.example.com/QuickConnect/Initiate',
            'GET https://music.example.com/QuickConnect/Connect?secret=s3',
            'GET https://music.example.com/QuickConnect/Connect?secret=s3',
            'POST https://music.example.com/Users/AuthenticateWithQuickConnect',
        ]);
        expect(JSON.parse(calls[4].init.body as string)).toEqual({ Secret: 's3' });
    });

    it('tells apart Quick Connect being off and a code that expired', async () => {
        const { fetchStub } = stub([{ status: 401 }, { status: 404 }]);
        const client = new JellyfinClient({ ...base, fetch: fetchStub });
        await expect(client.startQuickConnect()).rejects.toMatchObject({ kind: 'quickConnectDisabled' });
        await expect(client.pollQuickConnect('gone')).rejects.toMatchObject({ kind: 'quickConnectExpired' });
    });

    it('treats a 401 with a token as an expired session', async () => {
        const { calls, fetchStub } = stub([{ status: 401 }]);
        const client = new JellyfinClient({ ...base, fetch: fetchStub, accessToken: 'old', userId: 'u1' });
        await expect(client.me()).rejects.toMatchObject({ kind: 'expiredToken' });
        expect(auth(calls[0])).toContain('Token="old"');
    });

    it('reports an unreachable server as a network error', async () => {
        const client = new JellyfinClient({
            ...base,
            fetch: (async () => {
                throw new TypeError('Failed to fetch');
            }) as typeof fetch,
        });
        const error = await client.me().catch((e) => e);
        expect(error).toBeInstanceOf(JellyfinError);
        expect(error.kind).toBe('network');
    });
});
