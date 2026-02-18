(function (root) {
  const TAILWIND_HUE_PRESET = Object.freeze({
    red: { hue: 357, light: 3, dark: 2, saturation: 1 },
    orange: { hue: 24.6, light: 8.8, dark: -11.6, saturation: 1 },
    amber: { hue: 37.7, light: 10.3, dark: -16.8, saturation: 1 },
    yellow: { hue: 45.4, light: 9.1, dark: -19.4, saturation: 1 },
    lime: { hue: 83.7, light: -5.5, dark: 5.5, saturation: 1 },
    green: { hue: 142.1, light: -3.6, dark: 2.8, saturation: 1 },
    emerald: { hue: 160.1, light: -8.4, dark: 5.6, saturation: 1 },
    teal: { hue: 173.4, light: -7.3, dark: 5.2, saturation: 1 },
    cyan: { hue: 188.7, light: -5.6, dark: 8.3, saturation: 1 },
    sky: { hue: 198.6, light: 5.4, dark: 5.4, saturation: 1 },
    blue: { hue: 217.2, light: -3.5, dark: 9.0, saturation: 1 },
    indigo: { hue: 238.7, light: -12.9, dark: 5.0, saturation: 1 },
    violet: { hue: 258.3, light: -8.3, dark: 2.9, saturation: 1 },
    purple: { hue: 270.7, light: -0.7, dark: 2.8, saturation: 1 },
    fuchsia: { hue: 292.2, light: -3.1, dark: 4.6, saturation: 1 },
    pink: { hue: 330.4, light: -3.1, dark: 5.8, saturation: 1 },
    rose: { hue: 349.7, light: 6.0, dark: -6.6, saturation: 1 },
  });

  const TAILWIND_GREY_PRESET = Object.freeze({
    slate: { hue: 215.4, light: -5.4, dark: 13.2, saturation: 0.18 },
    gray: { hue: 220, light: -10, dark: 4, saturation: 0.1 },
    zinc: { hue: 240, light: 120, dark: 0, saturation: 0.04 },
    neutral: { hue: 0, light: 0, dark: 0, saturation: 0 },
    stone: { hue: 25, light: 35, dark: -5, saturation: 0.6 },
  });

  root.ColorGenerator = root.ColorGenerator || {};
  root.ColorGenerator.tailwindConfig = Object.freeze({
    HUE_PRESET: TAILWIND_HUE_PRESET,
    GREY_PRESET: TAILWIND_GREY_PRESET,
  });
})(window);
