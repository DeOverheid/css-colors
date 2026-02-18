import {
  clamp,
  normalizeHue,
  computeGreyFromSaturation,
} from "./color-utils.js";
import { setDatasetNumber, dispatchCustomEvent } from "./dom.js";

const sanitizeComponent = (value, min, max, fallback = 0) => {
  const number = Number(value);
  if (!Number.isFinite(number)) {
    return fallback;
  }
  return clamp(number, min, max);
};

export const sanitizeColor = (color = {}) => {
  const hue = normalizeHue(color.hue ?? 0);
  const saturation = sanitizeComponent(color.saturation, 0, 100, 0);
  const lightness = sanitizeComponent(color.lightness, 0, 100, 0);
  const greySaturation = sanitizeComponent(
    Number.isFinite(color.greySaturation)
      ? color.greySaturation
      : computeGreyFromSaturation(saturation),
    0,
    100,
    0
  );
  const neutralSaturation = sanitizeComponent(
    Number.isFinite(color.neutralSaturation) ? color.neutralSaturation : 0,
    0,
    100,
    0
  );

  return {
    hue,
    saturation,
    lightness,
    greySaturation,
    neutralSaturation,
  };
};

export const applyColorToRow = (row, color) => {
  if (!(row instanceof HTMLElement)) {
    return null;
  }
  const payload = sanitizeColor(color);

  setDatasetNumber(row, "baseHue", payload.hue, 2);
  setDatasetNumber(row, "baseSaturation", payload.saturation, 2);
  setDatasetNumber(row, "inputHue", payload.hue, 2);
  setDatasetNumber(row, "inputSaturation", payload.saturation, 2);
  setDatasetNumber(row, "inputLightness", payload.lightness, 2);
  setDatasetNumber(row, "greySaturation", payload.greySaturation, 2);
  setDatasetNumber(row, "neutralSaturation", payload.neutralSaturation, 2);

  if (window.HueOffset && typeof window.HueOffset.updateRow === "function") {
    window.HueOffset.updateRow(row);
  }

  dispatchCustomEvent(row, "color-demo:input", {
    color: payload,
  });

  return payload;
};

export const applyColorToRows = (entries, baseColor) => {
  const configs = Array.isArray(entries) ? entries : [];
  const basePayload = sanitizeColor(baseColor);
  let primaryResult = null;

  configs.forEach((config, index) => {
    const element = config?.element;
    if (!(element instanceof HTMLElement)) {
      return;
    }
    const nextColor =
      typeof config.transform === "function"
        ? sanitizeColor(config.transform(basePayload))
        : basePayload;
    const result = applyColorToRow(element, nextColor);
    if (index === 0) {
      primaryResult = result;
    }
  });

  return primaryResult ?? basePayload;
};
