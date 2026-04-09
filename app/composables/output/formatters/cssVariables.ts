/**
 * CSS Custom Properties Formatter
 *
 * Serializes a collected palette into a :root block with CSS custom properties.
 * Each color becomes: --{name}-{shade}: {value};
 *
 * Same shade ordering as Tailwind formatter: light → dark.
 */
import type { CollectedPalette, PaletteShade } from "~/composables/output/usePaletteCollector";
import type { ColorNotation } from "~/composables/output/formatters/tailwindV4Css";
import { hslToHex } from "~/composables/utils/colorConversion";

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
 * Generate CSS custom properties in a :root block.
 *
 * @param palette - The collected palette data
 * @param notation - Color notation: "hsl" or "hex"
 * @returns Formatted CSS string
 */
export function toCssVariables(palette: CollectedPalette, notation: ColorNotation = "hsl"): string {
    const lines: string[] = [":root {"];

    const allRows = [...palette.chromatic, ...palette.grey];

    for (let rowIdx = 0; rowIdx < allRows.length; rowIdx++) {
        const row = allRows[rowIdx]!;
        // Reverse: palette is dark→light, CSS convention is light→dark
        const shades = [...row.shades].reverse();

        for (const shade of shades) {
            const value = formatValue(shade, notation);
            lines.push(`    --${row.name}-${shade.label}: ${value};`);
        }

        // Blank line between color groups, but not after the last one
        if (rowIdx < allRows.length - 1) {
            lines.push("");
        }
    }

    lines.push("}");
    return lines.join("\n");
}
