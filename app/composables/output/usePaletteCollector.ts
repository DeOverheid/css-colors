/**
 * Palette Collector
 *
 * Gathers all visible swatch data into a flat structure for export.
 * Replicates the same HSL computation pipeline as GeneratorSwatches + ColorSwatchRow,
 * but outputs structured data instead of rendering DOM.
 *
 * Each row produces: { name, shades: [{ label, hue, saturation, lightness }] }
 * Black (index 0) and white (last index) are excluded.
 */
import { useColorSettings } from "~/composables/core/useColorSettings";
import { useComplementaryColors } from "~/composables/input/useComplementaryColors";
import { stepLightnessDistribution } from "~/composables/input/stepLightnessDistribution";
import { useLightnessAdjustment } from "~/composables/input/stepLightnessAdjustment";
import { useHueShift } from "~/composables/input/stepHueShift";
import { useThemes } from "~/composables/themes";
import { getChromaticEntriesForTheme } from "~/composables/utils/hueShiftDefaults";
import { greySaturationSteps } from "~/composables/utils/greySaturation";
import { closestGreyName } from "~/composables/utils/closestGreyName";

export interface PaletteShade {
    label: string;
    hue: number;
    saturation: number;
    lightness: number;
}

export interface PaletteRow {
    name: string;
    shades: PaletteShade[];
}

export interface CollectedPalette {
    chromatic: PaletteRow[];
    grey: PaletteRow[];
}

/**
 * Compute per-swatch HSL for a single row, excluding black and white endpoints.
 *
 * Mirrors the logic in ColorSwatchRow.vue:
 *  - swatchHues[i] = getHueForSwatch(baseHue, i, totalSteps)
 *  - satValues[i]  = single value or per-swatch array
 *  - adjustedLightness[i] = applyAdjustment(baseLightness, hue, i, totalSteps) unless skipAdjustment
 */
function computeRowShades(
    baseHue: number,
    saturation: number | number[],
    lightnessSteps: number[],
    totalSteps: number,
    labels: string[],
    getHueForSwatch: (baseHue: number, index: number, totalSteps: number) => number,
    applyAdjustment: (baseLightness: number, hue: number, index: number, count: number) => number,
    skipAdjustment: boolean
): PaletteShade[] {
    // Full lightness array: [0, ...lightnessSteps, 100]
    const allLightness = [0, ...lightnessSteps, 100];

    const shades: PaletteShade[] = [];

    // Iterate inner steps only (skip index 0 = black, skip last = white)
    for (let i = 1; i < allLightness.length - 1; i++) {
        const hue = getHueForSwatch(baseHue, i, totalSteps);
        const sat = Array.isArray(saturation) ? (saturation[i] ?? 0) : saturation;
        const baseLightness = allLightness[i]!;
        const lightness = skipAdjustment
            ? baseLightness
            : applyAdjustment(baseLightness, hue, i, totalSteps);

        shades.push({
            label: labels[i] ?? String(i),
            hue,
            saturation: sat,
            lightness
        });
    }

    return shades;
}

export function usePaletteCollector() {
    const { hue: primaryHue, saturation: primarySaturation } = useColorSettings();
    const { secondaryHue, tertiaryHue, complementarySaturation } = useComplementaryColors();
    const { lightnessSteps, grayscaleLightnessSteps } = stepLightnessDistribution();
    const { applyAdjustment } = useLightnessAdjustment();
    const { getHueForSwatch } = useHueShift();
    const { currentTheme } = useThemes();

    /**
     * Collected palette: all chromatic + grey rows with per-swatch HSL.
     * Updates reactively when any input changes.
     */
    const palette = computed((): CollectedPalette => {
        const theme = currentTheme.value;
        const totalSteps = theme.totalSteps;
        const labels = theme.swatchLabels;
        const isCustomTheme = theme.id === "custom";

        // --- Chromatic rows ---
        const entries = getChromaticEntriesForTheme(theme.id);
        const pHue = primaryHue.value % 360;

        // Find which entry is closest to the user's primary hue (same logic as GeneratorSwatches)
        let primaryIdx = 0;
        let bestDist = Infinity;
        for (let i = 0; i < entries.length; i++) {
            const d = Math.abs(entries[i]!.baseHue - pHue);
            const dist = d > 180 ? 360 - d : d;
            if (dist < bestDist) {
                bestDist = dist;
                primaryIdx = i;
            }
        }

        const chromatic: PaletteRow[] = entries.map((entry, idx) => {
            const rowHue = idx === primaryIdx ? pHue : entry.baseHue;
            return {
                name: entry.name,
                shades: computeRowShades(
                    rowHue,
                    primarySaturation.value,
                    lightnessSteps.value,
                    totalSteps,
                    labels,
                    getHueForSwatch,
                    applyAdjustment,
                    false
                )
            };
        });

        // --- Grey rows ---
        const grey: PaletteRow[] = [];
        const greySats = greySaturationSteps(
            primarySaturation.value,
            totalSteps,
            theme.greySaturationMax ?? 25,
            theme.greySaturationMin ?? 3
        );
        const greyLightness = grayscaleLightnessSteps.value;

        // Neutral: pure grey (saturation = 0)
        grey.push({
            name: "neutral",
            shades: computeRowShades(
                pHue,
                0,
                greyLightness,
                totalSteps,
                labels,
                getHueForSwatch,
                applyAdjustment,
                true
            )
        });

        // Tinted grey companions: primary, secondary, tertiary
        const companions: { id: string; hue: number }[] = [
            { id: "primary", hue: pHue },
            { id: "secondary", hue: secondaryHue.value },
            { id: "tertiary", hue: tertiaryHue.value }
        ];

        for (const comp of companions) {
            const greyName = isCustomTheme
                ? `grey-${comp.id}`
                : closestGreyName(comp.hue).toLowerCase();

            grey.push({
                name: greyName,
                shades: computeRowShades(
                    comp.hue,
                    greySats,
                    greyLightness,
                    totalSteps,
                    labels,
                    getHueForSwatch,
                    applyAdjustment,
                    true
                )
            });
        }

        return { chromatic, grey };
    });

    return { palette };
}
