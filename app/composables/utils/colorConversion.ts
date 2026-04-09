/**
 * Color Conversion Utilities
 * Pure functions for converting HSL to other color formats.
 * Rounding is NOT applied here — callers handle precision.
 */

/** Convert HSL to hex string (#rrggbb) */
export function hslToHex(h: number, s: number, l: number): string {
    const { r, g, b } = hslToRgbObj(h, s, l);
    return `#${componentToHex(r)}${componentToHex(g)}${componentToHex(b)}`;
}

/** Convert HSL to RGB object (0–255 integers) */
export function hslToRgbObj(h: number, s: number, l: number): { r: number; g: number; b: number } {
    const sNorm = s / 100;
    const lNorm = l / 100;

    const c = (1 - Math.abs(2 * lNorm - 1)) * sNorm;
    const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
    const m = lNorm - c / 2;

    let r1: number, g1: number, b1: number;

    if (h < 60) { r1 = c; g1 = x; b1 = 0; } else if (h < 120) { r1 = x; g1 = c; b1 = 0; } else if (h < 180) { r1 = 0; g1 = c; b1 = x; } else if (h < 240) { r1 = 0; g1 = x; b1 = c; } else if (h < 300) { r1 = x; g1 = 0; b1 = c; } else { r1 = c; g1 = 0; b1 = x; }

    return {
        r: Math.round((r1 + m) * 255),
        g: Math.round((g1 + m) * 255),
        b: Math.round((b1 + m) * 255)
    };
}

function componentToHex(c: number): string {
    const hex = Math.max(0, Math.min(255, c)).toString(16);
    return hex.length === 1 ? `0${hex}` : hex;
}
