<template>
    <div
        class="color-swatch"
        :style="{
            backgroundColor: hslColor
        }"
        :title="`H: ${hue}° S: ${saturation}% L: ${lightness}%`"
    />
</template>

<script setup lang="ts">
const props = defineProps<{
    hue: number;
    saturation: number;
    lightness: number;
}>();

const hslColor = computed(() => {
    return `hsl(${props.hue}, ${props.saturation}%, ${props.lightness}%)`;
});
</script>

<style scoped>
.color-swatch {
    width: 100%;
    aspect-ratio: 1;
}
</style>
