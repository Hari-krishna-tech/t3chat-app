/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
    './app/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['var(--font-inter)', 'system-ui', '-apple-system', 'sans-serif'],
      },
      colors: {
        background: {
          DEFAULT: 'rgb(var(--background-rgb))',
          dark: 'rgb(var(--background-dark-rgb))',
        },
        foreground: {
          DEFAULT: 'rgb(var(--foreground-rgb))',
        },
        surface: {
          0: 'rgb(var(--surface-0))',
          1: 'rgb(var(--surface-1))',
          2: 'rgb(var(--surface-2))',
          3: 'rgb(var(--surface-3))',
        },
        border: {
          DEFAULT: 'rgba(var(--border-rgb), 0.08)',
          subtle: 'rgba(var(--border-rgb), 0.04)',
          strong: 'rgba(var(--border-rgb), 0.12)',
        },
        accent: {
          primary: 'rgb(var(--accent-primary-rgb))',
          'primary-dark': 'rgb(var(--accent-primary-dark-rgb))',
          secondary: 'rgb(var(--accent-secondary-rgb))',
          'secondary-dark': 'rgb(var(--accent-secondary-dark-rgb))',
          success: 'rgb(var(--accent-success-rgb))',
          warning: 'rgb(var(--accent-warning-rgb))',
          error: 'rgb(var(--accent-error-rgb))',
          info: 'rgb(var(--accent-info-rgb))',
        },
        muted: {
          DEFAULT: 'rgba(var(--foreground-rgb), 0.5)',
          light: 'rgba(var(--foreground-rgb), 0.35)',
        },
      },
      animation: {
        'fade-in': 'fadeIn 0.3s ease-out forwards',
        'slide-up': 'slideUp 0.35s ease-out forwards',
        'scale-in': 'scaleIn 0.2s ease-out forwards',
        'shimmer': 'shimmer 2s linear infinite',
        'float': 'float 3s ease-in-out infinite',
        'glow': 'glow-pulse 2s ease-in-out infinite',
      },
      keyframes: {
        fadeIn: {
          from: { opacity: '0' },
          to: { opacity: '1' },
        },
        slideUp: {
          from: { opacity: '0', transform: 'translateY(8px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        scaleIn: {
          from: { opacity: '0', transform: 'scale(0.95)' },
          to: { opacity: '1', transform: 'scale(1)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-3px)' },
        },
        'glow-pulse': {
          '0%, 100%': { boxShadow: '0 0 4px rgba(var(--accent-primary-rgb), 0.1)' },
          '50%': { boxShadow: '0 0 16px rgba(var(--accent-primary-rgb), 0.2)' },
        },
      },
    },
  },
  plugins: [],
}
