(function (root) {
  function clamp(value, min, max) {
    const number = Number(value);
    if (!Number.isFinite(number)) {
      return min;
    }
    return Math.min(Math.max(number, min), max);
  }

  function normalizeHue(value) {
    const number = Number(value);
    if (!Number.isFinite(number)) {
      return 0;
    }
    const normalized = number % 360;
    return normalized < 0 ? normalized + 360 : normalized;
  }

  function lerp(start, end, t) {
    return start + (end - start) * t;
  }

  function toNumber(value, fallback = 0) {
    const parsed = Number.parseFloat(value ?? "");
    return Number.isFinite(parsed) ? parsed : fallback;
  }

  function roundTo(value, precision) {
    if (!Number.isFinite(value)) {
      return 0;
    }
    const factor = Math.pow(10, precision);
    return Math.round(value * factor) / factor;
  }

  function coerceNumber(value, fallback = 0) {
    const number = Number(value);
    return Number.isFinite(number) ? number : fallback;
  }

  function sanitizeSampleCount(value, fallback = 2) {
    const number = Number(value);
    if (!Number.isFinite(number)) {
      return Number.isFinite(fallback) ? fallback : 2;
    }
    const rounded = Math.round(number);
    if (rounded < 2) {
      return 2;
    }
    return rounded;
  }

  root.ColorGenerator = root.ColorGenerator || {};
  root.ColorGenerator.utils = Object.freeze({
    clamp,
    normalizeHue,
    lerp,
    toNumber,
    roundTo,
    coerceNumber,
    sanitizeSampleCount,
  });
})(window);
