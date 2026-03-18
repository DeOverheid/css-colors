<template>
    <div class="complementary-controls">
        <div class="input-row">
            <label class="input-label">Offset</label>
            <div class="slider-track">
                <input
                    type="range"
                    :value="hueOffset"
                    :min="-180"
                    :max="180"
                    class="slider-input"
                    :style="{ '--track-bg': trackGradient, '--thumb-bg': thumbColor }"
                    @input="hueOffset = Number(($event.target as HTMLInputElement).value)">
            </div>
            <div class="input-value">
                {{ hueOffset }}°
            </div>
        </div>

        <div class="color-preview swatch__group">
            <div class="preview-swatches swatch__row">
                <span class="preview-label swatch__label">Secondary</span>
                <span
                    class="preview-swatch swatch__cell"
                    :style="{ background: `hsl(${secondaryHue}, ${saturation}%, ${lightness}%)` }" />
                <span
                    class="preview-swatch swatch__cell"
                    :style="{ background: `hsl(${primaryHue}, ${saturation}%, ${lightness}%)` }" />
                <span
                    v-if="showTertiary"
                    class="preview-swatch swatch__cell"
                    :style="{ background: `hsl(${tertiaryHue}, ${saturation}%, ${lightness}%)` }" />
                <span
                    v-if="showTertiary"
                    class="preview-label preview-label--right swatch__label">Tertiary</span>
            </div>
            <div class="preview-degrees">
                <span />
                <span class="degrees-value">{{ secondaryHue }}°</span>
                <span class="degrees-value">{{ primaryHue }}°</span>
                <template v-if="showTertiary">
                    <span class="degrees-value">{{ tertiaryHue }}°</span>
                    <span />
                </template>
            </div>
        </div>

        <div class="input-row">
            <label class="input-label">UI Tone</label>
            <RadioSelector
                :model-value="uiToneSource"
                name="ui-tone"
                :options="toneOptions"
                @update:model-value="uiToneSource = $event as UiToneSource"
            />
        </div>
    </div>
</template>

<script setup lang="ts">
import { useComplementaryColors, type UiToneSource } from "~/composables/input/useComplementaryColors";
import { useColorSettings } from "~/composables/core/useColorSettings";
import type { RadioOption } from "~/components/RadioSelector.vue";

const colorSettings = useColorSettings();
const { hueOffset, secondaryHue, tertiaryHue, showTertiary, uiToneSource, availableTones } = useComplementaryColors();

const primaryHue = computed(() => colorSettings.hue.value);
const saturation = computed(() => colorSettings.saturation.value);
const lightness = computed(() => colorSettings.lightness.value);

/** Map tone data to RadioSelector options */
const toneOptions = computed<RadioOption[]>(() =>
    availableTones.value.map(tone => ({
        value: tone.value,
        label: tone.label,
        swatch: tone.value === "neutral" ? "hsl(0, 0%, 46%)" : `hsl(${tone.hue}, 10%, 46%)`
    }))
);

/** Track gradient: primary hue in center (offset 0), offset ±180 at edges */
const trackGradient = computed(() => {
    const h = primaryHue.value;
    const left = `hsl(${(h - 180 + 360) % 360}, 80%, 50%)`;
    const midLeft = `hsl(${(h - 90 + 360) % 360}, 80%, 50%)`;
    const center = `hsl(${h}, 80%, 50%)`;
    const midRight = `hsl(${(h + 90) % 360}, 80%, 50%)`;
    const right = `hsl(${(h + 180) % 360}, 80%, 50%)`;
    return `linear-gradient(to right, ${left}, ${midLeft}, ${center}, ${midRight}, ${right})`;
});

const thumbColor = computed(() => {
    return `hsl(${secondaryHue.value}, 80%, 50%)`;
});
</script>

<style scoped>
.complementary-controls {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    grid-column: 2;
}

.input-row {
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

.slider-track {
    flex: 1;
}

.slider-input {
    width: 100%;
    height: 8px;
    -webkit-appearance: none;
    appearance: none;
    background: var(--track-bg);
    border-radius: 4px;
    outline: none;
}

.slider-input::-webkit-slider-thumb {
    -webkit-appearance: none;
    appearance: none;
    width: 20px;
    height: 20px;
    border-radius: 50%;
    background: var(--thumb-bg);
    border: 2px solid white;
    cursor: pointer;
}

.slider-input::-moz-range-thumb {
    width: 20px;
    height: 20px;
    border-radius: 50%;
    background: var(--thumb-bg);
    border: 2px solid white;
    cursor: pointer;
}

.color-preview {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.25rem;
}

.preview-swatches,
.preview-degrees {
    display: flex;
    align-items: center;
    gap: 0;
}

.preview-swatch {
    width: 120px;
    height: 40px;
    border: 1px solid rgba(255, 255, 255, 0.15);
}

.preview-swatch+.preview-swatch {
    border-left: none;
}

.preview-label {
    font-family: var(--font-family-header);
    font-weight: 600;
    color: var(--ui-text-muted);
    font-size: 0.75rem;
    padding: 0 0.5rem;
    white-space: nowrap;
}

.preview-label--right {
    text-align: left;
}

.preview-degrees {
    gap: 0;
}

.degrees-value {
    width: 120px;
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
