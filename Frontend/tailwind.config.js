/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
      colors: {
        spotify: {
          dark: '#121212',
          darker: '#0f0f0f',
          accent: '#1DB954',
          gray: '#282828',
          'light-gray': '#404040',
        }
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
