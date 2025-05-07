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
        sans: ['Inter', 'system-ui', 'sans-serif'],
        hindi: ["'Noto Sans Devanagari'", 'sans-serif'],
      },

      /*  ─────  Colours  ─────────────────────────────────── */
      colors: {
        /* paper */
        paper: {
          DEFAULT: '#F9F5F1', // allows `bg-paper`
          light: '#F9F5F1',
          dark: '#0A0908',
          accent: '#F5EDE3',
          'dark-accent': '#1A1411',
        },

        /* ink */
        ink: {
          light: '#0A0908',
          dark: '#F9F5F1',
          'light-secondary': '#3D3029',
          'dark-secondary': '#E6DDD4',
          'light-tertiary': '#6B5A4C',
          'dark-tertiary': '#B8A598',
        },

        /* accent */
        accent: {
          DEFAULT: '#8B6F5B', // allows `bg-accent`
          light: '#8B6F5B',
          dark: '#D4B996',
          hover: {
            light: '#6B4E3B',
            dark: '#E8CDB2',
          },
        },

        /* sage */
        sage: {
          light: '#A8A598',
          dark: '#6B6A61',
        },

        /* states */
        states: {
          error: '#D84A3B',
          success: '#5A8B6F',
          warning: '#D3A13B',
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
