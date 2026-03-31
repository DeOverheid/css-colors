/**
 * Step: Per-Swatch Hue Adjustment
 * Allows shifting the hue of individual swatches within a row.
 * Dark swatches shift toward darkOffset, light toward lightOffset,
 * with linear taper — middle swatch is always unaffected.
 */
import type { HueShiftConfig, HueShiftRow } from "~/composables/themes/lib/types";
import { DEFAULT_HUE_SHIFT } from "~/composables/themes/lib/types";

const MAX_OFFSET = 30;

export function stepHueShift() {
    const settings = ref<HueShiftConfig>(structuredClone(DEFAULT_HUE_SHIFT));

    /**
     * Get the shift row for a given base hue, creating it if needed.
     */
    function getRow(hue: number): HueShiftRow {
        const key = Math.round(hue);
        if (!settings.value.rows[key]) {
            settings.value.rows[key] = { dark: 0, light: 0 };
        }
        return settings.value.rows[key];
    }

    /**
     * Set the dark-side hue offset for a row.
     */
    function setDarkOffset(hue: number, value: number) {
        const row = getRow(hue);
        row.dark = Math.max(-MAX_OFFSET, Math.min(MAX_OFFSET, value));
    }

    /**
     * Set the light-side hue offset for a row.
     */
    function setLightOffset(hue: number, value: number) {
        const row = getRow(hue);
        row.light = Math.max(-MAX_OFFSET, Math.min(MAX_OFFSET, value));
    }

    /**
     * Get the dark offset for a row (defaults to 0).
     */
    function getDarkOffset(hue: number): number {
        return settings.value.rows[Math.round(hue)]?.dark ?? 0;
    }

    /**
     * Get the light offset for a row (defaults to 0).
     */
    function getLightOffset(hue: number): number {
        return settings.value.rows[Math.round(hue)]?.light ?? 0;
    }

    /**
     * Compute hue for a specific swatch within a row.
     * Linear taper: dark offset at index 0, zero at middle, light offset at last index.
     * Black (index 0) and white (last index) are endpoints — they get full offset.
     */
    function getHueForSwatch(baseHue: number, index: number, totalSteps: number): number {
        if (!settings.value.enabled || totalSteps <= 1) return baseHue;

        const row = settings.value.rows[Math.round(baseHue)];
        if (!row || (row.dark === 0 && row.light === 0)) return baseHue;

        // blendFactor: 0 = darkest swatch, 1 = lightest swatch
        const blendFactor = index / (totalSteps - 1);
        // Offset interpolates from dark (at 0) through 0 (at 0.5) to light (at 1)
        const offset = row.dark + (row.light - row.dark) * blendFactor;

        let hue = baseHue + offset;
        while (hue < 0) hue += 360;
        while (hue >= 360) hue -= 360;

        return hue;
    }

    /**
     * Reset all offsets to 0.
     */
    function resetAll() {
        settings.value = structuredClone(DEFAULT_HUE_SHIFT);
    }

    /**
     * Reset a single row to 0.
     */
    function resetRow(hue: number) {
        const key = Math.round(hue);
        settings.value.rows[key] = { dark: 0, light: 0 };
    }

    return {
        settings,
        getRow,
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
