/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./App.{js,jsx,ts,tsx}",
    "./pastaBolada/components/**/*.{js,jsx,ts,tsx}", 
    "./pastaBolada/screens/**/*.{js,jsx,ts,tsx}",
    "./global.css" 
  ],
  presets: [require("nativewind/preset")], 
  theme: {
    extend: {}, 
  },
  plugins: [], 
};