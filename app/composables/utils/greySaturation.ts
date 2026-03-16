/**
 * Grey saturation distribution following Tailwind CSS v4's "gray" palette.
 *
 * TW greys have higher saturation in dark shades, lower in mid-tones,
 * and slightly elevated again in the lightest shades.
 *
 * This utility generates a 13-value saturation array (matching our 13-step grid)
 * that follows TW's actual saturation values, scaled by the slider (0–100).
 *
 * When slider = 100 → values match TW gray exactly (e.g. 10.3% at shade 500, 72.2% at 950)
 * When slider = 50  → half TW values
 * When slider = 0   → all saturations = 0%
 */

/**
 * TW v4 "gray" saturation values per shade (dark → light).
 * 13 entries: [black, 950, 900, 800, 700, 600, 500, 400, 300, 200, 100, 50, white]
 * Black endpoint extrapolated from 950; white is always 0.
 */
const TW_GRAY_SATURATIONS = [
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

/**
 * Generate 13 saturation values following TW's grey distribution,
 * scaled by the user's saturation slider (0–100).
 *
 * @param sliderValue - The saturation slider value (0–100)
 * @returns Array of 13 saturation percentages
 */
export function greySaturationSteps(sliderValue: number): number[] {
    const factor = sliderValue / 100;
    return TW_GRAY_SATURATIONS.map(s => Math.round(s * factor * 100) / 100);
}
