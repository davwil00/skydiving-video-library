import { reactRouter } from '@react-router/dev/vite';
import { defineConfig } from 'vite';
import tsconfigPaths from 'vite-tsconfig-paths';
import tailwindcss from '@tailwindcss/vite';
import vitePluginSvgr from 'vite-plugin-svgr'

export default defineConfig({
    plugins: [
        reactRouter(),
        tsconfigPaths(),
        tailwindcss(),
        vitePluginSvgr({
            include: "**/*.svg/?react"
        }),
    ],
    build: {
        copyPublicDir: false
    },
    server: {
        allowedHosts: ['localhost', 'skydiving-solo']
    }
});
