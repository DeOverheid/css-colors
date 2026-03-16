import { useColorSettings } from "~/composables/core/useColorSettings";
import { closestGreyName } from "~/composables/utils/closestGreyName";

/**
 * Complementary Colors
 * Computes secondary and tertiary hues by offsetting from the primary hue.
 * The offset is a value from 0 to 180 degrees, applied symmetrically:
 *   - secondary = primaryHue + offset
 *   - tertiary  = primaryHue - offset
 * Hues wrap around the 360° wheel.
 *
 * Also computes tinted-grey companion labels for each color row,
 * using the closest Tailwind grey palette name for the given hue.
 */
export function useComplementaryColors() {
    const colorSettings = useColorSettings();

    const hueOffset = useState<number>("complementary-hue-offset", () => 120);

    const primaryHue = computed(() => colorSettings.hue.value);

    const secondaryHue = computed(() => (primaryHue.value + hueOffset.value) % 360);

    const tertiaryHue = computed(() => (primaryHue.value - hueOffset.value + 360) % 360);

    /** At offset 180, secondary and tertiary land on the same hue — hide tertiary */
    const showTertiary = computed(() => hueOffset.value < 180);

    /** Closest TW grey name for each color hue */
    const primaryGreyName = computed(() => closestGreyName(primaryHue.value));
    const secondaryGreyName = computed(() => closestGreyName(secondaryHue.value));
    const tertiaryGreyName = computed(() => closestGreyName(tertiaryHue.value));

    /**
     * Returns swatch rows in fixed visual order:
     * secondary (top) → primary (middle) → tertiary (bottom).
     */
    const orderedRows = computed(() => {
        const rows: { rowId: "primary" | "secondary" | "tertiary"; hue: number }[] = [
            { rowId: "secondary", hue: secondaryHue.value },
            { rowId: "primary", hue: primaryHue.value }
        ];

        if (showTertiary.value) {
            rows.push({ rowId: "tertiary", hue: tertiaryHue.value });
        }

        return rows;
    });

    /**
     * Grey companion rows for secondary/tertiary colors.
     * These use the same hue as their parent color but with muted saturation.
     * Shown only when the parent color is unlocked.
     */
    const greyCompanionRows = computed(() => {
        const rows: { rowId: string; hue: number; label: string; parentId: string }[] = [];

        rows.push({
            rowId: "secondary-grey",
            hue: secondaryHue.value,
            label: secondaryGreyName.value,
            parentId: "secondary"
        });

        if (showTertiary.value) {
            rows.push({
                rowId: "tertiary-grey",
                hue: tertiaryHue.value,
                label: tertiaryGreyName.value,
                parentId: "tertiary"
            });
        }

        return rows;
    });

    return {
        hueOffset,
        primaryHue,
        secondaryHue,
        tertiaryHue,
        showTertiary,
        primaryGreyName,
        secondaryGreyName,
        tertiaryGreyName,
        orderedRows,
        greyCompanionRows
    };
}
