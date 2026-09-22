/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#eef8ff',
          100: '#d8eeff',
          200: '#b9e0ff',
          300: '#88cbff',
          400: '#52adff',
          500: '#2688ff',
          600: '#0d65f5',
          700: '#074ee0',
          800: '#0c3eb5',
          900: '#10378e',
          950: '#0a225c',
        },
        contrast: {
          bg: '#05070c',
          card: '#0d131f',
          border: '#1f2a3e',
          text: '#ffffff',
          accent: '#00e5ff',
          warning: '#ffd600',
          success: '#00e676',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
      },
      minHeight: {
        'touch': '48px',
      },
      minWidth: {
        'touch': '48px',
      }
    },
  },
  plugins: [],
}
