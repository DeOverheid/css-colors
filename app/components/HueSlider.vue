<template>
    <div class="hue-slider">
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
                    :style="{ '--hue-value': modelValue + 'deg' }"
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
}>();

defineEmits<{
    "update:modelValue": [value: number];
}>();
</script>

<style scoped>
.hue-slider {
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

/* Functional: gradient shows hue spectrum */
.slider-input {
    width: 100%;
    height: 8px;
    -webkit-appearance: none;
    appearance: none;
    background: linear-gradient(to right,
            hsl(0, 100%, 50%),
            hsl(60, 100%, 50%),
            hsl(120, 100%, 50%),
            hsl(180, 100%, 50%),
            hsl(240, 100%, 50%),
            hsl(300, 100%, 50%),
            hsl(360, 100%, 50%));
    border-radius: 4px;
    outline: none;
}

/* Functional: thumb shows current hue color */
.slider-input::-webkit-slider-thumb {
    -webkit-appearance: none;
    appearance: none;
    width: 20px;
    height: 20px;
    border-radius: 50%;
    background: hsl(var(--hue-value), 100%, 50%);
    border: 2px solid white;
    cursor: pointer;
}

.slider-input::-moz-range-thumb {
    width: 20px;
    height: 20px;
    border-radius: 50%;
    background: hsl(var(--hue-value), 100%, 50%);
    border: 2px solid white;
    cursor: pointer;
}

.slider-value {
    font-variant-numeric: tabular-nums;
    min-width: 4rem;
}
</style>
