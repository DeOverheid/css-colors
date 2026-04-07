/**
 * UI Module: Manages CSS variable updates for live color changes
 * Updates CSS variables in the DOM based on color settings and bezier curve.
 *
 * UI CSS vars always use 11 Tailwind-style shade labels (50–950) regardless of
 * the active theme's totalSteps. This ensures the Nuxt UI chrome stays consistent.
 * The swatch display uses the theme's native step count separately.
 *
 * Sets both input variables (--hue-slider-value, --primary-lightness-*) and
 * composed output variables (--ui-color-primary-*, --ui-color-secondary-*)
 * directly as inline styles to guarantee they override Nuxt UI's @layer theme defaults.
 */
import { generateLightnessSteps } from "~/composables/utils/bezierCurve";
import { greySaturationSteps } from "~/composables/utils/greySaturation";
import { GREY_SHADE_LABELS } from "~/composables/utils/greyConstants";
import { useComplementaryColors } from "~/composables/input/useComplementaryColors";
import { stepLightnessDistribution } from "~/composables/input/stepLightnessDistribution";
import { stepUniformLightnessShift } from "~/composables/input/stepUniformLightnessShift";
import { sliderToSqueeze } from "~/composables/utils/lightnessOffset";
import { useSwatchUnlock } from "~/composables/steps/useSwatchUnlock";

/** UI always uses 13 total steps (11 inner) for Nuxt UI's TW-style shade names */
const UI_TOTAL_STEPS = 13;

/** Primary shade labels ordered dark → light (always TW-style for UI) */
const PRIMARY_SHADE_LABELS = ["950", "900", "800", "700", "600", "500", "400", "300", "200", "100", "50"] as const;

export function useCssVariables() {
    const colorSettings = useColorSettings();
    const { currentTheme } = useThemes();
    const { uiToneSource, uiToneHue, secondaryHue } = useComplementaryColors();
    const { bezierValues } = stepLightnessDistribution();
    const { darkShift, lightShift, greyDarkShift, greyLightShift } = stepUniformLightnessShift();
    const { isUnlocked } = useSwatchUnlock();

    // UI lightness: always 11 inner values with TW shade names, independent of theme totalSteps
    const uiPrimaryLightness = computed(() =>
        generateLightnessSteps(
            bezierValues.value,
            UI_TOTAL_STEPS,
            currentTheme.value.lightnessMin ?? 0,
            currentTheme.value.lightnessMax ?? 100,
            sliderToSqueeze(darkShift.value),
            sliderToSqueeze(lightShift.value)
        )
    );

    const uiGreyLightness = computed(() =>
        generateLightnessSteps(
            bezierValues.value,
            UI_TOTAL_STEPS,
            currentTheme.value.grayscaleLightnessMin ?? 0,
            currentTheme.value.grayscaleLightnessMax ?? 100,
            sliderToSqueeze(greyDarkShift.value),
            sliderToSqueeze(greyLightShift.value)
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
        updatePrimaryUiColors();
        updateSecondaryUiColors();
        updateGreyNeutral();
    });

    // Watch for changes and update CSS variables
    watch(
        () => colorSettings.hue.value,
        (newHue) => {
            if (import.meta.client && typeof newHue === "number") {
                document.documentElement.style.setProperty("--hue-slider-value", String(newHue));
                updatePrimaryUiColors();
                updateSecondaryUiColors();
            }
        }
    );

    watch(
        () => colorSettings.saturation.value,
        (newSaturation) => {
            if (import.meta.client && typeof newSaturation === "number") {
                document.documentElement.style.setProperty("--saturation-slider-value", `${newSaturation}%`);
                updatePrimaryUiColors();
                updateSecondaryUiColors();
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
    watch(uiPrimaryLightness, () => {
        updatePrimaryLightness();
        updatePrimaryUiColors();
        updateSecondaryUiColors();
    });
    watch(uiGreyLightness, () => updateGreyNeutral());

    // Watch tone selection changes and update neutral palette
    watch(
        [uiToneSource, uiToneHue],
        () => updateGreyNeutral()
    );

    // Watch secondary hue changes and update secondary UI colors
    watch(secondaryHue, () => updateSecondaryUiColors());

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
     * Set --ui-color-primary-* directly as inline styles.
     * Inline styles override all CSS layers, preventing Nuxt UI's green defaults
     * from bleeding through.
     */
    function updatePrimaryUiColors() {
        if (!import.meta.client) return;

        const hue = colorSettings.hue.value;
        const sat = colorSettings.saturation.value;
        const steps = uiPrimaryLightness.value;
        PRIMARY_SHADE_LABELS.forEach((label, i) => {
            document.documentElement.style.setProperty(
                `--ui-color-primary-${label}`,
                `hsl(${hue} ${sat}% ${steps[i]}%)`
            );
        });
    }

    /**
     * Set --ui-color-secondary-* directly as inline styles.
     * Before step 2 is visited (secondary not yet unlocked), secondary mirrors primary.
     * After step 2, secondary uses the complementary hue.
     */
    function updateSecondaryUiColors() {
        if (!import.meta.client) return;

        const hue = isUnlocked("secondary")
            ? secondaryHue.value
            : colorSettings.hue.value;
        const sat = colorSettings.saturation.value;
        const steps = uiPrimaryLightness.value;
        PRIMARY_SHADE_LABELS.forEach((label, i) => {
            document.documentElement.style.setProperty(
                `--ui-color-secondary-${label}`,
                `hsl(${hue} ${sat}% ${steps[i]}%)`
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

        // Set per-shade saturations and compose final --ui-color-neutral-* inline
        // (inline styles override Nuxt UI's @layer theme plugin that would otherwise win)
        if (tone === "neutral") {
            GREY_SHADE_LABELS.forEach((label, i) => {
                document.documentElement.style.setProperty(
                    `--grey-saturation-${label}`,
                    "0%"
                );
                document.documentElement.style.setProperty(
                    `--ui-color-neutral-${label}`,
                    `hsl(0 0% ${greySteps[i]}%)`
                );
            });
        } else {
            const saturations = greySaturationSteps(
                colorSettings.saturation.value,
                UI_TOTAL_STEPS,
                currentTheme.value.greySaturationMax ?? 25,
                currentTheme.value.greySaturationMin ?? 3
            );
            GREY_SHADE_LABELS.forEach((label, i) => {
                document.documentElement.style.setProperty(
                    `--grey-saturation-${label}`,
                    `${saturations[i + 1]}%`
                );
                document.documentElement.style.setProperty(
                    `--ui-color-neutral-${label}`,
                    `hsl(${toneHue} ${saturations[i + 1]}% ${greySteps[i]}%)`
                );
            });
        }
    }
}
