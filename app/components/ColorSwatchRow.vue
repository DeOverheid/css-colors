<template>
    <div class="color-swatch-row swatch__row">
        <!-- Pure black (L: 0) -->
        <ColorSwatch
            :hue="hue"
            :saturation="satValues[0] ?? 0"
            :lightness="0"
            :class="['swatch__cell swatch__cell--black', { 'marked': showMarker && markerIndex === 0, 'swatch__cell--marked': showMarker && markerIndex === 0 }]"
        />

        <!-- Steps from bezier curve -->
        <ColorSwatch
            v-for="(lightnessValue, index) in lightnessSteps"
            :key="`step-${index}`"
            :hue="hue"
            :saturation="satValues[index + 1] ?? 0"
            :lightness="lightnessValue"
            :class="['swatch__cell', { 'marked': showMarker && markerIndex === index + 1, 'swatch__cell--marked': showMarker && markerIndex === index + 1 }]"
        />

        <!-- Pure white (L: 100) -->
        <ColorSwatch
            :hue="hue"
            :saturation="satValues[totalSteps - 1] ?? 0"
            :lightness="100"
            :class="['swatch__cell swatch__cell--white', { 'marked': showMarker && markerIndex === totalSteps - 1, 'swatch__cell--marked': showMarker && markerIndex === totalSteps - 1 }]"
        />
    </div>
</template>

<script setup lang="ts">
const props = defineProps<{
    hue: number;
    /** Single saturation value (applied to all swatches) or per-swatch array (length = totalSteps) */
    saturation: number | number[];
    lightnessSteps: number[];
    totalSteps: number;
    showMarker?: boolean;
    markerIndex?: number;
}>();

/** Resolved per-swatch saturation values */
const satValues = computed((): number[] => {
    if (Array.isArray(props.saturation)) {
        return props.saturation;
    }
    return Array(props.totalSteps).fill(props.saturation);
});
</script>

<style scoped>
.color-swatch-row {
    display: grid;
    grid-template-columns: repeat(v-bind(totalSteps), 1fr);
    gap: 0;
    width: 100%;
}

.color-swatch-row :deep(.marked) {
    outline: 3px solid var(--ui-primary);
    outline-offset: -3px;
    z-index: 1;
    position: relative;
}
</style>
