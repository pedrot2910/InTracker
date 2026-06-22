/** @type {import('tailwindcss').Config} */

const values = Array.from({ length: 101 }, (_, i) => i + "px");
const safelist = [];

// padding
["p", "pl", "pr", "pt", "pb", "px", "py"].forEach((prefix) => {
  values.forEach((v) => safelist.push(`${prefix}-[${v}]`));
});

// margin
["m", "ml", "mr", "mt", "mb"].forEach((prefix) => {
  values.forEach((v) => safelist.push(`${prefix}-[${v}]`));
});

module.exports = {
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {},
  },
  safelist: safelist,
  plugins: [],
};
