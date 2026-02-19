import animate from "tailwindcss-animate";

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
      },
      colors: {
        card: "#0f172a",
        "card-foreground": "#e2e8f0",
        "muted-foreground": "#94a3b8",
      },
    },
  },
  plugins: [
    animate,
  ],
}
