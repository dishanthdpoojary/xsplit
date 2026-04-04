/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
      colors: {
        'primary': '#10b981',
        'primary-dark': '#059669',
        'primary-light': '#d1fae5',
        'secondary': '#06b6d4',
        'secondary-dark': '#0891b2',
        'secondary-light': '#cffafe',
        'accent': '#f59e0b',
        'accent-dark': '#d97706',
        'warning': '#ef4444',
        'success': '#10b981',
      },
      spacing: {
        '13': '3.25rem',
        '15': '3.75rem',
      },
      backgroundImage: {
        'gradient-primary': 'linear-gradient(135deg, #10b981 0%, #06b6d4 100%)',
        'gradient-subtle': 'linear-gradient(135deg, #f8f9fa 0%, #f3f4f6 100%)',
      },
      boxShadow: {
        'sm-dark': '0 1px 2px 0 rgba(0, 0, 0, 0.3)',
        'md-dark': '0 4px 6px -1px rgba(0, 0, 0, 0.4)',
        'lg-dark': '0 10px 15px -3px rgba(0, 0, 0, 0.5)',
      },
      fontSize: {
        'xs': ['0.75rem', { lineHeight: '1rem' }],
        'sm': ['0.875rem', { lineHeight: '1.25rem' }],
        'base': ['1rem', { lineHeight: '1.5rem' }],
        'lg': ['1.125rem', { lineHeight: '1.75rem' }],
        'xl': ['1.25rem', { lineHeight: '1.75rem' }],
        '2xl': ['1.5rem', { lineHeight: '2rem' }],
        '3xl': ['1.875rem', { lineHeight: '2.25rem' }],
      }
    },
  },
  plugins: [],
}
