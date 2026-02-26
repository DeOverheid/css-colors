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
    /** Optional separate bezier curve for grayscale (uses bezier if not specified) */
    grayscaleBezier?: BezierCurve;
    /** Minimum lightness value (darkest shade, maps to bezier 0) */
    lightnessMin?: number;
    /** Maximum lightness value (lightest shade, maps to bezier 1) */
    lightnessMax?: number;
    /** Hue-based lightness compensation settings */
    lightnessAdjustment?: LightnessAdjustmentConfig;
    /** Description of the theme */
    description?: string;
}
