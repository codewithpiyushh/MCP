/** @type {import('tailwindcss').Config} */
module.exports = {
  // NOTE: Update this to include the paths to all files that contain Nativewind classes.
  content: ["./App.tsx", "./components/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        primary: "#3b82f6",
        secondary: "#6b7280",
        light: {
          100: "#D1D5DB",
          200: "#f9fafb"
        },
        accent: "#10b981",
        
    },
  },
  plugins: [],
  }
}