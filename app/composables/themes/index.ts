import type { ThemeConfig } from "./lib/types";
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

    return {
        currentThemeId,
        currentTheme,
        availableThemes,
        setTheme
    };
}
