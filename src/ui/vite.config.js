import path from 'path';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import federation from '@originjs/vite-plugin-federation';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    federation({
      name: 'host-app',
      remotes: { dummyRemote: 'dummyRemote.js' },
      shared: ['react', 'react-dom', '@emotion/react', 'react-router-dom', 'fivem-nui-react-lib'],
      exposes: {
        './Input': './src/ui/components/Input.tsx',
      },
    }),
  ],
  base: './',
  build: {
    emptyOutDir: true,
    modulePreload: false,
    assetsDir: '',
  },
  resolve: {
    alias: {
      // eslint-disable-next-line no-undef
      '@': path.resolve(__dirname, './src'),
    },
  },
});
