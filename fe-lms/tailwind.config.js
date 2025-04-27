/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}", // Penting: supaya Tailwind detect TSX/TS
  ],
  theme: {
    extend: {},
  },
  plugins: [],
};
