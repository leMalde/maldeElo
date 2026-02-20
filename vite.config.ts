// vite.config.js
import { defineConfig } from 'vite';
import { viteCopy } from '@arcmantle/vite-plugin-copy';
// import { defineDocConfig } from '@roenlie/mirage-docs/server';

export default defineConfig( {
    base: '/elo/',
    server: {
        proxy: {
            "/elosystem": {
                changeOrigin: true,
                target: "http://localhost:80",
                secure: false
            }
        }
    },
    plugins: [
        viteCopy({
            targets: [
                {
				from: './node_modules/@eye-share/web-components/dist/icons/*',
				to:   './public/vendor/icons',
                },
                {
                    from: './node_modules/@eye-share/web-components/dist/fonts/*',
                    to:   './public/vendor/fonts',
                },
                {
                    from: './node_modules/@eye-share/web-components/dist/styles/tokens/*',
                    to:   './public/vendor/styles',
                },
            ]
        })
    ]
} );
