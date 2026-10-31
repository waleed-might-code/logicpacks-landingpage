/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      // Black, white and greys only. Sampled from the reference layout.
      colors: {
        page: '#181818',
        panel: '#1b1b1b',
        raised: '#1e1e1e',
        line: '#2c2c2c',
        ink: '#ececea',
        muted: '#a3a3a1',
        faint: '#6f6f6d',
      },
      maxWidth: {
        site: '1280px',
      },
    },
  },
  plugins: [],
};
