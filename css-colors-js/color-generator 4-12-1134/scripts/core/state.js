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
  const hueOffsetDefaults = config.HUE_ROW_DEFAULT_OFFSETS || {};
  const HUE_SLIDER_RANGE = config.HUE_SLIDER_RANGE || {
    min: -30,
    max: 30,
  };

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

  function createInitialHueOffsets() {
    const offsets = Object.create(null);
    if (Array.isArray(config.HUE_NAMES)) {
      config.HUE_NAMES.forEach((name) => {
        offsets[name] = readDefaultHueOffset(name);
      });
    }
    return offsets;
  }

  function readDefaultHueOffset(name) {
    const entry = hueOffsetDefaults?.[name];
    const clampValue = (value) => {
      const number = Number(value);
      if (!Number.isFinite(number)) {
        return 0;
      }
      return utils.clamp(number, HUE_SLIDER_RANGE.min, HUE_SLIDER_RANGE.max);
    };
    if (!entry) {
      return { light: 0, dark: 0 };
    }
    return {
      light: clampValue(entry.light),
      dark: clampValue(entry.dark),
    };
  }

  const state = {
    sampleCount: config.SAMPLE_COUNT,
    primary: {
      hue: config.DEFAULT_HUE,
      saturation: config.DEFAULT_SATURATION,
      lightness: config.DEFAULT_LIGHTNESS,
    },
    hueOffset: computeHueOffsetFromHue(config.DEFAULT_HUE),
    controls: {
      light: config.DEFAULT_LIGHT_CONTROL,
      dark: config.DEFAULT_DARK_CONTROL,
    },
    controlPoints: { ...BASE_CONTROL },
    lightnessSteps: [],
    hueRows: [],
    hueRowOffsets: createInitialHueOffsets(),
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
      lightnessAdjustmentEnabled: state.lightnessAdjustmentEnabled,
      lightnessAdjustments: {
        brightening: { ...state.lightnessAdjustments.brightening },
        darkening: { ...state.lightnessAdjustments.darkening },
      },
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
    state.hueRows = Array.isArray(rows) ? rows.slice() : [];
    state.hueRows.forEach((entry) => {
      const name = entry.name;
      if (!state.hueRowOffsets[name]) {
        state.hueRowOffsets[name] = readDefaultHueOffset(name);
      }
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
    state.controlPoints = {
      x1,
      y1: BASE_CONTROL.y1,
      x2,
      y2: BASE_CONTROL.y2,
    };
    emitChange();
  }

  function setHueRowOffset(name, offsets) {
    if (!name) {
      return;
    }
    const current = state.hueRowOffsets[name] || readDefaultHueOffset(name);
    const normalize = (value, fallback) => {
      const number = Number(value);
      return Number.isFinite(number) ? number : fallback;
    };
    const lightRaw = normalize(offsets?.light, current.light);
    const darkRaw = normalize(offsets?.dark, current.dark);
    const next = {
      light: utils.clamp(
        lightRaw,
        config.HUE_SLIDER_RANGE.min,
        config.HUE_SLIDER_RANGE.max
      ),
      dark: utils.clamp(
        darkRaw,
        config.HUE_SLIDER_RANGE.min,
        config.HUE_SLIDER_RANGE.max
      ),
    };
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
  });
})(window);
