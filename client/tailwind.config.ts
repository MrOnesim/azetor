import type { Config } from 'tailwindcss'

export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        bg: {
          primary: '#080808',
          secondary: '#111111',
          card: '#161616',
          hover: '#1a1a1a',
        },
        border: '#222222',
        red: {
          accent: '#C0392B',
          hover: '#E74C3C',
        },
        text: {
          primary: '#FFFFFF',
          muted: '#999999',
        },
      },
      fontFamily: {
        bebas: ['"Bebas Neue"', 'cursive'],
        playfair: ['"Playfair Display"', 'serif'],
      },
    },
  },
  plugins: [],
} satisfies Config
