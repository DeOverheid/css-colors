/**
 * UI Module: Manages CSS variable updates for live color changes
 * Updates CSS variables in the DOM based on color settings
 */
export function useCssVariables() {
    const colorSettings = useColorSettings();

    // Initialize CSS variables from config on client-side
    onMounted(() => {
        const initialHue = colorSettings.step1.hue.value;
        const initialSaturation = colorSettings.step1.saturation.value;
        const initialLightness = colorSettings.step2.lightness.value;

        document.documentElement.style.setProperty("--hue-slider-value", String(initialHue));
        document.documentElement.style.setProperty("--saturation-slider-value", `${initialSaturation}%`);
        document.documentElement.style.setProperty("--lightness-slider-value", `${initialLightness}%`);
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
}
