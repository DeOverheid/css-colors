<template>
    <section class="swatches-preview panel">
        <!-- Primary Color Row -->
        <div
            v-if="isUnlocked('primary')"
            class="swatch-row">
            <div class="swatch-row-label">
                Primary
            </div>
            <ColorSwatchRow
                :hue="hue"
                :saturation="saturation"
                :lightness-steps="lightnessSteps"
                :total-steps="totalSteps"
                :show-marker="true"
                :marker-index="markerIndex"
                class="swatch-row-swatches" />
            <div class="swatch-row-value">
                {{ saturation }}%
            </div>
        </div>

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

const props = defineProps<{
    hue: number;
    saturation: number;
    mutedSaturation: number;
    lightnessSteps: number[];
    totalSteps: number;
    targetLightness: number;
}>();

const { isUnlocked } = useSwatchUnlock();

const markerIndex = computed(() =>
    findClosestLightnessIndex(props.lightnessSteps, props.targetLightness)
);

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
