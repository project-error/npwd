import dts from 'rollup-plugin-dts';

/**
 * @type {import('rollup').RollupOptions}
 */
const config = [
  {
    input: './typings/index.ts',
    output: [{ file: 'packages/npwd-types/index.d.ts', format: 'es' }],
    plugins: [dts()],
  },
];

export default config;
