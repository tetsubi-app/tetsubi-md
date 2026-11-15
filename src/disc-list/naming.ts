// Names, dates and capacity sums for the disc list. Plain functions, no state.

export const UNTITLED = 'Untitled MiniDisc';

/** Today (or `date`) as YYYY-MM-DD in the user's own time zone. */
export function localDate(date: Date = new Date()): string {
    const two = (n: number) => String(n).padStart(2, '0');
    return `${date.getFullYear()}-${two(date.getMonth() + 1)}-${two(date.getDate())}`;
}

/** The playlist's name: the disc's name, then the date a song was last added. */
export function playlistName(discName: string, lastAdded: string | null): string {
    const name = discName.trim() || UNTITLED;
    return lastAdded ? `${name} (${lastAdded})` : name;
}

/** Splits "Road Trip (2026-11-15)" back into the disc's name and the date. */
export function splitPlaylistName(name: string): { discName: string; lastAdded: string | null } {
    const match = name.match(/^(.*?)\s*\((\d{4}-\d{2}-\d{2})\)\s*$/);
    if (match && match[1].trim()) return { discName: match[1].trim(), lastAdded: match[2] };
    return { discName: name.trim(), lastAdded: null };
}

export type RecordingMode = 'SP' | 'LP2' | 'LP4';

/** How much longer than SP each mode plays for on the same disc. */
export const MODE_FACTOR: Record<RecordingMode, number> = { SP: 1, LP2: 2, LP4: 4 };
export const MODES: RecordingMode[] = ['SP', 'LP2', 'LP4'];

/** The length of the longest blank disc sold, in SP. */
const LONGEST_DISC_SECONDS = 80 * 60;

/** The best-sounding mode in which `seconds` of music fits `spSecondsFree`, or null if none does. */
export function modeThatFits(seconds: number, spSecondsFree: number = LONGEST_DISC_SECONDS): RecordingMode | null {
    return MODES.find((mode) => seconds <= spSecondsFree * MODE_FACTOR[mode]) ?? null;
}

/** "48 min", "1 hr 5 min". */
export function minutesText(seconds: number): string {
    const minutes = Math.max(0, Math.round(seconds / 60));
    if (minutes < 60) return `${minutes} min`;
    return `${Math.floor(minutes / 60)} hr${minutes % 60 ? ` ${minutes % 60} min` : ''}`;
}
