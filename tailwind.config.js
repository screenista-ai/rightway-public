import path from 'path';

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    path.resolve(import.meta.dirname, 'index.html'),
    path.resolve(import.meta.dirname, 'src/**/*.{ts,tsx,js,jsx}'),
    './index.html',
    './src/**/*.{ts,tsx,js,jsx}',
    './apps/web/index.html',
    './apps/web/src/**/*.{ts,tsx,js,jsx}',
  ],
  theme: {
    extend: {
      colors: {
        ink: '#0f172a',
        eu: '#003399',
      },
    },
  },
  plugins: [],
};
