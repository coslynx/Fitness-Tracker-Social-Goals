/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        "brand-primary": "#007bff",
        "brand-secondary": "#6c757d",
        "brand-success": "#28a745",
        "brand-danger": "#dc3545",
        "brand-warning": "#ffc107",
        "brand-info": "#17a2b8",
      },
      fontFamily: {
        "sans": ["Roboto", "sans-serif"],
        "serif": ["Merriweather", "serif"],
      },
      fontSize: {
        "xxs": "0.625rem",
        "xs": "0.75rem",
        "sm": "0.875rem",
        "base": "1rem",
        "lg": "1.125rem",
        "xl": "1.25rem",
        "2xl": "1.5rem",
        "3xl": "1.875rem",
        "4xl": "2.25rem",
        "5xl": "3rem",
        "6xl": "4rem",
        "7xl": "5rem",
      },
    },
  },
  plugins: [],
};