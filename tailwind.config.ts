
import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "#0F1115",
        foreground: "#FFFFFF",
        primary: {
          DEFAULT: "#1E88E5", // Blue shade for primary actions
          foreground: "#FFFFFF",
        },
        secondary: {
          DEFAULT: "#E6E4DD",
          foreground: "#141413",
        },
        accent: {
          DEFAULT: "#7C3AED", // Purple shade for accents
          foreground: "#FFFFFF",
        },
        muted: {
          DEFAULT: "#828179",
          foreground: "#FAFAF8",
        },
        card: {
          DEFAULT: "#1A1D24", // Dark card background
          foreground: "#FFFFFF",
        },
        success: {
          DEFAULT: "#10B981", // Green for success states
          foreground: "#FFFFFF",
        },
        warning: {
          DEFAULT: "#F59E0B", // Amber for warnings
          foreground: "#FFFFFF",
        },
        error: {
          DEFAULT: "#EF4444", // Red for errors
          foreground: "#FFFFFF",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-10px)" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        float: "float 6s ease-in-out infinite",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;
