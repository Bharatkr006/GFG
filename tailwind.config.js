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
        gfg: {
          dark: '#080D0D',
          panel: '#090E0E',
          editor: '#111111',
          toolbar: '#242424',
          card: '#252525',
          border: '#333333',
          borderLight: '#444444',
          green: '#2F914B',
          greenActive: '#2BA84A',
          drawerActive: '#203F50',
          text: '#F1F1F1',
          secondary: '#A0A0A0',
          muted: '#8A8A8A',
        }
      },
      fontFamily: {
        sans: ['Inter', 'Arial', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
        mono: ['Fira Code', 'JetBrains Mono', 'Consolas', 'Monaco', 'Courier New', 'monospace'],
      }
    },
  },
  plugins: [],
}
