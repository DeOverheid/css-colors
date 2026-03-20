/**
 * Step: Uniform Lightness Shift
 *
 * Manages four slider values — rainbow dark/light shift and grey dark/light shift
 * — that narrow the X-axis range sampled from the bezier curve.
 *
 * Dark shift: skips the darkest part of the curve (0 = full range, 100 = skip 50%)
 * Light shift: skips the lightest part of the curve (0 = full range, 100 = skip 50%)
 *
 * Rainbow shifts apply to chromatic (color) swatch rows.
 * Grey shifts apply to grey/neutral swatch rows.
 *
 * State is stored per-theme so each preset preserves its own values.
 */
import { useThemes, getThemeById, themes } from "~/composables/themes";

interface ShiftValues {
    darkShift: number;
    lightShift: number;
    greyDarkShift: number;
    greyLightShift: number;
}

function defaultsForTheme(themeId: string): ShiftValues {
    const theme = getThemeById(themeId);
    return {
        darkShift: theme?.defaultRainbowDarkShift ?? 0,
        lightShift: theme?.defaultRainbowLightShift ?? 0,
        greyDarkShift: theme?.defaultGreyDarkShift ?? 0,
        greyLightShift: theme?.defaultGreyLightShift ?? 0
    };
}

/** Reactive state for the shift sliders, stored per theme */
export function stepUniformLightnessShift() {
    const { currentThemeId } = useThemes();

    // Per-theme shift state: { [themeId]: ShiftValues }
    const perThemeShifts = useState<Record<string, ShiftValues>>("per-theme-shifts", () => {
        const map: Record<string, ShiftValues> = {};
        for (const theme of themes) {
            map[theme.id] = defaultsForTheme(theme.id);
        }
        return map;
    });

    // Ensure current theme always has an entry
    function getShifts(): ShiftValues {
        const id = currentThemeId.value;
        if (!perThemeShifts.value[id]) {
            perThemeShifts.value[id] = defaultsForTheme(id);
        }
        return perThemeShifts.value[id];
    }

    const darkShift = computed(() => getShifts().darkShift);
    const lightShift = computed(() => getShifts().lightShift);
    const greyDarkShift = computed(() => getShifts().greyDarkShift);
    const greyLightShift = computed(() => getShifts().greyLightShift);

    function clamp(value: number) {
        return Math.max(0, Math.min(100, value));
    }

    function setDarkShift(value: number) {
        getShifts().darkShift = clamp(value);
    }

    function setLightShift(value: number) {
        getShifts().lightShift = clamp(value);
    }

    function setGreyDarkShift(value: number) {
        getShifts().greyDarkShift = clamp(value);
    }

    function setGreyLightShift(value: number) {
        getShifts().greyLightShift = clamp(value);
    }

    function reset() {
        const defaults = defaultsForTheme(currentThemeId.value);
        const shifts = getShifts();
        shifts.darkShift = defaults.darkShift;
        shifts.lightShift = defaults.lightShift;
        shifts.greyDarkShift = defaults.greyDarkShift;
        shifts.greyLightShift = defaults.greyLightShift;
    }

    return {
        darkShift,
        lightShift,
        greyDarkShift,
        greyLightShift,
        setDarkShift,
        setLightShift,
        setGreyDarkShift,
        setGreyLightShift,
        reset
    };
}
