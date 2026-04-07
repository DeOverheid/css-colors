/**
 * Step: Lightness Adjustment
 * Hue-based lightness compensation to create perceptual uniformity across colors.
 * Yellow appears brighter than blue at the same HSL lightness; this compensates.
 */
import type { AdjustmentRange, LightnessAdjustmentConfig } from "~/composables/themes/lib/types";
import { DEFAULT_LIGHTNESS_ADJUSTMENT } from "~/composables/themes/lib/types";
import { useSwatchUnlock } from "~/composables/steps/useSwatchUnlock";
import { computeHueStrengthFactor } from "~/composables/utils/hueFalloff";
import { computeLightnessFalloffFactor, computeDarkFalloffFactor } from "~/composables/utils/lightnessFalloff";

export function stepLightnessAdjustment() {
    // Reactive state
    const settings = ref<LightnessAdjustmentConfig>(structuredClone(DEFAULT_LIGHTNESS_ADJUSTMENT));
    const { isUnlocked } = useSwatchUnlock();

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
    function _isHueInRange(hue: number, rangeSettings: AdjustmentRange): boolean {
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
     * Compute effective strength for a range (0–1).
     * Combines base amplitude, hue falloff, and lightness falloff.
     */
    function computeEffectiveStrength(
        hue: number,
        baseLightness: number,
        rangeSettings: AdjustmentRange
    ): number {
        if (!rangeSettings.enabled) return 0;

        const amplitude = rangeSettings.lightnessAmplitude || 0;
        if (amplitude === 0) return 0;

        // Get hue strength factor (0–1) with falloff applied
        const hueFactor = computeHueStrengthFactor(
            hue,
            rangeSettings.start,
            rangeSettings.end,
            rangeSettings.hueFalloff
        );
        if (hueFactor <= 0) return 0;

        // Get lightness falloff factor (0–1): strongest at dark, tapers toward light
        const lightnessFactor = computeLightnessFalloffFactor(
            baseLightness,
            rangeSettings.lightnessFalloffLight * 100
        );

        // Get dark-end falloff factor (0–1): strongest at light, tapers toward dark
        const darkFalloff = computeDarkFalloffFactor(
            baseLightness,
            rangeSettings.lightnessFalloffDark * 100
        );

        return clamp(amplitude / 100, 0, 1) * hueFactor * lightnessFactor * darkFalloff;
    }

    /**
     * Apply lightness adjustment to a base lightness value
     *
     * Darkening compresses toward 0:   result = L * (1 - strength)
     * Brightening compresses toward 100: result = 100 - (100 - L) * (1 - strength)
     *
     * @param baseLightness - Original lightness (0-100)
     * @param hue - Hue of the color (0-360)
     * @param index - Which swatch position (0 = darkest)
     * @param count - Total number of swatches
     * @returns Adjusted lightness (0-100)
     */
    function applyAdjustment(baseLightness: number, hue: number, _index: number, _count: number): number {
        const adjustedBase = clamp(baseLightness, 0, 100);

        if (!settings.value.enabled || !isUnlocked("lightness-adjustment")) {
            return adjustedBase;
        }

        const { darkening, brightening } = settings.value;

        let result = adjustedBase;

        // Darkening: compress toward 0 (black)
        const darkStrength = computeEffectiveStrength(hue, adjustedBase, darkening);
        if (darkStrength > 0) {
            result = result * (1 - darkStrength);
        }

        // Brightening: compress toward 100 (white) — mirror of darkening
        const brightStrength = computeEffectiveStrength(hue, adjustedBase, brightening);
        if (brightStrength > 0) {
            result = 100 - (100 - result) * (1 - brightStrength);
        }

        return clamp(result, 0, 100);
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
