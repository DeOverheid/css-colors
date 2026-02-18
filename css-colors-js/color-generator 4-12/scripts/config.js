(function (root) {
  const HUE_NAMES = [
    "crimson",
    "orange",
    "gold",
    "chartreuse",
    "emerald",
    "teal",
    "cerulean",
    "indigo",
    "violet",
    "magenta",
    "rose",
    "scarlet",
  ];

  const CONFIG = Object.freeze({
    SAMPLE_COUNT: 13,
    HUE_NAMES,
    DEFAULT_HUE: 0,
    DEFAULT_SATURATION: 80,
    DEFAULT_LIGHTNESS: 50,
    HUE_INTERVAL: 30,
    HUE_SLIDER_RANGE: { min: -45, max: 45 },
    HUE_LIGHTNESS_ADJUSTMENT: {
      enabled: false,
      rowWeight: {
        min: 0,
      },
      darkening: {
        enabled: true,
        start: 20,
        end: 200,
        hueFalloff: 15,
        lightnessFalloffLight: 0.39,
        lightnessAmplitude: 24,
        lightnessFalloffDark: 0.44,
      },
      brightening: {
        enabled: true,
        start: 210,
        end: 300,
        hueFalloff: 30,
        lightnessFalloffLight: 1.0,
        lightnessAmplitude: 12,
        lightnessFalloffDark: 0.2,
      },
    },
    HUE_ROW_DEFAULT_OFFSETS: {
      crimson: { light: 25, dark: -3 },
      orange: { light: 23, dark: -13 },
      gold: { light: 13, dark: -20 },
      chartreuse: { light: -14, dark: -6 },
      emerald: { light: -7, dark: 9 },
      teal: { light: 0, dark: 13 },
      cerulean: { light: 8, dark: 4 },
      indigo: { light: 11, dark: 0 },
      violet: { light: 7, dark: 1 },
      magenta: { light: 0, dark: 0 },
      rose: { light: -6, dark: 4 },
      scarlet: { light: -13, dark: 9 },
    },
    LIGHT_CONTROL_RANGE: { min: 0, max: 1, step: 0.01 },
    DEFAULT_LIGHT_CONTROL: 0.67,
    DEFAULT_DARK_CONTROL: 0,
  });

  root.ColorGenerator = root.ColorGenerator || {};
  root.ColorGenerator.config = CONFIG;
})(window);
