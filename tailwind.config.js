/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx,mdx}", // Incluye todo tu src
  ],
  theme: {
    extend: {
      colors: {
        blueviolet: '#6556FF',
        semiblueviolet: 'rgba(101, 86, 255, 0.15)',
        midnightblue: '#222C44',
        kellygreen: "#43C639",
        charcoal: "#2D2F30",
        cornflowerblue: "#699BF7",
        paleblue: '#D5EFFA',
        ultramarine: '#1A21BC',
        slategray: '#57595F',
        lightkblue: '#F6FAFF',
        grey500: '#ECECEC',
        red: '#B40000',
        gold: '#FFB900',
        darkgray: 'rgba(54, 54, 54, 0.75)',
        darkbrown: '#352E2E',
        lightgray: '#A3A7AD',
        gunmetalgray: '#363636',
        'gray-blue': 'rgba(105, 120, 131, 0.16)',
        'dark-red': 'rgba(44, 9, 11, 0.8)',
      },
      fontSize: {
        '55xl': ['55px', { lineHeight: '1' }],
        '22xl': ['22px', { lineHeight: '1' }],
      },
    },
  },
  plugins: [],
}
