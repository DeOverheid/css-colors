/**
 * Theme configuration type definitions
 */

export interface BezierCurve {
    x1: number;
    y1: number;
    x2: number;
    y2: number;
}

export interface AdjustmentRange {
    /** Whether this adjustment range is active */
    enabled: boolean;
    /** Start hue of the affected range (degrees) */
    start: number;
    /** End hue of the affected range (degrees) */
    end: number;
    /** Hue falloff percentage (0–100, how much of the range edge fades) */
    hueFalloff: number;
    /** Lightness falloff for light shades (0-1, higher = more effect on light shades) */
    lightnessFalloffLight: number;
    /** Maximum lightness adjustment amplitude (0-30) */
    lightnessAmplitude: number;
    /** Lightness falloff for dark shades (0-1, higher = more effect on dark shades) */
    lightnessFalloffDark: number;
}

export interface LightnessAdjustmentConfig {
    /** Master enable/disable for all adjustments */
    enabled: boolean;
    /** Darkening range: typically warm hues (30-210°) that need to be darkened */
    darkening: AdjustmentRange;
    /** Brightening range: typically cool hues (210-300°) that need to be brightened */
    brightening: AdjustmentRange;
}

export interface HueShiftRow {
    /** Hue offset for dark swatches (±30°) */
    dark: number;
    /** Hue offset for light swatches (±30°) */
    light: number;
}

export interface HueShiftConfig {
    /** Whether per-swatch hue shifting is enabled */
    enabled: boolean;
    /** Per-hue-row shift values keyed by hue degree */
    rows: Record<number, HueShiftRow>;
}

export interface ThemeConfig {
    /** Unique identifier for the theme */
    id: string;
    /** Display name for the theme */
    name: string;
    /** Total number of steps including black (0) and white (100) endpoints */
    totalSteps: number;
    /** Labels for each swatch step */
    swatchLabels: string[];
    /** Default bezier curve for color hues */
    bezier: BezierCurve;
    /** Minimum lightness value (darkest shade, maps to bezier 0) */
    lightnessMin?: number;
    /** Maximum lightness value (lightest shade, maps to bezier 1) */
    lightnessMax?: number;
    /** Minimum lightness for greyscale shades (defaults to 0) */
    grayscaleLightnessMin?: number;
    /** Maximum lightness for greyscale shades (defaults to 100) */
    grayscaleLightnessMax?: number;
    /** Hue-based lightness compensation settings */
    lightnessAdjustment?: LightnessAdjustmentConfig;
    /** Per-swatch hue shift settings */
    hueShift?: HueShiftConfig;
    /** Default dark squeeze slider value (0–100) */
    defaultDarkSqueeze?: number;
    /** Default light squeeze slider value (0–100) */
    defaultLightSqueeze?: number;
    /** Default rainbow (chromatic) dark shift (0–100) */
    defaultRainbowDarkShift?: number;
    /** Default rainbow (chromatic) light shift (0–100) */
    defaultRainbowLightShift?: number;
    /** Default grey dark shift (0–100) */
    defaultGreyDarkShift?: number;
    /** Default grey light shift (0–100) */
    defaultGreyLightShift?: number;
    /** Default UI tone source for the app background */
    defaultUiTone?: "primary" | "secondary" | "tertiary" | "neutral";
    /** Default saturation for the theme (0–100) */
    defaultSaturation?: number;
    /** Description of the theme */
    description?: string;
}

/**
 * Default lightness adjustment settings — shared across themes and composable.
 * Darkening: warm hues (30–210°), Brightening: cool hues (210–300°).
 */
export const DEFAULT_LIGHTNESS_ADJUSTMENT: LightnessAdjustmentConfig = {
    enabled: true,
    darkening: {
        enabled: true,
        start: 20,
        end: 220,
        hueFalloff: 25,
        lightnessFalloffLight: 0.50,
        lightnessAmplitude: 5,
        lightnessFalloffDark: 0.33
    },
    brightening: {
        enabled: true,
        start: 198,
        end: 302,
        hueFalloff: 100,
        lightnessFalloffLight: 0,
        lightnessAmplitude: 20,
        lightnessFalloffDark: 0.33
    }
};

/**
 * Default hue shift settings — mathematical defaults derived from perceptual analysis.
 * Keys are canonical hue degrees (0, 30, 60, ..., 330).
 */
export const DEFAULT_HUE_SHIFT: HueShiftConfig = {
    enabled: true,
    rows: {
        0: { dark: -3, light: 25 },
        30: { dark: -13, light: 23 },
        60: { dark: -20, light: 13 },
        90: { dark: -6, light: -14 },
        120: { dark: 9, light: -7 },
        150: { dark: 13, light: 0 },
        180: { dark: 4, light: 8 },
        210: { dark: 0, light: 11 },
        240: { dark: 1, light: 7 },
        270: { dark: 0, light: 0 },
        300: { dark: 4, light: -6 },
        330: { dark: 9, light: -13 }
    }
};
