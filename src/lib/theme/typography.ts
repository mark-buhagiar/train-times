/**
 * Typography tokens for the Train Times app
 * Based on styles.prd.md design system
 */
export const typography = {
  titleLarge: {
    fontSize: 28,
    fontWeight: "700" as const,
    lineHeight: 34,
  },
  title: {
    fontSize: 22,
    fontWeight: "600" as const,
    lineHeight: 28,
  },
  bodyLarge: {
    fontSize: 17,
    fontWeight: "400" as const,
    lineHeight: 22,
  },
  body: {
    fontSize: 15,
    fontWeight: "400" as const,
    lineHeight: 20,
  },
  caption: {
    fontSize: 13,
    fontWeight: "400" as const,
    lineHeight: 18,
  },
  captionSmall: {
    fontSize: 11,
    fontWeight: "500" as const,
    lineHeight: 14,
  },
} as const;

export type Typography = typeof typography;
