import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { fileURLToPath } from 'url';

const root = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  root,
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(root, './src'),
      '@rightway/shared': path.resolve(root, '../rightway-backend/packages/shared/src/index.js'),
    },
  },
  server: {
    host: '127.0.0.1',
    port: 3002,
  },
});
