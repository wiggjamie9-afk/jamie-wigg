/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'sunny-brown': '#654321',
        'sunny-gold': '#D4A574',
        'sunny-sky': '#1a3a52',
      },
      fontFamily: {
        'display': ['system-ui', 'sans-serif'],
        'body': ['system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
