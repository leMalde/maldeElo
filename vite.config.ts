// vite.config.js
import { defineConfig } from 'vite';
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
    siteConfig: {
        pages: {
            scripts: [ { src: '/bootstrap.ts' } ]
        }
    }
} );