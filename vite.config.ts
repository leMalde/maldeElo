// vite.config.js
import { defineConfig } from 'vite';

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
    }
} );