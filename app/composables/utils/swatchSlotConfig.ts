/**
 * Derives swatch grid slot counts from the actual theme hue entry arrays.
 *
 * Scans all themes to find the max number of chromatic ("color") and
 * grey ("grayscale") entries, then uses those as the fixed grid dimensions.
 */
import { mathematicalHues } from "~/composables/themes/lib/mathematical";
import { tailwindHues } from "~/composables/themes/lib/tailwind";
import { customHues } from "~/composables/themes/lib/custom";

interface HueEntry {
    type?: "color" | "grayscale";
}

const allThemeHues: HueEntry[][] = [mathematicalHues, tailwindHues, customHues];

function countByType(entries: HueEntry[]) {
    let chromatic = 0;
    let grey = 0;
    for (const e of entries) {
        if (e.type === "grayscale") grey++;
        else chromatic++;
    }
    return { chromatic, grey };
}

function computeSlotConfig() {
    let maxChromatic = 0;
    let maxGrey = 0;

    for (const hues of allThemeHues) {
        const { chromatic, grey } = countByType(hues);
        if (chromatic > maxChromatic) maxChromatic = chromatic;
        if (grey > maxGrey) maxGrey = grey;
    }

    return {
        chromaticSlots: maxChromatic,
        greySlots: maxGrey,
        totalSlots: maxChromatic + maxGrey,
        /** Max visible rows for height calculation: rainbow swatches + 2 grey */
        maxVisibleRows: maxChromatic + 2,
        gapPx: 10
    };
}

export const SWATCH_SLOT_CONFIG = computeSlotConfig();
