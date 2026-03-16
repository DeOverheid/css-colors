/**
 * Grey saturation distribution — linear ramp from 0% (white) to max (black).
 *
 * Generates a 13-value saturation array where saturation increases linearly
 * from the lightest swatch to the darkest. The max value is controlled by
 * the saturation slider (0–100).
 *
 * When slider = 100 → darkest swatch = 100% saturation, lightest = 0%
 * When slider = 50  → darkest = 50%, lightest = 0%
 * When slider = 0   → all = 0%
 */

/** Number of swatches in our grid */
const TOTAL_STEPS = 13;

/**
 * Generate 13 saturation values as a linear ramp (dark → light),
 * scaled by the user's saturation slider (0–100).
 *
 * Index 0 = black (highest saturation), index 12 = white (0% saturation).
 *
 * @param sliderValue - The saturation slider value (0–100)
 * @returns Array of 13 saturation percentages
 */
export function greySaturationSteps(sliderValue: number): number[] {
    const max = sliderValue;
    return Array.from({ length: TOTAL_STEPS }, (_, i) => {
        // i=0 is darkest (full saturation), i=12 is lightest (zero)
        const t = 1 - i / (TOTAL_STEPS - 1);
        return Math.round(t * max * 100) / 100;
    });
}
