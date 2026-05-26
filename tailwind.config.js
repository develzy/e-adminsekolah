/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#2563EB',
        secondary: '#1E3A8A',
        accent: '#D4AF37',
        'accent-soft': '#F5E6A8',
        surface: '#FFFFFF',
        background: '#F8FAFC',
        text: '#0F172A',
        border: '#E2E8F0',
        success: '#10B981',
        warning: '#F59E0B',
        danger: '#EF4444',
        info: '#3B82F6',
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'Helvetica Neue', 'Arial', 'sans-serif'],
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'shimmer': 'shimmer 2s linear infinite',
        'glow': 'glow 2s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        shimmer: {
          from: { backgroundPosition: '200% 0' },
          to: { backgroundPosition: '-200% 0' },
        },
        glow: {
          '0%, 100%': { boxShadow: '0 0 10px rgba(212, 175, 55, 0.2)' },
          '50%': { boxShadow: '0 0 20px rgba(212, 175, 55, 0.6)' },
        }
      }
    },
  },
  plugins: [],
}
