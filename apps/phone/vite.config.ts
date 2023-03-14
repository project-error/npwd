import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    open: true,
  },
  build: {
    outDir: '../../dist/html',
  },
  resolve: {
    alias: {
      '@os': path.resolve(__dirname, './src/os/'),
      '@ui': path.resolve(__dirname, './src/ui/'),
      '@common': path.resolve(__dirname, './src/common/'),
      '@utils': path.resolve(__dirname, './src/utils/'),
      '@apps': path.resolve(__dirname, './src/apps/'),
      '@typings': path.resolve(__dirname, '../../typings/'),
      '@shared': path.resolve(__dirname, '../../shared'),
    },
  },
});
