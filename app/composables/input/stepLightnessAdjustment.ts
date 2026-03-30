/**
 * Step: Lightness Adjustment
 * Hue-based lightness compensation to create perceptual uniformity across colors.
 * Yellow appears brighter than blue at the same HSL lightness; this compensates.
 */
import type { AdjustmentRange, LightnessAdjustmentConfig } from "~/composables/themes/lib/types";
import { DEFAULT_LIGHTNESS_ADJUSTMENT } from "~/composables/themes/lib/types";

export function stepLightnessAdjustment() {
    // Reactive state
    const settings = ref<LightnessAdjustmentConfig>(structuredClone(DEFAULT_LIGHTNESS_ADJUSTMENT));

    /**
     * Normalize hue to 0-360 range
     */
    function normalizeHue(hue: number): number {
        let normalized = hue % 360;
        if (normalized < 0) normalized += 360;
        return normalized;
    }

    /**
     * Clamp value between min and max
     */
    function clamp(value: number, min: number, max: number): number {
        return Math.max(min, Math.min(max, value));
    }

    /**
     * Compute if and how much a hue falls within a range
     * Returns null if outside range, or progress info if inside
     */
    function computeHuePlacement(hue: number, rangeSettings: AdjustmentRange): { progress: number; distance: number; span: number } | null {
        const start = normalizeHue(rangeSettings.start);
        const end = normalizeHue(rangeSettings.end);

        if (start === end) return null;

        const normalizedHue = normalizeHue(hue);
        let distance: number;
        let span: number;

        if (start < end) {
            // Normal range (e.g., 30 to 210)
            if (normalizedHue < start || normalizedHue > end) {
                return null;
            }
            distance = normalizedHue - start;
            span = end - start;
        } else {
            // Wrapping range (e.g., 300 to 60)
            span = 360 - start + end;
            if (normalizedHue >= start) {
                distance = normalizedHue - start;
            } else if (normalizedHue <= end) {
                distance = 360 - start + normalizedHue;
            } else {
                return null;
            }
        }

        const progress = span > 0 ? distance / span : 0;
        return { progress, distance, span };
    }

    /**
     * Compute hue falloff factor (smooth edges)
     */
    function computeHueFalloffFactor(rangeInfo: { distance: number; span: number }, falloffValue: number): number {
        const falloff = Number.isFinite(falloffValue) && falloffValue > 0 ? falloffValue : 0;
        if (falloff <= 0) return 1;

        const { distance, span } = rangeInfo;
        if (span <= 0) return 0;

        const distanceFromStart = distance;
        const distanceToEnd = span - distance;

        const startFactor = distanceFromStart < falloff ? distanceFromStart / falloff : 1;
        const endFactor = distanceToEnd < falloff ? distanceToEnd / falloff : 1;

        return Math.min(startFactor, endFactor);
    }

    /**
     * Compute lightness position falloff factor (currently disabled)
     */
    function _computeLightnessFalloffFactor(
        _index: number,
        _count: number,
        _falloff: number
    ): number {
        return 1;
    }

    /**
     * Check if a hue falls within a range (binary yes/no, no falloff)
     */
    function isHueInRange(hue: number, rangeSettings: AdjustmentRange): boolean {
        const placement = computeHuePlacement(hue, rangeSettings);
        return placement !== null;
    }

    /**
     * Compute hue contribution for a single range
     */
    function _computeHueContribution(hue: number, rangeSettings: AdjustmentRange, direction: number): number {
        if (!rangeSettings.enabled) return 0;

        const amplitude = rangeSettings.lightnessAmplitude || 0;
        if (amplitude === 0) return 0;

        const placement = computeHuePlacement(hue, rangeSettings);
        if (!placement) return 0;

        const hueFactor = computeHueFalloffFactor(placement, rangeSettings.hueFalloff);
        if (hueFactor <= 0) return 0;

        return direction * amplitude * hueFactor;
    }

    /**
     * Compute range effect — strength only, no lightness falloff.
     * Applies a flat lightness delta to all swatches in the hue range.
     * Darkening subtracts lightness, brightening adds lightness.
     * Strength 0 = no effect, strength 30 (max) = ±30 lightness points.
     */
    function computeRangeEffect(
        hue: number,
        rangeSettings: AdjustmentRange,
        direction: number
    ): number {
        if (!rangeSettings.enabled) return 0;

        const amplitude = rangeSettings.lightnessAmplitude || 0;
        if (amplitude === 0) return 0;

        if (!isHueInRange(hue, rangeSettings)) return 0;

        // Flat delta: direction * amplitude (darkening = negative, brightening = positive)
        return direction * amplitude;
    }

    /**
     * Apply lightness adjustment to a base lightness value
     *
     * @param baseLightness - Original lightness (0-100)
     * @param hue - Hue of the color (0-360)
     * @param index - Which swatch position (0 = darkest)
     * @param count - Total number of swatches
     * @returns Adjusted lightness (0-100)
     */
    function applyAdjustment(baseLightness: number, hue: number, _index: number, _count: number): number {
        const adjustedBase = clamp(baseLightness, 0, 100);

        if (!settings.value.enabled) {
            return adjustedBase;
        }

        const { darkening, brightening } = settings.value;

        const delta
            = computeRangeEffect(hue, brightening, 1)
            + computeRangeEffect(hue, darkening, -1);

        if (delta === 0) return adjustedBase;

        return clamp(adjustedBase + delta, 0, 100);
    }

    /**
     * Reset to default settings
     */
    function resetToDefaults() {
        settings.value = structuredClone(DEFAULT_LIGHTNESS_ADJUSTMENT);
    }

    return {
        settings,
        applyAdjustment,
        resetToDefaults
    };
}

// Export singleton instance for shared state
let _instance: ReturnType<typeof stepLightnessAdjustment> | null = null;

export function useLightnessAdjustment() {
    if (!_instance) {
        _instance = stepLightnessAdjustment();
    }
    return _instance;
}
