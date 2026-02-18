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

  root.ColorGenerator = root.ColorGenerator || {};
  root.ColorGenerator.utils = Object.freeze({
    clamp,
    normalizeHue,
    lerp,
    toNumber,
    roundTo,
  });
})(window);
