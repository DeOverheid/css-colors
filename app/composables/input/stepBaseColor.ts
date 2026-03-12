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

    return {
        colorSettings
    };
}
