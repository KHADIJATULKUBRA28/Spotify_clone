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
          darker: '#0a0a0a',
          accent: '#1DB954',
          'accent-dark': '#1aa34a',
          'accent-light': '#1ed760',
          gray: '#1a1a2e',
          'light-gray': '#2a2a3e',
          'hover': '#2a2a3e',
          surface: '#16162a',
          card: '#1e1e38',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['Outfit', 'Inter', 'sans-serif'],
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'hero-gradient': 'linear-gradient(135deg, #1DB954 0%, #191414 50%, #6C3FC5 100%)',
        'card-gradient': 'linear-gradient(180deg, rgba(30, 30, 56, 0.8) 0%, rgba(10, 10, 10, 0.95) 100%)',
        'accent-gradient': 'linear-gradient(135deg, #1DB954 0%, #1ed760 50%, #6C3FC5 100%)',
        'purple-accent': 'linear-gradient(135deg, #6C3FC5 0%, #9B59B6 100%)',
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'float': 'float 6s ease-in-out infinite',
        'glow': 'glow 2s ease-in-out infinite alternate',
        'slide-up': 'slideUp 0.4s ease-out',
        'slide-in-right': 'slideInRight 0.3s ease-out',
        'fade-in': 'fadeIn 0.3s ease-in',
        'scale-in': 'scaleIn 0.2s ease-out',
        'spin-slow': 'spin 8s linear infinite',
        'bounce-soft': 'bounceSoft 2s ease-in-out infinite',
        'equalizer-1': 'equalizer1 0.8s ease-in-out infinite',
        'equalizer-2': 'equalizer2 0.6s ease-in-out infinite',
        'equalizer-3': 'equalizer3 0.9s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-20px)' },
        },
        glow: {
          '0%': { boxShadow: '0 0 5px rgba(29, 185, 84, 0.3)' },
          '100%': { boxShadow: '0 0 20px rgba(29, 185, 84, 0.6), 0 0 40px rgba(29, 185, 84, 0.3)' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        slideInRight: {
          '0%': { transform: 'translateX(-20px)', opacity: '0' },
          '100%': { transform: 'translateX(0)', opacity: '1' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        scaleIn: {
          '0%': { transform: 'scale(0.9)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        bounceSoft: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-5px)' },
        },
        equalizer1: {
          '0%, 100%': { height: '8px' },
          '50%': { height: '20px' },
        },
        equalizer2: {
          '0%, 100%': { height: '16px' },
          '50%': { height: '6px' },
        },
        equalizer3: {
          '0%, 100%': { height: '12px' },
          '50%': { height: '22px' },
        },
      },
      backdropBlur: {
        xs: '2px',
      },
    },
  },
  plugins: [],
}
