// tailwind.config.js
const { fontFamily } = require("tailwindcss/defaultTheme");

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}", // Include all files in the `app/` directory
    "./pages/**/*.{js,ts,jsx,tsx,mdx}", // Include files from `pages/` directory (optional)
    "./components/**/*.{js,ts,jsx,tsx,mdx}", // Include files in `components/` directory
  ],
  theme: {
    extend: {
      colors: {
        background: "#f9fafb", // Example custom background color
        foreground: "#1f2937", // Example custom text color
      },
      fontFamily: {
        sans: ["var(--font-geist-sans)", ...fontFamily.sans],
        mono: ["var(--font-geist-mono)", ...fontFamily.mono],
      },
    },
  },
  plugins: [],
};
