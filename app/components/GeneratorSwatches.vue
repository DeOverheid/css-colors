<template>
    <section class="swatches-preview panel">
        <!-- Paired groups: chromatic color + its grey companion, no gap between them -->
        <template
            v-for="group in swatchGroups"
            :key="group.chromatic.rowId">
            <div class="swatch-group">
                <!-- Chromatic row -->
                <div class="swatch-row">
                    <div class="swatch-row-label">
                        {{ group.chromatic.label }}
                    </div>
                    <ColorSwatchRow
                        :hue="group.chromatic.hue"
                        :saturation="group.chromatic.saturation"
                        :lightness-steps="lightnessSteps"
                        :total-steps="totalSteps"
                        :show-marker="group.chromatic.rowId === 'primary'"
                        :marker-index="group.chromatic.rowId === 'primary' ? markerIndex : undefined"
                        class="swatch-row-swatches" />
                    <div class="swatch-row-value">
                        {{ group.chromatic.hue }}°
                    </div>
                </div>

                <!-- Grey companion (tinted grey using same hue, TW saturation distribution) -->
                <div class="swatch-row">
                    <div class="swatch-row-label">
                        {{ group.grey.label }}
                    </div>
                    <ColorSwatchRow
                        :hue="group.grey.hue"
                        :saturation="greySaturations"
                        :lightness-steps="GREY_LIGHTNESS_STEPS"
                        :total-steps="totalSteps"
                        class="swatch-row-swatches" />
                </div>
            </div>
        </template>

        <!-- Neutral row (standalone, always last) -->
        <div v-if="isUnlocked('neutral')" class="swatch-group">
            <div class="swatch-row">
                <div class="swatch-row-label">
                    Neutral
                </div>
                <ColorSwatchRow :hue="hue" :saturation="0" :lightness-steps="NEUTRAL_LIGHTNESS_STEPS" :total-steps="totalSteps" class="swatch-row-swatches" />
            </div>
        </div>
    </section>
</template>

<script setup lang="ts">
import { findClosestLightnessIndex } from "~/composables/utils/lightnessIndex";
import { useSwatchUnlock } from "~/composables/steps/useSwatchUnlock";
import { useComplementaryColors } from "~/composables/input/useComplementaryColors";
import { greySaturationSteps } from "~/composables/utils/greySaturation";

/**
 * Lightness steps from Tailwind CSS v4 grey palettes (shades 950→50, dark to light).
 * These replace the bezier-generated steps for grey rows so they match
 * real-world grey palette distribution.
 */
const GREY_LIGHTNESS_STEPS = [4.17, 11.08, 16.86, 26.86, 34.31, 46.27, 64.31, 83.92, 90.98, 95.88, 98.12];
const NEUTRAL_LIGHTNESS_STEPS = [3.94, 9.02, 14.9, 25.1, 32.16, 45.1, 63, 83.14, 89.8, 96.08, 98.04];

const props = defineProps<{
    hue: number;
    saturation: number;
    lightnessSteps: number[];
    totalSteps: number;
    targetLightness: number;
}>();

const { isUnlocked } = useSwatchUnlock();
const { orderedRows, greyCompanionRows } = useComplementaryColors();

const markerIndex = computed(() =>
    findClosestLightnessIndex(props.lightnessSteps, props.targetLightness)
);

/** Per-swatch grey saturation array following TW distribution, scaled by saturation slider */
const greySaturations = computed(() => greySaturationSteps(props.saturation));

interface SwatchGroup {
    chromatic: { rowId: string; hue: number; label: string; saturation: number };
    grey: { rowId: string; hue: number; label: string };
}

/**
 * Build paired groups: each chromatic color row with its grey companion.
 * - Primary grey is always labelled "Gray"
 * - Secondary/Tertiary grey labels come from closestGreyName (via greyCompanionRows)
 */
const swatchGroups = computed((): SwatchGroup[] => {
    const labels: Record<string, string> = {
        primary: "Primary",
        secondary: "Secondary",
        tertiary: "Tertiary"
    };

    // Build lookup for grey companion labels by parent ID
    const greyLabelByParent: Record<string, string> = {};
    for (const g of greyCompanionRows.value) {
        greyLabelByParent[g.parentId] = g.label;
    }

    return orderedRows.value
        .filter(row => isUnlocked(row.rowId))
        .map(row => ({
            chromatic: {
                rowId: row.rowId,
                hue: row.hue,
                label: labels[row.rowId] ?? row.rowId,
                saturation: props.saturation
            },
            grey: {
                rowId: `${row.rowId}-grey`,
                hue: row.hue,
                label: row.rowId === "primary" ? "Gray" : (greyLabelByParent[row.rowId] ?? "Gray")
            }
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
    gap: 0.75rem;
    overflow: hidden;
}

.swatch-group {
    display: flex;
    flex-direction: column;
    gap: 0;
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
