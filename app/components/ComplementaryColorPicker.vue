<template>
    <div class="complementary-controls">
        <div class="input-row">
            <label class="input-label">Offset</label>
            <div class="slider-track">
                <input
                    type="range"
                    :value="hueOffset"
                    :min="0"
                    :max="180"
                    class="slider-input"
                    :style="{ '--track-bg': trackGradient, '--thumb-bg': thumbColor }"
                    @input="hueOffset = Number(($event.target as HTMLInputElement).value)"
                >
            </div>
            <div class="input-value">
                ±{{ hueOffset }}°
            </div>
        </div>

        <div class="color-preview">
            <div class="preview-row">
                <span class="preview-label">Secondary</span>
                <span
                    class="preview-swatch"
                    :style="{ background: `hsl(${secondaryHue}, ${saturation}%, ${lightness}%)` }"
                />
                <span class="preview-degrees">{{ secondaryHue }}°</span>
            </div>
            <div class="preview-row">
                <span class="preview-label">Primary</span>
                <span
                    class="preview-swatch"
                    :style="{ background: `hsl(${primaryHue}, ${saturation}%, ${lightness}%)` }"
                />
                <span class="preview-degrees">{{ primaryHue }}°</span>
            </div>
            <div
                v-if="showTertiary"
                class="preview-row"
            >
                <span class="preview-label">Tertiary</span>
                <span
                    class="preview-swatch"
                    :style="{ background: `hsl(${tertiaryHue}, ${saturation}%, ${lightness}%)` }"
                />
                <span class="preview-degrees">{{ tertiaryHue }}°</span>
            </div>
        </div>

        <p class="hint">
            * Indication only — final hues may shift to align with the full palette range.
        </p>
    </div>
</template>

<script setup lang="ts">
import { useComplementaryColors } from "~/composables/input/useComplementaryColors";
import { useColorSettings } from "~/composables/core/useColorSettings";

const colorSettings = useColorSettings();
const { hueOffset, secondaryHue, tertiaryHue, showTertiary } = useComplementaryColors();

const primaryHue = computed(() => colorSettings.hue.value);
const saturation = computed(() => colorSettings.saturation.value);
const lightness = computed(() => colorSettings.lightness.value);

/** Track gradient: shows the primary hue in the center, offset hues at the edges */
const trackGradient = computed(() => {
    const h = primaryHue.value;
    // At 0 the secondary/tertiary sit on the primary; at 180 they're opposite
    const left = `hsl(${h}, 80%, 50%)`;
    const mid = `hsl(${(h + 90) % 360}, 80%, 50%)`;
    const right = `hsl(${(h + 180) % 360}, 80%, 50%)`;
    return `linear-gradient(to right, ${left}, ${mid}, ${right})`;
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
}

.preview-row {
    display: grid;
    grid-template-columns: var(--label-column-width, 80px) 40px 1fr;
    gap: 0.5rem;
    align-items: center;
}

.preview-swatch {
    width: 40px;
    height: 40px;
    border: 1px solid rgba(255, 255, 255, 0.15);
}

.preview-label {
    font-family: var(--font-family-header);
    font-weight: 600;
    color: var(--ui-text-muted);
    font-size: 0.875rem;
}

.preview-degrees {
    font-variant-numeric: tabular-nums;
    color: var(--ui-text-muted);
    font-size: 0.875rem;
}

.hint {
    color: var(--ui-text-dimmed);
    font-size: 0.75rem;
    font-style: italic;
    margin: 0;
}
</style>
