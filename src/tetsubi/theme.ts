// The Tetsubi look for MUI: colours from the app (AppColors.swift) and the
// website, DEKIRU Sans, always dark.

import { createTheme } from '@mui/material/styles';

export const colors = {
    navy: '#000b25',
    pink: '#aa5cc3',
    blue: '#039fd6',
    /** Solid surface for dialogs and menus, which sit above the page. */
    surface: '#0e1638',
    /** Content boxes over the background. */
    box: 'rgba(0, 0, 0, 0.35)',
    line: 'rgba(255, 255, 255, 0.12)',
    text: '#ffffff',
    text2: 'rgba(255, 255, 255, 0.85)',
    text3: 'rgba(255, 255, 255, 0.65)',
};

export const fontFamily =
    "'DEKIRU Sans', -apple-system, BlinkMacSystemFont, 'SF Pro Text', 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif";

export const tetsubiTheme = createTheme({
    palette: {
        mode: 'dark',
        primary: { main: colors.blue, light: '#4fc3ea', dark: '#027aa5', contrastText: '#fff' },
        secondary: { main: colors.pink, light: '#c489d6', dark: '#84409b', contrastText: '#fff' },
        info: { main: colors.blue },
        background: { default: colors.navy, paper: colors.surface },
        text: { primary: colors.text, secondary: colors.text3, disabled: 'rgba(255, 255, 255, 0.4)' },
        divider: colors.line,
        action: {
            active: '#fff',
            hover: 'rgba(255, 255, 255, 0.08)',
            hoverOpacity: 0.08,
            selected: 'rgba(170, 92, 195, 0.28)',
            selectedOpacity: 0.28,
            disabled: 'rgba(255, 255, 255, 0.35)',
            disabledBackground: 'rgba(255, 255, 255, 0.12)',
            disabledOpacity: 0.38,
            focus: 'rgba(255, 255, 255, 0.12)',
            focusOpacity: 0.12,
            activatedOpacity: 0.24,
        },
    },
    shape: { borderRadius: 10 },
    typography: {
        fontFamily,
        button: { textTransform: 'none', fontWeight: 600 },
        h4: { fontWeight: 700, letterSpacing: '-0.01em' },
        h5: { fontWeight: 700 },
        h6: { fontWeight: 600 },
    },
    components: {
        MuiCssBaseline: {
            styleOverrides: {
                // The background wash is set in tetsubi.css; keep MUI from painting over it.
                body: { backgroundColor: 'transparent' },
            },
        },
        MuiSelect: { defaultProps: { variant: 'standard' } },
        MuiTextField: { defaultProps: { variant: 'standard' } },
        MuiPaper: {
            defaultProps: { elevation: 1 },
            styleOverrides: {
                root: { backgroundImage: 'none' },
            },
        },
        MuiDialog: {
            defaultProps: { PaperProps: { elevation: 0 } },
            styleOverrides: {
                paper: { border: `1px solid ${colors.line}`, borderRadius: 16 },
            },
        },
        MuiMenu: {
            defaultProps: { PaperProps: { elevation: 24 } },
            styleOverrides: {
                paper: { border: `1px solid ${colors.line}` },
            },
        },
        MuiButton: {
            styleOverrides: {
                containedPrimary: {
                    backgroundImage: `linear-gradient(100deg, ${colors.pink}, ${colors.blue})`,
                    '&.Mui-disabled': { backgroundImage: 'none' },
                },
            },
        },
        MuiLink: {
            styleOverrides: {
                root: { color: '#4fc3ea' },
            },
        },
        MuiTooltip: {
            styleOverrides: {
                tooltip: { backgroundColor: '#1c2550', fontSize: 13 },
            },
        },
    },
});
