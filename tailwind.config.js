/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        'ink': '#f8f9fa',
        'ink-light': '#ffffff',
        'ink-dark': '#e9ecef',
        'gold': '#b8860b',
        'gold-light': '#daa520',
        'gold-dark': '#8b6914',
        'cinnabar': '#c23b22',
        'cinnabar-light': '#d44a33',
        'parchment': '#495057',
        'parchment-dark': '#6c757d',
        'surface': {
          DEFAULT: '#ffffff',
          alt: '#f1f3f5',
          dark: '#1a1a2e',
          'dark-alt': '#16213e',
        },
        'text-primary': {
          DEFAULT: '#212529',
          dark: '#e9ecef',
        },
        'text-secondary': {
          DEFAULT: '#495057',
          dark: '#adb5bd',
        },
        'text-muted': {
          DEFAULT: '#868e96',
          dark: '#6c757d',
        },
        'border-light': {
          DEFAULT: '#dee2e6',
          dark: '#2d3748',
        },
        'border-gold': '#daa520',
        'success': '#2b8a3e',
        'info': '#1971c2',
      },
      fontFamily: {
        'songti': ['"Noto Serif SC"', '"Source Han Serif SC"', 'SimSun', 'serif'],
        'kaishu': ['"KaiTi"', '"STKaiti"', 'serif'],
      },
      animation: {
        'glow': 'glow 2s ease-in-out infinite alternate',
        'fade-in-up': 'fadeInUp 0.6s ease-out',
        'shimmer': 'shimmer 2s linear infinite',
        'float': 'float 3s ease-in-out infinite',
        'pulse-soft': 'pulseSoft 2s ease-in-out infinite',
      },
      keyframes: {
        glow: {
          '0%': { boxShadow: '0 0 5px rgba(184, 134, 11, 0.2)' },
          '100%': { boxShadow: '0 0 15px rgba(184, 134, 11, 0.4)' },
        },
        fadeInUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        pulseSoft: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.7' },
        },
      },
      boxShadow: {
        'soft': '0 2px 15px rgba(0, 0, 0, 0.05)',
        'medium': '0 4px 20px rgba(0, 0, 0, 0.08)',
        'gold': '0 4px 15px rgba(184, 134, 11, 0.15)',
      },
    },
  },
  plugins: [],
};
