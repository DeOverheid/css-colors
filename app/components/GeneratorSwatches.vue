<template>
    <section class="swatches-preview panel">
        <!-- Color rows sorted by hue -->
        <template
            v-for="row in visibleRows"
            :key="row.rowId">
            <div class="swatch-row">
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
                    class="swatch-row-swatches" />
                <div class="swatch-row-value">
                    {{ row.hue }}°
                </div>
            </div>
        </template>

        <!-- Grey Row -->
        <div
            v-if="isUnlocked('grey')"
            class="swatch-row">
            <div class="swatch-row-label">
                Grey
            </div>
            <ColorSwatchRow
                :hue="hue"
                :saturation="mutedSaturation"
                :lightness-steps="lightnessSteps"
                :total-steps="totalSteps"
                class="swatch-row-swatches" />
            <div class="swatch-row-value">
                {{ mutedSaturation }}%
            </div>
        </div>

        <!-- Neutral Row -->
        <div
            v-if="isUnlocked('neutral')"
            class="swatch-row">
            <div class="swatch-row-label">
                Neutral
            </div>
            <ColorSwatchRow
                :hue="hue"
                :saturation="0"
                :lightness-steps="lightnessSteps"
                :total-steps="totalSteps"
                class="swatch-row-swatches" />
            <div class="swatch-row-value">
                0%
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
const { secondaryHue, tertiaryHue, orderedRows } = useComplementaryColors();

const markerIndex = computed(() =>
    findClosestLightnessIndex(props.lightnessSteps, props.targetLightness)
);

/**
 * Build the visible color rows (primary + secondary/tertiary when unlocked).
 * Sorted by hue via sortedRows from the composable.
 */
const visibleRows = computed(() => {
    const labels: Record<string, string> = {
        primary: "Primary",
        secondary: "Secondary",
        tertiary: "Tertiary"
    };

    return orderedRows.value
        .filter(row => isUnlocked(row.rowId))
        .map(row => ({
            ...row,
            label: labels[row.rowId] ?? row.rowId,
            saturation: props.saturation
        }));
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
