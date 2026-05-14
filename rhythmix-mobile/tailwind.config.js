/** @type {import('tailwindcss').Config} */
const { hairlineWidth } = require('nativewind/theme');

module.exports = {
  content: ['./app/**/*.{js,jsx,ts,tsx}', './components/**/*.{js,jsx,ts,tsx}'],
  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      colors: {
        ink: {
          0: '#000000',
          50: '#0a0a0c',
          100: '#111114',
          200: '#1a1a1f',
          300: '#26262d',
          400: '#3d3d47',
          500: '#5a5a67',
          600: '#8a8a99',
          700: '#b5b5c2',
          800: '#dcdce4',
          900: '#f5f5f7',
        },
        accent: {
          DEFAULT: '#ff3d7f',
          glow: '#ff7ab0',
          deep: '#b30043',
        },
        signal: {
          cyan: '#5cf2ff',
          violet: '#9b6bff',
          amber: '#ffb547',
        },
      },
      fontFamily: {
        sans: ['Inter', 'System'],
        display: ['Cal Sans', 'Inter', 'System'],
        mono: ['JetBrains Mono', 'Menlo'],
      },
      borderWidth: {
        hairline: hairlineWidth(),
      },
      animation: {
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
    },
  },
  plugins: [],
};
