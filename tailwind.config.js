/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
        hindi: ["'Noto Sans Devanagari'", "sans-serif"],
      },
      colors: {
        paper: {
          light: '#F9F5F1',
          dark: '#0A0908',
        },
        ink: {
          light: '#0A0908',
          dark: '#F9F5F1',
        },
        accent: {
          light: '#6B4E3B',
          dark: '#D3B88C',
        }
      },
    },
  },
  darkMode: 'class',
  plugins: [],
}