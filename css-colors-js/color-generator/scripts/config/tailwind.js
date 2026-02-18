(function (root) {
  const TAILWIND_HUE_PRESET = Object.freeze({
    red: { hue: 357, light: 0, dark: 2, saturation: 1 },
    orange: { hue: 30, light: 0, dark: -15, saturation: 1 },
    amber: { hue: 37.7, light: 15, dark: -30, saturation: 1 },
    yellow: { hue: 45.4, light: 22, dark: -24, saturation: 1 },
    lime: { hue: 83.7, light: -9, dark: -1, saturation: 1 },
    green: { hue: 142.1, light: -4, dark: 3, saturation: 1 },
    emerald: { hue: 160.1, light: -17, dark: 2, saturation: 1 },
    teal: { hue: 173.4, light: -7, dark: 5, saturation: 1 },
    cyan: { hue: 188.7, light: -12, dark: 3, saturation: 1 },
    sky: { hue: 198.6, light: 5, dark: 5, saturation: 1 },
    blue: { hue: 217.2, light: 0, dark: 4, saturation: 1 },
    indigo: { hue: 238.7, light: -13, dark: 9, saturation: 1 },
    violet: { hue: 258.3, light: -13, dark: 3, saturation: 1 },
    purple: { hue: 270.7, light: -4, dark: 7, saturation: 1 },
    fuchsia: { hue: 292.2, light: -6, dark: 7, saturation: 1 },
    pink: { hue: 330.4, light: -8, dark: -3, saturation: 1 },
    rose: { hue: 349.7, light: 8, dark: -16, saturation: 1 },
  });

  const TAILWIND_GREY_PRESET = Object.freeze({
    slate: { hue: 215.4, light: -5.4, dark: 13.2, saturation: 0.18 },
    gray: { hue: 220, light: -10, dark: 4, saturation: 0.1 },
    zinc: { hue: 240, light: 120, dark: 0, saturation: 0.04 },
    neutral: { hue: 0, light: 0, dark: 0, saturation: 0 },
    stone: { hue: 25, light: 35, dark: -5, saturation: 0.6 },
  });

  const TAILWIND_LIGHTNESS = Object.freeze({
    curve: Object.freeze({
      x1: 0.12,
      y1: 0,
      x2: 0.87,
      y2: 1,
    }),
    range: Object.freeze({ min: 10, max: 100, floor: 0 }),
  });

  const SAMPLE_VARIANT_OPTIONS = Object.freeze({
    includePrimaryVariant: false,
    neutralMode: "neutral",
    relativeHue: false,
  });

  const paletteConfig = Object.freeze({
    key: "tailwind",
    label: "Tailwind",
    isDefault: true,
    sampleCount: 15,
    lightness: TAILWIND_LIGHTNESS,
    sampleVariantOptions: SAMPLE_VARIANT_OPTIONS,
    HUE_PRESET: TAILWIND_HUE_PRESET,
    GREY_PRESET: TAILWIND_GREY_PRESET,
  });

  root.ColorGenerator = root.ColorGenerator || {};
  const registry =
    root.ColorGenerator.paletteConfigs ||
    (root.ColorGenerator.paletteConfigs = []);
  registry.push(paletteConfig);
  root.ColorGenerator.tailwindConfig = paletteConfig;
})(window);
