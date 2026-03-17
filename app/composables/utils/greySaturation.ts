/**
 * Grey saturation distribution — bezier-curved ramp from min (white) to max (black).
 *
 * Uses cubic-bezier(0.80, 0.00, 0.50, 1.00) to shape the distribution:
 * stays low through mids, ramps steeply in darks.
 * Both min and max scale linearly with the saturation slider (0–100).
 *
 * When slider = 100 → darkest = 25%, lightest = 3%
 * When slider = 0   → all = 0%
 */

/** Saturation at the darkest swatch when slider = 100 */
const MAX_SATURATION = 25;
/** Saturation at the lightest swatch when slider = 100 */
const MIN_SATURATION = 3;

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
 * Index 0 = black (highest saturation), index 12 = white (lowest saturation).
 * Curve: cubic-bezier(0.80, 0.00, 0.50, 1.00) — flat in mids, steep in darks.
 *
 * Output range: MIN_SATURATION → MAX_SATURATION, both scaled by slider.
 * At slider 100: 3% (lightest) → 25% (darkest).
 * At slider 0: 0% → 0%.
 *
 * @param sliderValue - The saturation slider value (0–100)
 * @returns Array of 13 saturation percentages
 */
export function greySaturationSteps(sliderValue: number): number[] {
    const fraction = sliderValue / 100;
    const max = fraction * MAX_SATURATION;
    const min = fraction * MIN_SATURATION;
    return Array.from({ length: TOTAL_STEPS }, (_, i) => {
        // t: 1 at darkest (i=0), 0 at lightest (i=12)
        const t = 1 - i / (TOTAL_STEPS - 1);
        const curved = cubicBezierY(0.80, 0.00, 0.50, 1.00, t);
        return Math.round((min + curved * (max - min)) * 100) / 100;
    });
}
