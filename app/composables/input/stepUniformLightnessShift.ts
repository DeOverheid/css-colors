/**
 * Step: Uniform Lightness Shift
 *
 * Manages two slider values — dark shift and light shift — that narrow
 * the X-axis range sampled from the bezier curve.
 *
 * Dark shift: skips the darkest part of the curve (0 = full range, 100 = skip 50%)
 * Light shift: skips the lightest part of the curve (0 = full range, 100 = skip 50%)
 */
import { useThemes } from "~/composables/themes";

/** Reactive state for the shift sliders */
export function stepUniformLightnessShift() {
    const { currentTheme } = useThemes();

    const darkShift = useState<number>("uniform-lightness-dark-shift", () =>
        currentTheme.value.defaultDarkSqueeze ?? 0
    );
    const lightShift = useState<number>("uniform-lightness-light-shift", () =>
        currentTheme.value.defaultLightSqueeze ?? 0
    );

    function setDarkShift(value: number) {
        darkShift.value = Math.max(0, Math.min(100, value));
    }

    function setLightShift(value: number) {
        lightShift.value = Math.max(0, Math.min(100, value));
    }

    function reset() {
        darkShift.value = 0;
        lightShift.value = 0;
    }

    return {
        darkShift: readonly(darkShift),
        lightShift: readonly(lightShift),
        setDarkShift,
        setLightShift,
        reset
    };
}
