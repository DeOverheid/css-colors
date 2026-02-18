/**
 * Theme configuration type definitions
 */

export interface ThemeConfig {
    /** Unique identifier for the theme */
    id: string;
    /** Display name for the theme */
    name: string;
    /** Total number of steps including black (0) and white (100) endpoints */
    totalSteps: number;
    /** Labels for each swatch step */
    swatchLabels: string[];
    /** Default bezier curve values for lightness distribution */
    bezier: {
        x1: number;
        y1: number;
        x2: number;
        y2: number;
    };
    /** Description of the theme */
    description?: string;
}
