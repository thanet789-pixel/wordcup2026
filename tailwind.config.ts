import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        navy: {
          DEFAULT: "#070B14",
          light: "#0D1424",
          card: "#111827",
        },
        neon: {
          DEFAULT: "#00D4FF",
          dim: "#00D4FF33",
        },
        gold: {
          DEFAULT: "#F8C14A",
          dim: "#F8C14A33",
        },
        live: {
          DEFAULT: "#FF3B30",
          dim: "#FF3B3033",
        },
        glass: {
          DEFAULT: "rgba(255,255,255,0.05)",
          border: "rgba(255,255,255,0.1)",
        },
      },
      borderRadius: {
        card: "16px",
      },
      fontFamily: {
        heading: ["var(--font-bebas)", "sans-serif"],
        body: ["var(--font-inter)", "sans-serif"],
      },
      boxShadow: {
        neon: "0 0 20px rgba(0, 212, 255, 0.3)",
        gold: "0 0 20px rgba(248, 193, 74, 0.3)",
        live: "0 0 20px rgba(255, 59, 48, 0.4)",
        glass: "0 8px 32px rgba(0, 0, 0, 0.4)",
      },
      backgroundImage: {
        "stadium-gradient":
          "radial-gradient(ellipse at top, rgba(0,212,255,0.15) 0%, transparent 50%), radial-gradient(ellipse at bottom, rgba(248,193,74,0.08) 0%, transparent 50%)",
        "hero-gradient":
          "linear-gradient(180deg, rgba(7,11,20,0.3) 0%, rgba(7,11,20,0.95) 100%)",
      },
      animation: {
        "pulse-live": "pulse-live 2s ease-in-out infinite",
        glow: "glow 2s ease-in-out infinite alternate",
        "goal-flash": "goal-flash 0.6s ease-out",
      },
      keyframes: {
        "pulse-live": {
          "0%, 100%": { opacity: "1", transform: "scale(1)" },
          "50%": { opacity: "0.7", transform: "scale(1.05)" },
        },
        glow: {
          "0%": { boxShadow: "0 0 5px rgba(0,212,255,0.2)" },
          "100%": { boxShadow: "0 0 25px rgba(0,212,255,0.5)" },
        },
        "goal-flash": {
          "0%": { backgroundColor: "rgba(248,193,74,0.4)" },
          "100%": { backgroundColor: "transparent" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
