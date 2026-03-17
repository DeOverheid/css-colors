<template>
    <BaseSlider
        :id="id"
        :label="label"
        :model-value="modelValue"
        :min="min"
        :max="max"
        :unit="unit"
        :track-gradient="trackGradient"
        :thumb-color="`hsl(${modelValue}deg, ${saturation}%, 50%)`"
        @update:model-value="$emit('update:modelValue', $event)" />
</template>

<script setup lang="ts">
const props = defineProps<{
    id: string;
    label?: string;
    modelValue: number;
    min: number;
    max: number;
    unit?: string;
    /** Current saturation value (0-100) for track coloring */
    saturation?: number;
}>();

defineEmits<{
    "update:modelValue": [value: number];
}>();

const sat = computed(() => props.saturation ?? 100);

const trackGradient = computed(() =>
    `linear-gradient(to right, hsl(0, ${sat.value}%, 50%), hsl(60, ${sat.value}%, 50%), hsl(120, ${sat.value}%, 50%), hsl(180, ${sat.value}%, 50%), hsl(240, ${sat.value}%, 50%), hsl(300, ${sat.value}%, 50%), hsl(360, ${sat.value}%, 50%))`
);
</script>
