/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Noto Sans Lao", "sans-serif"],
        pops: ["Poppins", "cursive"],
      },
      colors: {
        avocab: {
          50: "#f3f8ed",
          100: "#e4efd8",
          200: "#cbe1b5",
          300: "#a9ce88",
          400: "#93be6e",
          500: "#6c9d45",
          600: "#527d33",
          700: "#41602b",
          800: "#364e26",
          900: "#304324",
          950: "#17240f",
        },
      },
      width: {
        100: "25rem", // Custom width class w-100 (400px)
        104: "26rem", // Custom width class w-104 (416px)
        112: "28rem", // Custom width class w-112 (448px)
        120: "30rem", // Custom width class w-120 (480px)
        128: "32rem", // Custom width class w-128 (512px)
        144: "36rem", // Custom width class w-144 (576px)
      },
    },
  },
  plugins: [],
};
