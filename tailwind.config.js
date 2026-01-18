/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "class",
  content: ["./App.{js,jsx,ts,tsx}", "./src/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        // ==========================================
        // Semantic Theme Colors
        // Change these values to update the entire app theme
        // ==========================================

        // Backgrounds
        background: {
          DEFAULT: "#1e293b", // Main app background (slate-800)
          secondary: "#0f172a", // Darker sections (slate-900)
        },
        surface: {
          DEFAULT: "#334155", // Cards, inputs, sidebar (slate-700)
          hover: "#475569", // Hover state (slate-600)
          active: "#3b4a61", // Active/pressed state
        },
        border: {
          DEFAULT: "#475569", // Default borders (slate-600)
          muted: "#334155", // Subtle borders (slate-700)
        },

        // Text
        text: {
          DEFAULT: "#ffffff", // Primary text (white)
          secondary: "#94a3b8", // Secondary text (slate-400)
          muted: "#64748b", // Muted/placeholder text (slate-500)
          inverse: "#0f172a", // Text on light backgrounds
        },

        // Brand / Accent
        primary: {
          DEFAULT: "#3B82F6", // Primary blue
          light: "#60A5FA", // Lighter blue for hover/accents
          muted: "rgba(59, 130, 246, 0.2)", // For subtle highlights
        },

        // Semantic / Status
        success: "#22C55E",
        warning: "#F59E0B",
        error: "#EF4444",
        info: "#3B82F6",

        // ==========================================
        // Legacy colors (keep for backwards compatibility)
        // ==========================================
        navy: {
          DEFAULT: "#0A1628",
          light: "#1A2A44",
          dark: "#050d18",
        },
        blue: {
          DEFAULT: "#3B82F6",
          light: "#60A5FA",
        },
        gray: {
          100: "#F3F4F6",
          300: "#D1D5DB",
          400: "#94a3b8",
          500: "#64748b",
          600: "#475569",
          700: "#334155",
          800: "#1e293b",
          900: "#0f172a",
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
