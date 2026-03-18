/**
 * Step: Lightness Distribution
 * Handles bezier curve control points for lightness mapping.
 * Stores per-theme bezier state so user edits are preserved when switching themes.
 */
import { generateLightnessSteps } from "~/composables/utils/bezierCurve";
import { themes } from "~/composables/themes";
import { sliderToSqueeze } from "~/composables/utils/lightnessOffset";
import { stepUniformLightnessShift } from "~/composables/input/stepUniformLightnessShift";
import type { BezierCurve } from "~/composables/themes/lib/types";

export function stepLightnessDistribution() {
    const { currentTheme, currentThemeId } = useThemes();

    // Per-theme bezier state (preserves user edits per theme, same pattern as stepHueSpectrum)
    const perThemeBezier = useState<Record<string, BezierCurve>>("per-theme-bezier", () => {
        const state: Record<string, BezierCurve> = {};
        for (const theme of themes) {
            state[theme.id] = { ...theme.bezier };
        }
        return state;
    });

    /** Convenience computed: current bezier as a plain object */
    const bezierValues = computed(() => {
        return perThemeBezier.value[currentThemeId.value] ?? currentTheme.value.bezier;
    });

    /** Grayscale bezier (falls back to main bezier when theme has none) */
    const grayscaleBezierValues = computed(() => {
        return currentTheme.value.grayscaleBezier ?? bezierValues.value;
    });

    /** Lightness steps computed from bezier + current theme + squeeze */
    const lightnessSteps = computed(() => {
        const { darkShift, lightShift } = stepUniformLightnessShift();
        return generateLightnessSteps(
            bezierValues.value,
            currentTheme.value.totalSteps,
            currentTheme.value.lightnessMin ?? 0,
            currentTheme.value.lightnessMax ?? 100,
            sliderToSqueeze(darkShift.value),
            sliderToSqueeze(lightShift.value)
        );
    });

    /** Full lightness steps including 0 (black) and 100 (white) */
    const fullLightnessSteps = computed(() => [0, ...lightnessSteps.value, 100]);

    /** Grayscale lightness steps (uses grayscaleBezier + grayscale range + squeeze) */
    const grayscaleLightnessSteps = computed(() => {
        const { darkShift, lightShift } = stepUniformLightnessShift();
        return generateLightnessSteps(
            grayscaleBezierValues.value,
            currentTheme.value.totalSteps,
            currentTheme.value.grayscaleLightnessMin ?? 0,
            currentTheme.value.grayscaleLightnessMax ?? 100,
            sliderToSqueeze(darkShift.value),
            sliderToSqueeze(lightShift.value)
        );
    });

    /** Full grayscale lightness steps including 0 (black) and 100 (white) */
    const fullGrayscaleLightnessSteps = computed(() => [0, ...grayscaleLightnessSteps.value, 100]);

    /**
     * Update bezier values for the current theme
     */
    function updateBezier(values: { x1: number; y1: number; x2: number; y2: number }) {
        perThemeBezier.value[currentThemeId.value] = { ...values };
    }

    /**
     * Reset current theme's bezier to its defaults
     */
    function resetToThemeDefaults() {
        perThemeBezier.value[currentThemeId.value] = { ...currentTheme.value.bezier };
    }

    return {
        bezierValues,
        grayscaleBezierValues,
        lightnessSteps,
        fullLightnessSteps,
        grayscaleLightnessSteps,
        fullGrayscaleLightnessSteps,
        updateBezier,
        resetToThemeDefaults
    };
}
