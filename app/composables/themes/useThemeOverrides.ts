/**
 * Theme Overrides
 *
 * Tracks per-theme, per-step mode: "default" or "custom".
 * - default: step uses theme definition defaults (sliders locked)
 * - custom:  step uses user-edited values (sliders editable)
 *
 * Actual setting values live in each step's own per-theme state.
 * This composable only manages the mode toggle and default snapshots.
 *
 * Applicable to steps: lightness-distribution, lightness-adjustment, hue-adjustment
 */
import { themes, useThemes } from "~/composables/themes";
import { useStepNavigation } from "~/composables/steps/useStepNavigation";

export type OverrideMode = "default" | "custom";

/** Step IDs that support the default/custom toggle */
export const OVERRIDABLE_STEPS = [
    "primary-color",
    "complementary-colors",
    "lightness-distribution",
    "lightness-adjustment",
    "hue-adjustment"
] as const;

export type OverridableStepId = (typeof OVERRIDABLE_STEPS)[number];

type ModeMap = Record<string, Record<string, OverrideMode>>;

// Singleton
let _instance: ReturnType<typeof createThemeOverrides> | null = null;

function createThemeOverrides() {
    /**
     * Mode state: { [themeId]: { [stepId]: 'default' | 'custom' } }
     * All themes × all overridable steps start on "default".
     */
    const modes = useState<ModeMap>("theme-override-modes", () => {
        const map: ModeMap = {};
        for (const theme of themes) {
            map[theme.id] = {};
            for (const stepId of OVERRIDABLE_STEPS) {
                map[theme.id]![stepId] = "custom";
            }
        }
        return map;
    });

    /** Get the mode for a given theme + step */
    function getMode(themeId: string, stepId: string): OverrideMode {
        return modes.value[themeId]?.[stepId] ?? "custom";
    }

    /** Set the mode for a given theme + step */
    function setMode(themeId: string, stepId: string, mode: OverrideMode) {
        if (!modes.value[themeId]) {
            modes.value[themeId] = {};
        }
        modes.value[themeId]![stepId] = mode;
    }

    /** Toggle the mode for a given theme + step */
    function toggleMode(themeId: string, stepId: string) {
        const current = getMode(themeId, stepId);
        setMode(themeId, stepId, current === "default" ? "custom" : "default");
    }

    /** Check if a step is in custom mode for the current theme */
    function isCustom(themeId: string, stepId: string): boolean {
        return getMode(themeId, stepId) === "custom";
    }

    /** Check if any step has been set to custom for a given theme */
    function hasAnyCustom(themeId: string): boolean {
        return OVERRIDABLE_STEPS.some(stepId => isCustom(themeId, stepId));
    }

    /** Reset all overridable steps to "custom" for a given theme */
    function resetToCustom(themeId: string) {
        for (const stepId of OVERRIDABLE_STEPS) {
            setMode(themeId, stepId, "custom");
        }
    }

    // When the active theme changes, reset all toggles to "custom"
    const { currentThemeId } = useThemes();
    watch(currentThemeId, (id) => {
        resetToCustom(id);
    });

    // When navigating to a different step, reset that step's toggle to "custom"
    const { activeStepId } = useStepNavigation();
    watch(activeStepId, (stepId) => {
        if (OVERRIDABLE_STEPS.includes(stepId as OverridableStepId)) {
            setMode(currentThemeId.value, stepId, "custom");
        }
    });

    return {
        modes,
        getMode,
        setMode,
        toggleMode,
        isCustom,
        hasAnyCustom,
        resetToCustom
    };
}

export function useThemeOverrides() {
    if (!_instance) {
        _instance = createThemeOverrides();
    }
    return _instance;
}
