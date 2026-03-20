import { tailwindHues, HUE_OFFSET_RANGE, type TailwindHueEntry } from "~/composables/themes/lib/tailwind";
import { mathematicalHues, MATH_HUE_OFFSET_RANGE, type MathHueEntry } from "~/composables/themes/lib/mathematical";
import { useThemes } from "~/composables/themes";

export interface HueRowOffset {
    light: number;
    dark: number;
}

// Common hue entry type that works for both themes
export type HueEntry = TailwindHueEntry | MathHueEntry;

export interface HueRowState {
    entry: HueEntry;
    lightOffset: number;
    darkOffset: number;
}

/**
 * Step: Hue Spectrum
 * Displays color swatches with adjustable hue offsets
 * Supports both Tailwind and Mathematical theme palettes
 */
export function stepHueSpectrum() {
    const { currentThemeId } = useThemes();

    // Separate state for each theme
    const tailwindRowStates = useState<HueRowState[]>("tailwind-hue-row-states", () =>
        tailwindHues.map(entry => ({
            entry,
            lightOffset: entry.lightOffset,
            darkOffset: entry.darkOffset
        }))
    );

    const mathematicalRowStates = useState<HueRowState[]>("mathematical-hue-row-states", () =>
        mathematicalHues.map(entry => ({
            entry,
            lightOffset: entry.lightOffset,
            darkOffset: entry.darkOffset
        }))
    );

    // Custom starts as a copy of Tailwind hue rows
    const customRowStates = useState<HueRowState[]>("custom-hue-row-states", () =>
        tailwindHues.map(entry => ({
            entry,
            lightOffset: entry.lightOffset,
            darkOffset: entry.darkOffset
        }))
    );

    // Current row states based on selected theme
    const hueRowStates = computed(() => {
        if (currentThemeId.value === "mathematical") return mathematicalRowStates.value;
        if (currentThemeId.value === "custom") return customRowStates.value;
        return tailwindRowStates.value;
    });

    // Current offset range based on selected theme
    const offsetRange = computed(() => {
        return currentThemeId.value === "mathematical"
            ? MATH_HUE_OFFSET_RANGE
            : HUE_OFFSET_RANGE;
    });

    /**
     * Get the offset for a specific color row
     */
    function getRowOffsets(name: string): HueRowOffset {
        const row = hueRowStates.value.find(r => r.entry.name === name);
        if (!row) {
            return { light: 0, dark: 0 };
        }
        return {
            light: row.lightOffset,
            dark: row.darkOffset
        };
    }

    /**
     * Set the light offset for a specific color row
     */
    function getThemeRowStates() {
        if (currentThemeId.value === "mathematical") return mathematicalRowStates.value;
        if (currentThemeId.value === "custom") return customRowStates.value;
        return tailwindRowStates.value;
    }

    function setLightOffset(name: string, value: number) {
        const row = getThemeRowStates().find(r => r.entry.name === name);
        if (row) {
            row.lightOffset = value;
        }
    }

    /**
     * Set the dark offset for a specific color row
     */
    function setDarkOffset(name: string, value: number) {
        const row = getThemeRowStates().find(r => r.entry.name === name);
        if (row) {
            row.darkOffset = value;
        }
    }

    /**
     * Reset a row to its default values
     */
    function resetRow(name: string) {
        const states = getThemeRowStates();
        const row = states.find(r => r.entry.name === name);
        if (row) {
            row.lightOffset = row.entry.lightOffset;
            row.darkOffset = row.entry.darkOffset;
        }
    }

    /**
     * Reset all rows to default values
     */
    function resetAll() {
        const states = getThemeRowStates();
        for (const row of states) {
            row.lightOffset = row.entry.lightOffset;
            row.darkOffset = row.entry.darkOffset;
        }
    }

    /**
     * Export the current hue offset configuration
     */
    const exportConfig = computed(() => {
        const config: Record<string, HueRowOffset> = {};
        for (const row of hueRowStates.value) {
            config[row.entry.name] = {
                light: row.lightOffset,
                dark: row.darkOffset
            };
        }
        return config;
    });

    return {
        hueRowStates,
        offsetRange,
        getRowOffsets,
        setLightOffset,
        setDarkOffset,
        resetRow,
        resetAll,
        exportConfig
    };
}
