/**
 * Lightness Squeeze
 *
 * Squeezes the X-axis input to the bezier curve, narrowing the range
 * of the curve that gets sampled. This produces a tighter lightness
 * distribution without changing the curve shape.
 *
 * Dark squeeze: shifts X start away from 0 — darkest swatch gets a brighter result
 * Light squeeze: shifts X end away from 1 — lightest swatch gets a darker result
 *
 * Slider 0 = no squeeze, 100 = max squeeze (0.5 of the bezier X range).
 */

/** Maximum X-axis squeeze per side when slider is at 100 */
const MAX_SQUEEZE = 0.5;

/**
 * Remap an X value (0–1) into a squeezed sub-range of the bezier X-axis.
 *
 * @param x - Original evenly-spaced X value (0–1)
 * @param darkSqueeze - How much to squeeze the dark end (0 = none, 0.5 = max)
 * @param lightSqueeze - How much to squeeze the light end (0 = none, 0.5 = max)
 * @returns Squeezed X value still in 0–1 range
 */
export function squeezeX(x: number, darkSqueeze: number, lightSqueeze: number): number {
    if (darkSqueeze === 0 && lightSqueeze === 0) return x;

    // Clamp so total squeeze never exceeds 1.0
    const totalSqueeze = Math.min(darkSqueeze + lightSqueeze, 0.99);
    const dSq = darkSqueeze * (totalSqueeze / (darkSqueeze + lightSqueeze || 1));
    const lSq = lightSqueeze * (totalSqueeze / (darkSqueeze + lightSqueeze || 1));

    return dSq + x * (1 - dSq - lSq);
}

/**
 * Convert a slider value (0–100) to a squeeze factor (0–MAX_SQUEEZE).
 */
export function sliderToSqueeze(sliderValue: number): number {
    return (sliderValue / 100) * MAX_SQUEEZE;
}
