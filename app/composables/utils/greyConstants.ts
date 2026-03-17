/**
 * Shared constants for grey palette shades.
 * Used by GeneratorSwatches.vue (swatch display) and useCssVariables.ts (CSS variable updates).
 */

/** Shade labels ordered dark → light (matches greySaturationSteps indices 1–11) */
export const GREY_SHADE_LABELS = ["950", "900", "800", "700", "600", "500", "400", "300", "200", "100", "50"] as const;

/**
 * Fixed lightness values for grey shades (from Tailwind's grey palette, shades 950→50).
 * These are the final values — not dynamically overwritten.
 * Also hardcoded as CSS defaults in main.css.
 */
export const GREY_LIGHTNESS_STEPS = [4.17, 11.08, 16.86, 26.86, 34.31, 46.27, 64.31, 83.92, 90.98, 95.88, 98.12];

/** Fixed lightness values for neutral shades (pure achromatic, from Tailwind's neutral palette) */
export const NEUTRAL_LIGHTNESS_STEPS = [3.94, 9.02, 14.9, 25.1, 32.16, 45.1, 63, 83.14, 89.8, 96.08, 98.04];
