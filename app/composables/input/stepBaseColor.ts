import type { StepContent } from "~/types/fields";
import { useColorSettings } from "~/composables/core/useColorSettings";
import { useCssVariables } from "~/composables/ui/useCssVariables";

/**
 * Step: Base Color
 * Handles hue and saturation input for the base color
 */
export function stepBaseColor() {
    const colorSettings = useColorSettings();

    // Initialize CSS variable updates
    useCssVariables();

    const content = computed<StepContent>(() => ({
        title: "Choose your base color",
        description: "Select a hue and saturation to start building your palette.",
        fields: [
            {
                id: "hue-slider",
                label: "Hue",
                type: "range",
                min: 0,
                max: 360,
                value: colorSettings.step1.hue,
                unit: "°"
            },
            {
                id: "saturation-slider",
                label: "Saturation",
                type: "range",
                min: 0,
                max: 100,
                value: colorSettings.step1.saturation,
                unit: "%"
            }
        ]
    }));

    return {
        content
    };
}
