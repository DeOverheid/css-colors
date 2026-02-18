import type { ThemeConfig } from "./types";

/**
 * Mathematical color palette theme
 * Uses simple sequential numbering: 0-8
 * Evenly distributed lightness values based on bezier curve
 */
export const mathematicalTheme: ThemeConfig = {
    id: "mathematical",
    name: "Mathematical",
    totalSteps: 9,
    // Descriptive labels from dark to light
    swatchLabels: ["Black", "Darkest", "Darker", "Dark", "Medium", "Light", "Lighter", "Lightest", "White"],
    bezier: {
        x1: 0.0,
        y1: 0.0,
        x2: 0.54,
        y2: 0.94
    },
    description: "Simple sequential numbering with visually even distributed lightness"
};

/**
 * Mathematical Color Hue Entry Configuration
 *
 * A simplified color palette using 30° hue intervals.
 * Each color has a base hue and hue offsets for light and dark shades.
 *
 * The hue offset allows colors to shift slightly warmer or cooler
 * at the extremes for a more natural appearance.
 */
export interface MathHueEntry {
    /** Display name of the color */
    name: string;
    /** Base hue (0-360) */
    baseHue: number;
    /** Hue offset for light shades, degrees */
    lightOffset: number;
    /** Hue offset for dark shades, degrees */
    darkOffset: number;
    /** Lightness offset as relative percentage (+10 = 10% brighter), optional */
    lightnessOffset?: number;
    /** Saturation shift for light shades as relative percentage (+6 = 6% more), optional */
    saturationLightOffset?: number;
    /** Saturation shift for dark shades as relative percentage (-19 = 19% less), optional */
    saturationDarkOffset?: number;
}

/**
 * Mathematical color hue data at 30° intervals
 */
export const mathematicalHues: MathHueEntry[] = [
    { name: "crimson", baseHue: 0, lightOffset: 25, darkOffset: -3, saturationLightOffset: 0, saturationDarkOffset: 0 },
    { name: "flame", baseHue: 30, lightOffset: 23, darkOffset: -13, saturationLightOffset: 0, saturationDarkOffset: 0 },
    { name: "wheat", baseHue: 60, lightOffset: 13, darkOffset: -20, saturationLightOffset: 0, saturationDarkOffset: 0 },
    { name: "lime", baseHue: 90, lightOffset: -14, darkOffset: -6, saturationLightOffset: 0, saturationDarkOffset: 0 },
    { name: "grass", baseHue: 120, lightOffset: -7, darkOffset: 9, saturationLightOffset: 0, saturationDarkOffset: 0 },
    { name: "sea", baseHue: 150, lightOffset: 0, darkOffset: 13, saturationLightOffset: 0, saturationDarkOffset: 0 },
    { name: "sky", baseHue: 180, lightOffset: 8, darkOffset: 4, saturationLightOffset: 0, saturationDarkOffset: 0 },
    { name: "corn", baseHue: 210, lightOffset: 11, darkOffset: 0, saturationLightOffset: 0, saturationDarkOffset: 0 },
    { name: "dusk", baseHue: 240, lightOffset: 7, darkOffset: 1, saturationLightOffset: 0, saturationDarkOffset: 0 },
    { name: "plum", baseHue: 270, lightOffset: 0, darkOffset: 0, saturationLightOffset: 0, saturationDarkOffset: 0 },
    { name: "candy", baseHue: 300, lightOffset: -6, darkOffset: 4, saturationLightOffset: 0, saturationDarkOffset: 0 },
    { name: "salmon", baseHue: 330, lightOffset: -13, darkOffset: 9, saturationLightOffset: 0, saturationDarkOffset: 0 }
];

/**
 * Get a hue entry by name
 */
export function getMathHueByName(name: string): MathHueEntry | undefined {
    return mathematicalHues.find(h => h.name === name);
}

/**
 * Default offset range for sliders (degrees)
 */
export const MATH_HUE_OFFSET_RANGE = { min: -45, max: 45 };
