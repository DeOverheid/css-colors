<template>
    <div class="color-swatch-row">
        <!-- Pure black (L: 0) -->
        <ColorSwatch
            :hue="hue"
            :saturation="satAt(0)"
            :lightness="0"
            :class="{ marked: showMarker && markerIndex === 0 }"
        />

        <!-- Steps from bezier curve -->
        <ColorSwatch
            v-for="(lightnessValue, index) in lightnessSteps"
            :key="`step-${index}`"
            :hue="hue"
            :saturation="satAt(index + 1)"
            :lightness="lightnessValue"
            :class="{ marked: showMarker && markerIndex === index + 1 }"
        />

        <!-- Pure white (L: 100) -->
        <ColorSwatch
            :hue="hue"
            :saturation="satAt(totalSteps - 1)"
            :lightness="100"
            :class="{ marked: showMarker && markerIndex === totalSteps - 1 }"
        />
    </div>
</template>

<script setup lang="ts">
const props = defineProps<{
    hue: number;
    saturation: number;
    /** Optional per-swatch saturation array (length = totalSteps). Overrides `saturation` when provided. */
    saturations?: number[];
    lightnessSteps: number[];
    totalSteps: number;
    showMarker?: boolean;
    markerIndex?: number;
}>();

/** Return the saturation for swatch at the given index */
function satAt(index: number): number {
    return props.saturations?.[index] ?? props.saturation;
}
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
