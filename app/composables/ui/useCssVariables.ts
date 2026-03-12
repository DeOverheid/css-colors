/**
 * UI Module: Manages CSS variable updates for live color changes
 * Updates CSS variables in the DOM based on color settings and bezier curve
 */
import { generateLightnessSteps } from "~/composables/utils/bezierCurve";

/** Primary shade labels ordered dark → light (matches generateLightnessSteps output) */
const PRIMARY_SHADE_LABELS = ["950", "900", "800", "700", "600", "500", "400", "300", "200", "100", "50"] as const;

export function useCssVariables() {
    const colorSettings = useColorSettings();

    // Bezier state (initialized by stepLightnessDistribution before this composable runs)
    const bezierX1 = useState<number>("bezier-x1");
    const bezierY1 = useState<number>("bezier-y1");
    const bezierX2 = useState<number>("bezier-x2");
    const bezierY2 = useState<number>("bezier-y2");

    // Initialize CSS variables from config on client-side
    onMounted(() => {
        const initialHue = colorSettings.step1.hue.value;
        const initialSaturation = colorSettings.step1.saturation.value;
        const initialLightness = colorSettings.step2.lightness.value;

        document.documentElement.style.setProperty("--hue-slider-value", String(initialHue));
        document.documentElement.style.setProperty("--saturation-slider-value", `${initialSaturation}%`);
        document.documentElement.style.setProperty("--lightness-slider-value", `${initialLightness}%`);

        updatePrimaryLightness();
    });

    // Watch for changes and update CSS variables
    watch(
        () => colorSettings.step1.hue.value,
        (newHue) => {
            if (import.meta.client && typeof newHue === "number") {
                document.documentElement.style.setProperty("--hue-slider-value", String(newHue));
            }
        }
    );

    watch(
        () => colorSettings.step1.saturation.value,
        (newSaturation) => {
            if (import.meta.client && typeof newSaturation === "number") {
                document.documentElement.style.setProperty("--saturation-slider-value", `${newSaturation}%`);
            }
        }
    );

    watch(
        () => colorSettings.step2.lightness.value,
        (newLightness) => {
            if (import.meta.client && typeof newLightness === "number") {
                document.documentElement.style.setProperty("--lightness-slider-value", `${newLightness}%`);
            }
        }
    );

    // Watch bezier changes and update primary color scale
    watch(
        [bezierX1, bezierY1, bezierX2, bezierY2],
        () => updatePrimaryLightness()
    );

    /**
     * Compute lightness steps from the current bezier curve and apply
     * them to primary color scale CSS variables.
     * Uses totalSteps=13 (11 shades + 2 endpoints) and 5–95% range
     * for a full UI-appropriate lightness spread.
     */
    function updatePrimaryLightness() {
        if (!import.meta.client) return;

        const steps = generateLightnessSteps(
            bezierX1.value ?? 0.46,
            bezierY1.value ?? 0.13,
            bezierX2.value ?? 0.72,
            bezierY2.value ?? 0.92,
            13, 5, 95
        );

        PRIMARY_SHADE_LABELS.forEach((label, i) => {
            document.documentElement.style.setProperty(
                `--primary-lightness-${label}`,
                `${steps[i]}%`
            );
        });
    }
}
