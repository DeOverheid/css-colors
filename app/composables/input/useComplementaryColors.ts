import { useColorSettings } from "~/composables/core/useColorSettings";

/**
 * Complementary Colors
 * Computes secondary and tertiary hues by offsetting from the primary hue.
 * The offset is a value from 0 to 180 degrees, applied symmetrically:
 *   - secondary = primaryHue + offset
 *   - tertiary  = primaryHue - offset
 * Hues wrap around the 360° wheel.
 */
export function useComplementaryColors() {
    const colorSettings = useColorSettings();

    const hueOffset = useState<number>("complementary-hue-offset", () => 120);

    const primaryHue = computed(() => colorSettings.hue.value);

    const secondaryHue = computed(() => (primaryHue.value + hueOffset.value) % 360);

    const tertiaryHue = computed(() => (primaryHue.value - hueOffset.value + 360) % 360);

    /** At offset 180, secondary and tertiary land on the same hue — hide tertiary */
    const showTertiary = computed(() => hueOffset.value < 180);

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

    return {
        hueOffset,
        primaryHue,
        secondaryHue,
        tertiaryHue,
        showTertiary,
        orderedRows
    };
}
