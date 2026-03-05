<template>
    <div class="saturation-slider">
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
                    :style="{
                        '--hue-value': hue + 'deg',
                        '--saturation-value': modelValue + '%'
                    }"
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
    hue: number;
    min: number;
    max: number;
    unit?: string;
}>();

defineEmits<{
    "update:modelValue": [value: number];
}>();
</script>

<style scoped>
.saturation-slider {
    margin-bottom: 1rem;
}

.slider-row {
    display: flex;
    align-items: center;
    gap: 1rem;
}

.slider-track {
    flex: 1;
    max-width: 300px;
}

/* Functional: gradient shows saturation range */
.slider-input {
    width: 100%;
    height: 8px;
    -webkit-appearance: none;
    appearance: none;
    background: linear-gradient(to right,
            hsl(var(--hue-value), 0%, 50%),
            hsl(var(--hue-value), 100%, 50%));
    border-radius: 4px;
    outline: none;
}

/* Functional: thumb shows current saturation */
.slider-input::-webkit-slider-thumb {
    -webkit-appearance: none;
    appearance: none;
    width: 20px;
    height: 20px;
    border-radius: 50%;
    background: hsl(var(--hue-value), var(--saturation-value), 50%);
    border: 2px solid white;
    cursor: pointer;
}

.slider-input::-moz-range-thumb {
    width: 20px;
    height: 20px;
    border-radius: 50%;
    background: hsl(var(--hue-value), var(--saturation-value), 50%);
    border: 2px solid white;
    cursor: pointer;
}

.slider-value {
    font-variant-numeric: tabular-nums;
    min-width: 4rem;
}
</style>
