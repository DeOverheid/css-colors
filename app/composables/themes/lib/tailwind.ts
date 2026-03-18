import type { ThemeConfig } from "./types";
import { DEFAULT_LIGHTNESS_ADJUSTMENT } from "./types";

/**
 * Tailwind CSS color palette theme
 * Uses the standard Tailwind naming convention: 50, 100-900, 950
 * Plus 0 (pure black) and 1000 (pure white) as endpoints
 */

/**
 * Hue Entry Configuration
 *
 * Based on analysis of Tailwind CSS v3 default color palette.
 * Each color has a base hue (midpoint at shade 500) and hue offsets
 * for light (50-400) and dark (600-900) shades.
 */
export interface TailwindHueEntry {
    /** Display name of the color */
    name: string;
    /** Type: 'color' for chromatic hues, 'grayscale' for neutral tones */
    type: "color" | "grayscale";
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
 * Default offset range for sliders (degrees)
 */
export const HUE_OFFSET_RANGE = { min: -30, max: 30 };

// ============================================================================
// REPLACEABLE CONFIG - START
// Export > select this block > paste to replace
// ============================================================================

export const tailwindTheme: ThemeConfig = {
    id: "tailwind",
    name: "Tailwind",
    totalSteps: 13,
    swatchLabels: ["0", "950", "900", "800", "700", "600", "500", "400", "300", "200", "100", "50", "1000"],
    bezier: {
        x1: 0.46,
        y1: 0.13,
        x2: 0.72,
        y2: 0.92
    },
    grayscaleBezier: {
        x1: 0.45,
        y1: 0.03,
        x2: 0.55,
        y2: 0.99
    },
    grayscaleLightnessMin: 0,
    grayscaleLightnessMax: 100,
    lightnessAdjustment: DEFAULT_LIGHTNESS_ADJUSTMENT,
    defaultDarkSqueeze: 0,
    defaultLightSqueeze: 0,
    defaultRainbowDarkShift: 30,
    defaultRainbowLightShift: 0,
    defaultGreyDarkShift: 30,
    defaultGreyLightShift: 0,
    description: "Standard Tailwind CSS color scale with 50-950 naming"
};

export const tailwindHues: TailwindHueEntry[] = [
    { name: "slate", type: "grayscale", baseHue: 215, lightOffset: 0, darkOffset: 0, lightnessOffset: 0, saturationLightOffset: 0, saturationDarkOffset: 0 },
    { name: "gray", type: "grayscale", baseHue: 220, lightOffset: 0, darkOffset: 0, lightnessOffset: 0, saturationLightOffset: 0, saturationDarkOffset: 0 },
    { name: "zinc", type: "grayscale", baseHue: 240, lightOffset: 0, darkOffset: 0, lightnessOffset: 0, saturationLightOffset: 0, saturationDarkOffset: 0 },
    { name: "neutral", type: "grayscale", baseHue: 0, lightOffset: 0, darkOffset: 0, lightnessOffset: 0, saturationLightOffset: 0, saturationDarkOffset: 0 },
    { name: "stone", type: "grayscale", baseHue: 30, lightOffset: 0, darkOffset: 0, lightnessOffset: 0, saturationLightOffset: 0, saturationDarkOffset: 0 },
    { name: "red", type: "color", baseHue: 0, lightOffset: 2, darkOffset: -7, lightnessOffset: 20, saturationLightOffset: 2, saturationDarkOffset: -21 },
    { name: "orange", type: "color", baseHue: 25, lightOffset: 5, darkOffset: -10, lightnessOffset: 6, saturationLightOffset: 5, saturationDarkOffset: -20 },
    { name: "amber", type: "color", baseHue: 38, lightOffset: 16, darkOffset: -19, lightnessOffset: 0, saturationLightOffset: 8, saturationDarkOffset: -14 },
    { name: "yellow", type: "color", baseHue: 45, lightOffset: 19, darkOffset: -16, lightnessOffset: -5, saturationLightOffset: -2, saturationDarkOffset: -21 },
    { name: "lime", type: "color", baseHue: 84, lightOffset: -6, darkOffset: 4, lightnessOffset: -11, saturationLightOffset: 12, saturationDarkOffset: -19 },
    { name: "green", type: "color", baseHue: 142, lightOffset: -4, darkOffset: 5, lightnessOffset: -9, saturationLightOffset: 6, saturationDarkOffset: -9 },
    { name: "emerald", type: "color", baseHue: 160, lightOffset: -3, darkOffset: 3, lightnessOffset: -21, saturationLightOffset: -3, saturationDarkOffset: 2 },
    { name: "teal", type: "color", baseHue: 173, lightOffset: -3, darkOffset: 4, lightnessOffset: -20, saturationLightOffset: -4, saturationDarkOffset: -20 },
    { name: "cyan", type: "color", baseHue: 189, lightOffset: -6, darkOffset: 7, lightnessOffset: -14, saturationLightOffset: 6, saturationDarkOffset: -31 },
    { name: "sky", type: "color", baseHue: 199, lightOffset: 2, darkOffset: 6, lightnessOffset: -3, saturationLightOffset: 11, saturationDarkOffset: -8 },
    { name: "blue", type: "color", baseHue: 217, lightOffset: -4, darkOffset: 8, lightnessOffset: 20, saturationLightOffset: 9, saturationDarkOffset: -27 },
    { name: "indigo", type: "color", baseHue: 239, lightOffset: -13, darkOffset: 6, lightnessOffset: 33, saturationLightOffset: 17, saturationDarkOffset: -36 },
    { name: "violet", type: "color", baseHue: 258, lightOffset: -10, darkOffset: 5, lightnessOffset: 33, saturationLightOffset: 11, saturationDarkOffset: -22 },
    { name: "purple", type: "color", baseHue: 271, lightOffset: -2, darkOffset: 5, lightnessOffset: 30, saturationLightOffset: 9, saturationDarkOffset: -25 },
    { name: "fuchsia", type: "color", baseHue: 292, lightOffset: -4, darkOffset: 6, lightnessOffset: 21, saturationLightOffset: 16, saturationDarkOffset: -20 },
    { name: "pink", type: "color", baseHue: 330, lightOffset: 0, darkOffset: 5, lightnessOffset: 21, saturationLightOffset: -8, saturationDarkOffset: -12 },
    { name: "rose", type: "color", baseHue: 350, lightOffset: 13, darkOffset: -8, lightnessOffset: 20, saturationLightOffset: 11, saturationDarkOffset: -14 }
];

// ============================================================================
// REPLACEABLE CONFIG - END
// ============================================================================
