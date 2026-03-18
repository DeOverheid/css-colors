import { useColorSettings } from "~/composables/core/useColorSettings";
import { closestGreyName } from "~/composables/utils/closestGreyName";

/** Which grey tone feeds the app's UI neutral palette */
export type UiToneSource = "primary" | "secondary" | "tertiary" | "neutral";

/**
 * Complementary Colors
 * Computes secondary and tertiary hues by offsetting from the primary hue.
 * The offset ranges from -180 to +180 degrees:
 *   - secondary = primaryHue + offset
 *   - tertiary  = primaryHue - offset
 * Hues wrap around the 360° wheel.
 *
 * Also computes tinted-grey companion labels for each color row,
 * using the closest Tailwind grey palette name for the given hue.
 *
 * Manages `uiToneSource` — which grey tone drives the app's UI neutral palette.
 */
export function useComplementaryColors() {
    const colorSettings = useColorSettings();

    const hueOffset = useState<number>("complementary-hue-offset", () => 120);

    /** Which grey tone is selected as the app's UI background color */
    const uiToneSource = useState<UiToneSource>("ui-tone-source", () => "neutral");

    const primaryHue = computed(() => colorSettings.hue.value);

    const secondaryHue = computed(() => ((primaryHue.value + hueOffset.value) % 360 + 360) % 360);

    const tertiaryHue = computed(() => ((primaryHue.value - hueOffset.value) % 360 + 360) % 360);

    /** At offset 0 or ±180, secondary and tertiary overlap — hide tertiary */
    const showTertiary = computed(() => {
        const abs = Math.abs(hueOffset.value);
        return abs > 0 && abs < 180;
    });

    // If tertiary is hidden but tone was set to tertiary, fall back to neutral
    watch(showTertiary, (visible) => {
        if (!visible && uiToneSource.value === "tertiary") {
            uiToneSource.value = "neutral";
        }
    });

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

    /**
     * The hue value for the selected UI tone.
     * - primary/secondary/tertiary → the corresponding chromatic hue
     * - neutral → -1 (signals saturation=0, hue irrelevant)
     */
    const uiToneHue = computed((): number => {
        switch (uiToneSource.value) {
            case "secondary": return secondaryHue.value;
            case "tertiary": return tertiaryHue.value;
            case "neutral": return -1;
            default: return primaryHue.value;
        }
    });

    /**
     * Label for the currently selected UI tone.
     */
    const uiToneLabel = computed((): string => {
        switch (uiToneSource.value) {
            case "secondary": return secondaryGreyName.value;
            case "tertiary": return tertiaryGreyName.value;
            case "neutral": return "Neutral";
            default: return primaryGreyName.value;
        }
    });

    /**
     * Available tone options based on current state.
     * Neutral first, then chromatic tones with "Name (role hue)" labels.
     * Tertiary is only available when showTertiary is true.
     */
    const availableTones = computed(() => {
        const tones: { value: UiToneSource; label: string; hue: number }[] = [
            { value: "neutral", label: "Neutral", hue: -1 },
            { value: "secondary", label: secondaryGreyName.value, hue: secondaryHue.value },
            { value: "primary", label: primaryGreyName.value, hue: primaryHue.value }
        ];
        if (showTertiary.value) {
            tones.push({ value: "tertiary", label: tertiaryGreyName.value, hue: tertiaryHue.value });
        }
        return tones;
    });

    return {
        hueOffset,
        uiToneSource,
        uiToneHue,
        uiToneLabel,
        availableTones,
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
