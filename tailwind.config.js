/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "class",
  content: ["./App.{js,jsx,ts,tsx}", "./src/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        // ==========================================
        // Premium Dark Theme - Semantic Colors
        // ==========================================

        // Backgrounds - Rich dark with blue undertones
        background: {
          DEFAULT: "#0a0f1a", // Deep navy black
          secondary: "#050810", // Even darker for contrast
        },
        surface: {
          DEFAULT: "rgba(255, 255, 255, 0.05)", // Glass effect
          hover: "rgba(255, 255, 255, 0.08)",
          active: "rgba(255, 255, 255, 0.12)",
          solid: "#151f32", // Solid surface for cards
          elevated: "#1a2540", // Elevated elements
        },
        border: {
          DEFAULT: "rgba(255, 255, 255, 0.1)", // Subtle glass border
          muted: "rgba(255, 255, 255, 0.05)",
          accent: "rgba(99, 179, 237, 0.3)", // Accent border
        },

        // Text - Clean hierarchy
        text: {
          DEFAULT: "#ffffff", // Pure white for primary
          secondary: "#a0aec0", // Soft gray
          muted: "#718096", // Muted gray
          inverse: "#0a0f1a", // Text on light backgrounds
        },

        // Brand / Accent - Vibrant blue
        primary: {
          DEFAULT: "#4299e1", // Bright sky blue
          light: "#63b3ed", // Lighter accent
          dark: "#2b6cb0", // Darker shade
          muted: "rgba(66, 153, 225, 0.15)", // Subtle highlights
        },

        // Accent colors
        accent: {
          purple: "#9f7aea",
          pink: "#ed64a6",
          cyan: "#0bc5ea",
          orange: "#ed8936",
        },

        // Semantic / Status
        success: "#48bb78",
        warning: "#ecc94b",
        error: "#fc8181",
        info: "#4299e1",

        // ==========================================
        // Legacy colors (backwards compatibility)
        // ==========================================
        navy: {
          DEFAULT: "#0A1628",
          light: "#1A2A44",
          dark: "#050d18",
        },
        blue: {
          DEFAULT: "#4299e1",
          light: "#63b3ed",
        },
        gray: {
          100: "#F3F4F6",
          300: "#D1D5DB",
          400: "#a0aec0",
          500: "#718096",
          600: "#4a5568",
          700: "#2d3748",
          800: "#1a202c",
          900: "#171923",
        },
      },
      fontFamily: {
        sans: ["System"],
      },
      spacing: {
        xs: "4px",
        sm: "8px",
        md: "16px",
        lg: "24px",
        xl: "32px",
        "2xl": "48px",
      },
      borderRadius: {
        card: "12px",
        button: "10px",
        badge: "6px",
      },
    },
  },
  plugins: [],
};
