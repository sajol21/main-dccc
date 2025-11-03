/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'dc-blue': '#1E40AF',
        'dc-blue-dark': '#1D3A9A',
        'dc-gold': '#F59E0B',
        'dc-gold-dark': '#D97706',
        'dc-dark': '#111827',
        'dc-light': '#F9FAFB',
        'dc-gray': '#E5E7EB',
        'dc-text': '#374151',
        'dc-yellow': '#FBBF24',
        'dc-pink': '#EC4899',
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        poppins: ['Poppins', 'sans-serif'],
      },
      boxShadow: {
          'subtle': '0 4px 6px -1px rgb(0 0 0 / 0.05), 0 2px 4px -2px rgb(0 0 0 / 0.05)',
          'medium': '0 10px 15px -3px rgb(0 0 0 / 0.07), 0 4px 6px -4px rgb(0 0 0 / 0.07)',
          'neo': '4px 4px 0px #111827',
          'neo-sm': '2px 2px 0px #111827',
      },
      keyframes: {
          fadeInUp: {
              '0%': { opacity: 0, transform: 'translateY(20px)' },
              '100%': { opacity: 1, transform: 'translateY(0)' },
          },
          fadeIn: {
              '0%': { opacity: 0 },
              '100%': { opacity: 1 },
          },
          spin: {
              'from': { transform: 'rotate(0deg)' },
              'to': { transform: 'rotate(360deg)' },
          },
          slideDown: {
              '0%': { opacity: 0, transform: 'translateY(-1rem)' },
              '100%': { opacity: 1, transform: 'translateY(0)' },
          },
      },
      animation: {
          fadeInUp: 'fadeInUp 0.8s ease-out forwards',
          fadeIn: 'fadeIn 1s ease-out forwards',
          spin: 'spin 60s linear infinite',
          slideDown: 'slideDown 0.3s ease-out forwards',
      }
    }
  },
  plugins: [],
}