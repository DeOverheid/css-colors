import { useConfig } from "~/composables/core/baseConfig";

/**
 * Core Functionality: Manages color values (hue, lightness, etc.)
 * Placeholder for future expansion into full color system
 */
export function useColorSettings() {
    const config = useConfig();

    // Step 1: Base Color
    const hue = useState("color-hue", () => config.colors.hue);
    const saturation = useState("color-saturation", () => config.colors.saturation);

    // Step 2: Lightness
    const lightness = useState("color-lightness", () => config.colors.lightness);

    // Future: saturation, adjustments, curves, etc. will be added here

    return {
        // Step 1 settings
        step1: {
            hue,
            saturation
        },
        // Step 2 settings
        step2: {
            lightness
        }
    };
}
