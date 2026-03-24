<template>
    <section class="swatches-preview panel">
        <!-- Chromatic rows: Secondary, Primary, Tertiary -->
        <div class="swatch-group swatch__group swatch__group--chromatic rounded-group rounded-group--horizontal">
            <template
                v-for="row in chromaticRows"
                :key="row.rowId"
            >
                <div class="swatch-row swatch__row swatch__row--chromatic">
                    <div class="swatch-row-label swatch__label">
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
                    <div class="swatch-row-value swatch__value">
                        {{ row.hue }}°
                    </div>
                </div>
            </template>
        </div>

        <!-- Grey companion rows: sec. grey, primary grey, tert. grey -->
        <div
            v-if="greyRows.length > 0"
            class="swatch-group swatch__group swatch__group--grey"
        >
            <template
                v-for="row in greyRows"
                :key="row.rowId"
            >
                <div class="swatch-row swatch__row swatch__row--grey">
                    <div class="swatch-row-label swatch__label">
                        {{ row.label }}
                    </div>
                    <ColorSwatchRow
                        :hue="row.hue"
                        :saturation="greySaturations"
                        :lightness-steps="greyLightnessSteps"
                        :total-steps="totalSteps"
                        class="swatch-row-swatches"
                    />
                </div>
            </template>
        </div>

        <!-- Neutral row (always last) -->
        <div
            v-if="isUnlocked('neutral')"
            class="swatch-group swatch__group swatch__group--neutral"
        >
            <div class="swatch-row swatch__row swatch__row--neutral">
                <div class="swatch-row-label swatch__label">
                    Neutral
                </div>
                <ColorSwatchRow
                    :hue="hue"
                    :saturation="0"
                    :lightness-steps="greyLightnessSteps"
                    :total-steps="totalSteps"
                    class="swatch-row-swatches"
                />
            </div>
        </div>
    </section>
</template>

<script setup lang="ts">
import { findClosestLightnessIndex } from "~/composables/utils/lightnessIndex";
import { useSwatchUnlock } from "~/composables/steps/useSwatchUnlock";
import { useComplementaryColors } from "~/composables/input/useComplementaryColors";
import { greySaturationSteps } from "~/composables/utils/greySaturation";
import { stepLightnessDistribution } from "~/composables/input/stepLightnessDistribution";

const props = defineProps<{
    hue: number;
    saturation: number;
    lightnessSteps: number[];
    totalSteps: number;
    targetLightness: number;
}>();

const { grayscaleLightnessSteps: greyLightnessSteps } = stepLightnessDistribution();

const { isUnlocked } = useSwatchUnlock();
const { orderedRows, greyCompanionRows, primaryGreyName } = useComplementaryColors();

const markerIndex = computed(() => {
    const baseIndex = findClosestLightnessIndex(props.lightnessSteps, props.targetLightness);
    // Shift one step darker (lower lightness = higher index toward black)
    return Math.max(0, baseIndex - 1);
});

/** Per-swatch grey saturation array following TW distribution, scaled by saturation slider */
const greySaturations = computed(() => greySaturationSteps(props.saturation, props.totalSteps));

const chromaticLabels: Record<string, string> = {
    primary: "Primary",
    secondary: "Secondary",
    tertiary: "Tertiary"
};

/** Chromatic rows: Secondary → Primary → Tertiary */
const chromaticRows = computed(() =>
    orderedRows.value
        .filter(row => isUnlocked(row.rowId))
        .map(row => ({
            rowId: row.rowId,
            hue: row.hue,
            label: chromaticLabels[row.rowId] ?? row.rowId,
            saturation: props.saturation
        }))
);

/** Grey companion rows: sec. grey → primary grey → tert. grey */
const greyRows = computed(() => {
    // Build lookup for grey companion labels by parent ID
    const greyLabelByParent: Record<string, string> = {};
    for (const g of greyCompanionRows.value) {
        greyLabelByParent[g.parentId] = g.label;
    }

    // Order: secondary-grey, primary-grey, tertiary-grey
    const rows: { rowId: string; hue: number; label: string }[] = [];

    for (const row of orderedRows.value) {
        if (!isUnlocked(row.rowId)) continue;
        rows.push({
            rowId: `${row.rowId}-grey`,
            hue: row.hue,
            label: row.rowId === "primary" ? primaryGreyName.value : (greyLabelByParent[row.rowId] ?? "Gray")
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
