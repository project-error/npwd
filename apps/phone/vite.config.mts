import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import federation from '@originjs/vite-plugin-federation';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';
import topLevelAwait from 'vite-plugin-top-level-await';

const currentDir = dirname(fileURLToPath(import.meta.url));

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    federation({
      remotes: { dummyRemote: 'dummyRemote.js' },
      exposes: {
        './Input': './src/ui/components/Input.tsx',
      },
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
      '@os': resolve(currentDir, './src/os/'),
      '@ui': resolve(currentDir, './src/ui/'),
      '@common': resolve(currentDir, './src/common/'),
      '@utils': resolve(currentDir, './src/utils/'),
      '@apps': resolve(currentDir, './src/apps/'),
      '@typings': resolve(currentDir, '../../typings/'),
      '@shared': resolve(currentDir, '../../shared'),
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