// Previous CLI options: server/server.ts --bundle --sourcemap --platform=node --outfile=dist/server.js --config

require('esbuild').build({
  entryPoints: ['index.ts'],
  bundle: true,
  platform: 'node',
  outfile: 'dist/index.js',
  external: ['pg', 'oracledb', 'tedious', 'better-sqlite3', 'sqlite3', 'pg-query-stream'],
  write: true,
});
