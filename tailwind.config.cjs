/** @type {import('tailwindcss').Config} */
module.exports = {
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
      },
      boxShadow: {
        '3xl': '0 35px 60px -15px rgba(0, 0, 0, 0.3)',

        'pure-black': '-1px 2px 5px rgba(81, 41, 10, 0.15), 0px 1px 1px rgba(81, 41, 10, 0.15)',
      },


      animation: {
        enter: 'enter 200ms ease-out',
        'slide-in': 'slide-in 1.2s cubic-bezier(.41,.73,.51,1.02)',
        leave: 'leave 150ms ease-in forwards',
      },
      keyframes: {
        enter: {
          '0%': {transform: 'scale(0.9)', opacity: 0},
          '100%': {transform: 'scale(1)', opacity: 1},
        },
        leave: {
          '0%': {transform: 'scale(1)', opacity: 1},
          '100%': {transform: 'scale(0.9)', opacity: 0},
        },
        'slide-in': {
          '0%': {transform: 'translateY(-100%)'},
          '100%': {transform: 'translateY(0)'},
        },
      }


    },
  },
  plugins: [],
}

