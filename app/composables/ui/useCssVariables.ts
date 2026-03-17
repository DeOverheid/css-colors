/**
 * UI Module: Manages CSS variable updates for live color changes
 * Updates CSS variables in the DOM based on color settings and bezier curve.
 * Sets input variables that feed into CSS variable chains in main.css:
 *   - Primary: --hue-slider-value, --saturation-slider-value, --primary-lightness-{shade}
 *   - Grey:    --grey-saturation-{shade} (hue reuses --hue-slider-value, lightness is static CSS)
 */
import { generateLightnessSteps } from "~/composables/utils/bezierCurve";
import { greySaturationSteps } from "~/composables/utils/greySaturation";
import { GREY_SHADE_LABELS } from "~/composables/utils/greyConstants";

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
        const initialHue = colorSettings.hue.value;
        const initialSaturation = colorSettings.saturation.value;
        const initialLightness = colorSettings.lightness.value;

        document.documentElement.style.setProperty("--hue-slider-value", String(initialHue));
        document.documentElement.style.setProperty("--saturation-slider-value", `${initialSaturation}%`);
        document.documentElement.style.setProperty("--lightness-slider-value", `${initialLightness}%`);

        updatePrimaryLightness();
        updateGreySaturation();
    });

    // Watch for changes and update CSS variables
    watch(
        () => colorSettings.hue.value,
        (newHue) => {
            if (import.meta.client && typeof newHue === "number") {
                document.documentElement.style.setProperty("--hue-slider-value", String(newHue));
            }
        }
    );

    watch(
        () => colorSettings.saturation.value,
        (newSaturation) => {
            if (import.meta.client && typeof newSaturation === "number") {
                document.documentElement.style.setProperty("--saturation-slider-value", `${newSaturation}%`);
                updateGreySaturation();
            }
        }
    );

    watch(
        () => colorSettings.lightness.value,
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

    /**
     * Compute per-shade grey saturation from the bezier curve and apply
     * them to --grey-saturation-{shade} CSS variables.
     * CSS in main.css composes --ui-color-neutral-{shade} from these inputs.
     * Uses indices 1–11 of the 13-step array (skipping black/white endpoints).
     */
    function updateGreySaturation() {
        if (!import.meta.client) return;

        const saturations = greySaturationSteps(colorSettings.saturation.value);

        GREY_SHADE_LABELS.forEach((label, i) => {
            document.documentElement.style.setProperty(
                `--grey-saturation-${label}`,
                `${saturations[i + 1]}%`
            );
        });
    }
}
