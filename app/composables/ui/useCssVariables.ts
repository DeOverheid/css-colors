/**
 * UI Module: Manages CSS variable updates for live color changes
 * Updates CSS variables in the DOM based on color settings and bezier curve.
 * Reads lightness from stepLightnessDistribution (bezier-computed, single source of truth).
 * Sets input variables that feed into CSS variable chains in main.css:
 *   - Primary: --hue-slider-value, --saturation-slider-value, --primary-lightness-{shade}
 *   - Grey:    --grey-saturation-{shade}, --grey-lightness-{shade} (hue via --ui-neutral-hue)
 */
import { greySaturationSteps } from "~/composables/utils/greySaturation";
import { GREY_SHADE_LABELS } from "~/composables/utils/greyConstants";
import { useComplementaryColors } from "~/composables/input/useComplementaryColors";
import { stepLightnessDistribution } from "~/composables/input/stepLightnessDistribution";

/** Primary shade labels ordered dark → light (matches generateLightnessSteps output) */
const PRIMARY_SHADE_LABELS = ["950", "900", "800", "700", "600", "500", "400", "300", "200", "100", "50"] as const;

export function useCssVariables() {
    const colorSettings = useColorSettings();
    const { uiToneSource, uiToneHue } = useComplementaryColors();
    const { lightnessSteps, grayscaleLightnessSteps } = stepLightnessDistribution();

    // Initialize CSS variables from config on client-side
    onMounted(() => {
        const initialHue = colorSettings.hue.value;
        const initialSaturation = colorSettings.saturation.value;
        const initialLightness = colorSettings.lightness.value;

        document.documentElement.style.setProperty("--hue-slider-value", String(initialHue));
        document.documentElement.style.setProperty("--saturation-slider-value", `${initialSaturation}%`);
        document.documentElement.style.setProperty("--lightness-slider-value", `${initialLightness}%`);

        updatePrimaryLightness();
        updateGreyNeutral();
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
                updateGreyNeutral();
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

    // Watch bezier-computed lightness changes and push to CSS
    watch(lightnessSteps, () => updatePrimaryLightness());
    watch(grayscaleLightnessSteps, () => updateGreyNeutral());

    // Watch tone selection changes and update neutral palette
    watch(
        [uiToneSource, uiToneHue],
        () => updateGreyNeutral()
    );

    /**
     * Push bezier-computed primary lightness steps into CSS variables.
     * Reads from stepLightnessDistribution — no local recomputation.
     */
    function updatePrimaryLightness() {
        if (!import.meta.client) return;

        const steps = lightnessSteps.value;
        PRIMARY_SHADE_LABELS.forEach((label, i) => {
            document.documentElement.style.setProperty(
                `--primary-lightness-${label}`,
                `${steps[i]}%`
            );
        });
    }

    /**
     * Update grey saturation, lightness, and neutral hue CSS variables based on tone selection.
     *
     * Sets --ui-neutral-hue to the selected tone's hue.
     * Sets --grey-saturation-{shade} from bezier-curved distribution (or 0% for "neutral").
     * Sets --grey-lightness-{shade} from grayscaleLightnessSteps (bezier-computed).
     */
    function updateGreyNeutral() {
        if (!import.meta.client) return;

        const tone = uiToneSource.value;
        const toneHue = uiToneHue.value;

        // Set the neutral hue (for "neutral" tone, hue is irrelevant since sat=0)
        document.documentElement.style.setProperty(
            "--ui-neutral-hue",
            tone === "neutral" ? "0" : String(toneHue)
        );

        // Grey lightness from grayscale bezier (single source of truth)
        const greySteps = grayscaleLightnessSteps.value;
        GREY_SHADE_LABELS.forEach((label, i) => {
            document.documentElement.style.setProperty(
                `--grey-lightness-${label}`,
                `${greySteps[i]}%`
            );
        });

        // Set per-shade saturations: zero for "neutral", bezier-curved otherwise
        if (tone === "neutral") {
            GREY_SHADE_LABELS.forEach((label) => {
                document.documentElement.style.setProperty(
                    `--grey-saturation-${label}`,
                    "0%"
                );
            });
        }
        else {
            const saturations = greySaturationSteps(colorSettings.saturation.value);
            GREY_SHADE_LABELS.forEach((label, i) => {
                document.documentElement.style.setProperty(
                    `--grey-saturation-${label}`,
                    `${saturations[i + 1]}%`
                );
            });
        }
    }
}
