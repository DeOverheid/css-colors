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
    /** Hue falloff zone in degrees (smooth transition at range edges) */
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
    /** Description of the theme */
    description?: string;
}

/**
 * Default lightness adjustment settings — shared across themes and composable.
 * Darkening: warm hues (30–210°), Brightening: cool hues (210–300°).
 */
export const DEFAULT_LIGHTNESS_ADJUSTMENT: LightnessAdjustmentConfig = {
    enabled: false,
    darkening: {
        enabled: true,
        start: 30,
        end: 210,
        hueFalloff: 15,
        lightnessFalloffLight: 0.48,
        lightnessAmplitude: 9.5,
        lightnessFalloffDark: 0.44
    },
    brightening: {
        enabled: true,
        start: 210,
        end: 300,
        hueFalloff: 15,
        lightnessFalloffLight: 1,
        lightnessAmplitude: 12,
        lightnessFalloffDark: 0.2
    }
};
