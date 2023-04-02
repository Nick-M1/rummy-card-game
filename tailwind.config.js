/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      height: {
        screen: ['100vh', '100dvh'],
      },
      width: {
        screen: ['100vw', '100dvw'],
      }
    },
  },
  plugins: [],
}

