// Centralised cinematic palette + motion tokens.
// Kept in sync with tailwind.config.js so Skia/Reanimated code can use the same values.

export const palette = {
  ink: {
    0: '#000000',
    50: '#0a0a0c',
    100: '#111114',
    200: '#1a1a1f',
    300: '#26262d',
    400: '#3d3d47',
    500: '#5a5a67',
    600: '#8a8a99',
    700: '#b5b5c2',
    800: '#dcdce4',
    900: '#f5f5f7',
  },
  accent: { base: '#ff3d7f', glow: '#ff7ab0', deep: '#b30043' },
  signal: { cyan: '#5cf2ff', violet: '#9b6bff', amber: '#ffb547' },
} as const;

export const motion = {
  // cubic-bezier tokens, mirrored from rhythmix-teaser-60s/DESIGN.md
  ease: {
    standard: [0.4, 0, 0.2, 1] as const,
    decelerate: [0, 0, 0.2, 1] as const,
    accelerate: [0.4, 0, 1, 1] as const,
    cinematic: [0.16, 1, 0.3, 1] as const, // expo-out-quart, used for hero entrance
  },
  duration: {
    instant: 120,
    fast: 220,
    base: 360,
    slow: 600,
    cinematic: 1200,
  },
  spring: {
    soft: { damping: 22, stiffness: 180, mass: 1 },
    snappy: { damping: 14, stiffness: 220, mass: 0.9 },
    bouncy: { damping: 10, stiffness: 200, mass: 1 },
  },
} as const;

export type Palette = typeof palette;
export type Motion = typeof motion;
