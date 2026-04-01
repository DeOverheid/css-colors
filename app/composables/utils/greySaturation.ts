/**
 * Grey saturation distribution — bezier-curved ramp from min (white) to max (black).
 *
 * Uses cubic-bezier(0.80, 0.00, 0.50, 1.00) to shape the distribution:
 * stays low through mids, ramps steeply in darks.
 * Both min and max scale linearly with the saturation slider (0–100).
 */
import { getBezierY } from "~/composables/utils/bezierCurve";

/** Default saturation bounds (used when theme doesn't specify) */
const DEFAULT_MAX_SATURATION = 25;
const DEFAULT_MIN_SATURATION = 3;

/**
 * Generate saturation values using a bezier curve (dark → light),
 * scaled by the user's saturation slider (0–100).
 *
 * @param sliderValue - The saturation slider value (0–100)
 * @param totalSteps - Total number of steps including endpoints
 * @param maxSaturation - Saturation at darkest swatch when slider = 100
 * @param minSaturation - Saturation at lightest swatch when slider = 100
 * @returns Array of totalSteps saturation percentages
 */
export function greySaturationSteps(
    sliderValue: number,
    totalSteps: number,
    maxSaturation = DEFAULT_MAX_SATURATION,
    minSaturation = DEFAULT_MIN_SATURATION
): number[] {
    const fraction = sliderValue / 100;
    const max = fraction * maxSaturation;
    const min = fraction * minSaturation;
    return Array.from({ length: totalSteps }, (_, i) => {
        // t: 1 at darkest (i=0), 0 at lightest (i=last)
        const t = 1 - i / (totalSteps - 1);
        const curved = getBezierY(t, 0.80, 0.00, 0.50, 1.00);
        return Math.round((min + curved * (max - min)) * 100) / 100;
    });
}
