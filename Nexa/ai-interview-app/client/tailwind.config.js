/** @type {import('tailwindcss').Config} */
import defaultTheme from 'tailwindcss/defaultTheme';
import plugin from 'tailwindcss/plugin';

export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', ...defaultTheme.fontFamily.sans],
      },
      textShadow: {
        // Updated to an orange glow
        glow: '0 0 15px rgba(251, 146, 60, 0.7), 0 0 5px rgba(251, 146, 60, 0.8)',
      },
    },
  },
  plugins: [
    plugin(function({ addUtilities, theme }) {
      const newUtilities = {
        '.text-glow': {
          textShadow: theme('textShadow.glow'),
        },
      }
      addUtilities(newUtilities)
    })
  ],
}