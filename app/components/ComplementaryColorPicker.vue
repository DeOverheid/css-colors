<template>
    <div class="step-title">
        <h2>{{ activeStep.title }}</h2>
    </div>
    <div class="step-text">
        <p>{{ activeStep.description }}</p>
    </div>
    <div class="step-controls">
        <div class="input-row--tone">
            <label class="input-label">UI Tone</label>
            <RadioSelector
                :model-value="uiToneSource"
                name="ui-tone"
                :options="toneOptions"
                segmented
                @update:model-value="uiToneSource = $event as UiToneSource" />
        </div>

        <div class="color-preview">
            <!-- Labels row -->
            <div class="preview-grid">
                <span class="preview-label">Secondary</span>
                <span class="preview-label">Primary</span>
                <span class="preview-label">Tertiary</span>
            </div>
            <!-- Swatches row -->
            <div class="preview-grid rounded-group rounded-group--horizontal">
                <span
                    class="preview-swatch"
                    :style="{ background: `hsl(${secondaryHue}, ${complementarySaturation}%, ${lightness}%)` }" />
                <span
                    class="preview-swatch"
                    :style="{ background: `hsl(${primaryHue}, ${saturation}%, ${lightness}%)` }" />
                <span
                    class="preview-swatch"
                    :style="{ background: `hsl(${tertiaryHue}, ${complementarySaturation}%, ${lightness}%)` }" />
            </div>
            <!-- Degrees row -->
            <div class="preview-grid">
                <span class="degrees-value">{{ secondaryHue }}°</span>
                <span class="degrees-value">{{ primaryHue }}°</span>
                <span class="degrees-value">{{ tertiaryHue }}°</span>
            </div>
        </div>
    </div>
    <div class="step-wheel">
        <HueSaturationWheel />
    </div>
</template>

<script setup lang="ts">
import { useComplementaryColors, type UiToneSource } from "~/composables/input/useComplementaryColors";
import { useColorSettings } from "~/composables/core/useColorSettings";
import { useStepNavigation } from "~/composables/steps/useStepNavigation";
import type { RadioOption } from "~/components/RadioSelector.vue";

const colorSettings = useColorSettings();
const { activeStep } = useStepNavigation();
const { hueOffset, secondaryHue, tertiaryHue, uiToneSource, availableTones, complementarySaturation } = useComplementaryColors();

const primaryHue = computed(() => colorSettings.hue.value);
const saturation = computed(() => colorSettings.saturation.value);
const lightness = computed(() => colorSettings.lightness.value);

/** Map tone data to RadioSelector options */
const toneOptions = computed<RadioOption[]>(() =>
    availableTones.value.map(tone => ({
        value: tone.value,
        label: tone.label,
        swatch: tone.value === "neutral" ? "hsl(0, 0%, 46%)" : `hsl(${tone.hue}, 10%, 46%)`,
        background: tone.value === "neutral" ? "hsl(0, 0%, 46%)" : `hsl(${tone.hue}, 10%, 46%)`
    }))
);
</script>

<style scoped>
.step-title {
    grid-area: title;
    align-self: end;
}

.step-title h2 {
    font-weight: 600;
    margin: 0 0 0.25rem 0;
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
    gap: 1rem;
}

.step-wheel {
    grid-area: wheel;
    height: 100%;
    aspect-ratio: 1;
    overflow: visible;
}

.input-row--tone {
    display: grid;
    grid-template-columns: auto 1fr;
    align-items: start;
    gap: 1rem;
}

.input-row--tone .input-label {
    padding-top: 0.25rem;
    line-height: 1.5;
}

.input-label {
    font-family: var(--font-family-header);
    font-weight: 600;
    color: var(--ui-text-muted);
}

.color-preview {
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
}

.preview-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(0, 1fr));
    gap: 0;
}

.preview-swatch {
    height: 20px;
    border: 1px solid rgba(255, 255, 255, 0.15);
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

.hint {
    color: var(--ui-text-dimmed);
    font-size: 0.75rem;
    font-style: italic;
    margin: 0;
}
</style>
