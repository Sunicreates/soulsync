/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Primary Colors
        'primary': '#1E40AF', // Deep professional blue (blue-800)
        'primary-50': '#EFF6FF', // Very light blue (blue-50)
        'primary-100': '#DBEAFE', // Light blue (blue-100)
        'primary-500': '#3B82F6', // Medium blue (blue-500)
        'primary-600': '#2563EB', // Darker blue (blue-600)
        'primary-700': '#1D4ED8', // Dark blue (blue-700)
        
        // Secondary Colors
        'secondary': '#7C3AED', // Sophisticated purple (violet-600)
        'secondary-50': '#F5F3FF', // Very light purple (violet-50)
        'secondary-100': '#EDE9FE', // Light purple (violet-100)
        'secondary-500': '#8B5CF6', // Medium purple (violet-500)
        'secondary-600': '#7C3AED', // Darker purple (violet-600)
        
        // Accent Colors
        'accent': '#F59E0B', // Warm amber (amber-500)
        'accent-50': '#FFFBEB', // Very light amber (amber-50)
        'accent-100': '#FEF3C7', // Light amber (amber-100)
        'accent-600': '#D97706', // Darker amber (amber-600)
        
        // Background Colors
        'background': '#FAFAFA', // Soft off-white (gray-50)
        'surface': '#FFFFFF', // Pure white (white)
        
        // Text Colors
        'text-primary': '#111827', // Near-black (gray-900)
        'text-secondary': '#6B7280', // Medium gray (gray-500)
        'text-tertiary': '#9CA3AF', // Light gray (gray-400)
        
        // Status Colors
        'success': '#10B981', // Professional green (emerald-500)
        'success-50': '#ECFDF5', // Very light green (emerald-50)
        'success-100': '#D1FAE5', // Light green (emerald-100)
        
        'warning': '#F59E0B', // Warm amber (amber-500)
        'warning-50': '#FFFBEB', // Very light amber (amber-50)
        'warning-100': '#FEF3C7', // Light amber (amber-100)
        
        'error': '#EF4444', // Clear red (red-500)
        'error-50': '#FEF2F2', // Very light red (red-50)
        'error-100': '#FEE2E2', // Light red (red-100)
        
        // Border Colors
        'border': '#E5E7EB', // Light gray border (gray-200)
        'border-light': '#F3F4F6', // Very light gray border (gray-100)
      },
      fontFamily: {
        'sans': ['Inter', 'system-ui', 'sans-serif'],
        'mono': ['JetBrains Mono', 'monospace'],
      },
      fontSize: {
        'xs': ['0.75rem', { lineHeight: '1rem' }],
        'sm': ['0.875rem', { lineHeight: '1.25rem' }],
        'base': ['1rem', { lineHeight: '1.5rem' }],
        'lg': ['1.125rem', { lineHeight: '1.75rem' }],
        'xl': ['1.25rem', { lineHeight: '1.75rem' }],
        '2xl': ['1.5rem', { lineHeight: '2rem' }],
        '3xl': ['1.875rem', { lineHeight: '2.25rem' }],
        '4xl': ['2.25rem', { lineHeight: '2.5rem' }],
        '5xl': ['3rem', { lineHeight: '1' }],
        '6xl': ['3.75rem', { lineHeight: '1' }],
      },
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
        '128': '32rem',
      },
      borderRadius: {
        'xl': '0.75rem',
        '2xl': '1rem',
      },
      boxShadow: {
        'sm': '0 1px 3px rgba(0, 0, 0, 0.1)',
        'md': '0 4px 6px rgba(0, 0, 0, 0.1)',
        'lg': '0 10px 15px rgba(0, 0, 0, 0.1)',
      },
      animation: {
        'fade-in': 'fadeIn 300ms cubic-bezier(0.4, 0, 0.2, 1)',
        'slide-in': 'slideIn 300ms cubic-bezier(0.4, 0, 0.2, 1)',
        'scale-in': 'scaleIn 200ms ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideIn: {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(0)' },
        },
        scaleIn: {
          '0%': { transform: 'scale(0.95)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
      },
      transitionTimingFunction: {
        'smooth': 'cubic-bezier(0.4, 0, 0.2, 1)',
      },
      zIndex: {
        '100': '100',
        '110': '110',
        '120': '120',
        '1000': '1000',
      },
    },
  },
  plugins: [],
}