<!-- eslint-disable vue/no-mutating-props -- settings is shared reactive state from a composable singleton -->
<template>
    <div class="adjustment-section">
        <div class="section-header">
            <h4>{{ title }}</h4>
            <label class="toggle-label small">
                <input
                    v-model="settings.enabled"
                    type="checkbox">
                <span>Enabled</span>
            </label>
        </div>
        <p class="section-description">
            {{ description }}
        </p>

        <div
            v-if="settings.enabled"
            class="control-grid">
            <div class="control-row">
                <label :for="`${idPrefix}-start-${componentId}`">Hue Start</label>
                <input
                    :id="`${idPrefix}-start-${componentId}`"
                    v-model.number="settings.start"
                    type="range"
                    min="0"
                    max="360"
                    step="1">
                <output>{{ settings.start }}°</output>
            </div>

            <div class="control-row">
                <label :for="`${idPrefix}-end-${componentId}`">Hue End</label>
                <input
                    :id="`${idPrefix}-end-${componentId}`"
                    v-model.number="settings.end"
                    type="range"
                    min="0"
                    max="360"
                    step="1">
                <output>{{ settings.end }}°</output>
            </div>

            <div class="control-row">
                <label :for="`${idPrefix}-falloff-${componentId}`">Hue Falloff</label>
                <input
                    :id="`${idPrefix}-falloff-${componentId}`"
                    v-model.number="settings.hueFalloff"
                    type="range"
                    min="0"
                    max="60"
                    step="1">
                <output>{{ settings.hueFalloff }}°</output>
            </div>

            <div class="control-row">
                <label :for="`${idPrefix}-amplitude-${componentId}`">Amplitude</label>
                <input
                    :id="`${idPrefix}-amplitude-${componentId}`"
                    v-model.number="settings.lightnessAmplitude"
                    type="range"
                    min="0"
                    max="30"
                    step="0.5">
                <output>{{ settings.lightnessAmplitude.toFixed(1) }}</output>
            </div>

            <div class="control-row">
                <label :for="`${idPrefix}-light-falloff-${componentId}`">Light Falloff</label>
                <input
                    :id="`${idPrefix}-light-falloff-${componentId}`"
                    v-model.number="settings.lightnessFalloffLight"
                    type="range"
                    min="0"
                    max="1"
                    step="0.01">
                <output>{{ settings.lightnessFalloffLight.toFixed(2) }}</output>
            </div>

            <div class="control-row">
                <label :for="`${idPrefix}-dark-falloff-${componentId}`">Dark Falloff</label>
                <input
                    :id="`${idPrefix}-dark-falloff-${componentId}`"
                    v-model.number="settings.lightnessFalloffDark"
                    type="range"
                    min="0"
                    max="1"
                    step="0.01">
                <output>{{ settings.lightnessFalloffDark.toFixed(2) }}</output>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import type { AdjustmentRange } from "~/composables/themes/lib/types";

defineProps<{
    title: string;
    description: string;
    settings: AdjustmentRange;
    idPrefix: string;
}>();

const componentId = useId();
</script>

<style scoped>
.adjustment-section {
    display: flex;
    flex-direction: column;
    gap: 5px;
}

.section-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.section-header h4 {
    margin: 0;
    font-size: 0.75rem;
    font-weight: 600;
}

.toggle-label.small {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    cursor: pointer;
    font-size: 0.75rem;
}

.toggle-label.small input[type="checkbox"] {
    width: 1rem;
    height: 1rem;
    cursor: pointer;
}

.section-description {
    font-size: 0.75rem;
    opacity: 0.7;
    margin: 0;
}

.control-grid {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
}

.control-row {
    display: grid;
    grid-template-columns: 80px 1fr 80px;
    gap: 0.75rem;
    align-items: center;
}

.control-row label {
    font-size: 0.75rem;
}

.control-row input[type="range"] {
    width: 100%;
}

.control-row output {
    font-size: 0.75rem;
    font-variant-numeric: tabular-nums;
    text-align: right;
}
</style>
