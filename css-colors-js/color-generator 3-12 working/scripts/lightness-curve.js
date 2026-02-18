(function (root) {
  function clamp(value, min, max) {
    return Math.min(Math.max(value, min), max);
  }

  function bezierCoord(t, p0, p1, p2, p3) {
    const mt = 1 - t;
    return (
      mt * mt * mt * p0 +
      3 * mt * mt * t * p1 +
      3 * mt * t * t * p2 +
      t * t * t * p3
    );
  }

  function bezierDerivative(t, p0, p1, p2, p3) {
    const mt = 1 - t;
    return (
      3 * mt * mt * (p1 - p0) + 6 * mt * t * (p2 - p1) + 3 * t * t * (p3 - p2)
    );
  }

  function solveForT(x, x1, x2) {
    let t = clamp(x, 0, 1);
    for (let iteration = 0; iteration < 12; iteration += 1) {
      const xt = bezierCoord(t, 0, x1, x2, 1);
      const dxt = bezierDerivative(t, 0, x1, x2, 1);
      if (Math.abs(dxt) < 1e-6) {
        break;
      }
      t -= (xt - x) / dxt;
      t = clamp(t, 0, 1);
    }
    return t;
  }

  function createSteps({ sampleCount, controls }) {
    const count = Math.max(2, sampleCount | 0);
    const interiorCount = Math.max(0, count - 2);
    const steps = new Array(count);
    steps[0] = 100;
    for (let index = 0; index < interiorCount; index += 1) {
      const progress = (index + 1) / (interiorCount + 1);
      const flippedX = 1 - progress;
      const t = solveForT(flippedX, controls.x1, controls.x2);
      const y = bezierCoord(t, 0, controls.y1, controls.y2, 1);
      const lightness = clamp(100 * y, 0, 100);
      steps[index + 1] = Number(lightness.toFixed(4));
    }
    if (count > 1) {
      steps[count - 1] = 0;
    }
    return steps;
  }

  const api = Object.freeze({
    createSteps,
  });

  root.ColorGenerator = root.ColorGenerator || {};
  root.ColorGenerator.lightness = api;
})(window);
