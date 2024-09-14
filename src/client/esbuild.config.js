// Previous CLI options: server/server.ts --bundle --sourcemap --platform=node --outfile=dist/server.js --config

require('esbuild').build({
  entryPoints: ['index.ts'],
  bundle: true,
  platform: 'node',
  outfile: 'dist/index.js',
  write: true,
});
