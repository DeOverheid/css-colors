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
 */
import { useThemes } from "~/composables/themes";

/** Reactive state for the shift sliders */
export function stepUniformLightnessShift() {
    const { currentTheme } = useThemes();

    // Rainbow (chromatic) shifts
    const darkShift = useState<number>("uniform-lightness-dark-shift", () =>
        currentTheme.value.defaultRainbowDarkShift ?? currentTheme.value.defaultDarkSqueeze ?? 0
    );
    const lightShift = useState<number>("uniform-lightness-light-shift", () =>
        currentTheme.value.defaultRainbowLightShift ?? currentTheme.value.defaultLightSqueeze ?? 0
    );

    // Grey shifts
    const greyDarkShift = useState<number>("uniform-grey-dark-shift", () =>
        currentTheme.value.defaultGreyDarkShift ?? 0
    );
    const greyLightShift = useState<number>("uniform-grey-light-shift", () =>
        currentTheme.value.defaultGreyLightShift ?? 0
    );

    function setDarkShift(value: number) {
        darkShift.value = Math.max(0, Math.min(100, value));
    }

    function setLightShift(value: number) {
        lightShift.value = Math.max(0, Math.min(100, value));
    }

    function setGreyDarkShift(value: number) {
        greyDarkShift.value = Math.max(0, Math.min(100, value));
    }

    function setGreyLightShift(value: number) {
        greyLightShift.value = Math.max(0, Math.min(100, value));
    }

    function reset() {
        darkShift.value = currentTheme.value.defaultRainbowDarkShift ?? 0;
        lightShift.value = currentTheme.value.defaultRainbowLightShift ?? 0;
        greyDarkShift.value = currentTheme.value.defaultGreyDarkShift ?? 0;
        greyLightShift.value = currentTheme.value.defaultGreyLightShift ?? 0;
    }

    return {
        darkShift: readonly(darkShift),
        lightShift: readonly(lightShift),
        greyDarkShift: readonly(greyDarkShift),
        greyLightShift: readonly(greyLightShift),
        setDarkShift,
        setLightShift,
        setGreyDarkShift,
        setGreyLightShift,
        reset
    };
}
