import { reactRouter } from '@react-router/dev/vite';
import tailwindcss from '@tailwindcss/vite';
import { defineConfig } from 'vite';
import vitePluginSvgr from 'vite-plugin-svgr';
import tsconfigPaths from 'vite-tsconfig-paths';

export default defineConfig({
    plugins: [
        reactRouter(),
        tsconfigPaths(),
        tailwindcss(),
        vitePluginSvgr({
            include: '**/*.svg/?react',
        }),
    ],
    build: {
        copyPublicDir: false,
    },
    server: {
        allowedHosts: ['localhost', 'skydiving-solo', 'tunnel.vision'],
    },
});
