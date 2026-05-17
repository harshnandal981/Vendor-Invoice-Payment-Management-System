/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        ink: '#0f1115',
        'ink-muted': '#171a1f',
        gold: '#c9a227',
        sand: '#f7f6f2',
        line: '#e6e1d7',
        canvas: '#f7f6f2',
      },
      boxShadow: {
        soft: '0 20px 40px -30px rgba(15, 17, 21, 0.35)',
      },
      fontFamily: {
        display: ['Sora', 'Segoe UI', 'sans-serif'],
        body: ['Manrope', 'Segoe UI', 'sans-serif'],
      },
    },
  },
  plugins: [],
}

