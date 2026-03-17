/**
 * Shared constants for grey palette shades.
 * Lightness values are now bezier-computed (see stepLightnessDistribution.ts).
 * Only shade labels remain as constants.
 */

/** Shade labels ordered dark → light (matches greySaturationSteps indices 1–11) */
export const GREY_SHADE_LABELS = ["950", "900", "800", "700", "600", "500", "400", "300", "200", "100", "50"] as const;
