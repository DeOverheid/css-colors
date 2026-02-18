import type { ThemeConfig } from "./types";

/**
 * Tailwind CSS color palette theme
 * Uses the standard Tailwind naming convention: 50, 100-900, 950
 * Plus 0 (pure black) and 1000 (pure white) as endpoints
 */
export const tailwindTheme: ThemeConfig = {
    id: "tailwind",
    name: "Tailwind",
    totalSteps: 13,
    // Labels from dark to light: 0 (black), 950, 900...100, 50, 1000 (white)
    // Note: Tailwind shade numbers are inverted - 50 is lightest, 950 is darkest
    swatchLabels: ["0", "950", "900", "800", "700", "600", "500", "400", "300", "200", "100", "50", "1000"],
    bezier: {
        x1: 0.30,
        y1: 0.10,
        x2: 0.68,
        y2: 0.98
    },
    description: "Standard Tailwind CSS color scale with 50-950 naming"
};

/**
 * Hue Entry Configuration
 *
 * Based on analysis of Tailwind CSS v3 default color palette.
 * Each color has a base hue (midpoint at shade 500) and hue offsets
 * for light (50-400) and dark (600-900) shades.
 *
 * The hue offset allows colors to shift slightly warmer or cooler
 * at the extremes, matching Tailwind's natural color appearance.
 *
 * The lightnessOffset adjusts the entire lightness curve to match
 * Tailwind's perceptual brightness compensation.
 */
export interface TailwindHueEntry {
    /** Display name of the color */
    name: string;
    /** Base hue at shade 500 (0-360) */
    baseHue: number;
    /** Hue offset for light shades (50-400), degrees */
    lightOffset: number;
    /** Hue offset for dark shades (600-900), degrees */
    darkOffset: number;
    /** Lightness offset as relative percentage (+10 = 10% brighter, -10 = 10% darker) */
    lightnessOffset: number;
    /** Saturation shift for light shades as relative percentage (+6 = 6% more saturated) */
    saturationLightOffset: number;
    /** Saturation shift for dark shades as relative percentage (-19 = 19% less saturated) */
    saturationDarkOffset: number;
}

/**
 * Tailwind color hue data ordered from red through the spectrum to rose
 *
 * Hue values are the midpoint (shade 500) from Tailwind's palette.
 * Offsets represent the hue shift applied to lighter/darker variants.
 * Lightness offsets are derived from Tailwind's actual L500 values vs neutral 50%.
 */
export const tailwindHues: TailwindHueEntry[] = [
    { name: "red", baseHue: 0, lightOffset: 0, darkOffset: 2, lightnessOffset: 20, saturationLightOffset: 2, saturationDarkOffset: -21 },
    { name: "orange", baseHue: 25, lightOffset: 0, darkOffset: -15, lightnessOffset: 6, saturationLightOffset: 5, saturationDarkOffset: -20 },
    { name: "amber", baseHue: 38, lightOffset: 15, darkOffset: -30, lightnessOffset: 0, saturationLightOffset: 8, saturationDarkOffset: -14 },
    { name: "yellow", baseHue: 45, lightOffset: 22, darkOffset: -24, lightnessOffset: -5, saturationLightOffset: -2, saturationDarkOffset: -21 },
    { name: "lime", baseHue: 84, lightOffset: -9, darkOffset: -1, lightnessOffset: -11, saturationLightOffset: 12, saturationDarkOffset: -19 },
    { name: "green", baseHue: 142, lightOffset: -4, darkOffset: 3, lightnessOffset: -9, saturationLightOffset: 6, saturationDarkOffset: -9 },
    { name: "emerald", baseHue: 160, lightOffset: -17, darkOffset: 2, lightnessOffset: -21, saturationLightOffset: -3, saturationDarkOffset: 2 },
    { name: "teal", baseHue: 173, lightOffset: -7, darkOffset: 5, lightnessOffset: -20, saturationLightOffset: -4, saturationDarkOffset: -20 },
    { name: "cyan", baseHue: 189, lightOffset: -12, darkOffset: 3, lightnessOffset: -14, saturationLightOffset: 6, saturationDarkOffset: -31 },
    { name: "sky", baseHue: 199, lightOffset: 5, darkOffset: 5, lightnessOffset: -3, saturationLightOffset: 11, saturationDarkOffset: -8 },
    { name: "blue", baseHue: 217, lightOffset: 0, darkOffset: 4, lightnessOffset: 20, saturationLightOffset: 9, saturationDarkOffset: -27 },
    { name: "indigo", baseHue: 239, lightOffset: -13, darkOffset: 9, lightnessOffset: 33, saturationLightOffset: 17, saturationDarkOffset: -36 },
    { name: "violet", baseHue: 258, lightOffset: -13, darkOffset: 3, lightnessOffset: 33, saturationLightOffset: 11, saturationDarkOffset: -22 },
    { name: "purple", baseHue: 271, lightOffset: -4, darkOffset: 7, lightnessOffset: 30, saturationLightOffset: 9, saturationDarkOffset: -25 },
    { name: "fuchsia", baseHue: 292, lightOffset: -6, darkOffset: 7, lightnessOffset: 21, saturationLightOffset: 16, saturationDarkOffset: -20 },
    { name: "pink", baseHue: 330, lightOffset: -8, darkOffset: -3, lightnessOffset: 21, saturationLightOffset: -8, saturationDarkOffset: -12 },
    { name: "rose", baseHue: 350, lightOffset: 8, darkOffset: -16, lightnessOffset: 20, saturationLightOffset: 11, saturationDarkOffset: -14 }
];

/**
 * Get a hue entry by name
 */
export function getHueByName(name: string): TailwindHueEntry | undefined {
    return tailwindHues.find(h => h.name === name);
}

/**
 * Default offset range for sliders (degrees)
 */
export const HUE_OFFSET_RANGE = { min: -45, max: 45 };
