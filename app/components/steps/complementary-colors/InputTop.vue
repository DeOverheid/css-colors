<template>
    <div class="step-title">
        <h2>{{ activeStep.title }}</h2>
    </div>
    <div class="step-text">
        <p>{{ activeStep.description }}</p>
    </div>
    <div
        class="step-controls"
        :class="{ 'step-disabled': isDefault }">
        <label class="input-label">1. Adjust the color wheel</label>
        <label class="input-label">2. Choose a UI tone</label>

        <div class="tone-grid">
            <!-- Names row -->
            <div class="tone-row">
                <span class="preview-label">Neutral</span>
                <span class="preview-label">Secondary</span>
                <span class="preview-label">Primary</span>
                <span class="preview-label">Tertiary</span>
            </div>
            <!-- Clickable swatches row -->

            <UFieldGroup class="tone-row">
                <UButton
                    color="neutral"
                    class="tone-swatch"
                    :class="uiToneSource === 'neutral' && 'ring-2 ring-inset ring-(--ui-primary)'"
                    :style="{ background: 'hsl(0, 0%, 46%)' }"
                    :disabled="isDefault"
                    @click="uiToneSource = 'neutral'" />
                <UButton
                    color="neutral"
                    class="tone-swatch"
                    :class="uiToneSource === 'secondary' && 'ring-2 ring-inset ring-(--ui-primary)'"
                    :style="{ background: `hsl(${secondaryHue}, ${complementarySaturation}%, ${lightness}%)` }"
                    :disabled="isDefault"
                    @click="uiToneSource = 'secondary'" />
                <UButton
                    color="neutral"
                    class="tone-swatch"
                    :class="uiToneSource === 'primary' && 'ring-2 ring-inset ring-white'"
                    :style="{ background: `hsl(${primaryHue}, ${saturation}%, ${lightness}%)` }"
                    :disabled="isDefault"
                    @click="uiToneSource = 'primary'" />
                <UButton
                    color="neutral"
                    class="tone-swatch"
                    :class="uiToneSource === 'tertiary' && 'ring-2 ring-inset ring-(--ui-primary)'"
                    :style="{ background: `hsl(${tertiaryHue}, ${complementarySaturation}%, ${lightness}%)` }"
                    :disabled="isDefault"
                    @click="uiToneSource = 'tertiary'" />
            </UFieldGroup>

            <!-- Degrees row -->
            <div class="tone-row">
                <span class="degrees-value">&ndash;</span>
                <span class="degrees-value">{{ secondaryHue }}°</span>
                <span class="degrees-value">{{ primaryHue }}°</span>
                <span class="degrees-value">{{ tertiaryHue }}°</span>
            </div>
        </div>
    </div>
    <div
        class="step-wheel"
        :class="{ 'step-disabled': isDefault }">
        <HueSaturationWheel />
    </div>
</template>

<script setup lang="ts">
import { useComplementaryColors } from "~/composables/input/useComplementaryColors";
import { useColorSettings } from "~/composables/core/useColorSettings";
import { useStepNavigation } from "~/composables/steps/useStepNavigation";
import { useThemeOverrides } from "~/composables/themes/useThemeOverrides";
import { useThemes } from "~/composables/themes";

const { currentThemeId } = useThemes();
const { isCustom } = useThemeOverrides();
const isDefault = computed(() => !isCustom(currentThemeId.value, "complementary-colors"));

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
    display: flex;
    flex-direction: column;
    gap: 5px;
}

.tone-row {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    min-height: 20px;
}

.tone-swatch {
    min-height: 20px;
    min-width: 0;
    padding: 0;
    border: none;
    border-radius: 0;
    outline: none;
    position: relative;
}

.tone-swatch:first-of-type {
    border-radius: 6px 0 0 6px;
}

.tone-swatch:last-of-type {
    border-radius: 0 6px 6px 0;
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

.step-disabled {
    pointer-events: none;
    filter: saturate(0.5);
}
</style>
