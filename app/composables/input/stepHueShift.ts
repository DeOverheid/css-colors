/**
 * Step: Per-Swatch Hue Adjustment
 *
 * Each swatch row's hue maps to the closest named color entry in the theme
 * (e.g. "crimson", "red"). Offsets are stored and looked up by name.
 * When the user shifts the primary hue across a boundary, the row picks up
 * the new name's offsets — matching the legacy JS behavior.
 *
 * Dark swatches shift toward darkOffset, light toward lightOffset,
 * with linear interpolation across the swatch range.
 */
import type { HueShiftConfig, HueShiftEntry } from "~/composables/themes/lib/types";
import { useThemes } from "~/composables/themes";
import { getHueShiftForTheme, findClosestEntryName } from "~/composables/utils/hueShiftDefaults";

const MAX_OFFSET = 30;

export function stepHueShift() {
    const { currentTheme } = useThemes();

    /** Build a fresh config from the current theme */
    function themeDefaults(): HueShiftConfig {
        return structuredClone(toRaw(getHueShiftForTheme(currentTheme.value.id)));
    }

    const settings = ref<HueShiftConfig>(themeDefaults());

    // Re-seed when theme changes
    watch(() => currentTheme.value.id, () => {
        settings.value = themeDefaults();
    });

    /**
     * Resolve the entry name for a given hue (closest match by angular distance).
     */
    function nameForHue(hue: number): string | undefined {
        return findClosestEntryName(settings.value, hue);
    }

    /**
     * Get the entry for a hue, or undefined if none matches.
     */
    function entryForHue(hue: number): HueShiftEntry | undefined {
        const name = nameForHue(hue);
        return name ? settings.value.rows[name] : undefined;
    }

    /**
     * Set the dark-side hue offset for the closest named entry.
     */
    function setDarkOffset(hue: number, value: number) {
        const name = nameForHue(hue);
        const entry = name ? settings.value.rows[name] : undefined;
        if (entry) entry.dark = Math.max(-MAX_OFFSET, Math.min(MAX_OFFSET, value));
    }

    /**
     * Set the light-side hue offset for the closest named entry.
     */
    function setLightOffset(hue: number, value: number) {
        const name = nameForHue(hue);
        const entry = name ? settings.value.rows[name] : undefined;
        if (entry) entry.light = Math.max(-MAX_OFFSET, Math.min(MAX_OFFSET, value));
    }

    /**
     * Get the dark offset for a hue (via closest named entry, defaults to 0).
     */
    function getDarkOffset(hue: number): number {
        return entryForHue(hue)?.dark ?? 0;
    }

    /**
     * Get the light offset for a hue (via closest named entry, defaults to 0).
     */
    function getLightOffset(hue: number): number {
        return entryForHue(hue)?.light ?? 0;
    }

    /**
     * Compute hue for a specific swatch within a row.
     * Linear interpolation: dark offset at index 0, light offset at last index.
     */
    function getHueForSwatch(baseHue: number, index: number, totalSteps: number): number {
        if (!settings.value.enabled || totalSteps <= 1) return baseHue;

        const entry = entryForHue(baseHue);
        if (!entry || (entry.dark === 0 && entry.light === 0)) return baseHue;

        const blendFactor = index / (totalSteps - 1);
        const offset = entry.dark + (entry.light - entry.dark) * blendFactor;

        let hue = baseHue + offset;
        while (hue < 0) hue += 360;
        while (hue >= 360) hue -= 360;

        return hue;
    }

    /** Reset all offsets to theme defaults. */
    function resetAll() {
        settings.value = themeDefaults();
    }

    /** Reset a single row (by hue) to theme defaults. */
    function resetRow(hue: number) {
        const name = nameForHue(hue);
        if (!name) return;
        const defaults = getHueShiftForTheme(currentTheme.value.id);
        const defaultEntry = defaults.rows[name];
        if (defaultEntry) {
            settings.value.rows[name] = structuredClone(defaultEntry);
        } else {
            settings.value.rows[name] = { baseHue: hue, dark: 0, light: 0 };
        }
    }

    return {
        settings,
        nameForHue,
        setDarkOffset,
        setLightOffset,
        getDarkOffset,
        getLightOffset,
        getHueForSwatch,
        resetAll,
        resetRow
    };
}

// Singleton instance for shared state
let _instance: ReturnType<typeof stepHueShift> | null = null;

export function useHueShift() {
    if (!_instance) {
        _instance = stepHueShift();
    }
    return _instance;
}
