import { useColorSettings } from "~/composables/core/useColorSettings";
import { closestGreyName } from "~/composables/utils/closestGreyName";
import { useThemes, getThemeById, themes as allThemes } from "~/composables/themes";

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

    const { currentThemeId } = useThemes();

    const hueOffset = useState<number>("complementary-hue-offset", () => 120);

    /**
     * Saturation ratio: complementary saturation relative to primary.
     * 1.0 = same as primary, 0.8 = 80% of primary, 1.2 = 120% of primary.
     */
    const satRatio = useState<number>("complementary-sat-ratio", () => 1.0);

    /** Last absolute complementary saturation — used when primary is 0 */
    const _lastAbsCompSat = useState<number>("complementary-last-abs-sat", () => -1);

    /** Computed complementary saturation from ratio × primary, clamped 0–100 */
    const complementarySaturation = computed(() => {
        const pSat = colorSettings.saturation.value;
        if (pSat === 0 && _lastAbsCompSat.value >= 0) {
            return _lastAbsCompSat.value;
        }
        return Math.min(100, Math.max(0, pSat * satRatio.value));
    });

    /** Update satRatio from an absolute S/T saturation value */
    function setComplementarySaturation(absSat: number) {
        const pSat = colorSettings.saturation.value;
        _lastAbsCompSat.value = absSat;
        if (pSat > 0) {
            satRatio.value = absSat / pSat;
        }
    }

    /** Per-theme UI tone state */
    const perThemeUiTone = useState<Record<string, UiToneSource>>("per-theme-ui-tone", () => {
        const map: Record<string, UiToneSource> = {};
        for (const theme of allThemes) {
            map[theme.id] = theme.defaultUiTone ?? "neutral";
        }
        return map;
    });

    /** Which grey tone is selected as the app's UI background color */
    const uiToneSource = computed({
        get: () => {
            const id = currentThemeId.value;
            if (!perThemeUiTone.value[id]) {
                const theme = getThemeById(id);
                perThemeUiTone.value[id] = theme?.defaultUiTone ?? "neutral";
            }
            return perThemeUiTone.value[id];
        },
        set: (value: UiToneSource) => {
            perThemeUiTone.value[currentThemeId.value] = value;
        }
    });

    const primaryHue = computed(() => colorSettings.hue.value);

    const secondaryHue = computed(() => ((primaryHue.value + hueOffset.value) % 360 + 360) % 360);

    const tertiaryHue = computed(() => ((primaryHue.value - hueOffset.value) % 360 + 360) % 360);

    // If tertiary overlaps with secondary (offset 0 or ±180), they share the same hue
    // but we still show tertiary in the UI for layout stability

    /** Closest TW grey name for each color hue (custom theme uses role names) */
    const isCustomTheme = computed(() => currentThemeId.value === "custom");
    const primaryGreyName = computed(() => isCustomTheme.value ? "Primary" : closestGreyName(primaryHue.value));
    const secondaryGreyName = computed(() => isCustomTheme.value ? "Secondary" : closestGreyName(secondaryHue.value));
    const tertiaryGreyName = computed(() => isCustomTheme.value ? "Tertiary" : closestGreyName(tertiaryHue.value));

    /**
     * Returns swatch rows in fixed visual order:
     * secondary (top) → primary (middle) → tertiary (bottom).
     */
    const orderedRows = computed(() => {
        const rows: { rowId: "primary" | "secondary" | "tertiary"; hue: number }[] = [
            { rowId: "secondary", hue: secondaryHue.value },
            { rowId: "primary", hue: primaryHue.value },
            { rowId: "tertiary", hue: tertiaryHue.value }
        ];

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

        rows.push({
            rowId: "tertiary-grey",
            hue: tertiaryHue.value,
            label: tertiaryGreyName.value,
            parentId: "tertiary"
        });

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
     * Neutral first, then chromatic tones.
     */
    const availableTones = computed(() => {
        const tones: { value: UiToneSource; label: string; hue: number }[] = [
            { value: "neutral", label: "Neutral", hue: -1 },
            { value: "secondary", label: secondaryGreyName.value, hue: secondaryHue.value },
            { value: "primary", label: primaryGreyName.value, hue: primaryHue.value },
            { value: "tertiary", label: tertiaryGreyName.value, hue: tertiaryHue.value }
        ];
        return tones;
    });

    return {
        hueOffset,
        satRatio,
        complementarySaturation,
        setComplementarySaturation,
        uiToneSource,
        uiToneHue,
        uiToneLabel,
        availableTones,
        primaryHue,
        secondaryHue,
        tertiaryHue,
        primaryGreyName,
        secondaryGreyName,
        tertiaryGreyName,
        orderedRows,
        greyCompanionRows
    };
}
