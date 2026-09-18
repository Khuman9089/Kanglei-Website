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
        void: {
          950: '#070A10',
          900: '#0B0F19',
          850: '#0F1523',
          800: '#141C2E',
        },
        card: {
          dark: '#111827',
          surface: '#1E293B',
          glass: 'rgba(17, 24, 39, 0.75)',
        },
        gold: {
          400: '#FBBF24',
          500: '#F59E0B',
          600: '#D97706',
          700: '#B45309',
        },
        cyan: {
          400: '#22D3EE',
          500: '#06B6D4',
          600: '#0891B2',
        },
        ruby: {
          500: '#EF4444',
          600: '#DC2626',
        }
      },
      fontFamily: {
        serif: ['Cinzel', 'Georgia', 'serif'],
        sans: ['Outfit', 'Inter', 'system-ui', 'sans-serif'],
        mono: ['Fira Code', 'monospace']
      },
      boxShadow: {
        'glow-gold': '0 0 20px -3px rgba(245, 158, 11, 0.25)',
        'glow-cyan': '0 0 20px -3px rgba(6, 182, 212, 0.25)',
        'glow-ruby': '0 0 20px -3px rgba(239, 68, 68, 0.25)',
      },
      backgroundImage: {
        'radial-radial': 'radial-gradient(circle at 50% 0%, rgba(245, 158, 11, 0.08) 0%, rgba(11, 15, 25, 0) 70%)',
        'subtle-grid': 'radial-gradient(rgba(255, 255, 255, 0.05) 1px, transparent 1px)',
      }
    },
  },
  plugins: [],
}
