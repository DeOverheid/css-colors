/**
 * Find the index of the swatch whose lightness is closest to the target.
 *
 * @param lightnessSteps - The inner lightness steps (excluding 0/100 endpoints)
 * @param targetLightness - The lightness value to match
 * @returns Index into the full array [0, ...lightnessSteps, 100]
 */
export function findClosestLightnessIndex(lightnessSteps: number[], targetLightness: number): number {
    const allLightnesses = [0, ...lightnessSteps, 100];
    let closestIndex = 0;
    let smallestDiff = Math.abs((allLightnesses[0] ?? 0) - targetLightness);

    allLightnesses.forEach((lightness, index) => {
        const diff = Math.abs(lightness - targetLightness);
        if (diff < smallestDiff) {
            smallestDiff = diff;
            closestIndex = index;
        }
    });

    return closestIndex;
}
