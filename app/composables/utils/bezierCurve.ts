/**
 * Cubic bezier curve utilities for lightness distribution.
 * Pure functions — no Vue reactivity needed.
 */
import type { BezierCurve } from "~/composables/themes/lib/types";
import { squeezeX } from "~/composables/utils/lightnessOffset";

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
 * Solve for t given x using Newton-Raphson with binary search fallback.
 * The derivative of X(t) = 3(1-t)²t·x1 + 3(1-t)t²·x2 + t³ is:
 * dX/dt = 3(1-t)²·x1 + 6(1-t)t·(x2-x1) + 3t²·(1-x2)
 */
function solveBezierX(x: number, x1: number, x2: number): number {
    let t = x;

    // Newton-Raphson iterations
    for (let i = 0; i < 8; i++) {
        const mt = 1 - t;
        const currentX = 3 * mt * mt * t * x1 + 3 * mt * t * t * x2 + t * t * t;
        const slope = 3 * mt * mt * x1 + 6 * mt * t * (x2 - x1) + 3 * t * t * (1 - x2);

        if (Math.abs(slope) < 1e-6) break;

        const nextT = t - (currentX - x) / slope;
        t = Math.max(0, Math.min(1, nextT));

        if (Math.abs(currentX - x) < 1e-7) return t;
    }

    // Binary search fallback for extreme curves where Newton-Raphson fails
    let lo = 0;
    let hi = 1;
    t = x;
    for (let i = 0; i < 20; i++) {
        const mt = 1 - t;
        const currentX = 3 * mt * mt * t * x1 + 3 * mt * t * t * x2 + t * t * t;
        if (Math.abs(currentX - x) < 1e-7) return t;
        if (currentX < x) {
            lo = t;
        } else {
            hi = t;
        }
        t = (lo + hi) / 2;
    }

    return t;
}

/**
 * Get Y value for a given X on the bezier curve
 */
export function getBezierY(x: number, x1: number, y1: number, x2: number, y2: number): number {
    if (x <= 0) return 0;
    if (x >= 1) return 1;

    const t = solveBezierX(x, x1, x2);
    return cubicBezier(t, x1, y1, x2, y2);
}

/**
 * Generate lightness percentage values from a bezier curve.
 *
 * Takes a BezierCurve and distributes `totalSteps` evenly across it.
 * The first and last steps are implied endpoints (black=0%, white=100%),
 * so this returns `totalSteps - 2` inner values.
 *
 * The bezier output (0–1) is mapped to the lightnessMin–lightnessMax range.
 *
 * @param curve - Cubic bezier control points { x1, y1, x2, y2 }
 * @param totalSteps - Total steps including black/white endpoints (e.g. 13)
 * @param lightnessMin - Lightness % at the dark end (bezier 0), default 0
 * @param lightnessMax - Lightness % at the light end (bezier 1), default 100
 * @param darkSqueeze - X-axis squeeze from dark end (0–0.5), default 0
 * @param lightSqueeze - X-axis squeeze from light end (0–0.5), default 0
 * @returns Array of (totalSteps - 2) lightness percentages, dark → light
 */
export function generateLightnessSteps(
    curve: BezierCurve,
    totalSteps: number,
    lightnessMin = 0,
    lightnessMax = 100,
    darkSqueeze = 0,
    lightSqueeze = 0
): number[] {
    const numberOfCalculatedSteps = totalSteps - 2;
    const divisor = totalSteps - 1;
    const steps = Array.from({ length: numberOfCalculatedSteps }, (_, i) => (i + 1) / divisor);
    const range = lightnessMax - lightnessMin;

    return steps.map((step) => {
        const squeezed = squeezeX(step, darkSqueeze, lightSqueeze);
        const y = getBezierY(squeezed, curve.x1, curve.y1, curve.x2, curve.y2);
        // Map bezier output (0-1) to lightness range (min-max)
        const lightness = lightnessMin + y * range;
        return Math.round(lightness);
    });
}
