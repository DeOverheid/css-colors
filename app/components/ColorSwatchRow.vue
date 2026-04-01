<template>
    <div class="color-swatch-row swatch__row">
        <!-- Pure black (L: 0) -->
        <ColorSwatch
            :hue="swatchHues[0] ?? hue"
            :saturation="satValues[0] ?? 0"
            :lightness="adjustedLightness[0] ?? 0"
            :class="['swatch__cell swatch__cell--black', { 'marked': showMarker && markerIndex === 0, 'swatch__cell--marked': showMarker && markerIndex === 0 }]" />

        <!-- Steps from bezier curve -->
        <ColorSwatch
            v-for="(_, index) in lightnessSteps"
            :key="`step-${index}`"
            :hue="swatchHues[index + 1] ?? hue"
            :saturation="satValues[index + 1] ?? 0"
            :lightness="adjustedLightness[index + 1] ?? 0"
            :class="['swatch__cell', { 'marked': showMarker && markerIndex === index + 1, 'swatch__cell--marked': showMarker && markerIndex === index + 1 }]" />

        <!-- Pure white (L: 100) -->
        <ColorSwatch
            :hue="swatchHues[totalSteps - 1] ?? hue"
            :saturation="satValues[totalSteps - 1] ?? 0"
            :lightness="adjustedLightness[totalSteps - 1] ?? 100"
            :class="['swatch__cell swatch__cell--white', { 'marked': showMarker && markerIndex === totalSteps - 1, 'swatch__cell--marked': showMarker && markerIndex === totalSteps - 1 }]" />
    </div>
</template>

<script setup lang="ts">
import { useLightnessAdjustment } from "~/composables/input/stepLightnessAdjustment";
import { useHueShift } from "~/composables/input/stepHueShift";

const props = defineProps<{
    hue: number;
    /** Single saturation value (applied to all swatches) or per-swatch array (length = totalSteps) */
    saturation: number | number[];
    lightnessSteps: number[];
    totalSteps: number;
    showMarker?: boolean;
    markerIndex?: number;
}>();

const { applyAdjustment } = useLightnessAdjustment();
const { getHueForSwatch } = useHueShift();

/** Per-swatch hue values with hue shift applied */
const swatchHues = computed((): number[] =>
    Array.from({ length: props.totalSteps }, (_, i) =>
        getHueForSwatch(props.hue, i, props.totalSteps)
    )
);

/** Resolved per-swatch saturation values */
const satValues = computed((): number[] => {
    if (Array.isArray(props.saturation)) {
        return props.saturation;
    }
    return Array(props.totalSteps).fill(props.saturation);
});

/** All lightness values with adjustment applied: [0, ...steps, 100] */
const adjustedLightness = computed((): number[] => {
    const allBase = [0, ...props.lightnessSteps, 100];
    const lastIndex = allBase.length - 1;
    return allBase.map((baseLightness, index) => {
        if (index === 0 || index === lastIndex) return baseLightness;
        return applyAdjustment(baseLightness, swatchHues.value[index] ?? props.hue, index, props.totalSteps);
    });
});
</script>

<style scoped>
.color-swatch-row {
    display: grid;
    grid-template-columns: repeat(v-bind(totalSteps), 1fr);
    gap: 0;
    width: 100%;
    height: 100%;
}

.color-swatch-row :deep(.marked) {
    outline: 3px solid var(--ui-primary);
    outline-offset: -3px;
    z-index: 1;
    position: relative;
}
</style>
