<template>
    <BaseSlider
        :id="id"
        :label="label"
        :model-value="modelValue"
        :min="min"
        :max="max"
        :unit="unit"
        :track-gradient="trackGradient"
        :thumb-color="`hsl(${modelValue}deg, 100%, 50%)`"
        @update:model-value="$emit('update:modelValue', $event)" />
</template>

<script setup lang="ts">
const trackGradient = "linear-gradient(to right, hsl(0, 100%, 50%), hsl(60, 100%, 50%), hsl(120, 100%, 50%), hsl(180, 100%, 50%), hsl(240, 100%, 50%), hsl(300, 100%, 50%), hsl(360, 100%, 50%))";

defineProps<{
    id: string;
    label?: string;
    modelValue: number;
    min: number;
    max: number;
    unit?: string;
}>();

defineEmits<{
    "update:modelValue": [value: number];
}>();
</script>
