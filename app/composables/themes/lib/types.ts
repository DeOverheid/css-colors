/**
 * Theme configuration type definitions
 */

export interface BezierCurve {
    x1: number;
    y1: number;
    x2: number;
    y2: number;
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
    /** Description of the theme */
    description?: string;
}
