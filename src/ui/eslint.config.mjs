// @ts-check

// @ts-expect-error (tslint) eslint is not a module
import eslint from '@eslint/js';
import tseslint from 'typescript-eslint';

export default tseslint.config(eslint.configs.recommended, ...tseslint.configs.recommended, {
  ignores: ['*.mjs', '*.js', 'dist', 'node_modules'],
});
