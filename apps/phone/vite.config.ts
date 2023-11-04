import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

import federation from '@originjs/vite-plugin-federation';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    federation({
      remotes: { dummyRemote: 'dummyRemote.js' },
      shared: ['react', 'react-dom', '@emotion/react', 'react-router-dom'],
    }),
  ],
  server: {
    port: 3000,
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
  define: {
    'process.env': {},
  },
});
