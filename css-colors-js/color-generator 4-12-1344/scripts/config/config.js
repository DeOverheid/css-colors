(function (root) {
    const practicalConfig = root.ColorGenerator?.practicalConfig;
    const tailwindConfig = root.ColorGenerator?.tailwindConfig;

    if (!practicalConfig || !tailwindConfig) {
        throw new Error(
            "ColorGenerator config requires practical and tailwind preset modules to load first."
        );
    }

    const PRACTICAL_HUE_PRESET = practicalConfig.HUE_PRESET || {};
    const PRACTICAL_GREY_PRESET = practicalConfig.GREY_PRESET || {};
    const TAILWIND_HUE_PRESET = tailwindConfig.HUE_PRESET || {};
    const TAILWIND_GREY_PRESET = tailwindConfig.GREY_PRESET || {};

    const BASE_HUE_INTERVAL = 30;

    const PRACTICAL_HUES = createHueList(PRACTICAL_HUE_PRESET, "practical");
    const TAILWIND_HUES = createHueList(TAILWIND_HUE_PRESET, "tailwind");

    const PRACTICAL_SAMPLES = createGreySampleVariants(PRACTICAL_GREY_PRESET, {
        includePrimaryVariant: true,
        neutralMode: "neutral",
        relativeHue: true
    });

    const TAILWIND_SAMPLES = createGreySampleVariants(TAILWIND_GREY_PRESET, {
        includePrimaryVariant: false,
        neutralMode: "neutral"
    });

    const PALETTES = Object.freeze({
        practical: Object.freeze({
            key: "practical",
            label: "Practical",
            hues: PRACTICAL_HUES,
            samples: PRACTICAL_SAMPLES
        }),
        tailwind: Object.freeze({
            key: "tailwind",
            label: "Tailwind",
            hues: TAILWIND_HUES,
            samples: TAILWIND_SAMPLES
        })
    });

    const DEFAULT_PALETTE = "practical";

    const CONFIG = Object.freeze({
        SAMPLE_COUNT: 15,
        PRACTICAL_HUE_PRESET,
        PRACTICAL_GREY_PRESET,
        TAILWIND_HUE_PRESET,
        TAILWIND_GREY_PRESET,
        PALETTES,
        DEFAULT_PALETTE,
        DEFAULT_HUE: 183,
        DEFAULT_SATURATION: 66,
        DEFAULT_LIGHTNESS: 50,
        HUE_INTERVAL: BASE_HUE_INTERVAL,
        HUE_SLIDER_RANGE: { min: -45, max: 45 },
        HUE_LIGHTNESS_ADJUSTMENT: {
            enabled: true,
            rowWeight: {
                min: 0
            },
            darkening: {
                enabled: true,
                start: 30,
                end: 210,
                hueFalloff: 15,
                lightnessFalloffLight: 0.48,
                lightnessAmplitude: 9.5,
                lightnessFalloffDark: 0.44
            },
            brightening: {
                enabled: true,
                start: 210,
                end: 300,
                hueFalloff: 15,
                lightnessFalloffLight: 1.0,
                lightnessAmplitude: 12,
                lightnessFalloffDark: 0.2
            }
        },
        LIGHT_CONTROL_RANGE: { min: 0, max: 1, step: 0.01 },
        DEFAULT_LIGHT_CONTROL: 0.67,
        DEFAULT_DARK_CONTROL: 0
    });

    function normalizeHue(value) {
        const number = Number(value);
        if (!Number.isFinite(number)) {
            return 0;
        }
        const normalized = number % 360;
        return normalized < 0 ? normalized + 360 : normalized;
    }

    function freezeHueEntry({ name, baseHue, family, offsets, saturation }) {
        const sanitizedOffsets = {
            light: Number(offsets?.light) || 0,
            dark: Number(offsets?.dark) || 0
        };
        const numericSaturation = Number(saturation);
        return Object.freeze({
            name,
            baseHue: normalizeHue(baseHue),
            family,
            offsets: Object.freeze(sanitizedOffsets),
            saturation: Number.isFinite(numericSaturation) ? numericSaturation : 1
        });
    }

    function createHueList(preset, family) {
        const entries = [];
        Object.entries(preset).forEach(([name, definition]) => {
            if (!definition) {
                return;
            }
            entries.push(
                freezeHueEntry({
                    name,
                    baseHue: definition.hue,
                    family,
                    offsets: { light: definition.light, dark: definition.dark },
                    saturation: definition.saturation
                })
            );
        });
        return Object.freeze(entries);
    }

    function createGreySampleVariants(
        preset,
        {
            includePrimaryVariant = false,
            neutralMode = "neutral",
            relativeHue = false
        } = {}
    ) {
        const variants = [];
        Object.entries(preset).forEach(([rawKey, definition]) => {
            if (!definition) {
                return;
            }
            const key = rawKey === "pramary" ? "primary" : rawKey;
            if (key === "primary") {
                if (includePrimaryVariant) {
                    variants.push(Object.freeze({ key: "primary", mode: "primary" }));
                }
                return;
            }
            if (key === "neutral" && neutralMode === "neutral") {
                variants.push(Object.freeze({ key: "neutral", mode: "neutral" }));
                return;
            }
            const saturationScale = sanitizeScale(definition.saturation);
            if (relativeHue) {
                variants.push(
                    Object.freeze({
                        key,
                        mode: "primary-scale",
                        saturationScale
                    })
                );
                return;
            }
            const hue = normalizeHue(definition.hue);
            variants.push(
                Object.freeze({
                    key,
                    mode: "fixed",
                    hue,
                    saturationScale
                })
            );
        });
        return Object.freeze(variants);
    }

    function sanitizeScale(value) {
        const number = Number(value);
        if (!Number.isFinite(number)) {
            return 1;
        }
        if (number < 0) {
            return 0;
        }
        return number;
    }

    root.ColorGenerator = root.ColorGenerator || {};
    root.ColorGenerator.config = CONFIG;
})(window);
