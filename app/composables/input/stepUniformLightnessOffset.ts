/**
 * Step: Uniform Lightness Squeeze
 *
 * Manages two slider values — dark squeeze and light squeeze — that narrow
 * the X-axis range sampled from the bezier curve.
 *
 * Dark squeeze: skips the darkest part of the curve (0 = full range, 100 = skip 50%)
 * Light squeeze: skips the lightest part of the curve (0 = full range, 100 = skip 50%)
 */
import { useThemes } from "~/composables/themes";

/** Reactive state for the squeeze sliders */
export function stepUniformLightnessOffset() {
    const { currentTheme } = useThemes();

    const darkOffset = useState<number>("uniform-lightness-dark-offset", () =>
        currentTheme.value.defaultDarkSqueeze ?? 0
    );
    const lightOffset = useState<number>("uniform-lightness-light-offset", () =>
        currentTheme.value.defaultLightSqueeze ?? 0
    );

    function setDarkOffset(value: number) {
        darkOffset.value = Math.max(0, Math.min(100, value));
    }

    function setLightOffset(value: number) {
        lightOffset.value = Math.max(0, Math.min(100, value));
    }

    function reset() {
        darkOffset.value = 0;
        lightOffset.value = 0;
    }

    return {
        darkOffset: readonly(darkOffset),
        lightOffset: readonly(lightOffset),
        setDarkOffset,
        setLightOffset,
        reset
    };
}
