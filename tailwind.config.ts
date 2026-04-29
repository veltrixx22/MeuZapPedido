import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        charcoal: "#0f0f10",
        panel: "#1f1f22",
        mutedpanel: "#171719",
        ember: "#ef4444",
        orangefire: "#f97316"
      },
      boxShadow: {
        glow: "0 18px 70px rgba(239, 68, 68, 0.18)"
      }
    }
  },
  plugins: []
};

export default config;
