<template>
    <div class="base-slider">
        <label
            v-if="label"
            :for="id">
            {{ label }}
        </label>
        <div class="slider-row">
            <div class="slider-track">
                <input
                    :id="id"
                    type="range"
                    :value="modelValue"
                    :min="min"
                    :max="max"
                    class="slider-input"
                    :style="{ '--track-bg': trackGradient, '--thumb-bg': thumbColor }"
                    @input="$emit('update:modelValue', Number(($event.target as HTMLInputElement).value))">
            </div>
            <span
                v-if="unit"
                class="slider-value">
                {{ modelValue }}{{ unit }}
            </span>
        </div>
    </div>
</template>

<script setup lang="ts">
defineProps<{
    id: string;
    label?: string;
    modelValue: number;
    min: number;
    max: number;
    unit?: string;
    /** CSS value for the slider track background (e.g. a linear-gradient) */
    trackGradient: string;
    /** CSS color value for the slider thumb */
    thumbColor: string;
}>();

defineEmits<{
    "update:modelValue": [value: number];
}>();
</script>

<style scoped>
.base-slider {
    margin-bottom: 1rem;
}

.slider-row {
    display: flex;
    align-items: center;
    gap: 1rem;
}

.slider-track {
    flex: 1;
}

.slider-input {
    width: 100%;
    height: 8px;
    -webkit-appearance: none;
    appearance: none;
    background: var(--track-bg);
    border-radius: 4px;
    outline: none;
}

.slider-input::-webkit-slider-thumb {
    -webkit-appearance: none;
    appearance: none;
    width: 20px;
    height: 20px;
    border-radius: 50%;
    background: var(--thumb-bg);
    border: 2px solid white;
    cursor: pointer;
}

.slider-input::-moz-range-thumb {
    width: 20px;
    height: 20px;
    border-radius: 50%;
    background: var(--thumb-bg);
    border: 2px solid white;
    cursor: pointer;
}

.slider-value {
    font-variant-numeric: tabular-nums;
    min-width: 4rem;
}
</style>
