/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{js,jsx,ts,tsx}', '../../packages/ui/**/*.{js,jsx,ts,tsx}'],
  darkMode: 'class',
  plugins: [],
  extend: {
    fontFamily: {
      sans: ['var(--font-geist-sans)'],
    },
  },
  theme: {
    extend: {
      backgroundColor: {
        primary: 'var(--bg-primary)',
        secondary: 'var(--bg-secondary)',
      },
      textColor: {
        primary: 'var(--text-primary)',
        secondary: 'var(--text-secondary)',
      },
    },
  },
};
