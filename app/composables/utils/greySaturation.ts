/**
 * Grey saturation distribution — bezier-curved ramp from 0% (white) to max (black).
 *
 * Uses cubic-bezier(0.80, 0.00, 0.50, 1.00) to shape the distribution:
 * stays low through mids (~15% at shade 500), ramps steeply in darks (~60% at black).
 * The max value is controlled by the saturation slider (0–100).
 *
 * When slider = 100 → darkest swatch = 60% saturation, lightest = 0%
 * When slider = 0   → all = 0%
 */

/** Maximum saturation at the darkest swatch when slider = 100 */
const MAX_SATURATION = 60;

const TOTAL_STEPS = 13;

/**
 * Evaluate a cubic bezier curve at parameter t (0–1).
 * Control points: P0=(0,0), P1=(x1,y1), P2=(x2,y2), P3=(1,1).
 * We solve for the Y value at a given X using Newton's method.
 */
function cubicBezierY(x1: number, y1: number, x2: number, y2: number, x: number): number {
    // Find t for given x using Newton-Raphson
    let t = x; // initial guess
    for (let i = 0; i < 8; i++) {
        const currentX = 3 * (1 - t) * (1 - t) * t * x1
            + 3 * (1 - t) * t * t * x2
            + t * t * t;
        const dx = 3 * (1 - t) * (1 - t) * x1
            + 6 * (1 - t) * t * (x2 - x1)
            + 3 * t * t * (1 - x2);
        if (Math.abs(dx) < 1e-6) break;
        t -= (currentX - x) / dx;
        t = Math.max(0, Math.min(1, t));
    }
    // Evaluate Y at t
    return 3 * (1 - t) * (1 - t) * t * y1
        + 3 * (1 - t) * t * t * y2
        + t * t * t;
}

/**
 * Generate 13 saturation values using a bezier curve (dark → light),
 * scaled by the user's saturation slider (0–100).
 *
 * Index 0 = black (highest saturation), index 12 = white (0% saturation).
 * Curve: cubic-bezier(0.80, 0.00, 0.50, 1.00) — flat in mids, steep in darks.
 *
 * @param sliderValue - The saturation slider value (0–100)
 * @returns Array of 13 saturation percentages
 */
export function greySaturationSteps(sliderValue: number): number[] {
    const max = (sliderValue / 100) * MAX_SATURATION;
    return Array.from({ length: TOTAL_STEPS }, (_, i) => {
        // t: 1 at darkest (i=0), 0 at lightest (i=12)
        const t = 1 - i / (TOTAL_STEPS - 1);
        const curved = cubicBezierY(0.80, 0.00, 0.50, 1.00, t);
        return Math.round(curved * max * 100) / 100;
    });
}
