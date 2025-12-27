/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        app: {
          bg: "var(--bg-main)",
          panel: "var(--bg-panel)",
          text: "var(--text-main)",
          "text-sub": "var(--text-secondary)",
          "text-mute": "var(--text-passive)",
          primary: "var(--color-primary)",
          "primary-hover": "var(--color-primary-hover)",
          nav: "var(--nav-bg)",
          border: "var(--divider)",
        },
      },
    },
  },
  plugins: [],
};
