/**
 * Step: Lightness Distribution
 * Handles bezier curve control points for lightness mapping
 */
import { generateLightnessSteps } from "~/composables/utils/bezierCurve";

export function stepLightnessDistribution() {
    const { currentTheme } = useThemes();

    // Bezier control points (initialized from current theme)
    const x1 = useState("bezier-x1", () => currentTheme.value.bezier.x1);
    const y1 = useState("bezier-y1", () => currentTheme.value.bezier.y1);
    const x2 = useState("bezier-x2", () => currentTheme.value.bezier.x2);
    const y2 = useState("bezier-y2", () => currentTheme.value.bezier.y2);

    // Watch for theme changes and update bezier values
    watch(currentTheme, (newTheme) => {
        x1.value = newTheme.bezier.x1;
        y1.value = newTheme.bezier.y1;
        x2.value = newTheme.bezier.x2;
        y2.value = newTheme.bezier.y2;
    });

    /** Convenience computed: current bezier as a plain object */
    const bezierValues = computed(() => ({
        x1: x1.value,
        y1: y1.value,
        x2: x2.value,
        y2: y2.value
    }));

    /** Grayscale bezier (falls back to main bezier when theme has none) */
    const grayscaleBezierValues = computed(() => {
        return currentTheme.value.grayscaleBezier ?? bezierValues.value;
    });

    /** Lightness steps computed from bezier + current theme */
    const lightnessSteps = computed(() => {
        return generateLightnessSteps(
            bezierValues.value,
            currentTheme.value.totalSteps,
            currentTheme.value.lightnessMin ?? 0,
            currentTheme.value.lightnessMax ?? 100
        );
    });

    /** Full lightness steps including 0 (black) and 100 (white) */
    const fullLightnessSteps = computed(() => [0, ...lightnessSteps.value, 100]);

    /** Grayscale lightness steps (uses grayscaleBezier + grayscale range if available) */
    const grayscaleLightnessSteps = computed(() => {
        return generateLightnessSteps(
            grayscaleBezierValues.value,
            currentTheme.value.totalSteps,
            currentTheme.value.grayscaleLightnessMin ?? 0,
            currentTheme.value.grayscaleLightnessMax ?? 100
        );
    });

    /** Full grayscale lightness steps including 0 (black) and 100 (white) */
    const fullGrayscaleLightnessSteps = computed(() => [0, ...grayscaleLightnessSteps.value, 100]);

    /**
     * Update bezier values
     */
    function updateBezier(values: { x1: number; y1: number; x2: number; y2: number }) {
        x1.value = values.x1;
        y1.value = values.y1;
        x2.value = values.x2;
        y2.value = values.y2;
    }

    /**
     * Reset to theme defaults
     */
    function resetToThemeDefaults() {
        x1.value = currentTheme.value.bezier.x1;
        y1.value = currentTheme.value.bezier.y1;
        x2.value = currentTheme.value.bezier.x2;
        y2.value = currentTheme.value.bezier.y2;
    }

    return {
        bezier: { x1, y1, x2, y2 },
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
