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
        default: ['var(--font-inter)'],
      },
      colors: {
        background: {
          DEFAULT: 'rgb(var(--background-rgb))',
          dark: 'rgb(var(--background-dark-rgb))',
        },
        foreground: {
          DEFAULT: 'rgb(var(--foreground-rgb))',
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
      },
    },
  },
  plugins: [],
}
