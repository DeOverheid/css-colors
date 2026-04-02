<template>
    <div class="tooltip-slider">
        <input
            type="range"
            :value="modelValue"
            :min="min"
            :max="max"
            :step="step"
            v-bind="$attrs"
            @input="$emit('update:modelValue', Number(($event.target as HTMLInputElement).value))">
        <span
            class="tooltip-slider__tip"
            :style="{ left: tooltipLeft }">
            {{ displayValue ?? modelValue }}
        </span>
    </div>
</template>

<script setup lang="ts">
defineOptions({ inheritAttrs: false });

const props = defineProps<{
    modelValue: number;
    min?: number;
    max?: number;
    step?: number;
    /** Formatted string shown in tooltip (defaults to raw value) */
    displayValue?: string | number;
    /** Override tooltip position as 0–100 percentage (defaults to value mapped to min–max) */
    tooltipPosition?: number;
}>();

defineEmits<{
    "update:modelValue": [value: number];
}>();

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
    position: relative;
    width: 100%;
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
