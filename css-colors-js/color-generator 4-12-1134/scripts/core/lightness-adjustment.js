(function (root) {
  const config = root.ColorGenerator?.config;
  const utils = root.ColorGenerator?.utils;

  if (!config || !utils) {
    throw new Error(
      "ColorGenerator.lightnessAdjustment requires config and utils to load first."
    );
  }

  function isEnabled() {
    const active = getActiveSettings();
    if (active && Object.prototype.hasOwnProperty.call(active, "enabled")) {
      return Boolean(active.enabled);
    }
    return true;
  }

  function getActiveSettings() {
    const stateApi = root.ColorGenerator?.state;
    if (stateApi && typeof stateApi.getLightnessAdjustments === "function") {
      return stateApi.getLightnessAdjustments();
    }
    return config.HUE_LIGHTNESS_ADJUSTMENT || {};
  }

  function getRowWeightSettings(settings) {
    return settings?.rowWeight || {};
  }

  function getRowWeightMinimum(weightSettings) {
    const min = Number(weightSettings.min);
    if (Number.isFinite(min)) {
      return utils.clamp(min, 0, 1);
    }
    return 0;
  }

  function resolveEnabled(override) {
    return typeof override === "boolean" ? override : isEnabled();
  }

  function apply(baseLightness, { hue, index = 0, count = 1, enabled } = {}) {
    const adjustedBase = utils.clamp(baseLightness, 0, 100);
    if (!resolveEnabled(enabled)) {
      return adjustedBase;
    }

    const settings = getActiveSettings();
    const rowWeightSettings = getRowWeightSettings(settings);
    const brightening = settings?.brightening;
    const darkening = settings?.darkening;

    const context = {
      hue,
      index: clampIndex(index, count),
      count: normalizeCount(count),
    };

    const delta =
      computeRangeEffect(context, brightening, rowWeightSettings, 1) +
      computeRangeEffect(context, darkening, rowWeightSettings, -1);

    if (!delta) {
      return adjustedBase;
    }

    return utils.clamp(adjustedBase + delta, 0, 100);
  }

  function computeHueDelta(hue, { enabled } = {}) {
    if (!resolveEnabled(enabled)) {
      return 0;
    }
    const settings = getActiveSettings();
    return (
      computeHueContribution(hue, settings?.brightening, 1) +
      computeHueContribution(hue, settings?.darkening, -1)
    );
  }

  function computeRangeEffect(
    context,
    rangeSettings,
    rowWeightSettings,
    direction
  ) {
    const baseContribution = computeHueContribution(
      context.hue,
      rangeSettings,
      direction
    );
    if (!baseContribution) {
      return 0;
    }

    const lightFalloff = resolveLightnessFalloffValue(
      rangeSettings?.lightnessFalloffLight,
      rangeSettings?.lightnessFalloff
    );
    const darkFalloff = resolveLightnessFalloffValue(
      rangeSettings?.lightnessFalloffDark,
      rangeSettings?.lightnessFalloff
    );

    const lightnessFactor = computeLightnessFalloffFactor(
      context.index,
      context.count,
      lightFalloff,
      darkFalloff
    );
    if (lightnessFactor <= 0) {
      return 0;
    }

    const minWeight = getRowWeightMinimum(rowWeightSettings || {});
    const weight = minWeight + (1 - minWeight) * lightnessFactor;
    return baseContribution * weight;
  }

  function computeHueContribution(hue, rangeSettings, direction) {
    if (!rangeSettings) {
      return 0;
    }
    if (
      Object.prototype.hasOwnProperty.call(rangeSettings, "enabled") &&
      !rangeSettings.enabled
    ) {
      return 0;
    }

    const amplitude = Number(rangeSettings.lightnessAmplitude) || 0;
    if (!amplitude) {
      return 0;
    }

    const placement = computeHuePlacement(hue, rangeSettings);
    if (!placement) {
      return 0;
    }

    const hueFactor = computeHueFalloffFactor(
      placement,
      rangeSettings.hueFalloff
    );
    if (hueFactor <= 0) {
      return 0;
    }

    return direction * amplitude * hueFactor;
  }

  function computeHuePlacement(hue, rangeSettings) {
    const startValue = Number(rangeSettings?.start);
    const endValue = Number(rangeSettings?.end);
    if (!Number.isFinite(startValue) || !Number.isFinite(endValue)) {
      return null;
    }
    const start = utils.normalizeHue(startValue);
    const end = utils.normalizeHue(endValue);
    if (start === end) {
      return null;
    }
    const normalizedHue = utils.normalizeHue(hue);
    return computeProgressWithinRange(normalizedHue, start, end);
  }

  function computeHueFalloffFactor(rangeInfo, falloffValue) {
    const falloff = Number(falloffValue);
    if (!Number.isFinite(falloff) || falloff <= 0) {
      return 1;
    }
    const span = rangeInfo.span;
    if (span <= 0) {
      return 0;
    }

    const distanceFromStart = rangeInfo.distance;
    const distanceToEnd = span - rangeInfo.distance;

    const startFactor =
      distanceFromStart < falloff ? distanceFromStart / falloff : 1;
    const endFactor = distanceToEnd < falloff ? distanceToEnd / falloff : 1;

    return Math.min(startFactor, endFactor);
  }

  function computeLightnessFalloffFactor(
    index,
    count,
    falloffLightValue,
    falloffDarkValue
  ) {
    const normalizedCount = normalizeCount(count);
    if (normalizedCount <= 1) {
      return 1;
    }
    const normalizedIndex = utils.clamp(index / (normalizedCount - 1), 0, 1);

    const falloffLight = normalizeFalloffValue(falloffLightValue);
    const falloffDark = normalizeFalloffValue(falloffDarkValue);

    const fromLight =
      falloffLight > 0 ? Math.min(1, normalizedIndex / falloffLight) : 1;
    const fromDark =
      falloffDark > 0 ? Math.min(1, (1 - normalizedIndex) / falloffDark) : 1;

    return Math.min(fromLight, fromDark);
  }

  function resolveLightnessFalloffValue(primary, fallback) {
    const primaryNumber = Number(primary);
    if (Number.isFinite(primaryNumber)) {
      return primaryNumber;
    }
    const fallbackNumber = Number(fallback);
    if (Number.isFinite(fallbackNumber)) {
      return fallbackNumber;
    }
    return 0;
  }

  function normalizeFalloffValue(raw) {
    const number = Number(raw);
    if (!Number.isFinite(number) || number <= 0) {
      return 0;
    }
    return utils.clamp(number, 0, 1);
  }

  function clampIndex(index, count) {
    const normalizedCount = normalizeCount(count);
    if (normalizedCount <= 1) {
      return 0;
    }
    if (!Number.isFinite(index)) {
      return 0;
    }
    return utils.clamp(index, 0, normalizedCount - 1);
  }

  function normalizeCount(count) {
    const number = Number(count);
    if (!Number.isFinite(number) || number < 1) {
      return 1;
    }
    return Math.max(1, Math.floor(number));
  }

  function computeProgressWithinRange(hue, start, end) {
    const normalizedHue = utils.normalizeHue(hue);
    if (start === end) {
      return null;
    }
    let distance;
    let span;
    if (start < end) {
      if (normalizedHue < start || normalizedHue > end) {
        return null;
      }
      distance = normalizedHue - start;
      span = end - start;
    } else {
      span = 360 - start + end;
      if (normalizedHue >= start) {
        distance = normalizedHue - start;
      } else if (normalizedHue <= end) {
        distance = 360 - start + normalizedHue;
      } else {
        return null;
      }
    }
    const progress = span > 0 ? distance / span : 0;
    return {
      progress,
      distance,
      span,
    };
  }

  root.ColorGenerator = root.ColorGenerator || {};
  root.ColorGenerator.lightnessAdjustment = Object.freeze({
    apply,
    computeHueDelta,
  });
})(window);
