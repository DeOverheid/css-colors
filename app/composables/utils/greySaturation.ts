/**
 * Grey saturation distribution — bezier-curved ramp from min (white) to max (black).
 *
 * Uses cubic-bezier(0.80, 0.00, 0.50, 1.00) to shape the distribution:
 * stays low through mids, ramps steeply in darks.
 * Both min and max scale linearly with the saturation slider (0–100).
 *
 * When slider = 100 → darkest = 25%, lightest = 3%
 * When slider = 0   → all = 0%
 */
import { getBezierY } from "~/composables/utils/bezierCurve";

/** Saturation at the darkest swatch when slider = 100 */
const MAX_SATURATION = 25;
/** Saturation at the lightest swatch when slider = 100 */
const MIN_SATURATION = 3;

/**
 * Generate saturation values using a bezier curve (dark → light),
 * scaled by the user's saturation slider (0–100).
 *
 * Index 0 = black (highest saturation), last index = white (lowest saturation).
 * Curve: cubic-bezier(0.80, 0.00, 0.50, 1.00) — flat in mids, steep in darks.
 *
 * Output range: MIN_SATURATION → MAX_SATURATION, both scaled by slider.
 * At slider 100: 3% (lightest) → 25% (darkest).
 * At slider 0: 0% → 0%.
 *
 * @param sliderValue - The saturation slider value (0–100)
 * @param totalSteps - Total number of steps including endpoints (default 13)
 * @returns Array of totalSteps saturation percentages
 */
export function greySaturationSteps(sliderValue: number, totalSteps = 13): number[] {
    const fraction = sliderValue / 100;
    const max = fraction * MAX_SATURATION;
    const min = fraction * MIN_SATURATION;
    return Array.from({ length: totalSteps }, (_, i) => {
        // t: 1 at darkest (i=0), 0 at lightest (i=last)
        const t = 1 - i / (totalSteps - 1);
        const curved = getBezierY(t, 0.80, 0.00, 0.50, 1.00);
        return Math.round((min + curved * (max - min)) * 100) / 100;
    });
}
