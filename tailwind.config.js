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
          DEFAULT: '#181424',
          dark: '#221C36',
        },
        foreground: {
          DEFAULT: '#E8E6FF',
        },
        accent: {
          purple: '#8B5CF6',
          dark: '#5B21B6',
        },
      },
    },
  },
  plugins: [],
}
