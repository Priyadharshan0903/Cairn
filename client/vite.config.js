import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      workbox: {
        // Activate a new service worker immediately and drop stale precaches so
        // an old cached shell can never blank the app after a redeploy.
        cleanupOutdatedCaches: true,
        clientsClaim: true,
        skipWaiting: true,
        globPatterns: ['**/*.{js,css,html,svg,png,woff2}'],
      },
      includeAssets: ['icon.svg', 'apple-touch-icon.png', 'favicon-32x32.png'],
      manifest: {
        name: 'Cairn — Goal Tracker',
        short_name: 'Cairn',
        description: 'Set the goal. Keep the pace. Notice how each day feels.',
        theme_color: '#B4573E',
        background_color: '#F4EEE3',
        display: 'standalone',
        start_url: '/',
        icons: [
          // Scalable icon for browsers that honour SVG.
          { src: '/icon.svg', sizes: 'any', type: 'image/svg+xml', purpose: 'any' },
          // Raster fallbacks — Android home-screen shortcuts use these.
          { src: '/pwa-192x192.png', sizes: '192x192', type: 'image/png', purpose: 'any' },
          { src: '/pwa-512x512.png', sizes: '512x512', type: 'image/png', purpose: 'any' },
          // Full-bleed maskable art for adaptive icon shapes.
          { src: '/maskable-512x512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
        ],
      },
    }),
  ],
  server: {
    port: 5173,
    strictPort: true,
    proxy: {
      '/api': { target: 'http://localhost:4000', changeOrigin: true },
    },
    allowedHosts: ["cairn-production-1.up.railway.app"]
  },
});
