(function (root) {
  const config = root.ColorGenerator?.config;
  const utils = root.ColorGenerator?.utils;
  const lightnessApi = root.ColorGenerator?.lightness;

  if (!config || !utils || !lightnessApi) {
    throw new Error(
      "ColorGenerator state requires config, utils, and lightness modules to load first."
    );
  }

  const listeners = new Set();
  const rowListeners = new Map();
  const rowChangeListeners = new Map();
  const HUE_INTERVAL = config.HUE_INTERVAL;
  const HALF_INTERVAL = HUE_INTERVAL / 2;
  const EPSILON = 1e-6;

  // Shift hue modulo so ranges center around each named hue (e.g. red spans -15..+15).
  function computeHueOffsetFromHue(hue) {
    const normalizedHue = utils.normalizeHue(hue);
    let offset =
      ((normalizedHue + HALF_INTERVAL) % HUE_INTERVAL) - HALF_INTERVAL;
    if (Math.abs(offset + HALF_INTERVAL) < EPSILON) {
      offset =
        normalizedHue >= 360 - HALF_INTERVAL ? -HALF_INTERVAL : HALF_INTERVAL;
    }
    return offset;
  }

  const BASE_CONTROL = {
    x1: config.DEFAULT_DARK_CONTROL,
    y1: 0,
    x2: config.DEFAULT_LIGHT_CONTROL,
    y2: 1,
  };

  const adjustmentDefaults = config.HUE_LIGHTNESS_ADJUSTMENT || {};
  const HUE_SLIDER_RANGE = config.HUE_SLIDER_RANGE || {
    min: -30,
    max: 30,
  };
  const palettes = config.PALETTES || {};
  const paletteKeys = Object.keys(palettes);
  const DEFAULT_PALETTE_KEY = resolveDefaultPalette();
  const paletteOffsets = Object.create(null);
  const paletteLightnessSettings = config.PALETTE_LIGHTNESS || {};
  const paletteLightnessState = Object.create(null);
  const LIGHT_CONTROL_RANGE = config.LIGHT_CONTROL_RANGE || {
    min: 0,
    max: 1,
  };
  const DEFAULT_SAMPLE_COUNT = utils.sanitizeSampleCount(
    config.SAMPLE_COUNT,
    15
  );

  function createAdjustmentRangeDefaults(key) {
    const source = adjustmentDefaults[key] || {};
    const resolveFalloff = (primary, fallback) => {
      const value = Number(primary);
      if (Number.isFinite(value)) {
        return value;
      }
      const fallbackNumber = Number(fallback);
      if (Number.isFinite(fallbackNumber)) {
        return fallbackNumber;
      }
      return 0;
    };
    return {
      enabled: Boolean(source.enabled ?? true),
      start: Number.isFinite(Number(source.start)) ? Number(source.start) : 0,
      end: Number.isFinite(Number(source.end)) ? Number(source.end) : 0,
      lightnessFalloff: Number(source.lightnessFalloff) || 0,
      lightnessFalloffLight: resolveFalloff(
        source.lightnessFalloffLight,
        source.lightnessFalloff
      ),
      lightnessAmplitude: Number(source.lightnessAmplitude) || 0,
      lightnessFalloffDark: resolveFalloff(
        source.lightnessFalloffDark,
        source.lightnessFalloff
      ),
      hueFalloff: Number(source.hueFalloff) || 0,
    };
  }

  function resolveDefaultPalette() {
    if (typeof config.DEFAULT_PALETTE === "string") {
      return config.DEFAULT_PALETTE;
    }
    if (paletteKeys.length) {
      return paletteKeys[0];
    }
    return "practical";
  }

  function sanitizeOffset(source) {
    const clampValue = (value) => {
      const number = utils.coerceNumber(value, 0);
      return utils.clamp(number, HUE_SLIDER_RANGE.min, HUE_SLIDER_RANGE.max);
    };
    return {
      light: clampValue(source?.light),
      dark: clampValue(source?.dark),
    };
  }

  function createOffsetsForPalette(key) {
    const palette = palettes[key];
    const offsets = Object.create(null);
    if (palette && Array.isArray(palette.hues)) {
      palette.hues.forEach((entry) => {
        if (!entry?.name) {
          return;
        }
        offsets[entry.name] = sanitizeOffset(
          entry.offsets || { light: 0, dark: 0 }
        );
      });
    }
    return offsets;
  }

  function ensurePaletteOffsets(key) {
    if (!Object.prototype.hasOwnProperty.call(paletteOffsets, key)) {
      paletteOffsets[key] = createOffsetsForPalette(key);
    }
    return paletteOffsets[key];
  }

  function ensureLightnessState(key) {
    if (!Object.prototype.hasOwnProperty.call(paletteLightnessState, key)) {
      paletteLightnessState[key] = createLightnessState(key);
    }
    return paletteLightnessState[key];
  }

  function createLightnessState(key) {
    const defaults = paletteLightnessSettings[key] || {};
    const sanitizeControl = (value, fallback) => {
      const numeric = utils.coerceNumber(value, fallback);
      return utils.clamp(
        numeric,
        LIGHT_CONTROL_RANGE.min,
        LIGHT_CONTROL_RANGE.max
      );
    };
    const sanitizeCurveValue = (value, fallback) => {
      return utils.coerceNumber(value, fallback);
    };
    const sanitizeRangeBound = (value, fallback) => {
      return utils.coerceNumber(value, fallback);
    };
    const baseControls = {
      dark: sanitizeControl(
        defaults?.controls?.dark,
        config.DEFAULT_DARK_CONTROL
      ),
      light: sanitizeControl(
        defaults?.controls?.light,
        config.DEFAULT_LIGHT_CONTROL
      ),
    };
    const curve = {
      x1: sanitizeCurveValue(defaults?.curve?.x1, baseControls.dark),
      y1: sanitizeCurveValue(defaults?.curve?.y1, BASE_CONTROL.y1),
      x2: sanitizeCurveValue(defaults?.curve?.x2, baseControls.light),
      y2: sanitizeCurveValue(defaults?.curve?.y2, BASE_CONTROL.y2),
    };
    const rangeMin = sanitizeRangeBound(defaults?.range?.min, 0);
    const rangeMax = sanitizeRangeBound(defaults?.range?.max, 100);
    const rangeFloor = sanitizeRangeBound(defaults?.range?.floor, rangeMin);
    const range = {
      min: rangeMin,
      max: rangeMax,
      floor: rangeFloor,
    };
    return {
      controls: baseControls,
      curve,
      range,
    };
  }

  function getSampleCountForPalette(key) {
    const fallback = DEFAULT_SAMPLE_COUNT;
    if (config && typeof config.getPaletteSampleCount === "function") {
      const value = config.getPaletteSampleCount(key);
      return utils.sanitizeSampleCount(value, fallback);
    }
    const palette = getPalette(key);
    if (palette && Number.isFinite(palette.sampleCount)) {
      return utils.sanitizeSampleCount(palette.sampleCount, fallback);
    }
    return fallback;
  }

  function getPalette(key) {
    if (typeof key === "string" && palettes[key]) {
      return palettes[key];
    }
    return palettes[DEFAULT_PALETTE_KEY] || null;
  }

  function getHueDefinitions(key) {
    const resolvedKey = typeof key === "string" ? key : DEFAULT_PALETTE_KEY;
    const palette = getPalette(resolvedKey);
    if (!palette || !Array.isArray(palette.hues)) {
      return [];
    }
    return palette.hues.map((entry) => ({
      name: entry.name,
      baseHue: entry.baseHue,
      family: entry.family || palette.key,
    }));
  }

  function getSampleVariants(key) {
    const resolvedKey = typeof key === "string" ? key : DEFAULT_PALETTE_KEY;
    const palette = getPalette(resolvedKey);
    if (!palette || !Array.isArray(palette.samples)) {
      return [];
    }
    return palette.samples.slice();
  }

  function ensureOffsetEntry(name, paletteKey) {
    const key = paletteKey || state.palette;
    const offsets = ensurePaletteOffsets(key);
    if (!Object.prototype.hasOwnProperty.call(offsets, name)) {
      const palette = getPalette(key);
      const defaultEntry = Array.isArray(palette?.hues)
        ? palette.hues.find((entry) => entry.name === name)
        : null;
      offsets[name] = sanitizeOffset(
        defaultEntry?.offsets || { light: 0, dark: 0 }
      );
    }
    return offsets[name];
  }

  ensurePaletteOffsets(DEFAULT_PALETTE_KEY);
  const defaultLightness = ensureLightnessState(DEFAULT_PALETTE_KEY);
  const defaultSampleCount = getSampleCountForPalette(DEFAULT_PALETTE_KEY);

  const state = {
    sampleCount: defaultSampleCount,
    primary: {
      hue: config.DEFAULT_HUE,
      saturation: config.DEFAULT_SATURATION,
      lightness: config.DEFAULT_LIGHTNESS,
    },
    hueOffset: computeHueOffsetFromHue(config.DEFAULT_HUE),
    palette: DEFAULT_PALETTE_KEY,
    controls: {
      light: defaultLightness.controls.light,
      dark: defaultLightness.controls.dark,
    },
    controlPoints: { ...defaultLightness.curve },
    lightnessRange: { ...defaultLightness.range },
    lightnessSteps: [],
    hueRows: [],
    hueRowOffsets: ensurePaletteOffsets(DEFAULT_PALETTE_KEY),
    sampleRows: Object.create(null),
    lastParsedColor: null,
    highlightMode: "row",
    lightnessAdjustmentEnabled: Boolean(adjustmentDefaults?.enabled ?? true),
    lightnessAdjustments: {
      brightening: createAdjustmentRangeDefaults("brightening"),
      darkening: createAdjustmentRangeDefaults("darkening"),
    },
  };

  function recalcLightnessSteps() {
    state.lightnessSteps = lightnessApi.createSteps({
      sampleCount: state.sampleCount,
      controls: state.controlPoints,
      range: state.lightnessRange,
    });
  }

  function emitChange() {
    recalcLightnessSteps();
    listeners.forEach((handler) => {
      if (typeof handler === "function") {
        handler(getSnapshot());
      }
    });
  }

  function getSnapshot() {
    return {
      sampleCount: state.sampleCount,
      primary: { ...state.primary },
      hueOffset: state.hueOffset,
      controls: { ...state.controls },
      controlPoints: { ...state.controlPoints },
      lightnessSteps: [...state.lightnessSteps],
      hueRows: state.hueRows.map((entry) => ({ ...entry })),
      hueRowOffsets: { ...state.hueRowOffsets },
      sampleRows: { ...state.sampleRows },
      lastParsedColor: state.lastParsedColor
        ? { ...state.lastParsedColor }
        : null,
      highlightMode: state.highlightMode,
      palette: state.palette,
      lightnessAdjustmentEnabled: state.lightnessAdjustmentEnabled,
      lightnessAdjustments: {
        brightening: { ...state.lightnessAdjustments.brightening },
        darkening: { ...state.lightnessAdjustments.darkening },
      },
      lightnessRange: { ...state.lightnessRange },
    };
  }

  function subscribe(handler) {
    if (typeof handler === "function") {
      listeners.add(handler);
      handler(getSnapshot());
    }
    return () => listeners.delete(handler);
  }

  function registerSampleRows(entries) {
    if (!entries) {
      return;
    }
    state.sampleRows = { ...entries };
    emitChange();
  }

  function registerHueRows(rows) {
    ensurePaletteOffsets(state.palette);
    state.hueRows = Array.isArray(rows) ? rows.slice() : [];
    state.hueRows.forEach((entry) => {
      const name = entry.name;
      if (!name) {
        return;
      }
      ensureOffsetEntry(name);
    });
    emitChange();
  }

  function setPrimaryFromSliders({ hue, saturation, lightness }) {
    const normalizedHue = utils.normalizeHue(hue);
    const clampedSaturation = utils.clamp(saturation, 0, 100);
    const numericLightness = Number(lightness);
    const clampedLightness = Number.isFinite(numericLightness)
      ? Math.round(utils.clamp(numericLightness, 0, 100))
      : state.primary.lightness;
    state.primary.hue = normalizedHue;
    state.primary.saturation = clampedSaturation;
    state.primary.lightness = clampedLightness;
    state.hueOffset = computeHueOffsetFromHue(normalizedHue);
    state.highlightMode = "row";
    emitChange();
  }

  function applyParsedColor(color) {
    if (!color) {
      return;
    }
    state.primary.hue = utils.normalizeHue(color.hue);
    state.primary.saturation = utils.clamp(color.saturation, 0, 100);
    const parsedLightness = utils.clamp(color.lightness, 0, 100);
    state.primary.lightness = Math.round(parsedLightness);
    state.hueOffset = computeHueOffsetFromHue(state.primary.hue);
    state.lastParsedColor = {
      hue: state.primary.hue,
      saturation: state.primary.saturation,
      lightness: state.primary.lightness,
    };
    state.highlightMode = "sample";
    emitChange();
  }

  function setLightControls({ light, dark }) {
    const range = config.LIGHT_CONTROL_RANGE;
    const x2 = utils.clamp(light, range.min, range.max);
    const x1 = utils.clamp(dark, range.min, range.max);
    state.controls.light = x2;
    state.controls.dark = x1;
    const paletteSettings = ensureLightnessState(state.palette);
    paletteSettings.controls.light = x2;
    paletteSettings.controls.dark = x1;
    state.controlPoints = {
      x1,
      y1: paletteSettings.curve.y1,
      x2,
      y2: paletteSettings.curve.y2,
    };
    paletteSettings.curve.x1 = state.controlPoints.x1;
    paletteSettings.curve.x2 = state.controlPoints.x2;
    emitChange();
  }

  function setHueRowOffset(name, offsets) {
    if (!name) {
      return;
    }
    ensureOffsetEntry(name);
    const current = state.hueRowOffsets[name];
    const next = sanitizeOffset({
      light: offsets?.light ?? current.light,
      dark: offsets?.dark ?? current.dark,
    });
    state.hueRowOffsets[name] = next;
    const handler = rowListeners.get(name);
    if (typeof handler === "function") {
      handler({ ...next });
    }
    const changeHandler = rowChangeListeners.get(name);
    if (typeof changeHandler === "function") {
      changeHandler({ ...next });
    }
    emitChange();
  }

  function setLightnessAdjustmentEnabled(enabled) {
    const next = Boolean(enabled);
    if (state.lightnessAdjustmentEnabled === next) {
      return;
    }
    state.lightnessAdjustmentEnabled = next;
    emitChange();
  }

  function setLightnessAdjustment(range, field, value) {
    if (!range || !field) {
      return;
    }
    const target = state.lightnessAdjustments[range];
    if (!target) {
      return;
    }
    const numericValue = Number(value);
    if (!Number.isFinite(numericValue)) {
      return;
    }
    let nextValue = numericValue;
    if (field === "lightnessAmplitude") {
      nextValue = utils.clamp(numericValue, -50, 50);
    } else if (field === "hueFalloff") {
      nextValue = utils.clamp(numericValue, 0, 180);
    } else if (field === "start" || field === "end") {
      nextValue = utils.clamp(numericValue, 0, 360);
    } else if (field === "enabled") {
      nextValue = Boolean(value);
    } else if (field === "lightnessFalloff") {
      nextValue = utils.clamp(numericValue, 0, 1);
    } else {
      nextValue = utils.clamp(numericValue, 0, 1);
    }
    if (target[field] === nextValue) {
      return;
    }
    target[field] = nextValue;
    emitChange();
  }

  function getLightnessAdjustments() {
    return {
      brightening: { ...state.lightnessAdjustments.brightening },
      darkening: { ...state.lightnessAdjustments.darkening },
      enabled: state.lightnessAdjustmentEnabled,
      rowWeight: adjustmentDefaults.rowWeight || { min: 0 },
    };
  }

  function onHueRowOffset(name, handler) {
    if (typeof handler === "function") {
      rowListeners.set(name, handler);
    }
    return () => {
      rowListeners.delete(name);
    };
  }

  function onHueRowChange(name, handler) {
    if (typeof handler === "function") {
      rowChangeListeners.set(name, handler);
    }
    return () => {
      rowChangeListeners.delete(name);
    };
  }

  function setPalette(key) {
    if (typeof key !== "string") {
      return;
    }
    const palette = palettes[key] || null;
    if (!palette) {
      return;
    }
    const nextKey = palette.key || key;
    if (state.palette === nextKey) {
      return;
    }
    state.palette = nextKey;
    state.hueRowOffsets = ensurePaletteOffsets(state.palette);
    const nextSampleCount = getSampleCountForPalette(state.palette);
    if (nextSampleCount !== state.sampleCount) {
      state.sampleCount = nextSampleCount;
    }
    applyPaletteLightness(state.palette);
    emitChange();
  }

  function applyPaletteLightness(key) {
    const settings = ensureLightnessState(key);
    state.controls = {
      light: settings.controls.light,
      dark: settings.controls.dark,
    };
    state.controlPoints = {
      x1: settings.curve.x1,
      y1: settings.curve.y1,
      x2: settings.curve.x2,
      y2: settings.curve.y2,
    };
    state.lightnessRange = {
      min: settings.range.min,
      max: settings.range.max,
      floor: settings.range.floor,
    };
  }

  recalcLightnessSteps();

  root.ColorGenerator = root.ColorGenerator || {};
  root.ColorGenerator.state = Object.freeze({
    getSnapshot,
    subscribe,
    registerSampleRows,
    registerHueRows,
    setPrimaryFromSliders,
    applyParsedColor,
    setLightControls,
    setHueRowOffset,
    onHueRowOffset,
    onHueRowChange,
    setLightnessAdjustmentEnabled,
    setLightnessAdjustment,
    getLightnessAdjustments,
    setPalette,
    getPalette: (key) =>
      getPalette(typeof key === "string" ? key : state.palette),
    getHueDefinitions: (key) =>
      getHueDefinitions(typeof key === "string" ? key : state.palette),
    getSampleVariants: (key) =>
      getSampleVariants(typeof key === "string" ? key : state.palette),
    getPaletteKey: () => state.palette,
  });
})(window);
