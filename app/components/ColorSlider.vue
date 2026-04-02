<template>
    <div class="color-slider">
        <label :for="id">{{ label }}</label>
        <div class="slider-row">
            <USlider
                :id="id"
                :model-value="modelValue"
                :min="min"
                :max="max"
                class="slider-input"
                @update:model-value="$emit('update:modelValue', $event)" />
            <span class="slider-value">
                {{ modelValue }}{{ unit }}
            </span>
        </div>
    </div>
</template>

<script setup lang="ts">
defineProps<{
    id: string;
    label: string;
    modelValue: number;
    min: number;
    max: number;
    unit?: string;
}>();

defineEmits<{
    "update:modelValue": [value: number];
}>();
</script>

<style scoped>
.color-slider {
    margin-bottom: 10px;
}

.slider-row {
    display: flex;
    align-items: center;
    gap: 1rem;
}

.slider-input {
    flex: 1;
}

.slider-value {
    font-variant-numeric: tabular-nums;
    min-width: 4rem;
}
</style>
