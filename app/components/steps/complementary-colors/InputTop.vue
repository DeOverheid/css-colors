<template>
    <div class="step-title">
        <h2>{{ activeStep.title }}</h2>
    </div>
    <div class="step-text">
        <p>{{ activeStep.description }}</p>
    </div>
    <div class="step-controls">
        <label class="input-label">1. Adjust the color wheel</label>
        <label class="input-label">2. Choose a UI tone</label>

        <div class="tone-grid">
            <!-- Names row -->
            <span class="preview-label">Neutral</span>
            <span class="preview-label">Secondary</span>
            <span class="preview-label">Primary</span>
            <span class="preview-label">Tertiary</span>
            <!-- Clickable swatches row -->

            <UFieldGroup>
                <UButton
                    class="tone-swatch"
                    :class="{ 'tone-swatch--active': uiToneSource === 'neutral' }"
                    :style="{ background: 'hsl(0, 0%, 46%)' }"
                    @click="uiToneSource = 'neutral'" />
                <UButton
                    class="tone-swatch"
                    :class="{ 'tone-swatch--active': uiToneSource === 'secondary' }"
                    :style="{ background: `hsl(${secondaryHue}, ${complementarySaturation}%, ${lightness}%)` }"
                    @click="uiToneSource = 'secondary'" />
                <UButton
                    class="tone-swatch"
                    :class="{ 'tone-swatch--active': uiToneSource === 'primary' }"
                    :style="{ 'background': `hsl(${primaryHue}, ${saturation}%, ${lightness}%)`, '--active-outline': 'white' }"
                    @click="uiToneSource = 'primary'" />
                <UButton
                    class="tone-swatch"
                    :class="{ 'tone-swatch--active': uiToneSource === 'tertiary' }"
                    :style="{ background: `hsl(${tertiaryHue}, ${complementarySaturation}%, ${lightness}%)` }"
                    @click="uiToneSource = 'tertiary'" />
            </UFieldGroup>

            <!-- Degrees row -->
            <span class="degrees-value">&ndash;</span>
            <span class="degrees-value">{{ secondaryHue }}°</span>
            <span class="degrees-value">{{ primaryHue }}°</span>
            <span class="degrees-value">{{ tertiaryHue }}°</span>
        </div>
    </div>
    <div class="step-wheel">
        <HueSaturationWheel />
    </div>
</template>

<script setup lang="ts">
import { useComplementaryColors } from "~/composables/input/useComplementaryColors";
import { useColorSettings } from "~/composables/core/useColorSettings";
import { useStepNavigation } from "~/composables/steps/useStepNavigation";

const colorSettings = useColorSettings();
const { activeStep } = useStepNavigation();
const { secondaryHue, tertiaryHue, uiToneSource, complementarySaturation } = useComplementaryColors();

const primaryHue = computed(() => colorSettings.hue.value);
const saturation = computed(() => colorSettings.saturation.value);
const lightness = computed(() => colorSettings.lightness.value);
</script>

<style scoped>
.step-title {
    grid-area: title;
    align-self: end;
}

.step-title h2 {
    font-weight: 600;
    margin: 0;
}

.step-text {
    grid-area: text;
}

.step-text p {
    color: var(--ui-text-muted);
    margin: 0;
}

.step-controls {
    grid-area: controls;
    display: flex;
    flex-direction: column;
    gap: 5px;
}

.step-wheel {
    grid-area: ui-input;
    height: 100%;
    aspect-ratio: 1;
    overflow: visible;
}

.input-label {
    font-family: var(--font-family-header);
    font-weight: 600;
    color: var(--ui-text-muted);
    text-overflow: ellipsis;
    overflow: hidden;
    white-space: nowrap;
}

.tone-grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 0;
    row-gap: 5px;
}

.tone-swatch {
    min-height: 20px;
    min-width: 0;
    padding: 0;
    border: none;
    border-radius: 0;
    outline: none;
    transition: outline-offset 0.1s;
}

.tone-swatch:first-of-type {
    border-radius: 6px 0 0 6px;
}

.tone-swatch:last-of-type {
    border-radius: 0 6px 6px 0;
}

.tone-swatch--active {
    outline: 2px solid var(--active-outline, var(--ui-primary, white));
    outline-offset: -2px;
    z-index: 1;
    position: relative;
}

.preview-label {
    font-family: var(--font-family-header);
    font-weight: 600;
    color: var(--ui-text-muted);
    font-size: 0.75rem;
    text-align: center;
}

.degrees-value {
    text-align: center;
    font-variant-numeric: tabular-nums;
    color: var(--ui-text-muted);
    font-size: 0.75rem;
}
</style>
