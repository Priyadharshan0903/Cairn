import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      manifest: {
        name: 'Cairn — Goal Tracker',
        short_name: 'Cairn',
        description: 'Set the goal. Keep the pace. Notice how each day feels.',
        theme_color: '#B4573E',
        background_color: '#F4EEE3',
        display: 'standalone',
        start_url: '/',
        icons: [
          { src: '/icon.svg', sizes: 'any', type: 'image/svg+xml', purpose: 'any maskable' },
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
