/**
 * Central builder: derives HueShiftConfig from a theme's hue entry arrays.
 *
 * Each theme exports its own hue entries (mathematicalHues, tailwindHues, customHues)
 * with a common shape: { name, baseHue, lightOffset, darkOffset }.
 *
 * The config creates one entry per chromatic theme entry, using the entry's own
 * name and baseHue. Each swatch row maps to its own unique entry — no bucketing
 * or averaging — so every slider is independent.
 */
import type { HueShiftConfig, HueShiftEntry } from "~/composables/themes/lib/types";
import { DEFAULT_HUE_SHIFT } from "~/composables/themes/lib/types";
import { mathematicalHues } from "~/composables/themes/lib/mathematical";
import { tailwindHues } from "~/composables/themes/lib/tailwind";
import { customHues } from "~/composables/themes/lib/custom";

interface HueEntry {
    name: string;
    baseHue: number;
    lightOffset: number;
    darkOffset: number;
    type?: "color" | "grayscale";
}

/** Map of theme ID → hue entry arrays */
const themeHueEntries: Record<string, HueEntry[]> = {
    mathematical: mathematicalHues,
    tailwind: tailwindHues,
    custom: customHues
};

/**
 * Build a HueShiftConfig with one entry per chromatic theme entry.
 * Each entry uses the theme entry's own name and baseHue.
 */
function buildFromEntries(entries: HueEntry[]): HueShiftConfig {
    const rows: Record<string, HueShiftEntry> = {};

    for (const entry of entries) {
        if (entry.type === "grayscale") continue;
        rows[entry.name] = {
            baseHue: entry.baseHue,
            dark: entry.darkOffset,
            light: entry.lightOffset
        };
    }

    return { enabled: true, rows };
}

/**
 * Get the HueShiftConfig defaults for a given theme ID.
 * Falls back to DEFAULT_HUE_SHIFT if the theme has no registered hue entries.
 */
export function getHueShiftForTheme(themeId: string): HueShiftConfig {
    const entries = themeHueEntries[themeId];
    if (entries) return buildFromEntries(entries);
    return structuredClone(DEFAULT_HUE_SHIFT);
}

/**
 * Get the chromatic (non-grayscale) hue entries for a given theme, in order.
 * Returns { name, baseHue } for each entry.
 */
export function getChromaticEntriesForTheme(themeId: string): { name: string; baseHue: number }[] {
    const entries = themeHueEntries[themeId];
    if (!entries) return [];
    return entries
        .filter(e => e.type !== "grayscale")
        .map(e => ({ name: e.name, baseHue: e.baseHue }));
}

/**
 * Get the display name for a hue degree in a given theme.
 * Finds the closest chromatic entry by angular distance, returns its name capitalized.
 * Falls back to the hue degree as a string.
 */
export function getHueNameForTheme(themeId: string, hue: number): string {
    const entries = themeHueEntries[themeId];
    if (entries) {
        let bestName = "";
        let bestDist = Infinity;
        for (const entry of entries) {
            if (entry.type === "grayscale") continue;
            const d = hueDist(hue, entry.baseHue);
            if (d < bestDist) {
                bestDist = d;
                bestName = entry.name;
            }
        }
        if (bestName) return bestName.charAt(0).toUpperCase() + bestName.slice(1);
    }
    return `${hue}°`;
}
function hueDist(a: number, b: number): number {
    const d = Math.abs(a - b) % 360;
    return d > 180 ? 360 - d : d;
}

/**
 * Find the closest entry name in a HueShiftConfig for a given hue.
 * Each entry has a baseHue; returns the name of the nearest one.
 */
export function findClosestEntryName(config: HueShiftConfig, hue: number): string | undefined {
    let bestName: string | undefined;
    let bestDist = Infinity;
    for (const [name, entry] of Object.entries(config.rows)) {
        const d = hueDist(hue, entry.baseHue);
        if (d < bestDist) {
            bestDist = d;
            bestName = name;
        }
    }
    return bestName;
}
