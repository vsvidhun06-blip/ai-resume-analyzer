/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        display: ["'DM Sans'", "sans-serif"],
        body: ["'DM Sans'", "system-ui", "sans-serif"],
      },
      colors: {
        ink: {
          50: "#f0f0f5",
          100: "#e0e0eb",
          200: "#c0c0d6",
          300: "#9191b8",
          400: "#6363a0",
          500: "#3f3f8e",
          600: "#2d2d7a",
          700: "#1f1f62",
          800: "#14144a",
          900: "#0a0a30",
          950: "#050518",
        },
        lime: {
          300: "#d4f55a",
          400: "#c8f135",
          500: "#b5e020",
        },
      },
      animation: {
        "fade-up": "fadeUp 0.5s ease forwards",
        "pulse-soft": "pulseSoft 2s ease-in-out infinite",
        shimmer: "shimmer 2s linear infinite",
      },
      keyframes: {
        fadeUp: {
          from: { opacity: "0", transform: "translateY(20px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        pulseSoft: {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.6" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
      },
    },
  },
  plugins: [],
};