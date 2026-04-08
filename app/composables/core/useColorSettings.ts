import { useConfig } from "~/composables/core/baseConfig";
import { useThemes, getThemeById, themes as allThemes } from "~/composables/themes";
import { useThemeOverrides } from "~/composables/themes/useThemeOverrides";

/**
 * Core Functionality: Manages color values (hue, saturation, lightness)
 * Saturation is stored per-theme so each preset can have its own default.
 */
export function useColorSettings() {
    const config = useConfig();
    const { currentThemeId } = useThemes();
    const { isCustom } = useThemeOverrides();

    // Per-theme hue state
    const perThemeHue = useState<Record<string, number>>("per-theme-hue", () => {
        const map: Record<string, number> = {};
        for (const theme of allThemes) {
            map[theme.id] = theme.defaultHue ?? config.colors.hue;
        }
        return map;
    });

    const hue = computed({
        get: () => {
            const id = currentThemeId.value;
            if (!isCustom(id, "primary-color")) {
                const theme = getThemeById(id);
                return theme?.defaultHue ?? config.colors.hue;
            }
            if (perThemeHue.value[id] === undefined) {
                const theme = getThemeById(id);
                perThemeHue.value[id] = theme?.defaultHue ?? config.colors.hue;
            }
            return perThemeHue.value[id];
        },
        set: (value: number) => {
            perThemeHue.value[currentThemeId.value] = value;
        }
    });
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
            if (!isCustom(id, "primary-color")) {
                const theme = getThemeById(id);
                return theme?.defaultSaturation ?? config.colors.saturation;
            }
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
