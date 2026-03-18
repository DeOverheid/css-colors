/**
 * UI Module: Manages CSS variable updates for live color changes
 * Updates CSS variables in the DOM based on color settings and bezier curve.
 *
 * UI CSS vars always use 11 Tailwind-style shade labels (50–950) regardless of
 * the active theme's totalSteps. This ensures the Nuxt UI chrome stays consistent.
 * The swatch display uses the theme's native step count separately.
 *
 * Sets input variables that feed into CSS variable chains in main.css:
 *   - Primary: --hue-slider-value, --saturation-slider-value, --primary-lightness-{shade}
 *   - Grey:    --grey-saturation-{shade}, --grey-lightness-{shade} (hue via --ui-neutral-hue)
 */
import { generateLightnessSteps } from "~/composables/utils/bezierCurve";
import { greySaturationSteps } from "~/composables/utils/greySaturation";
import { GREY_SHADE_LABELS } from "~/composables/utils/greyConstants";
import { useComplementaryColors } from "~/composables/input/useComplementaryColors";
import { stepLightnessDistribution } from "~/composables/input/stepLightnessDistribution";

/** UI always uses 13 total steps (11 inner) for Nuxt UI's TW-style shade names */
const UI_TOTAL_STEPS = 13;

/** Primary shade labels ordered dark → light (always TW-style for UI) */
const PRIMARY_SHADE_LABELS = ["950", "900", "800", "700", "600", "500", "400", "300", "200", "100", "50"] as const;

export function useCssVariables() {
    const colorSettings = useColorSettings();
    const { currentTheme } = useThemes();
    const { uiToneSource, uiToneHue } = useComplementaryColors();
    const { bezierValues, grayscaleBezierValues } = stepLightnessDistribution();

    // UI lightness: always 11 inner values with TW shade names, independent of theme totalSteps
    const uiPrimaryLightness = computed(() =>
        generateLightnessSteps(
            bezierValues.value,
            UI_TOTAL_STEPS,
            currentTheme.value.lightnessMin ?? 0,
            currentTheme.value.lightnessMax ?? 100
        )
    );

    const uiGreyLightness = computed(() =>
        generateLightnessSteps(
            grayscaleBezierValues.value,
            UI_TOTAL_STEPS,
            currentTheme.value.grayscaleLightnessMin ?? 0,
            currentTheme.value.grayscaleLightnessMax ?? 100
        )
    );

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

    // Watch UI lightness changes and push to CSS
    watch(uiPrimaryLightness, () => updatePrimaryLightness());
    watch(uiGreyLightness, () => updateGreyNeutral());

    // Watch tone selection changes and update neutral palette
    watch(
        [uiToneSource, uiToneHue],
        () => updateGreyNeutral()
    );

    /**
     * Push primary lightness steps into CSS variables.
     * Always uses 11 inner values (TW shade names) regardless of theme totalSteps.
     */
    function updatePrimaryLightness() {
        if (!import.meta.client) return;

        const steps = uiPrimaryLightness.value;
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

        // Grey lightness from grayscale bezier (always 11 inner values for UI)
        const greySteps = uiGreyLightness.value;
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
