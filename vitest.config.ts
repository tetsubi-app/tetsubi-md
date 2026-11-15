import { defineConfig } from 'vitest/config';

// Unit tests only cover plain TypeScript (no components yet), so they don't
// need the app's Vite plugins.
export default defineConfig({
    test: {
        include: ['src/**/__tests__/**/*.test.ts'],
        environment: 'node',
    },
});
