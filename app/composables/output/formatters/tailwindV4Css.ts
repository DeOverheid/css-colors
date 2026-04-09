/**
 * Tailwind v4 CSS Formatter
 *
 * Serializes a collected palette into Tailwind v4's @theme CSS format.
 * Each color becomes: --color-{name}-{shade}: {value};
 *
 * Shade order is light → dark (50, 100, 200, ..., 900, 950) matching
 * Tailwind's conventional ordering. The palette collector provides shades
 * dark → light, so we reverse before serializing.
 */
import type { CollectedPalette, PaletteShade } from "~/composables/output/usePaletteCollector";
import { hslToHex } from "~/composables/utils/colorConversion";

export type ColorNotation = "hsl" | "hex";

/** Format a single shade value as HSL or hex string. Late rounding applied here. */
function formatValue(shade: PaletteShade, notation: ColorNotation): string {
    if (notation === "hex") {
        return hslToHex(shade.hue, shade.saturation, shade.lightness);
    }
    const h = fmt(shade.hue);
    const s = fmt(shade.saturation);
    const l = fmt(shade.lightness);
    return `hsl(${h}, ${s}%, ${l}%)`;
}

/** Round to 1 decimal; drop trailing .0 for clean integers */
function fmt(value: number): string {
    const rounded = Number(value.toFixed(1));
    return Number.isInteger(rounded) ? String(rounded) : rounded.toFixed(1);
}

/**
 * Generate Tailwind v4 @theme CSS block.
 *
 * @param palette - The collected palette data
 * @param notation - Color notation: "hsl" or "hex"
 * @returns Formatted CSS string
 */
export function toTailwindV4Css(palette: CollectedPalette, notation: ColorNotation = "hsl"): string {
    const lines: string[] = [
        "@import \"tailwindcss\";",
        "",
        "@theme {"
    ];

    const allRows = [...palette.chromatic, ...palette.grey];

    for (let rowIdx = 0; rowIdx < allRows.length; rowIdx++) {
        const row = allRows[rowIdx]!;
        // Reverse: palette is dark→light, Tailwind convention is light→dark
        const shades = [...row.shades].reverse();

        for (const shade of shades) {
            const value = formatValue(shade, notation);
            lines.push(`    --color-${row.name}-${shade.label}: ${value};`);
        }

        // Blank line between color groups
        lines.push("");
    }

    // Black and white at the bottom, matching Tailwind's default palette reference
    const black = notation === "hex" ? "#000" : "hsl(0, 0%, 0%)";
    const white = notation === "hex" ? "#fff" : "hsl(0, 0%, 100%)";
    lines.push(`    --color-black: ${black};`);
    lines.push(`    --color-white: ${white};`);

    lines.push("}");
    return lines.join("\n");
}
