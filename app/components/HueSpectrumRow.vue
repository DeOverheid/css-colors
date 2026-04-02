<template>
    <div class="hue-spectrum-row">
        <!-- Dark offset slider -->
        <div class="slider-column">
            <TooltipSlider
                :label="`${entry.name} dark`"
                :model-value="darkOffset"
                :min="offsetRange.min"
                :max="offsetRange.max"
                :display-value="formatOffset(darkOffset)"
                @update:model-value="$emit('update:darkOffset', $event)" />
        </div>

        <!-- Middle column: Color swatches -->
        <div class="swatches-column">
            <div class="swatches-row">
                <ColorSwatch
                    v-for="item in orderedSteps"
                    :key="item.originalIndex"
                    :hue="hueForStep(item.originalIndex)"
                    :saturation="adjustedSaturation(item.originalIndex)"
                    :lightness="adjustedLightness(item.step, item.originalIndex)" />
            </div>
        </div>

        <!-- Light offset slider -->
        <div class="slider-column">
            <TooltipSlider
                :label="`${entry.name} light`"
                :model-value="lightOffset"
                :min="offsetRange.min"
                :max="offsetRange.max"
                :display-value="formatOffset(lightOffset)"
                @update:model-value="$emit('update:lightOffset', $event)" />
        </div>
    </div>
</template>

<script setup lang="ts">
import type { HueEntry } from "~/composables/input/stepHueSpectrum";
import { useLightnessAdjustment } from "~/composables/input/stepLightnessAdjustment";
import { getHueForStep, formatOffset, getAdjustedLightness, getAdjustedSaturation } from "~/composables/utils/hueRowColors";

const props = defineProps<{
    entry: HueEntry;
    lightOffset: number;
    darkOffset: number;
    saturation: number;
    lightnessSteps: number[];
    offsetRange: { min: number; max: number };
}>();

defineEmits<{
    "update:lightOffset": [value: number];
    "update:darkOffset": [value: number];
}>();

const { applyAdjustment } = useLightnessAdjustment();

const totalSteps = computed(() => props.lightnessSteps.length);

// Steps in original order (dark to light, left to right)
const orderedSteps = computed(() => {
    return props.lightnessSteps.map((step, index) => ({
        step,
        originalIndex: index
    }));
});

// Wrapper functions that bind component props to pure utility functions
function hueForStep(index: number): number {
    return getHueForStep(index, totalSteps.value, props.entry.baseHue, props.darkOffset, props.lightOffset);
}

function adjustedLightness(lightness: number, index: number): number {
    const hue = hueForStep(index);
    return getAdjustedLightness(lightness, index, totalSteps.value, 0, hue, applyAdjustment);
}

function adjustedSaturation(index: number): number {
    return getAdjustedSaturation(
        index, totalSteps.value, props.saturation,
        props.entry.saturationDarkOffset ?? 0, props.entry.saturationLightOffset ?? 0
    );
}
</script>

<style scoped>
.hue-spectrum-row {
    display: grid;
    grid-template-columns: 100px 1fr 100px;
    gap: 0.25rem;
    align-items: center;
}

.slider-column {
    display: flex;
    flex-direction: column;
}

.slider-column label {
    font-size: 0.625rem;
    opacity: 0.7;
    text-transform: capitalize;
}

.swatches-column {
    display: flex;
    flex-direction: column;
}

.swatches-row {
    display: flex;
    gap: 0;
}

.swatches-row :deep(.color-swatch) {
    flex: 1;
    aspect-ratio: 2 / 1;
    min-width: 0;
}
</style>
