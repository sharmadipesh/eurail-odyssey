import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
        mono: ["var(--font-roboto-mono)", "ui-monospace", "monospace"],
      },
      fontSize: {
        10: "10px",
      },
      letterSpacing: {
        12: "12%",
      },
      colors: {
        // Text colors
        ink: {
          DEFAULT: "#1B2040",
          black: "#050505",
        },
        grey: {
          DEFAULT: "#F9F7F3",
        },
        // Brand (yellow) gradient stops
        brand: {
          white: "rgba(255, 249, 249, 0.01)",
          yellow: "rgba(255, 212, 0, 0.8)",
          amber: "rgba(255, 205, 27, 0.8)",
        },
        // Indigo gradient stops
        indigo: {
          deep: "#1C1B40",
          bright: "#4C4BB3",
        },
      },
      backgroundImage: {
        "brand-gradient":
          "linear-gradient(180deg, rgba(255, 249, 249, 0.01) 0%, rgba(255, 212, 0, 0.8) 50%, rgba(255, 205, 27, 0.8) 100%)",
        "indigo-gradient":
          "linear-gradient(180deg, #1C1B40 0%, #1C1B40 50%, #4C4BB3 100%)",
        // Horizontal overlay: opaque amber on the left, fading to transparent on the right
        "brand-overlay":
          "linear-gradient(to left, rgba(255, 249, 249, 0.01) 0%, rgba(255, 212, 0, 0.8) 50%, rgba(255, 205, 27, 0.8) 100%)",
      },
    },
  },
};

export default config;
