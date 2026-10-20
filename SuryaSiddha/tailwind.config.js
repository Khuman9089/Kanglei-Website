/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Vedic & Bengali Panjika Design System Core
        surface: {
          DEFAULT: '#fff8f4',
          dim: '#e0d9d3',
          bright: '#fff8f4',
          lowest: '#ffffff',
          low: '#faf2ed',
          container: '#f4ece7',
          high: '#eee7e1',
          highest: '#e9e1dc',
          variant: '#e9e1dc',
          tint: '#b12b28',
        },
        'on-surface': {
          DEFAULT: '#1e1b18',
          variant: '#59413e',
        },
        'inverse-surface': {
          DEFAULT: '#33302c',
          on: '#f7efea',
        },
        outline: {
          DEFAULT: '#8d706d',
          variant: '#e1bfbb',
        },
        primary: {
          DEFAULT: '#790009',
          container: '#9c1b1b',
          'on-container': '#ffada5',
          'on-primary': '#ffffff',
          fixed: '#ffdad6',
          'fixed-dim': '#ffb4ac',
        },
        secondary: {
          DEFAULT: '#904d00',
          container: '#fe932c',
          'on-container': '#663500',
          'on-secondary': '#ffffff',
          fixed: '#ffdcc3',
        },
        tertiary: {
          DEFAULT: '#00431b',
          container: '#005d28',
          'on-container': '#75d789',
          'on-tertiary': '#ffffff',
        },
        error: {
          DEFAULT: '#ba1a1a',
          container: '#ffdad6',
          'on-container': '#93000a',
        },
        // Traditional Ritual Roles
        temple: {
          DEFAULT: '#9C1B1B',
          dark: '#790009',
          light: '#B12B28',
          crimson: '#9C1B1B',
        },
        parchment: {
          50: '#FDFBF7',
          100: '#FFF8F4',
          200: '#F7F3E8',
          300: '#E9E1DC',
          border: '#E6D5B8',
        },
        marigold: {
          50: '#FFFBEB',
          100: '#FEF3C7',
          400: '#FBBF24',
          500: '#F59E0B',
          600: '#D97706',
          700: '#B45309',
        },
        turmeric: {
          50: '#FFFBEB',
          100: '#FEF3C7',
          400: '#FBBF24',
          500: '#F59E0B',
          600: '#D97706',
          700: '#B45309',
        },
        sacred: {
          gold: '#D97706',
          ink: '#1E1B18',
          charcoal: '#33302C',
          muted: '#59413E',
          hairline: '#E6D5B8',
        },
      },
      fontFamily: {
        serif: ['"Noto Serif"', '"Noto Serif Bengali"', 'Cinzel', 'serif'],
        bengali: ['"Hind Siliguri"', '"Noto Serif Bengali"', 'sans-serif'],
        sans: ['"Work Sans"', 'system-ui', 'sans-serif'],
        mono: ['Fira Code', 'monospace'],
      },
      boxShadow: {
        'level-1': '0 2px 8px rgba(30, 27, 24, 0.04)',
        'level-2': '0 4px 16px rgba(156, 27, 27, 0.08)',
        'sacred': '0 4px 20px -2px rgba(156, 27, 27, 0.12), 0 2px 6px -1px rgba(0, 0, 0, 0.04)',
        'card': '0 2px 8px rgba(30, 27, 24, 0.04), 0 1px 3px rgba(0, 0, 0, 0.02)',
        'nav': '0 -4px 20px rgba(30, 27, 24, 0.06)',
      },
      backgroundImage: {
        'radial-radial': 'radial-gradient(circle at 50% 0%, rgba(245, 158, 11, 0.08) 0%, rgba(11, 15, 25, 0) 70%)',
        'subtle-grid': 'radial-gradient(rgba(255, 255, 255, 0.05) 1px, transparent 1px)',
      }
    },
  },
  plugins: [],
}
