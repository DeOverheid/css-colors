import { useConfig } from "~/composables/core/baseConfig";
import { useThemes, getThemeById, themes as allThemes } from "~/composables/themes";

/**
 * Core Functionality: Manages color values (hue, saturation, lightness)
 * Saturation is stored per-theme so each preset can have its own default.
 */
export function useColorSettings() {
    const config = useConfig();
    const { currentThemeId } = useThemes();

    const hue = useState("color-hue", () => config.colors.hue);
    const lightness = useState("color-lightness", () => config.colors.lightness);

    // Per-theme saturation state
    const perThemeSaturation = useState<Record<string, number>>("per-theme-saturation", () => {
        const map: Record<string, number> = {};
        for (const theme of allThemes) {
            map[theme.id] = theme.defaultSaturation ?? config.colors.saturation;
        }
        return map;
    });

    const saturation = computed({
        get: () => {
            const id = currentThemeId.value;
            if (perThemeSaturation.value[id] === undefined) {
                const theme = getThemeById(id);
                perThemeSaturation.value[id] = theme?.defaultSaturation ?? config.colors.saturation;
            }
            return perThemeSaturation.value[id];
        },
        set: (value: number) => {
            perThemeSaturation.value[currentThemeId.value] = value;
        }
    });

    return {
        hue,
        saturation,
        lightness
    };
}
