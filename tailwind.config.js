/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      fontFamily: {
        "poppins": ["Poppins-Regular"],
        "poppins-medium": ["Poppins-Medium"],
        "poppins-semibold": ["Poppins-SemiBold"],
        "poppins-bold": ["Poppins-Bold"],
      },
      colors: {
        brand: {
          dark: "#1A3C34",      // deep forest green — primary text / icons
          DEFAULT: "#2D6A4F",   // main green — interactive elements
          mid: "#40916C",       // mid green — secondary icons
          light: "#74C69D",     // light green — accents / dividers
          subtle: "#D8F3DC",    // very light green — subtle backgrounds if ever needed
        },
        surface: {
          DEFAULT: "#F3F4EC",   // card background
          page: "#F6F6F6",      // screen background
        },
        text: {
          primary: "#1A1A1A",   // main body text
          secondary: "#6B6B6B", // subdued labels / captions
          muted: "#A0A0A0",     // placeholder / disabled text
        },
      },
    },
  },
  plugins: [],
};
