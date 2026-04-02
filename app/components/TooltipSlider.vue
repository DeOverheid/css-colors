<template>
    <label
        :for="sliderId"
        class="tooltip-slider"
        v-bind="$attrs">
        <span
            v-if="label"
            class="sidepanel__label">
            {{ label }}
        </span>
        <span class="tooltip-slider__track">
            <input
                :id="sliderId"
                type="range"
                class="tooltip-slider__input"
                :value="modelValue"
                :min="min"
                :max="max"
                :step="step"
                @input="$emit('update:modelValue', Number(($event.target as HTMLInputElement).value))">
            <span
                class="tooltip-slider__tip"
                :style="{ left: tooltipLeft }">
                {{ displayValue ?? modelValue }}
            </span>
        </span>
    </label>
</template>

<script setup lang="ts">
defineOptions({ inheritAttrs: false });

const props = defineProps<{
    modelValue: number;
    min?: number;
    max?: number;
    step?: number;
    /** Label text shown above the slider */
    label?: string;
    /** Formatted string shown in tooltip (defaults to raw value) */
    displayValue?: string | number;
    /** Override tooltip position as 0–100 percentage (defaults to value mapped to min–max) */
    tooltipPosition?: number;
}>();

defineEmits<{
    "update:modelValue": [value: number];
}>();

const sliderId = useId();

const tooltipLeft = computed(() => {
    if (props.tooltipPosition != null) return props.tooltipPosition + "%";
    const min = props.min ?? 0;
    const max = props.max ?? 100;
    const range = max - min;
    if (range === 0) return "50%";
    return ((props.modelValue - min) / range) * 100 + "%";
});
</script>

<style scoped>
.tooltip-slider {
    width: 100%;
}

.tooltip-slider__track {
    position: relative;
    display: block;
}

.tooltip-slider__input {
    width: 100%;
    height: 8px;
    -webkit-appearance: none;
    appearance: none;
    border-radius: 4px;
    border: none;
    outline: none;
    background: var(--track-background, linear-gradient(to right, #333, #ccc));
}

.tooltip-slider__input::-webkit-slider-thumb {
    -webkit-appearance: none;
    appearance: none;
    width: 18px;
    height: 18px;
    border-radius: 50%;
    background: var(--thumb-color, var(--color-gray-300));
    border: 2px solid white;
    cursor: pointer;
}

.tooltip-slider__input::-moz-range-thumb {
    width: 18px;
    height: 18px;
    border-radius: 50%;
    background: var(--thumb-color, var(--color-gray-300));
    border: 2px solid white;
    cursor: pointer;
}

.tooltip-slider__tip {
    position: absolute;
    bottom: calc(100% + 6px);
    transform: translateX(-50%);
    font-size: 0.6875rem;
    font-variant-numeric: tabular-nums;
    background: var(--ui-color-primary-900, #1a1a2e);
    color: white;
    padding: 2px 6px;
    border-radius: 4px;
    white-space: nowrap;
    pointer-events: none;
    opacity: 0;
    transition: opacity 0.15s;
}

.tooltip-slider:hover .tooltip-slider__tip,
.tooltip-slider:active .tooltip-slider__tip,
.tooltip-slider:has(input:active) .tooltip-slider__tip {
    opacity: 1;
}
</style>
