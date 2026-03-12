/**
 * Tailwind Saturation Analysis Tool
 *
 * Analyzes saturation values across all Tailwind CSS colors to understand:
 * 1. Saturation distribution per shade (50-900)
 * 2. Average saturation at each shade level
 * 3. Saturation shifts from light to dark (S50 vs S500 vs S900)
 *
 * Usage:
 *   node css-colors-js/tools/analyze-saturation.mjs
 *
 * Output:
 *   - Per-color saturation values across all shades
 *   - Average saturation per shade
 *   - Individual S500 values with overall average
 *   - Saturation shift analysis (light diff, dark diff)
 *
 * Dependencies:
 *   - Requires ../tailwind-hsl.json data file
 *
 * Last updated: February 2026
 */

import { createRequire } from "module";

const require = createRequire(import.meta.url);
const data = require("../tailwind-hsl.json");

const colors = ["red", "orange", "amber", "yellow", "lime", "green", "emerald", "teal", "cyan", "sky", "blue", "indigo", "violet", "purple", "fuchsia", "pink", "rose"];
const shades = ["50", "100", "200", "300", "400", "500", "600", "700", "800", "900"];

// Section 1: Saturation by shade for each color
console.log("=== SATURATION BY SHADE (50 -> 900) ===\n");
for (const name of colors) {
    const c = data.colors[name];
    if (c) {
        const sats = shades.map(s => c.shades[s]?.saturation.toFixed(0).padStart(3) || "N/A").join(", ");
        console.log(`${name.padEnd(8)}: ${sats}`);
    }
}

// Section 2: Average saturation per shade
console.log("\n=== AVERAGE SATURATION PER SHADE ===\n");
for (const shade of shades) {
    let sum = 0, count = 0;
    for (const name of colors) {
        const c = data.colors[name];
        if (c && c.shades[shade]) {
            sum += c.shades[shade].saturation;
            count++;
        }
    }
    console.log(`Shade ${shade}: avg = ${(sum / count).toFixed(1)}%`);
}

// Section 3: S500 values (midpoint saturation)
console.log("\n=== S500 VALUES (MIDPOINT SATURATION) ===\n");
let s500sum = 0;
for (const name of colors) {
    const c = data.colors[name];
    if (c) {
        const s500 = c.shades["500"].saturation;
        s500sum += s500;
        console.log(`${name.padEnd(8)}: ${s500.toFixed(1)}%`);
    }
}
console.log(`\n>>> Average S500: ${(s500sum / colors.length).toFixed(1)}%`);

// Section 4: Saturation shift analysis
console.log("\n=== SATURATION SHIFT ANALYSIS (S50 vs S500 vs S900) ===\n");
console.log("lightDiff = S50 - S500 (positive = lighter shades are more saturated)");
console.log("darkDiff  = S900 - S500 (positive = darker shades are more saturated)\n");

for (const name of colors) {
    const c = data.colors[name];
    if (c && c.shades["50"] && c.shades["500"] && c.shades["900"]) {
        const s50 = c.shades["50"].saturation;
        const s500 = c.shades["500"].saturation;
        const s900 = c.shades["900"].saturation;
        const lightDiff = s50 - s500;
        const darkDiff = s900 - s500;
        console.log(`${name.padEnd(8)}: S50=${s50.toFixed(1).padStart(5)}, S500=${s500.toFixed(1).padStart(5)}, S900=${s900.toFixed(1).padStart(5)} | lightDiff=${lightDiff >= 0 ? "+" : ""}${lightDiff.toFixed(1).padStart(5)}, darkDiff=${darkDiff >= 0 ? "+" : ""}${darkDiff.toFixed(1).padStart(5)}`);
    }
}

// Section 5: Average shifts summary
console.log("\n=== AVERAGE SATURATION SHIFTS ===\n");
let lightDiffSum = 0, darkDiffSum = 0, cnt = 0;
for (const name of colors) {
    const c = data.colors[name];
    if (c && c.shades["50"] && c.shades["500"] && c.shades["900"]) {
        const s50 = c.shades["50"].saturation;
        const s500 = c.shades["500"].saturation;
        const s900 = c.shades["900"].saturation;
        lightDiffSum += (s50 - s500);
        darkDiffSum += (s900 - s500);
        cnt++;
    }
}
console.log(`Average light diff (S50-S500):  ${lightDiffSum / cnt >= 0 ? "+" : ""}${(lightDiffSum / cnt).toFixed(1)}%`);
console.log(`Average dark diff (S900-S500):  ${darkDiffSum / cnt >= 0 ? "+" : ""}${(darkDiffSum / cnt).toFixed(1)}%`);
console.log("\n>>> Use these values to configure saturation offsets in the color generator.");
