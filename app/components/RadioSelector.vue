<template>
    <form class="radio-selector">
        <fieldset
            class="radio-selector__fieldset"
            :class="{ 'radio-selector__fieldset--segmented': segmented }">
            <legend
                v-if="legend"
                class="radio-selector__legend">
                {{ legend }}
            </legend>
            <label
                v-for="option in options"
                :key="option.value"
                class="radio-selector__option"
                :class="{ 'radio-selector__option--active': modelValue === option.value }"
                :style="option.background ? { background: option.background, color: 'white' } : {}"
                :title="option.title">
                <input
                    type="radio"
                    :name="name"
                    :value="option.value"
                    :checked="modelValue === option.value"
                    class="radio-selector__input"
                    @change="$emit('update:modelValue', option.value)">
                <span
                    v-if="option.swatch && !option.background && !segmented"
                    class="radio-selector__swatch"
                    :style="{ background: option.swatch }" />
                <span class="radio-selector__label">{{ option.label }}</span>
            </label>
        </fieldset>
    </form>
</template>

<script setup lang="ts">
export interface RadioOption {
    /** Unique value emitted on selection */
    value: string;
    /** Display label text */
    label: string;
    /** Optional title attribute (tooltip) */
    title?: string;
    /** Optional swatch color (CSS color string) */
    swatch?: string;
    /** Optional background color for the entire button */
    background?: string;
}

defineProps<{
    /** Currently selected value (v-model) */
    modelValue: string;
    /** Radio group name (for form semantics) */
    name: string;
    /** Options to display */
    options: RadioOption[];
    /** Optional fieldset legend */
    legend?: string;
    /** Segmented control appearance: no gaps, first/last rounding only */
    segmented?: boolean;
}>();

defineEmits<{
    (e: "update:modelValue", value: string): void;
}>();
</script>

<style scoped>
/* Fieldset reset */
.radio-selector__fieldset {
    border: none;
    margin: 0;
    padding: 0;
    display: flex;
    gap: 0.5rem;
    flex-wrap: wrap;
}

/* Legend */
.radio-selector__legend {
    font-family: var(--font-family-header);
    font-weight: 600;
    color: var(--ui-text-muted);
    margin-bottom: 0.5rem;
    width: 100%;
}

/* Hidden native radio */
.radio-selector__input {
    position: absolute;
    opacity: 0;
    width: 0;
    height: 0;
    pointer-events: none;
}

/* Option label (the clickable pill) */
.radio-selector__option {
    display: flex;
    align-items: center;
    gap: 0.375rem;
    padding: 0.25rem 0.5rem;
    border-radius: 6px;
    border: 1.5px solid var(--ui-border);
    background: transparent;
    cursor: pointer;
    transition: border-color 0.15s, background 0.15s;
    font-family: var(--font-family-header);
    font-weight: 600;
    font-size: 0.75rem;
    color: var(--ui-text-muted);
}

/* Hover */
.radio-selector__option:hover {
    border-color: var(--ui-border-hover);
    background: var(--ui-bg-elevated);
}

/* Active / selected */
.radio-selector__option--active {
    border-color: var(--ui-color-primary-400);
    background: var(--ui-bg-elevated);
    color: var(--ui-text);
}

/* Color swatch dot */
.radio-selector__swatch {
    display: inline-block;
    width: 16px;
    height: 16px;
    border-radius: 3px;
    border: 1px solid rgba(255, 255, 255, 0.1);
    flex-shrink: 0;
}

/* Segmented variant: connected button group */
.radio-selector__fieldset--segmented {
    gap: 0;
}

.radio-selector__fieldset--segmented .radio-selector__option {
    border-radius: 0;
    flex: 1;
    justify-content: center;
    text-align: center;
}

.radio-selector__fieldset--segmented .radio-selector__option+.radio-selector__option {
    margin-left: -1.5px;
}

.radio-selector__fieldset--segmented .radio-selector__option:first-of-type {
    border-top-left-radius: 6px;
    border-bottom-left-radius: 6px;
}

.radio-selector__fieldset--segmented .radio-selector__option:last-of-type {
    border-top-right-radius: 6px;
    border-bottom-right-radius: 6px;
}

.radio-selector__fieldset--segmented .radio-selector__option--active {
    position: relative;
    z-index: 1;
}
</style>
