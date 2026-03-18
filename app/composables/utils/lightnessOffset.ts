/**
 * Uniform Lightness Offset
 *
 * Pure functions for applying a uniform dark/light offset to bezier-distributed
 * lightness values. Both offsets use a tapering effect so they have maximum
 * impact at mid-lightness and zero impact at the extremes (0 and 100).
 *
 * Dark offset: subtracts lightness (pushes swatches darker)
 * Light offset: adds lightness (pushes swatches lighter)
 *
 * This runs on top of the bezier distribution — it provides adjustments
 * the bezier curve alone cannot achieve.
 */

/**
 * Apply uniform dark and light lightness offsets to a single lightness value.
 *
 * The taper ensures no effect at L=0 or L=100, with maximum effect at L=50.
 * Dark offset darkens (subtracts), light offset brightens (adds).
 *
 * @param lightness - Base lightness from bezier distribution (0–100)
 * @param darkOffset - How much to darken (0 = none, 100 = maximum)
 * @param lightOffset - How much to lighten (0 = none, 100 = maximum)
 * @returns Adjusted lightness (0–100)
 */
export function applyUniformLightnessOffset(
    lightness: number,
    darkOffset: number,
    lightOffset: number
): number {
    if (darkOffset === 0 && lightOffset === 0) return lightness;

    // Taper: 0 at extremes (0 or 100), 1 at midpoint (50)
    const taper = Math.min(lightness, 100 - lightness) / 50;

    // Scale offsets: slider 0–100 maps to 0–30 lightness points max effect
    const MAX_EFFECT = 30;
    const darkDelta = -(darkOffset / 100) * MAX_EFFECT * taper;
    const lightDelta = (lightOffset / 100) * MAX_EFFECT * taper;

    return Math.max(0, Math.min(100, lightness + darkDelta + lightDelta));
}
