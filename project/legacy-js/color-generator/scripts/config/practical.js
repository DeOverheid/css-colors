(function (root) {
    const PRACTICAL_HUE_PRESET = Object.freeze({
        crimson: { hue: 0, light: 25, dark: -3, saturation: 1 },
        flame: { hue: 30, light: 23, dark: -13, saturation: 1 },
        wheat: { hue: 60, light: 13, dark: -20, saturation: 1 },
        lime: { hue: 90, light: -14, dark: -6, saturation: 1 },
        grass: { hue: 120, light: -7, dark: 9, saturation: 1 },
        sea: { hue: 150, light: 0, dark: 13, saturation: 1 },
        sky: { hue: 180, light: 8, dark: 4, saturation: 1 },
        corn: { hue: 210, light: 11, dark: 0, saturation: 1 },
        dusk: { hue: 240, light: 7, dark: 1, saturation: 1 },
        plum: { hue: 270, light: 0, dark: 0, saturation: 1 },
        candy: { hue: 300, light: -6, dark: 4, saturation: 1 },
        salmon: { hue: 330, light: -13, dark: 9, saturation: 1 }
    });

    const PRACTICAL_GREY_PRESET = Object.freeze({
        primary: { hue: 183, light: 0, dark: 0, saturation: 1 },
        muted: { hue: 183, light: 0, dark: 0, saturation: 0.5 },
        gray: { hue: 183, light: 0, dark: 0, saturation: 0.1 },
        neutral: { hue: 183, light: 0, dark: 0, saturation: 0 }
    });

    const PRACTICAL_LIGHTNESS = Object.freeze({
        curve: Object.freeze({
            x1: 0,
            y1: 0,
            x2: 0.67,
            y2: 1
        }),
        range: Object.freeze({ min: 0, max: 100, floor: 0 })
    });

    const SAMPLE_VARIANT_OPTIONS = Object.freeze({
        includePrimaryVariant: true,
        neutralMode: "neutral",
        relativeHue: true
    });

    const paletteConfig = Object.freeze({
        key: "practical",
        label: "Practical",
        isDefault: false,
        sampleCount: 11,
        lightness: PRACTICAL_LIGHTNESS,
        sampleVariantOptions: SAMPLE_VARIANT_OPTIONS,
        HUE_PRESET: PRACTICAL_HUE_PRESET,
        GREY_PRESET: PRACTICAL_GREY_PRESET
    });

    root.ColorGenerator = root.ColorGenerator || {};
    const registry
        = root.ColorGenerator.paletteConfigs
            || (root.ColorGenerator.paletteConfigs = []);
    registry.push(paletteConfig);
    root.ColorGenerator.practicalConfig = paletteConfig;
})(window);
