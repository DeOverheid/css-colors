/**
 * Hue Row Color Math
 * Pure functions for calculating hue offsets, adjusted lightness, and adjusted saturation
 * for individual hue spectrum rows.
 */

/**
 * Calculate the hue for a specific step index.
 * Blends from darkOffset (dark side) to lightOffset (light side).
 */
export function getHueForStep(
    index: number,
    totalSteps: number,
    baseHue: number,
    darkOffset: number,
    lightOffset: number
): number {
    const blendFactor = totalSteps > 1
        ? index / (totalSteps - 1)
        : 0.5;

    const offset = darkOffset + (lightOffset - darkOffset) * blendFactor;

    let hue = baseHue + offset;
    while (hue < 0) hue += 360;
    while (hue >= 360) hue -= 360;

    return hue;
}

/**
 * Format an offset value for display (e.g. "+5°", "-3°", "0°")
 */
export function formatOffset(value: number): string {
    const rounded = Math.round(value);
    if (rounded > 0) return `+${rounded}°`;
    if (rounded < 0) return `${rounded}°`;
    return "0°";
}

/**
 * Adjust lightness based on:
 * 1. Entry's lightnessOffset (per-color adjustment, scaled by distance from extremes)
 * 2. Hue-based lightness compensation via applyAdjustment callback
 */
export function getAdjustedLightness(
    lightness: number,
    index: number,
    totalSteps: number,
    lightnessOffset: number,
    hue: number,
    applyAdjustment: (lightness: number, hue: number, index: number, total: number) => number
): number {
    let adjusted = lightness;

    if (lightnessOffset !== 0) {
        // Scale offset based on distance from extremes (0 and 100)
        // Maximum effect at lightness 50, tapering to 0 at extremes
        const distanceFromExtreme = Math.min(lightness, 100 - lightness) / 50;
        const multiplier = 1 + (lightnessOffset / 100) * distanceFromExtreme;
        adjusted = Math.max(0, Math.min(100, adjusted * multiplier));
    }

    return applyAdjustment(adjusted, hue, index, totalSteps);
}

/**
 * Adjust saturation based on per-color dark/light offsets.
 * Interpolates from darkOffset (index 0) to lightOffset (last index).
 * Offsets are relative: +6 means 6% more saturated, -19 means 19% less saturated.
 */
export function getAdjustedSaturation(
    index: number,
    totalSteps: number,
    baseSaturation: number,
    saturationDarkOffset: number,
    saturationLightOffset: number
): number {
    if (saturationLightOffset === 0 && saturationDarkOffset === 0) return baseSaturation;

    const blendFactor = totalSteps > 1
        ? index / (totalSteps - 1)
        : 0.5;

    const offsetPercent = saturationDarkOffset + (saturationLightOffset - saturationDarkOffset) * blendFactor;
    const multiplier = 1 + offsetPercent / 100;

    return Math.max(0, Math.min(100, baseSaturation * multiplier));
}
