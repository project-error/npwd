const { build } = require('esbuild');
const { copy } = require('esbuild-plugin-copy');

build({
  entryPoints: ['server/server.ts'],
  outfile: '../../dist/game/server/server.js',
  bundle: true,
  loader: {
    '.ts': 'ts',
    '.js': 'js',
  },
  write: true,
  platform: 'node',
  target: 'es2020',
})
  .then(() => {
    console.log('Server built successfully');
  })
  .catch(() => process.exit(1));

build({
  entryPoints: ['client/client.ts'],
  outfile: '../../dist/game/client/client.js',
  bundle: true,
  loader: {
    '.ts': 'ts',
    '.js': 'js',
  },
  write: true,
  platform: 'browser',
  target: 'es2016',
  plugins: [
    copy({
      resolveFrom: 'cwd',
      verbose: true,
      assets: {
        from: ['client/cl_controls.lua'],
        to: ['../../dist/game/client/cl_controls.lua'],
      },
    }),
  ],
})
  .then(() => {
    console.log('Client built successfully');
  })
  .catch(() => process.exit(1));
