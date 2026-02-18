import type { StepContent } from "~/types/fields";

/**
 * Step: Lightness Distribution
 * Handles bezier curve control points for lightness mapping
 */
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

    const content = computed<StepContent>(() => ({
        title: "Lightness Distribution",
        description: "Adjust the bezier curve to control how lightness values are distributed across the color scale.",
        fields: [] // Bezier editor is a custom component, not standard fields
    }));

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
        content,
        bezier: {
            x1,
            y1,
            x2,
            y2
        },
        updateBezier,
        resetToThemeDefaults
    };
}
