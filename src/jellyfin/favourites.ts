// A counter that goes up whenever a favourite is added or removed here, so
// lists of favourites know to load again.

import { useSyncExternalStore } from 'react';

let version = 0;
const listeners = new Set<() => void>();

export function favouritesChanged() {
    version++;
    listeners.forEach((listener) => listener());
}

export function useFavouritesVersion(): number {
    return useSyncExternalStore(
        (listener) => {
            listeners.add(listener);
            return () => listeners.delete(listener);
        },
        () => version
    );
}
