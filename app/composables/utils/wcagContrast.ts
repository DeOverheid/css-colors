/**
 * WCAG Contrast Checker
 *
 * Pipeline: HSL → sRGB (hslToRgb) → linear RGB (gamma-expand) → luminance → ratio
 *
 * Threshold (WCAG 2.1 normal text AA): 4.5:1
 */

/** Convert HSL (h: 0–360, s: 0–100, l: 0–100) to sRGB [0–255] */
export function hslToRgb(h: number, s: number, l: number): [number, number, number] {
    const sN = s / 100;
    const lN = l / 100;
    const c = (1 - Math.abs(2 * lN - 1)) * sN;
    const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
    const m = lN - c / 2;

    let r1: number, g1: number, b1: number;
    if (h < 60) { r1 = c; g1 = x; b1 = 0; } else if (h < 120) { r1 = x; g1 = c; b1 = 0; } else if (h < 180) { r1 = 0; g1 = c; b1 = x; } else if (h < 240) { r1 = 0; g1 = x; b1 = c; } else if (h < 300) { r1 = x; g1 = 0; b1 = c; } else { r1 = c; g1 = 0; b1 = x; }

    return [
        Math.round((r1 + m) * 255),
        Math.round((g1 + m) * 255),
        Math.round((b1 + m) * 255)
    ];
}

/** Linearize a single sRGB channel (0–255 → linear 0–1) */
function linearize(value: number): number {
    const c = value / 255;
    return c <= 0.04045 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
}

/** Relative luminance from sRGB [0–255] */
export function luminanceFromRgb(r: number, g: number, b: number): number {
    return 0.2126 * linearize(r) + 0.7152 * linearize(g) + 0.0722 * linearize(b);
}

/** WCAG contrast ratio between two sRGB colors. Returns ratio ≥ 1. */
export function contrastRatioRgb(
    r1: number, g1: number, b1: number,
    r2: number, g2: number, b2: number
): number {
    const lum1 = luminanceFromRgb(r1, g1, b1);
    const lum2 = luminanceFromRgb(r2, g2, b2);
    const lighter = Math.max(lum1, lum2);
    const darker = Math.min(lum1, lum2);
    return (lighter + 0.05) / (darker + 0.05);
}
