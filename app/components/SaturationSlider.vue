<template>
    <BaseSlider
        :id="id"
        :label="label"
        :model-value="modelValue"
        :min="min"
        :max="max"
        :unit="unit"
        :track-gradient="`linear-gradient(to right, hsl(${hue}deg, 0%, 50%), hsl(${hue}deg, 100%, 50%))`"
        :thumb-color="`hsl(${hue}deg, ${modelValue}%, 50%)`"
        @update:model-value="$emit('update:modelValue', $event)" />
</template>

<script setup lang="ts">
defineProps<{
    id: string;
    label?: string;
    modelValue: number;
    hue: number;
    min: number;
    max: number;
    unit?: string;
}>();

defineEmits<{
    "update:modelValue": [value: number];
}>();
</script>
