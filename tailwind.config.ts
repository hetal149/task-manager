import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'system-ui', 'sans-serif'],
      },
      colors: {
        brand: {
          50: '#f3f1ff',
          100: '#ebe5ff',
          200: '#d9ceff',
          300: '#bea6ff',
          400: '#9f75ff',
          500: '#843dff',
          600: '#7916ff',
          700: '#6b04fd',
          800: '#5a03d5',
          900: '#4b05ad',
        },
        surface: {
          DEFAULT: '#ffffff',
          muted: '#f7f7fb',
          border: '#ececf2',
        },
        ink: {
          900: '#0f0f17',
          800: '#1a1a24',
          600: '#4a4a59',
          500: '#6b6b7a',
          400: '#9a9aab',
          300: '#c4c4cf',
        },
      },
      fontSize: {
        'page-title': ['24px', { lineHeight: '32px', fontWeight: '700' }],
        'col-title': ['13px', { lineHeight: '18px', fontWeight: '600', letterSpacing: '0.08em' }],
        'card-title': ['14px', { lineHeight: '20px', fontWeight: '600' }],
        'card-body': ['12px', { lineHeight: '18px', fontWeight: '400' }],
        'badge': ['11px', { lineHeight: '14px', fontWeight: '600' }],
        'meta': ['11px', { lineHeight: '14px', fontWeight: '400' }],
      },
      boxShadow: {
        card: '0 1px 2px rgba(15, 15, 23, 0.04), 0 1px 1px rgba(15, 15, 23, 0.03)',
        'card-hover': '0 4px 12px rgba(15, 15, 23, 0.08), 0 2px 4px rgba(15, 15, 23, 0.04)',
        pop: '0 12px 32px rgba(15, 15, 23, 0.12), 0 4px 8px rgba(15, 15, 23, 0.06)',
      },
      keyframes: {
        'fade-in': {
          '0%': { opacity: '0', transform: 'translateY(4px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'pulse-soft': {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.6' },
        },
      },
      animation: {
        'fade-in': 'fade-in 200ms ease-out',
        'pulse-soft': 'pulse-soft 2s ease-in-out infinite',
      },
    },
  },
  plugins: [],
};

export default config;


