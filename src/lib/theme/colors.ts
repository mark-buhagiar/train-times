/**
 * Color palette for the Train Times app
 * Premium dark theme with vibrant accents - designed to impress
 *
 * Usage:
 * - Tailwind classes: Use semantic names like `bg-background`, `bg-surface`, `text-primary`
 * - Inline styles: Import `theme` and use `theme.background`, `theme.surface.DEFAULT`, etc.
 */

// ==========================================
// Theme Definition - Premium Dark Mode
// ==========================================
export const theme = {
  // Backgrounds - Rich dark with blue undertones
  background: {
    DEFAULT: "#0a0f1a", // Deep navy black
    secondary: "#050810", // Even darker for contrast
    gradient: {
      start: "#0a0f1a",
      middle: "#0d1525",
      end: "#111b2e",
    },
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

  // Brand / Accent - Vibrant blue gradient
  primary: {
    DEFAULT: "#4299e1", // Bright sky blue
    light: "#63b3ed", // Lighter accent
    dark: "#2b6cb0", // Darker shade
    muted: "rgba(66, 153, 225, 0.15)", // Subtle highlights
    gradient: {
      start: "#4299e1",
      end: "#667eea", // Blue to indigo gradient
    },
  },

  // Accent colors for visual interest
  accent: {
    purple: "#9f7aea",
    pink: "#ed64a6",
    cyan: "#0bc5ea",
    orange: "#ed8936",
  },

  // Semantic / Status - Refined colors
  success: "#48bb78", // Soft green
  warning: "#ecc94b", // Warm yellow
  error: "#fc8181", // Soft red
  info: "#4299e1",

  // Special effects
  glow: {
    primary: "rgba(66, 153, 225, 0.4)",
    success: "rgba(72, 187, 120, 0.4)",
    error: "rgba(252, 129, 129, 0.4)",
  },
} as const;

// ==========================================
// Gradient definitions for LinearGradient
// ==========================================
export const gradients = {
  background: ["#0a0f1a", "#0d1525", "#111b2e"],
  card: ["rgba(255,255,255,0.08)", "rgba(255,255,255,0.03)"],
  primary: ["#4299e1", "#667eea"],
  sunset: ["#ed8936", "#ed64a6"],
  aurora: ["#48bb78", "#4299e1", "#9f7aea"],
} as const;

// ==========================================
// Legacy colors (for backwards compatibility)
// ==========================================
export const colors = {
  // Primary colors
  navy: {
    DEFAULT: "#0A1628",
    light: "#1A2A44",
  },
  blue: {
    DEFAULT: "#3B82F6",
    light: "#60A5FA",
  },

  // Semantic colors
  success: "#22C55E",
  warning: "#F59E0B",
  error: "#EF4444",
  info: "#3B82F6",

  // Neutral colors
  white: "#FFFFFF",
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
} as const;

export type Theme = typeof theme;
export type Colors = typeof colors;
