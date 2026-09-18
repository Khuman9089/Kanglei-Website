import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

import { resolve } from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  base: '/suryasiddha/',
  build: {
    outDir: '../public/suryasiddha',
    emptyOutDir: true,
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        admin: resolve(__dirname, 'admin.html'),
      },
    },
  },
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.ico', 'apple-touch-icon.png', 'icons/*'],
      manifest: {
        name: 'SuryaSiddha: Vedic Calendar',
        short_name: 'SuryaSiddha',
        description: 'Hindu Astronomical Calendar & Precision Kundli Engine',
        theme_color: '#D97706',
        background_color: '#FAF7F2',
        display: 'standalone',
        scope: '/suryasiddha/',
        start_url: '/suryasiddha/',
        icons: [
          {
            src: '/suryasiddha/icons/icon-192.png',
            sizes: '192x192',
            type: 'image/png',
            purpose: 'any',
          },
          {
            src: '/suryasiddha/icons/icon-512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any',
          },
          {
            src: '/suryasiddha/icons/icon-maskable.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'maskable',
          },
          {
            src: '/suryasiddha/icons/icon.svg',
            sizes: '192x192 512x512',
            type: 'image/svg+xml',
            purpose: 'any maskable',
          },
        ],
      },
    }),
  ],
  server: {
    port: 3000,
    open: false,
  },
});

