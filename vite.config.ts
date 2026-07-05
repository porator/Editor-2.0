import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import path from 'path';

export default defineConfig(({ command }) => ({
  // Served from https://porator.github.io/Editor-2.0/ in production
  base: command === 'build' ? '/Editor-2.0/' : '/',
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    port: Number(process.env.PORT) || 5173,
    strictPort: false,
    allowedHosts: ['.trycloudflare.com'],
  },
}));
