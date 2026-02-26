<template>
    <div class="color-swatch-row">
        <!-- Pure black (L: 0) -->
        <ColorSwatch
            :hue="hue"
            :saturation="saturation"
            :lightness="0"
            :class="{ marked: showMarker && markerIndex === 0 }"
        />

        <!-- Steps from bezier curve -->
        <ColorSwatch
            v-for="(lightnessValue, index) in lightnessSteps"
            :key="`step-${index}`"
            :hue="hue"
            :saturation="saturation"
            :lightness="lightnessValue"
            :class="{ marked: showMarker && markerIndex === index + 1 }"
        />

        <!-- Pure white (L: 100) -->
        <ColorSwatch
            :hue="hue"
            :saturation="saturation"
            :lightness="100"
            :class="{ marked: showMarker && markerIndex === totalSteps - 1 }"
        />
    </div>
</template>

<script setup lang="ts">
defineProps<{
    hue: number;
    saturation: number;
    lightnessSteps: number[];
    totalSteps: number;
    showMarker?: boolean;
    markerIndex?: number;
}>();
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
