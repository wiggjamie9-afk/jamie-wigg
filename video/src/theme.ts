/**
 * RHYTHMIX design tokens for the Remotion pipeline.
 *
 * Source of truth: rhythmix-teaser-60s/DESIGN.md. Hex values are copied
 * verbatim so this file stays grep-traceable to the brand spec, and mirror
 * the --color-rhythmix-* custom properties declared in index.css.
 */

export const COLORS = {
  canvas: "#08050d",
  magenta: "#ff1f5a",
  purple: "#7c3aed",
  cyan: "#00d8ff",
  green: "#00e887",
  gold: "#f5c000",
  pink: "#ff6fc8",
  white: "#ffffff",
  muted: "#a0a0b0",
  card: "#1a1325",
} as const;

/**
 * Display face for headlines / wordmark / big numbers, mono for taglines and
 * numerals. The brand fonts lead; system faces trail so a render never blocks
 * on a missing font.
 */
export const FONTS = {
  display: '"Space Grotesk", system-ui, -apple-system, sans-serif',
  mono: '"JetBrains Mono", ui-monospace, "SFMono-Regular", monospace',
} as const;

/**
 * The equalizer accent ramp — cycled across bars and feature glyphs so the
 * whole piece reads as one spectrum rather than random colour.
 */
export const SPECTRUM = [
  COLORS.magenta,
  COLORS.purple,
  COLORS.cyan,
  COLORS.green,
  COLORS.gold,
  COLORS.pink,
] as const;

/** 30fps timeline; every scene length below is expressed in frames. */
export const FPS = 30;

/** Scene lengths in frames. Overlaps are handled by the crossfade wrapper. */
export const SCENE_FRAMES = {
  intro: 100,
  wordmark: 100,
  stats: 100,
  cta: 90,
} as const;

/** Frames of overlap between adjacent scenes — the crossfade IS the exit. */
export const CROSSFADE = 20;
