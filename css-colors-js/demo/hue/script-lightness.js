(() => {
    const DEFAULT_CONFIG = {
        stepCount: 12,
        x1: 0,
        y1: 0,
        x2: 0.67,
        y2: 1
    };

    const clamp = (value, min, max) => Math.min(Math.max(value, min), max);

    const bezierCoord = (t, p0, p1, p2, p3) => {
        const mt = 1 - t;
        return (
            mt * mt * mt * p0
            + 3 * mt * mt * t * p1
            + 3 * mt * t * t * p2
            + t * t * t * p3
        );
    };

    const bezierDerivative = (t, p0, p1, p2, p3) => {
        const mt = 1 - t;
        return (
            3 * mt * mt * (p1 - p0) + 6 * mt * t * (p2 - p1) + 3 * t * t * (p3 - p2)
        );
    };

    const solveForT = (x, x1, x2) => {
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
    };

    const generate = (options = {}) => {
        const config = { ...DEFAULT_CONFIG, ...options };
        const stepCount = Number.isFinite(config.stepCount)
            ? Math.max(2, Math.trunc(config.stepCount))
            : DEFAULT_CONFIG.stepCount;
        const { x1, y1, x2, y2 } = config;
        const results = [];
        for (let index = 0; index < stepCount; index += 1) {
            const progress = stepCount === 1 ? 1 : index / (stepCount - 1);
            const flippedX = 1 - progress;
            const t = solveForT(flippedX, x1, x2);
            const y = bezierCoord(t, 0, y1, y2, 1);
            const lightness = clamp(100 * y, 0, 100);
            results.push(Number(lightness.toFixed(4)));
        }
        return results;
    };

    const api = Object.freeze({ generate });

    Object.defineProperty(window, "LightnessCurve", {
        value: api,
        configurable: true,
        enumerable: false,
        writable: false
    });
})();
