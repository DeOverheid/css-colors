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
    HUE_SLIDER_RANGE: { min: -30, max: 30 },
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
        lightnessAmplitude: 8,
        lightnessFalloffLight: 0.3,
        lightnessFalloffDark: 0.3,
      },
      brightening: {
        enabled: true,
        start: 210,
        end: 300,
        hueFalloff: 30,
        lightnessAmplitude: 4,
        lightnessFalloffLight: 0.6,
        lightnessFalloffDark: 0.3,
      },
    },
    LIGHT_CONTROL_RANGE: { min: 0, max: 1, step: 0.01 },
    DEFAULT_LIGHT_CONTROL: 0.67,
    DEFAULT_DARK_CONTROL: 0,
  });

  root.ColorGenerator = root.ColorGenerator || {};
  root.ColorGenerator.config = CONFIG;
})(window);
