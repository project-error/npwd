import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import federation from '@originjs/vite-plugin-federation';

export default defineConfig({
  plugins: [
    react(),
    federation({
      name: 'layout',
      filename: 'remoteEntry.js',
      exposes: {
        './ui': './src/ui/components/index',
      },
      shared: ['react', 'react-dom', 'recoil'],
    }),
  ],
  server: {
    port: 3000,
  },
  build: {
    outDir: '../resources/html',
    assetsDir: '.',
    sourcemap: true,
    dynamicImportVarsOptions: {},
  },
  resolve: {
    alias: {
      '@os': path.resolve(__dirname, './src/os/'),
      '@ui': path.resolve(__dirname, './src/ui/'),
      '@common': path.resolve(__dirname, './src/common/'),
      '@utils': path.resolve(__dirname, './src/utils/'),
      '@apps': path.resolve(__dirname, './src/apps/'),
      '@typings': path.resolve(__dirname, '../typings/'),
      '@shared': path.resolve(__dirname, '../shared'),
    },
  },
});
