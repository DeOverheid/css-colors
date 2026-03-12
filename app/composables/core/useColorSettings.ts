import { useConfig } from "~/composables/core/baseConfig";

/**
 * Core Functionality: Manages color values (hue, saturation, lightness)
 */
export function useColorSettings() {
    const config = useConfig();

    const hue = useState("color-hue", () => config.colors.hue);
    const saturation = useState("color-saturation", () => config.colors.saturation);
    const lightness = useState("color-lightness", () => config.colors.lightness);

    return {
        hue,
        saturation,
        lightness
    };
}
