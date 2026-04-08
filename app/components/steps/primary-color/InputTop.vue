<template>
    <div class="step1-controls">
        <div class="input-row-color">
            <label class="input-label">Color</label>
            <UInput
                v-model="colorInput"
                placeholder="#hex, rgb(), or hsl()"
                class="input-field"
                @keydown.enter="applyColor" />
            <UButton
                class="color-apply-btn w-fit justify-self-start"
                color="primary"
                variant="soft"
                :disabled="!colorInput.trim()"
                @click="applyColor">
                <span>Input color</span>
            </UButton>
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
    </div>
</template>

<script setup lang="ts">
import { useColorSettings } from "~/composables/core/useColorSettings";
import { useUserInputLightness } from "~/composables/ui/useUserInputLightness";
import { parseColor } from "~/composables/utils/parseColor";

const colorSettings = useColorSettings();
const userInputLightness = useUserInputLightness();

const colorInput = ref("");

function applyColor() {
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
    grid-template-columns: var(--label-column-width, 80px) 0.5fr auto;
    gap: 1rem;
}

.input-row-color>.input-label {
    align-self: center;
}

.color-apply-btn {
    width: fit-content;
    justify-self: start;
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
