/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx}"],
  mode: "jit",
  theme: {
    extend: {
      colors: {
        transparent: 'transparent',
        current: 'currentColor',
        'input': '#EFEFEF',
        'primary':'  #6149CD',
        'secondary': '#F8F8FF',
        'navcolor' : '#0A1629'
        
       
      },
      fontFamily: {
        head: ['Montserrat', 'sans-serif'],
        body: ['DM Sans', 'sans-serif'],
      },
    },
    screens: {
      xs: "480px",
      ss: "620px",
      sm: "768px",
      md: "1060px",
      lg: "1200px",
      xl: "1700px",
    },
  },
  plugins: [],
};
