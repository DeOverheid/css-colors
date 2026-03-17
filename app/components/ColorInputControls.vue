<template>
    <div class="step1-controls">
        <div class="input-row-color">
            <label class="input-label">Color</label>
            <UInput
                v-model="colorInput"
                placeholder="#hex, rgb(), or hsl()"
                class="input-field"
                @input="handleColorInput" />
        </div>
        <div class="input-row">
            <label class="input-label">Hue</label>
            <HueSlider
                id="hue"
                v-model="colorSettings.hue.value"
                :min="0"
                :max="360"
                :saturation="colorSettings.saturation.value"
                class="input-field" />
            <div class="input-value">
                {{ colorSettings.hue.value }}°
            </div>
        </div>
        <div class="input-row">
            <label class="input-label">Saturation</label>
            <SaturationSlider
                id="saturation"
                v-model="colorSettings.saturation.value"
                :hue="colorSettings.hue.value"
                :min="0"
                :max="100"
                class="input-field" />
            <div class="input-value">
                {{ colorSettings.saturation.value }}%
            </div>
        </div>

        <div class="color-preview swatch__group">
            <div class="preview-swatches swatch__row">
                <span class="preview-label swatch__label">Primary</span>
                <span
                    class="preview-swatch swatch__cell"
                    :style="{ background: `hsl(${colorSettings.hue.value}, ${colorSettings.saturation.value}%, ${colorSettings.lightness.value}%)` }" />
                <span class="preview-value swatch__value">{{ colorSettings.hue.value }}°</span>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { useColorSettings } from "~/composables/core/useColorSettings";
import { parseColor } from "~/composables/utils/parseColor";

const colorSettings = useColorSettings();

const colorInput = ref("");
const userInputLightness = defineModel<number | null>("userInputLightness");

function handleColorInput() {
    const parsed = parseColor(colorInput.value);
    if (parsed) {
        colorSettings.hue.value = parsed.hue;
        colorSettings.saturation.value = parsed.saturation;
        userInputLightness.value = parsed.lightness;
    }
}
</script>

<style scoped>
.step1-controls {
    display: flex;
    flex-direction: column;
    gap: 10px;
    height: 100%;
    grid-column: 2;
}

.input-row {
    display: grid;
    grid-template-columns: var(--label-column-width, 80px) 1fr var(--label-column-width, 80px);
    gap: 1rem;
    align-items: center;
}

.input-row-color {
    display: grid;
    grid-template-columns: var(--label-column-width, 80px) 0.5fr;
    gap: 1rem;
    align-items: center;
}

.input-label {
    font-family: var(--font-family-header);
    font-weight: 600;
    color: var(--ui-text-muted);
}

.input-value {
    font-family: var(--font-family-header);
    font-weight: 600;
    font-variant-numeric: tabular-nums;
    text-align: right;
    color: var(--ui-text-muted);
}

.input-field {
    width: 100%;
}

.color-preview {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.25rem;
}

.preview-swatches {
    display: flex;
    align-items: center;
    gap: 0;
}

.preview-swatch {
    width: 360px;
    height: 40px;
    border: 1px solid rgba(255, 255, 255, 0.15);
}

.preview-label {
    font-family: var(--font-family-header);
    font-weight: 600;
    color: var(--ui-text-muted);
    font-size: 0.75rem;
    padding: 0 0.5rem;
    white-space: nowrap;
}

.preview-value {
    font-family: var(--font-family-header);
    font-variant-numeric: tabular-nums;
    color: var(--ui-text-muted);
    font-size: 0.75rem;
    padding: 0 0.5rem;
    white-space: nowrap;
}
</style>
