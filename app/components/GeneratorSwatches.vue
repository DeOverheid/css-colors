<template>
    <section class="swatches-preview panel">
        <!-- Chromatic rows: secondary → primary → tertiary -->
        <div
            v-for="row in visibleRows"
            :key="row.rowId"
            class="swatch-row"
        >
            <div class="swatch-row-label">
                {{ row.label }}
            </div>
            <ColorSwatchRow
                :hue="row.hue"
                :saturation="row.saturation"
                :lightness-steps="lightnessSteps"
                :total-steps="totalSteps"
                :show-marker="row.rowId === 'primary'"
                :marker-index="row.rowId === 'primary' ? markerIndex : undefined"
                class="swatch-row-swatches"
            />
            <div class="swatch-row-value">
                {{ row.hue }}°
            </div>
        </div>

        <!-- Greyscale rows: one tinted grey per chromatic color + neutral -->
        <div
            v-for="row in greyRows"
            :key="row.rowId"
            class="swatch-row swatch-row--muted"
        >
            <div class="swatch-row-label">
                {{ row.label }}
            </div>
            <ColorSwatchRow
                :hue="row.hue"
                :saturation="row.saturation"
                :lightness-steps="lightnessSteps"
                :total-steps="totalSteps"
                class="swatch-row-swatches"
            />
            <div class="swatch-row-value">
                {{ row.value }}
            </div>
        </div>
    </section>
</template>

<script setup lang="ts">
import { findClosestLightnessIndex } from "~/composables/utils/lightnessIndex";
import { useSwatchUnlock } from "~/composables/steps/useSwatchUnlock";
import { useComplementaryColors } from "~/composables/input/useComplementaryColors";

const props = defineProps<{
    hue: number;
    saturation: number;
    mutedSaturation: number;
    lightnessSteps: number[];
    totalSteps: number;
    targetLightness: number;
}>();

const { isUnlocked } = useSwatchUnlock();
const { orderedRows, primaryGreyName, greyCompanionRows } = useComplementaryColors();

const markerIndex = computed(() =>
    findClosestLightnessIndex(props.lightnessSteps, props.targetLightness)
);

/** Chromatic color rows (secondary → primary → tertiary when unlocked) */
const visibleRows = computed(() => {
    const labels: Record<string, string> = {
        primary: "Primary",
        secondary: "Secondary",
        tertiary: "Tertiary"
    };

    return orderedRows.value
        .filter(row => isUnlocked(row.rowId))
        .map(row => ({
            rowId: row.rowId,
            hue: row.hue,
            label: labels[row.rowId] ?? row.rowId,
            saturation: props.saturation
        }));
});

interface GreyRow {
    rowId: string;
    hue: number;
    label: string;
    saturation: number;
    value: string;
}

/** Greyscale rows: one tinted grey per visible chromatic color + neutral at the end */
const greyRows = computed((): GreyRow[] => {
    const rows: GreyRow[] = [];

    // Build lookup for grey companion labels by parent ID
    const greyLabelByParent: Record<string, string> = {};
    for (const g of greyCompanionRows.value) {
        greyLabelByParent[g.parentId] = g.label;
    }

    // Tinted grey for each visible chromatic row (same order)
    for (const row of visibleRows.value) {
        const label = row.rowId === "primary"
            ? primaryGreyName.value
            : greyLabelByParent[row.rowId];
        if (label) {
            rows.push({
                rowId: `${row.rowId}-grey`,
                hue: row.hue,
                label,
                saturation: props.mutedSaturation,
                value: `${props.mutedSaturation}%`
            });
        }
    }

    // Neutral (always last, 0% saturation)
    if (isUnlocked("neutral")) {
        rows.push({
            rowId: "neutral",
            hue: props.hue,
            label: "Neutral",
            saturation: 0,
            value: "0%"
        });
    }

    return rows;
});

/** The actual lightness value of the marked swatch */
const markedSampleLightness = computed(() => {
    const allLightnesses = [0, ...props.lightnessSteps, 100];
    return allLightnesses[markerIndex.value] ?? props.targetLightness;
});

defineExpose({ markedSampleLightness });
</script>

<style scoped>
.swatches-preview {
    grid-column: 2;
    grid-row: 2;
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    overflow: hidden;
}

.swatch-row {
    display: grid;
    grid-template-columns: var(--label-column-width, 80px) 1fr var(--label-column-width, 80px);
    gap: 1rem;
    align-items: center;
}

.swatch-row--muted {
    opacity: 0.85;
}

.swatch-row-label {
    font-family: var(--font-family-header);
    font-weight: 600;
    color: var(--ui-text-muted);
}

.swatch-row-value {
    font-family: var(--font-family-header);
    font-weight: 600;
    font-variant-numeric: tabular-nums;
    text-align: right;
    color: var(--ui-text-muted);
}

.swatch-row-swatches {
    width: 100%;
}

@media (max-width: 1024px) {
    .swatches-preview {
        grid-column: 1;
        grid-row: 2;
        height: auto;
    }
}
</style>
