/**
 * Maps a hue (0-360) to the closest Tailwind grey palette name.
 * Uses the shade-500 representative hue for each grey family.
 * Neutral (achromatic) is excluded — it has no hue direction.
 */

/** Representative hue (shade 500) for each tinted grey palette */
const greyHues: { name: string; hue: number }[] = [
    { name: "Taupe", hue: 17 },    // warm red-orange
    { name: "Stone", hue: 25 },     // warm brown
    { name: "Olive", hue: 60 },     // yellow-green
    { name: "Mist", hue: 191 },     // teal/cyan
    { name: "Slate", hue: 215 },    // blue (high sat)
    { name: "Gray", hue: 220 },     // cool blue (medium sat)
    { name: "Zinc", hue: 240 },     // violet (low sat)
    { name: "Mauve", hue: 293 },    // pink/rose
];

/** Angular distance on the hue wheel (0-180) */
function hueDistance(a: number, b: number): number {
    const d = Math.abs(a - b) % 360;
    return d > 180 ? 360 - d : d;
}

/**
 * Returns the Tailwind grey palette name whose hue is closest to the given hue.
 * Always returns a tinted grey (never "Neutral").
 */
export function closestGreyName(hue: number): string {
    let best = greyHues[0];
    let bestDist = hueDistance(hue, best.hue);

    for (let i = 1; i < greyHues.length; i++) {
        const d = hueDistance(hue, greyHues[i].hue);
        if (d < bestDist) {
            bestDist = d;
            best = greyHues[i];
        }
    }

    return best.name;
}
