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
    // Labels from dark to light: 0 (black), 50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950, 1000 (white)
    swatchLabels: ["0", "50", "100", "200", "300", "400", "500", "600", "700", "800", "900", "950", "1000"],
    bezier: {
        x1: 0.07,
        y1: 0.36,
        x2: 0.35,
        y2: 0.88
    },
    description: "Standard Tailwind CSS color scale with 50-950 naming"
};
