/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./App.{js,jsx,ts,tsx}",
    "./src/components/**/*.{js,jsx,ts,tsx}", 
    "./src/screens/**/*.{js,jsx,ts,tsx}",
    "./global.css" 
  ],
  presets: [require("nativewind/preset")], 
  theme: {
    extend: {}, 
  },
  plugins: [], 
};