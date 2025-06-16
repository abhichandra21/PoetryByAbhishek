/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],

  darkMode: 'class',

  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        serif: ['Lora', 'serif'],
        hindi: ['Lora', 'serif'], 
        serifHindi: ["'merriweather'", 'serif'],
        serifLatin: ['merriweather', 'Georgia', 'serif'],
      },

      /*  ─────  Colours  ─────────────────────────────────── */
      colors: {
        paper: {
          light: '#F8F6F9', // Soft lavender white
          dark: '#0B0A12',  // Deep blue-black
          accent: '#EFE9F4', // Lavender hint
          'dark-accent': '#161525', // Deep indigo
        },
        ink: {
          light: '#1F1A33', // Deep indigo
          dark: '#F8F6F9',
          'light-secondary': '#3D355A',
          'dark-secondary': '#E5E1ED',
        },
        accent: {
          light: '#6F5B8B', // Lavender
          dark: '#A99BC1',
          hover: {
            light: '#574873',
            dark: '#C2B4D8',
          },
        },
      },

      /*  spacing / radius / shadows … unchanged  */
      spacing: {
        18: '4.5rem',
        22: '5.5rem',
      },
      borderRadius: {
        xl: '0.75rem',
        '2xl': '1rem',
      },
      boxShadow: {
        soft: '0 2px 8px rgba(0,0,0,0.05)',
        medium: '0 4px 16px rgba(0,0,0,0.1)',
        book: '0 8px 24px rgba(0,0,0,0.15)',
        deep: '0 12px 32px rgba(0,0,0,0.2)',
        'inner-soft': 'inset 0 1px 2px rgba(0,0,0,0.05)',
      },
      backdropBlur: { xs: '2px' },

      animation: {
        'fade-in': 'fadeIn 0.3s ease-out',
        'slide-up': 'slideUp 0.4s ease-out',
        float: 'float 6s ease-in-out infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
      },
    },
  },

  /*  ─────  Safelist  ───────────────────────────────────── */
  /**  Tailwind’s JIT sometimes misses colour‑slash‑opacity
   *   utilities or class names built via template strings.
   *   The patterns below guarantee they’re always in the CSS.
   */
  safelist: [
    // paper / ink / accent basic colours
    { pattern: /(bg|text|border)-(paper|ink|accent)-(light|dark)/ },
    { pattern: /(bg|text|border)-(paper|ink)-(accent|dark-accent)/ },

    // second‑tier ink colours
    { pattern: /(bg|text|border)-ink-(light|dark)-(secondary|tertiary)/ },

    // sage & accent colours with arbitrary opacity
    { pattern: /(bg|text|border)-(sage|accent)-(light|dark)\/\d+/ },

    // explicit utilities used in PoemPage controls bar
    'bg-paper-accent',
    'bg-paper-dark-accent',
    'bg-accent-light',
    'bg-accent-dark',
    'text-ink-light-secondary',
    'text-ink-dark-secondary',
  ],

  plugins: [
    // e.g. require('@tailwindcss/typography'),
  ],
};
