const { build } = require('esbuild');

build({
  entryPoints: ['server/server.ts'],
  outfile: 'dist/server/server.js',
  bundle: true,
  loader: {
    '.ts': 'ts',
    '.js': 'js',
  },
  write: true,
  watch: {
    onRebuild(error, result) {
      if (error) console.error('Server watch build failed:', error);
      else console.log('Server watch build succeeded:', result);
    },
  },
  platform: 'node',
  target: 'es2016',
})
  .then(() => {
    console.log('Server built successfully');
  })
  .catch(() => process.exit(1));

build({
  entryPoints: ['client/client.ts'],
  outfile: 'dist/client/client.js',
  bundle: true,
  loader: {
    '.ts': 'ts',
    '.js': 'js',
  },
  watch: {
    onRebuild(error, result) {
      if (error) console.error('Client watch build failed:', error);
      else console.log('Client watch build succeeded:', result);
    },
  },
  write: true,
  platform: 'browser',
  target: 'es2016',
})
  .then(() => {
    console.log('Client built successfully');
  })
  .catch(() => process.exit(1));
