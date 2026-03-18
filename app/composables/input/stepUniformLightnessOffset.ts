/**
 * Step: Uniform Lightness Offset
 *
 * Manages two slider values — dark offset and light offset — that apply a
 * uniform, tapered lightness shift across all hue spectrum swatches.
 *
 * Dark offset: pushes swatches toward black (0 = none, 100 = max darkening)
 * Light offset: pushes swatches toward white (0 = none, 100 = max brightening)
 */

/** Reactive state for the uniform lightness offset sliders */
export function stepUniformLightnessOffset() {
    const darkOffset = useState<number>("uniform-lightness-dark-offset", () => 0);
    const lightOffset = useState<number>("uniform-lightness-light-offset", () => 0);

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
