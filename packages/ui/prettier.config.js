/** @type {import("prettier").Config} */
module.exports = {
  plugins: [require.resolve('prettier-plugin-tailwindcss')],
  printWidth: 100,
  singleQuote: true,
  semi: true,
  bracketSpacing: true,
  trailingComma: 'all',
  useTabs: false,
  tabWidth: 2,
};
