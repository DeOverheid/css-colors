import type { BezierCurve, ThemeConfig } from "./lib/types";
import { tailwindTheme } from "./lib/tailwind";
import { mathematicalTheme } from "./lib/mathematical";
import { customTheme } from "./lib/custom";

/**
 * All available themes
 * Add new themes here to make them available in the generator
 */
export const themes: ThemeConfig[] = [
    tailwindTheme,
    mathematicalTheme,
    customTheme
];

/**
 * Default theme ID
 */
export const defaultThemeId = "tailwind";

/**
 * Get a theme by its ID
 */
export function getThemeById(id: string): ThemeConfig | undefined {
    return themes.find(theme => theme.id === id);
}

/**
 * Composable for working with themes in the generator
 */
export function useThemes() {
    const currentThemeId = useState<string>("current-theme", () => defaultThemeId);

    const currentTheme = computed(() => {
        return getThemeById(currentThemeId.value) ?? themes[0]!;
    });

    const availableThemes = computed(() => themes);

    function setTheme(id: string) {
        if (getThemeById(id)) {
            currentThemeId.value = id;
        }
    }

    /**
     * Snapshot the current state into the custom theme slot.
     * Takes the user-edited bezier (from stepLightnessDistribution's per-theme state)
     * and copies the rest from the current theme config.
     * Switches to the custom theme after saving.
     */
    function saveAsCustom(bezier: BezierCurve) {
        const source = currentTheme.value;
        const custom = themes.find(t => t.id === "custom");
        if (!custom) return;

        custom.totalSteps = source.totalSteps;
        custom.swatchLabels = [...source.swatchLabels];
        custom.bezier = { ...bezier };
        custom.grayscaleBezier = source.grayscaleBezier ? { ...source.grayscaleBezier } : undefined;
        custom.lightnessMin = source.lightnessMin;
        custom.lightnessMax = source.lightnessMax;
        custom.grayscaleLightnessMin = source.grayscaleLightnessMin;
        custom.grayscaleLightnessMax = source.grayscaleLightnessMax;
        custom.lightnessAdjustment = source.lightnessAdjustment
            ? JSON.parse(JSON.stringify(source.lightnessAdjustment))
            : undefined;
        custom.defaultRainbowDarkShift = source.defaultRainbowDarkShift;
        custom.defaultRainbowLightShift = source.defaultRainbowLightShift;
        custom.defaultGreyDarkShift = source.defaultGreyDarkShift;
        custom.defaultGreyLightShift = source.defaultGreyLightShift;
        custom.description = `Snapshot based on ${source.name}`;

        // Initialize the custom theme's per-theme bezier state
        const perThemeBezier = useState<Record<string, BezierCurve>>("per-theme-bezier");
        if (perThemeBezier.value) {
            perThemeBezier.value.custom = { ...bezier };
        }

        currentThemeId.value = "custom";
    }

    return {
        currentThemeId,
        currentTheme,
        availableThemes,
        setTheme,
        saveAsCustom
    };
}
