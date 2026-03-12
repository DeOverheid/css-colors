export function useBezierCurve() {
    /**
     * Calculate a point on a cubic bezier curve
     * P(t) = (1-t)³P0 + 3(1-t)²tP1 + 3(1-t)t²P2 + t³P3
     */
    function cubicBezier(t: number, x1: number, y1: number, x2: number, y2: number): number {
        const t2 = t * t;
        const t3 = t2 * t;
        const mt = 1 - t;
        const mt2 = mt * mt;

        // For a curve from (0,0) to (1,1)
        // P(t) = 3(1-t)²t*P1 + 3(1-t)t²*P2 + t³
        return 3 * mt2 * t * y1 + 3 * mt * t2 * y2 + t3;
    }

    /**
     * Solve for t given x using Newton-Raphson method
     */
    function solveBezierX(x: number, x1: number, x2: number): number {
        // Simple approach: approximate t ≈ x for initial guess
        let t = x;

        // Newton-Raphson iterations
        for (let i = 0; i < 8; i++) {
            const currentX = 3 * (1 - t) * (1 - t) * t * x1 + 3 * (1 - t) * t * t * x2 + t * t * t;
            const currentSlope = 3 * (1 - t) * (1 - t) * x1 - 6 * (1 - t) * t * x1 + 3 * (1 - t) * t * x2 + 3 * t * t * (1 - x1) + 3 * t * t * x2;

            if (Math.abs(currentSlope) < 1e-6) break;

            t = t - (currentX - x) / currentSlope;
            t = Math.max(0, Math.min(1, t));
        }

        return t;
    }

    /**
     * Get Y value for a given X on the bezier curve
     */
    function getBezierY(x: number, x1: number, y1: number, x2: number, y2: number): number {
        if (x <= 0) return 0;
        if (x >= 1) return 1;

        const t = solveBezierX(x, x1, x2);
        return cubicBezier(t, x1, y1, x2, y2);
    }

    /**
     * Generate lightness steps using bezier curve
     * Returns lightness values for N-2 steps evenly distributed between black and white
     * Total of N samples: black (0) + (N-2) calculated steps + white (100)
     * X positions: 1/(N-1), 2/(N-1), 3/(N-1), ..., (N-2)/(N-1)
     *
     * @param lightnessMin - Minimum lightness (darkest shade), bezier 0 maps here
     * @param lightnessMax - Maximum lightness (lightest shade), bezier 1 maps here
     */
    function generateLightnessSteps(
        x1: number,
        y1: number,
        x2: number,
        y2: number,
        totalSteps: number,
        lightnessMin = 0,
        lightnessMax = 100
    ): number[] {
        const numberOfCalculatedSteps = totalSteps - 2;
        const divisor = totalSteps - 1;
        const steps = Array.from({ length: numberOfCalculatedSteps }, (_, i) => (i + 1) / divisor);
        const range = lightnessMax - lightnessMin;

        return steps.map((step) => {
            const y = getBezierY(step, x1, y1, x2, y2);
            // Map bezier output (0-1) to lightness range (min-max)
            const lightness = lightnessMin + y * range;
            return Math.round(lightness);
        });
    }

    return {
        getBezierY,
        generateLightnessSteps
    };
}
