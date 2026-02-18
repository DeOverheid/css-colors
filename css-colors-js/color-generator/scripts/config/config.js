(function (root) {
  const paletteModules = collectPaletteModules(root);

  if (!paletteModules.length) {
    throw new Error(
      "ColorGenerator config requires at least one palette preset module."
    );
  }

  const BASE_HUE_INTERVAL = 30;
  const DEFAULT_SAMPLE_COUNT = 15;
  const DEFAULT_CONTROL = { dark: 0, light: 0.67 };
  const LIGHT_CONTROL_RANGE = Object.freeze({ min: 0, max: 1, step: 0.01 });

  const paletteEntries = normalizePalettes(paletteModules);
  const paletteMap = Object.create(null);
  const lightnessMap = Object.create(null);
  const presetsMap = Object.create(null);
  const sampleCountMap = Object.create(null);

  paletteEntries.forEach((entry) => {
    paletteMap[entry.key] = entry.definition;
    lightnessMap[entry.key] = entry.lightness;
    presetsMap[entry.key] = entry.presets;
    sampleCountMap[entry.key] = entry.sampleCount;
  });

  const defaultEntry =
    paletteEntries.find((entry) => entry.isDefault) || paletteEntries[0];

  const DEFAULT_PALETTE = defaultEntry.key;
  const DEFAULT_LIGHT_CONTROL = defaultEntry.lightness.controls.light;
  const DEFAULT_DARK_CONTROL = defaultEntry.lightness.controls.dark;
  const DEFAULT_COUNT = defaultEntry.sampleCount;

  const FROZEN_PALETTES = Object.freeze(paletteMap);
  const FROZEN_LIGHTNESS = Object.freeze(lightnessMap);
  const FROZEN_PRESETS = Object.freeze(presetsMap);
  const FROZEN_SAMPLE_COUNTS = Object.freeze(sampleCountMap);

  const CONFIG = Object.freeze({
    SAMPLE_COUNT: DEFAULT_COUNT,
    DEFAULT_PALETTE,
    DEFAULT_HUE: 0,
    DEFAULT_SATURATION: 90,
    DEFAULT_LIGHTNESS: 50,
    HUE_INTERVAL: BASE_HUE_INTERVAL,
    HUE_SLIDER_RANGE: { min: -45, max: 45 },
    HUE_LIGHTNESS_ADJUSTMENT: {
      enabled: true,
      rowWeight: {
        min: 0,
      },
      darkening: {
        enabled: true,
        start: 30,
        end: 210,
        hueFalloff: 15,
        lightnessFalloffLight: 0.48,
        lightnessAmplitude: 9.5,
        lightnessFalloffDark: 0.44,
      },
      brightening: {
        enabled: true,
        start: 210,
        end: 300,
        hueFalloff: 15,
        lightnessFalloffLight: 1.0,
        lightnessAmplitude: 12,
        lightnessFalloffDark: 0.2,
      },
    },
    LIGHT_CONTROL_RANGE,
    DEFAULT_LIGHT_CONTROL,
    DEFAULT_DARK_CONTROL,
    PALETTES: FROZEN_PALETTES,
    PALETTE_LIGHTNESS: FROZEN_LIGHTNESS,
    PALETTE_PRESETS: FROZEN_PRESETS,
    PALETTE_SAMPLE_COUNT: FROZEN_SAMPLE_COUNTS,
    getPalette: (key) => {
      const resolved = resolvePaletteKey(key);
      return resolved ? FROZEN_PALETTES[resolved] || null : null;
    },
    getPaletteSampleCount: (key) => {
      const resolved = resolvePaletteKey(key);
      if (resolved && FROZEN_SAMPLE_COUNTS[resolved]) {
        return FROZEN_SAMPLE_COUNTS[resolved];
      }
      return DEFAULT_COUNT;
    },
    getPaletteLightness: (key) => {
      const resolved = resolvePaletteKey(key);
      if (resolved && FROZEN_LIGHTNESS[resolved]) {
        return FROZEN_LIGHTNESS[resolved];
      }
      return defaultEntry.lightness;
    },
    getPalettePresets: (key) => {
      const resolved = resolvePaletteKey(key);
      if (resolved && FROZEN_PRESETS[resolved]) {
        return FROZEN_PRESETS[resolved];
      }
      return null;
    },
  });

  function resolvePaletteKey(key) {
    if (typeof key === "string" && key && FROZEN_PALETTES[key]) {
      return key;
    }
    return DEFAULT_PALETTE;
  }

  function collectPaletteModules(scope) {
    const registry = scope.ColorGenerator || {};
    const modules = [];

    if (Array.isArray(registry.paletteConfigs)) {
      modules.push(...registry.paletteConfigs);
    }

    if (!modules.length) {
      if (registry.practicalConfig) {
        modules.push(registry.practicalConfig);
      }
      if (registry.tailwindConfig) {
        modules.push(registry.tailwindConfig);
      }
    }

    const unique = new Map();
    modules.forEach((moduleConfig) => {
      if (!moduleConfig) {
        return;
      }
      const key =
        typeof moduleConfig.key === "string" && moduleConfig.key.length
          ? moduleConfig.key
          : `palette-${unique.size + 1}`;
      unique.set(key, moduleConfig);
    });

    return Array.from(unique.values());
  }

  function normalizePalettes(modules) {
    return modules.map((moduleConfig, index) => {
      const key = sanitizeKey(moduleConfig.key, index);
      const label = sanitizeLabel(moduleConfig.label, key);
      const sampleCount = sanitizeSampleCount(
        moduleConfig.sampleCount,
        DEFAULT_SAMPLE_COUNT
      );
      const lightness = freezeLightnessSettings(
        moduleConfig.lightness,
        DEFAULT_CONTROL
      );
      const sampleOptions = sanitizeSampleOptions(
        moduleConfig.sampleVariantOptions
      );
      const huePreset = moduleConfig.HUE_PRESET || {};
      const greyPreset = moduleConfig.GREY_PRESET || {};
      const hues = createHueList(huePreset, key);
      const samples = createGreySampleVariants(greyPreset, sampleOptions);

      return {
        key,
        label,
        sampleCount,
        isDefault: Boolean(moduleConfig.isDefault),
        lightness,
        presets: Object.freeze({ hue: huePreset, grey: greyPreset }),
        definition: Object.freeze({
          key,
          label,
          sampleCount,
          hues,
          samples,
        }),
      };
    });
  }

  function sanitizeKey(value, index) {
    if (typeof value === "string" && value.trim().length) {
      return value.trim();
    }
    return `palette-${index + 1}`;
  }

  function sanitizeLabel(value, fallback) {
    if (typeof value === "string" && value.trim().length) {
      return value.trim();
    }
    return fallback;
  }

  function sanitizeNumber(value, fallback) {
    const number = Number(value);
    return Number.isFinite(number) ? number : fallback;
  }

  function sanitizeSampleCount(value, fallback) {
    const number = Number(value);
    if (!Number.isFinite(number)) {
      return fallback;
    }
    const rounded = Math.round(number);
    if (rounded < 2) {
      return 2;
    }
    return rounded;
  }

  function freezeLightnessSettings(settings, defaultControls) {
    const x1 = sanitizeNumber(settings?.curve?.x1, defaultControls.dark);
    const y1 = sanitizeNumber(settings?.curve?.y1, 0);
    const x2 = sanitizeNumber(settings?.curve?.x2, defaultControls.light);
    const y2 = sanitizeNumber(settings?.curve?.y2, 1);
    const curve = Object.freeze({ x1, y1, x2, y2 });
    const controls = Object.freeze({
      dark: sanitizeNumber(settings?.controls?.dark, x1),
      light: sanitizeNumber(settings?.controls?.light, x2),
    });
    const rangeMin = sanitizeNumber(settings?.range?.min, 0);
    const rangeMax = sanitizeNumber(settings?.range?.max, 100);
    const rangeFloor = sanitizeNumber(settings?.range?.floor, rangeMin);
    const range = Object.freeze({
      min: rangeMin,
      max: rangeMax,
      floor: rangeFloor,
    });
    return Object.freeze({ controls, curve, range });
  }

  function sanitizeSampleOptions(options) {
    const includePrimaryVariant = Boolean(options?.includePrimaryVariant);
    const neutralMode =
      typeof options?.neutralMode === "string"
        ? options.neutralMode
        : "neutral";
    const relativeHue = Boolean(options?.relativeHue);
    return { includePrimaryVariant, neutralMode, relativeHue };
  }

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
      dark: Number(offsets?.dark) || 0,
    };
    const numericSaturation = Number(saturation);
    return Object.freeze({
      name,
      baseHue: normalizeHue(baseHue),
      family,
      offsets: Object.freeze(sanitizedOffsets),
      saturation: Number.isFinite(numericSaturation) ? numericSaturation : 1,
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
          saturation: definition.saturation,
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
      relativeHue = false,
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
            saturationScale,
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
          saturationScale,
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
