/**
 * Lightness Falloff Utility
 * Computes a strength factor (0–1) based on a swatch's lightness value.
 * Effect is strongest at the dark end (lightness 0) and tapers toward
 * the light end (lightness 100).
 *
 * The falloff slider controls how aggressive the taper is:
 *   0 = uniform effect across all lightness values (no falloff)
 *   100 = full linear taper (100% at L=0, 0% at L=100)
 *
 * The curve parameter bends the linear taper:
 *   curve < 1 = effect lingers longer on dark swatches (concave, more effect)
 *   curve = 1 = linear
 *   curve > 1 = effect drops off faster from dark end (convex, less effect)
 */

/**
 * Compute a strength factor (0–1) based on the swatch's lightness.
 *
 * @param lightness - The swatch's base lightness (0–100)
 * @param falloffPercent - How much falloff to apply (0–100).
 *   0 = uniform, all swatches get full strength.
 *   100 = full taper from dark (1.0) to light (0.0).
 * @param curve - Shape of the falloff curve (default 1.0 = linear).
 *   < 1 = concave (effect stays stronger longer into light swatches)
 *   > 1 = convex (effect drops off faster, concentrated on dark swatches)
 * @returns Strength factor from 0.0 (no effect) to 1.0 (full effect)
 */
export function computeLightnessFalloffFactor(
    lightness: number,
    falloffPercent: number,
    curve: number = 1.0
): number {
    // Clamp inputs
    const l = Math.max(0, Math.min(100, lightness));
    const falloff = Math.max(0, Math.min(100, falloffPercent)) / 100;
    const c = Math.max(0.1, curve);

    if (falloff <= 0) return 1;

    // Normalized position: 0 = black, 1 = white
    const normalizedL = l / 100;

    // Linear base: 1.0 at black, 0.0 at white
    // Apply curve: pow bends the line
    const linearFactor = 1 - normalizedL;
    const curvedFactor = Math.pow(linearFactor, c);

    // Blend between uniform (1.0) and curved falloff based on falloff %
    return 1 - falloff * (1 - curvedFactor);
}
