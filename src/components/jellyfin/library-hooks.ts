import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import { JellyfinClient, JellyfinError } from '../../jellyfin/api';
import { Page } from '../../jellyfin/library';
import { currentClient, signOut, useJellyfin } from '../../jellyfin/session';

/** A client for the signed-in session. Only use inside the signed-in library. */
export function useClient(): JellyfinClient {
    const { session } = useJellyfin();
    return useMemo(() => {
        const client = currentClient();
        if (!client) throw new Error('Not signed in');
        return client;
        // A new session (another server or user) gets a new client.
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [session?.serverUrl, session?.userId, session?.accessToken]);
}

/** Turns a failure into words, signing out if the server no longer accepts the session. */
function explain(e: unknown): string {
    if (e instanceof JellyfinError) {
        if (e.kind === 'expiredToken') {
            signOut({ notice: 'Your session expired. Please sign in again.', tellServer: false });
        }
        return e.message;
    }
    return 'Something went wrong. Please try again.';
}

export interface Loaded<T> {
    data: T | null;
    loading: boolean;
    error: string | null;
    retry: () => void;
}

/** Loads something once per change of `deps`, ignoring answers that arrive after a newer request. */
export function useLoad<T>(load: () => Promise<T>, deps: unknown[]): Loaded<T> {
    const [state, setState] = useState<{ data: T | null; loading: boolean; error: string | null }>({ data: null, loading: true, error: null });
    const [attempt, setAttempt] = useState(0);

    useEffect(() => {
        let current = true;
        setState((old) => ({ data: old.data, loading: true, error: null }));
        load().then(
            (data) => current && setState({ data, loading: false, error: null }),
            (e) => current && setState({ data: null, loading: false, error: explain(e) })
        );
        return () => {
            current = false;
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [...deps, attempt]);

    const retry = useCallback(() => setAttempt((n) => n + 1), []);
    return { ...state, retry };
}

export interface Paged<T> {
    items: T[];
    total: number | null;
    loading: boolean;
    error: string | null;
    /** True once every item has been loaded. */
    done: boolean;
    /** Loads the next page, if one isn't already on its way. */
    more: () => void;
}

/** A long list loaded a page at a time. Starts again whenever `deps` change. */
export function usePaged<T>(loadPage: (start: number, limit: number) => Promise<Page<T>>, deps: unknown[], pageSize = 100): Paged<T> {
    const [state, setState] = useState<{ items: T[]; total: number | null; loading: boolean; error: string | null }>({
        items: [],
        total: null,
        loading: false,
        error: null,
    });
    // Each list (set of deps) has a number, so a page for an old list is dropped.
    const generation = useRef(0);
    const busy = useRef(false);
    const loaded = useRef(0);
    const finished = useRef(false);
    const loader = useRef(loadPage);
    loader.current = loadPage;

    const more = useCallback(() => {
        if (busy.current || finished.current) return;
        const mine = generation.current;
        busy.current = true;
        setState((old) => ({ ...old, loading: true, error: null }));
        loader.current(loaded.current, pageSize).then(
            (result) => {
                if (mine !== generation.current) return;
                busy.current = false;
                loaded.current += result.items.length;
                finished.current = result.items.length === 0 || loaded.current >= result.total;
                setState((old) => ({ items: [...old.items, ...result.items], total: result.total, loading: false, error: null }));
            },
            (e) => {
                if (mine !== generation.current) return;
                busy.current = false;
                setState((old) => ({ ...old, loading: false, error: explain(e) }));
            }
        );
    }, [pageSize]);

    useEffect(() => {
        generation.current++;
        busy.current = false;
        loaded.current = 0;
        finished.current = false;
        setState({ items: [], total: null, loading: false, error: null });
        more();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, deps);

    return { ...state, done: state.total !== null && state.items.length >= state.total, more };
}

/** Calls `onVisible` when the element the returned ref is on scrolls into (or near) view. */
export function useWhenVisible(onVisible: () => void, active: boolean, refreshKey?: unknown) {
    const ref = useRef<HTMLDivElement>(null);
    const callback = useRef(onVisible);
    callback.current = onVisible;

    useEffect(() => {
        const element = ref.current;
        if (!element || !active || typeof IntersectionObserver === 'undefined') return;
        const observer = new IntersectionObserver(
            (entries) => {
                if (entries.some((entry) => entry.isIntersecting)) callback.current();
            },
            { rootMargin: '600px' }
        );
        observer.observe(element);
        return () => observer.disconnect();
        // `refreshKey` re-observes after each page, so a page that didn't fill
        // the view is followed by the next without waiting for a scroll.
    }, [active, refreshKey]);

    return ref;
}

/** `value`, but only after it has stopped changing for `delay` ms. */
export function useDebounced<T>(value: T, delay: number): T {
    const [settled, setSettled] = useState(value);
    useEffect(() => {
        const timer = setTimeout(() => setSettled(value), delay);
        return () => clearTimeout(timer);
    }, [value, delay]);
    return settled;
}
