import { describe, expect, it } from 'vitest';
import { localDate, minutesText, modeThatFits, playlistName, splitPlaylistName } from '../naming';

describe('playlist names', () => {
    it('adds the date a song was last added', () => {
        expect(playlistName('Road Trip', '2026-11-15')).toBe('Road Trip (2026-11-15)');
        expect(playlistName('  Road Trip ', null)).toBe('Road Trip');
        expect(playlistName('', '2026-11-15')).toBe('Untitled MiniDisc (2026-11-15)');
    });

    it('splits a name back into disc name and date', () => {
        expect(splitPlaylistName('Road Trip (2026-11-15)')).toEqual({ discName: 'Road Trip', lastAdded: '2026-11-15' });
        expect(splitPlaylistName('Road Trip')).toEqual({ discName: 'Road Trip', lastAdded: null });
        expect(splitPlaylistName('Best of (Live) (2026-01-02)')).toEqual({ discName: 'Best of (Live)', lastAdded: '2026-01-02' });
        expect(splitPlaylistName('(2026-01-02)')).toEqual({ discName: '(2026-01-02)', lastAdded: null });
    });

    it('formats the local date', () => {
        expect(localDate(new Date(2026, 0, 5, 23, 59))).toBe('2026-01-05');
    });
});

describe('capacity', () => {
    it('picks the best mode that fits', () => {
        expect(modeThatFits(79 * 60)).toBe('SP');
        expect(modeThatFits(81 * 60)).toBe('LP2');
        expect(modeThatFits(200 * 60)).toBe('LP4');
        expect(modeThatFits(321 * 60)).toBeNull();
        expect(modeThatFits(30 * 60, 20 * 60)).toBe('LP2');
    });

    it('words minutes', () => {
        expect(minutesText(48 * 60)).toBe('48 min');
        expect(minutesText(65 * 60)).toBe('1 hr 5 min');
        expect(minutesText(120 * 60)).toBe('2 hr');
    });
});
