// A small Jellyfin client: sign-in now, library and playlists to follow.
// A TypeScript port of the Tetsubi app's JellyfinAPI.

export const CLIENT_NAME = 'Tetsubi MD';
export const CLIENT_VERSION = '0.1.0';

export type JellyfinErrorKind =
    | 'network'
    | 'http'
    | 'decode'
    | 'expiredToken'
    | 'wrongPassword'
    | 'quickConnectDisabled'
    | 'quickConnectExpired';

export class JellyfinError extends Error {
    constructor(
        public kind: JellyfinErrorKind,
        message: string,
        public status?: number
    ) {
        super(message);
        this.name = 'JellyfinError';
    }
}

export interface AuthenticationResponse {
    AccessToken: string;
    ServerId?: string;
    User: { Id: string; Name: string };
}

export interface QuickConnectStart {
    Code: string;
    Secret: string;
    Authenticated?: boolean;
}

export interface UserInfo {
    Id: string;
    Name: string;
}

/**
 * `value` as plain ASCII, safe inside the quoted header. Browser and device
 * names can hold curly quotes or accents, which Jellyfin rejects with a 400.
 */
export function headerSafe(value: string): string {
    const plain = value
        .replace(/[\u2018\u2019]/g, "'")
        .replace(/[\u201C\u201D]/g, '')
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        // eslint-disable-next-line no-control-regex
        .replace(/[^\x20-\x7e]/g, '')
        .replace(/["\\]/g, '')
        .split(' ')
        .filter(Boolean)
        .join(' ');
    return plain || 'Device';
}

/** A name for this browser, shown in the server's list of devices. */
export function browserDeviceName(userAgent: string = navigator.userAgent): string {
    const browser = /Edg\//.test(userAgent)
        ? 'Edge'
        : /OPR\//.test(userAgent)
          ? 'Opera'
          : /Chrome\//.test(userAgent)
            ? 'Chrome'
            : /Firefox\//.test(userAgent)
              ? 'Firefox'
              : /Safari\//.test(userAgent)
                ? 'Safari'
                : 'Browser';
    const system = /Windows/.test(userAgent)
        ? 'Windows'
        : /Android/.test(userAgent)
          ? 'Android'
          : /iPhone|iPad/.test(userAgent)
            ? 'iOS'
            : /Mac OS X|Macintosh/.test(userAgent)
              ? 'Mac'
              : /CrOS/.test(userAgent)
                ? 'ChromeOS'
                : /Linux/.test(userAgent)
                  ? 'Linux'
                  : '';
    return system ? `${browser} on ${system}` : browser;
}

export interface ClientOptions {
    serverUrl: string;
    deviceId: string;
    deviceName?: string;
    accessToken?: string;
    userId?: string;
    fetch?: typeof fetch;
}

export class JellyfinClient {
    readonly serverUrl: string;
    readonly deviceId: string;
    readonly deviceName: string;
    accessToken?: string;
    userId?: string;
    private fetchImpl: typeof fetch;

    constructor(options: ClientOptions) {
        this.serverUrl = options.serverUrl.replace(/\/+$/, '');
        this.deviceId = options.deviceId;
        this.deviceName = options.deviceName ?? browserDeviceName();
        this.accessToken = options.accessToken;
        this.userId = options.userId;
        // Bound, because calling window.fetch detached throws "Illegal invocation".
        this.fetchImpl = options.fetch ?? ((...args) => fetch(...args));
    }

    /** The `Authorization: MediaBrowser` header value, with the token once signed in. */
    authorizationHeader(token: string | undefined = this.accessToken): string {
        const parts = [
            `Client="${CLIENT_NAME}"`,
            `Device="${headerSafe(this.deviceName)}"`,
            `DeviceId="${headerSafe(this.deviceId)}"`,
            `Version="${CLIENT_VERSION}"`,
        ];
        if (token) parts.push(`Token="${token}"`);
        return 'MediaBrowser ' + parts.join(', ');
    }

    url(path: string, query?: Record<string, string | number | boolean | undefined>): string {
        const url = new URL(`${this.serverUrl}/${path.replace(/^\/+/, '')}`);
        for (const [key, value] of Object.entries(query ?? {})) {
            if (value !== undefined) url.searchParams.set(key, String(value));
        }
        return url.toString();
    }

    private async request<T>(
        method: string,
        path: string,
        options: { query?: Record<string, string | number | boolean | undefined>; body?: unknown; token?: string | null } = {}
    ): Promise<T> {
        const headers: Record<string, string> = {
            Authorization: this.authorizationHeader(options.token === null ? undefined : (options.token ?? this.accessToken)),
            Accept: 'application/json',
        };
        if (options.body !== undefined) headers['Content-Type'] = 'application/json';

        let response: Response;
        try {
            response = await this.fetchImpl(this.url(path, options.query), {
                method,
                headers,
                body: options.body === undefined ? undefined : JSON.stringify(options.body),
            });
        } catch (e) {
            throw new JellyfinError('network', "Couldn't reach the server. Check your connection and the server address.");
        }
        if (!response.ok) {
            const text = await response.text().catch(() => '');
            if (response.status === 401 && this.accessToken && options.token !== null) {
                throw new JellyfinError('expiredToken', 'Session expired. Please sign in again.', 401);
            }
            throw new JellyfinError('http', `The server answered with an error (HTTP ${response.status}).${text ? ' ' + text.slice(0, 200) : ''}`, response.status);
        }
        if (response.status === 204) return undefined as T;
        const text = await response.text();
        if (!text) return undefined as T;
        try {
            return JSON.parse(text) as T;
        } catch {
            throw new JellyfinError('decode', "Couldn't read the server's answer.");
        }
    }

    get<T>(path: string, query?: Record<string, string | number | boolean | undefined>): Promise<T> {
        return this.request<T>('GET', path, { query });
    }

    post<T>(path: string, body?: unknown, query?: Record<string, string | number | boolean | undefined>): Promise<T> {
        return this.request<T>('POST', path, { body, query });
    }

    delete<T>(path: string, query?: Record<string, string | number | boolean | undefined>): Promise<T> {
        return this.request<T>('DELETE', path, { query });
    }

    private signedIn(response: AuthenticationResponse): AuthenticationResponse {
        this.accessToken = response.AccessToken;
        this.userId = response.User.Id;
        return response;
    }

    // MARK: Sign-in

    /** POST /Users/AuthenticateByName */
    async authenticateByName(username: string, password: string): Promise<AuthenticationResponse> {
        try {
            const response = await this.request<AuthenticationResponse>('POST', 'Users/AuthenticateByName', {
                body: { Username: username, Pw: password },
                token: null,
            });
            return this.signedIn(response);
        } catch (e) {
            if (e instanceof JellyfinError && e.status === 401) {
                throw new JellyfinError('wrongPassword', 'Wrong username or password.', 401);
            }
            throw e;
        }
    }

    /** GET /QuickConnect/Enabled: whether the server offers Quick Connect. */
    async quickConnectEnabled(): Promise<boolean> {
        try {
            return (await this.request<boolean>('GET', 'QuickConnect/Enabled', { token: null })) === true;
        } catch {
            return false;
        }
    }

    /** POST /QuickConnect/Initiate: the six-digit code to show, and the secret to poll with. */
    async startQuickConnect(): Promise<QuickConnectStart> {
        try {
            return await this.request<QuickConnectStart>('POST', 'QuickConnect/Initiate', { token: null });
        } catch (e) {
            if (e instanceof JellyfinError && e.status === 401) {
                throw new JellyfinError(
                    'quickConnectDisabled',
                    "Quick Connect isn't available on this server. Use username and password.",
                    401
                );
            }
            throw e;
        }
    }

    /** GET /QuickConnect/Connect: true once the code has been approved on another device. */
    async pollQuickConnect(secret: string): Promise<boolean> {
        try {
            const result = await this.request<{ Authenticated?: boolean }>('GET', 'QuickConnect/Connect', {
                query: { secret },
                token: null,
            });
            return result?.Authenticated === true;
        } catch (e) {
            if (e instanceof JellyfinError && e.status === 404) {
                throw new JellyfinError('quickConnectExpired', 'The Quick Connect code expired. Try again or use username and password.', 404);
            }
            throw e;
        }
    }

    /** POST /Users/AuthenticateWithQuickConnect: swaps an approved secret for a session. */
    async authenticateWithQuickConnect(secret: string): Promise<AuthenticationResponse> {
        const response = await this.request<AuthenticationResponse>('POST', 'Users/AuthenticateWithQuickConnect', {
            body: { Secret: secret },
            token: null,
        });
        return this.signedIn(response);
    }

    /** GET /Users/Me: checks a saved session still works. */
    me(): Promise<UserInfo> {
        return this.get<UserInfo>('Users/Me');
    }

    /** POST /Sessions/Logout: ends this session on the server. */
    async logout(): Promise<void> {
        try {
            await this.post('Sessions/Logout');
        } catch {
            // Signing out locally is what matters.
        }
    }
}
