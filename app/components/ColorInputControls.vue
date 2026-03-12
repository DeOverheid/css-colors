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
                v-model="colorSettings.step1.hue.value"
                :min="0"
                :max="360"
                class="input-field" />
            <div class="input-value">
                {{ colorSettings.step1.hue.value }}°
            </div>
        </div>
        <div class="input-row">
            <label class="input-label">Saturation</label>
            <SaturationSlider
                id="saturation"
                v-model="colorSettings.step1.saturation.value"
                :hue="colorSettings.step1.hue.value"
                :min="0"
                :max="100"
                class="input-field" />
            <div class="input-value">
                {{ colorSettings.step1.saturation.value }}%
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
        colorSettings.step1.hue.value = parsed.hue;
        colorSettings.step1.saturation.value = parsed.saturation;
        userInputLightness.value = parsed.lightness;
    }
}
</script>

<style scoped>
.step1-controls {
    display: flex;
    flex-direction: column;
    gap: 1rem;
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
    grid-template-columns: var(--label-column-width, 80px) 1fr var(--label-column-width, 80px);
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
</style>
