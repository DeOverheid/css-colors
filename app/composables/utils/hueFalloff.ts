/**
 * Hue Falloff Utility
 * Computes a strength factor (0–1) based on a hue's position within a range
 * and a falloff percentage that determines how much of the range edge fades.
 *
 * Example: center=100, span=50 (range 50–150), falloff=50%
 *   - Hues 75–125: full strength (1.0)
 *   - Hues 50–75: fades from 0.0 to 1.0
 *   - Hues 125–150: fades from 1.0 to 0.0
 *   - Hues outside 50–150: no effect (0.0)
 */

/**
 * Normalize hue to 0–360 range
 */
function normalizeHue(hue: number): number {
    let normalized = hue % 360;
    if (normalized < 0) normalized += 360;
    return normalized;
}

/**
 * Compute the shortest angular distance from a hue to the center of a range.
 * Returns null if the hue is outside the range defined by start/end.
 * Returns { distanceFromStart, distanceToEnd, span } if inside.
 */
function getHuePosition(hue: number, start: number, end: number): { distanceFromStart: number; distanceToEnd: number; span: number } | null {
    const s = normalizeHue(start);
    const e = normalizeHue(end);
    const h = normalizeHue(hue);

    if (s === e) return null;

    let distanceFromStart: number;
    let span: number;

    if (s < e) {
        if (h < s || h > e) return null;
        distanceFromStart = h - s;
        span = e - s;
    } else {
        span = 360 - s + e;
        if (h >= s) {
            distanceFromStart = h - s;
        } else if (h <= e) {
            distanceFromStart = 360 - s + h;
        } else {
            return null;
        }
    }

    return { distanceFromStart, distanceToEnd: span - distanceFromStart, span };
}

/**
 * Compute a strength factor (0–1) for a given hue within a range,
 * applying a falloff percentage at the edges.
 *
 * @param hue - The hue to evaluate (0–360)
 * @param start - Start of the hue range (degrees)
 * @param end - End of the hue range (degrees)
 * @param falloffPercent - Falloff percentage (0–100).
 *   0 = hard edges (all hues in range get full strength).
 *   50 = outer 25% on each side fades.
 *   100 = entire range is a gradient, only the center point has full strength.
 * @returns Strength factor from 0.0 (no effect) to 1.0 (full effect)
 */
export function computeHueStrengthFactor(
    hue: number,
    start: number,
    end: number,
    falloffPercent: number
): number {
    const position = getHuePosition(hue, start, end);
    if (!position) return 0;

    const { distanceFromStart, distanceToEnd, span } = position;

    // Clamp falloff to 0–100, normalize to 0–1
    const falloff = Math.max(0, Math.min(100, falloffPercent)) / 100;

    if (falloff <= 0) return 1;

    // Falloff zone width on each side (in degrees)
    // falloff=1.0 → fadeZone = span/2 (entire range is gradient)
    // falloff=0.5 → fadeZone = span/4 (25% fade on each side)
    const fadeZone = (span / 2) * falloff;

    const startFactor = distanceFromStart < fadeZone
        ? distanceFromStart / fadeZone
        : 1;

    const endFactor = distanceToEnd < fadeZone
        ? distanceToEnd / fadeZone
        : 1;

    return Math.min(startFactor, endFactor);
}
