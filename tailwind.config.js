/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{js,jsx,ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        navy: {
          900: '#0A1219',
          800: '#0F1923',
          700: '#162230',
          600: '#1A2B3D',
        },
        gold: {
          DEFAULT: '#D4AF37',
          dark: '#B08D2A',
          mid: '#C9A227',
        },
      },
      fontFamily: {
        serif: ['Lora', 'Georgia', 'Times New Roman', 'serif'],
        display: ['Playfair Display', 'Georgia', 'serif'],
      },
    },
  },
  plugins: [],
}
