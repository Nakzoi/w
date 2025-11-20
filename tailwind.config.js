/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class', // Enable class-based dark mode
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          DEFAULT: '#E9967A', // Salmon/Peach
          dark: '#d68569',
          light: '#f0ad96',
        },
        // Custom dark backgrounds
        dark: {
          bg: '#121212',
          card: '#1E1E1E',
          input: '#2C2C2C'
        }
      },
      fontFamily: {
        sans: ['"Nunito"', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
