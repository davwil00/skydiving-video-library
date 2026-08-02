import { defineConfig } from 'vitest/config';
export default defineConfig({
    test: {
        include: ['src/tests/**/*.test.ts'],
        pool: 'threads',
        setupFiles: ['test.setup.ts'],
    },
    resolve: {
        alias: {
            auth: '/src/auth',
            quotes: '/src/quotes',
            lib: '/src/lib',
        },
    },
});
