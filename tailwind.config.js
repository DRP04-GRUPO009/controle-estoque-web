/** @type {import('tailwindcss').Config} */

// eslint-disable-next-line @typescript-eslint/no-var-requires, no-undef
const withMT = require("@material-tailwind/react/utils/withMT");

export default withMT({
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#1C2434',
        secondary: '#F1F5F9',
        info: '#3C50E0',
        danger: '#F87171',
        success: '#34D399',
        alert: '#FFDB9B'
      }
    },
  },
  plugins: [],
});