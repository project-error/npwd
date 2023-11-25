import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import topLevelAwait from 'vite-plugin-top-level-await';
import federation from '@originjs/vite-plugin-federation';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    federation({
      remotes: { dummyRemote: 'dummyRemote.js' },
      shared: ['react', 'react-dom', '@emotion/react', 'react-router-dom', 'fivem-nui-react-lib'],
    }),
    topLevelAwait({
      // The export name of top-level await promise for each chunk module
      promiseExportName: '__tla',
      // The function to generate import names of top-level await promise in each chunk module
      promiseImportName: (i) => `__tla_${i}`,
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
  base: './',
  build: {
    emptyOutDir: true,
    outDir: '../../dist/html',
  },
});
