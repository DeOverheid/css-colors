/**
 * Grey saturation distribution following Tailwind CSS v4's "gray" palette.
 *
 * TW greys have higher saturation in dark shades, lower in mid-tones,
 * and slightly elevated again in the lightest shades.
 *
 * This utility generates a 13-value saturation array (matching our 13-step grid)
 * that follows TW's distribution shape, scaled by a slider factor (0–100).
 *
 * When slider = 100 → peak saturation = MAX_GREY_SATURATION (20%)
 * When slider = 0   → all saturations = 0%
 */

/** Peak grey saturation when the saturation slider is at 100% */
const MAX_GREY_SATURATION = 20;

/**
 * Raw TW v4 "gray" saturation values per shade (dark → light).
 * 13 entries: [black, 950, 900, 800, 700, 600, 500, 400, 300, 200, 100, 50, white]
 * Black endpoint extrapolated from 950; white is always 0.
 */
const RAW_SATURATIONS = [
    72.2,  // black (extrapolated = same as 950)
    72.2,  // 950
    41.7,  // 900
    31.0,  // 800
    21.1,  // 700
    15.7,  // 600
    10.3,  // 500
    11.9,  // 400
    13.1,  // 300
    13.6,  // 200
    15.0,  // 100
    24.2,  // 50
    0      // white
];

/** Normalized weights: RAW / max, so peak = 1.0 */
const peakRaw = Math.max(...RAW_SATURATIONS);
const WEIGHTS = RAW_SATURATIONS.map(s => s / peakRaw);

/**
 * Generate 13 saturation values following TW's grey distribution,
 * scaled by the user's saturation slider (0–100).
 *
 * @param sliderValue - The saturation slider value (0–100)
 * @returns Array of 13 saturation percentages (0–20)
 */
export function greySaturationSteps(sliderValue: number): number[] {
    const factor = (sliderValue / 100) * MAX_GREY_SATURATION;
    return WEIGHTS.map(w => Math.round(w * factor * 100) / 100);
}
