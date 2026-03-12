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
     * Compute lightness position falloff factor
     * index: which swatch (0 = darkest, count-1 = lightest)
     * count: total swatches
     */
    function computeLightnessFalloffFactor(
        index: number,
        count: number,
        falloffLight: number,
        falloffDark: number
    ): number {
        if (count <= 1) return 1;

        const normalizedIndex = clamp(index / (count - 1), 0, 1);
        const normFalloffLight = clamp(falloffLight, 0, 1);
        const normFalloffDark = clamp(falloffDark, 0, 1);

        // fromLight: how much the light end affects this position
        const fromLight = normFalloffLight > 0
            ? Math.min(1, normalizedIndex / normFalloffLight)
            : 1;

        // fromDark: how much the dark end affects this position
        const fromDark = normFalloffDark > 0
            ? Math.min(1, (1 - normalizedIndex) / normFalloffDark)
            : 1;

        return Math.min(fromLight, fromDark);
    }

    /**
     * Compute hue contribution for a single range
     */
    function computeHueContribution(hue: number, rangeSettings: AdjustmentRange, direction: number): number {
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
     * Compute range effect with lightness position falloff
     */
    function computeRangeEffect(
        hue: number,
        index: number,
        count: number,
        rangeSettings: AdjustmentRange,
        direction: number
    ): number {
        const baseContribution = computeHueContribution(hue, rangeSettings, direction);
        if (baseContribution === 0) return 0;

        const lightnessFactor = computeLightnessFalloffFactor(
            index,
            count,
            rangeSettings.lightnessFalloffLight,
            rangeSettings.lightnessFalloffDark
        );

        return baseContribution * lightnessFactor;
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
    function applyAdjustment(baseLightness: number, hue: number, index: number, count: number): number {
        const adjustedBase = clamp(baseLightness, 0, 100);

        if (!settings.value.enabled) {
            return adjustedBase;
        }

        const { darkening, brightening } = settings.value;

        // Darkening reduces lightness (negative direction)
        // Brightening increases lightness (positive direction)
        const delta
            = computeRangeEffect(hue, index, count, brightening, 1)
            + computeRangeEffect(hue, index, count, darkening, -1);

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
