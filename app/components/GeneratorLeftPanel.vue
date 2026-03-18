<template>
    <aside class="panel offset-panel">
        <div
            v-if="showOffsetSliders"
            class="offset-slider-wrapper">
            <label
                for="uniform-dark-offset"
                class="offset-label">
                Dark offset
            </label>
            <div class="slider-track-container">
                <input
                    id="uniform-dark-offset"
                    type="range"
                    :value="darkOffset"
                    min="0"
                    max="100"
                    class="offset-slider offset-slider--dark"
                    :style="{ '--primary-hsl': primaryHsl }"
                    @input="setDarkOffset(Number(($event.target as HTMLInputElement).value))">
            </div>
            <span class="offset-value">{{ darkOffset }}</span>
        </div>
    </aside>
</template>

<script setup lang="ts">
import { stepUniformLightnessOffset } from "~/composables/input/stepUniformLightnessOffset";
import { useColorSettings } from "~/composables/core/useColorSettings";
import { useStepNavigation } from "~/composables/steps/useStepNavigation";
import { steps } from "~/composables/steps/stepRegistry";

const { darkOffset, setDarkOffset } = stepUniformLightnessOffset();
const colorSettings = useColorSettings();
const { activeIndex } = useStepNavigation();

const primaryHsl = computed(() =>
    `hsl(${colorSettings.hue.value}, ${colorSettings.saturation.value}%, 50%)`
);

// Show offset sliders from lightness-distribution step onward
const lightnessStepIndex = steps.findIndex(s => s.id === "lightness-distribution");
const showOffsetSliders = computed(() => activeIndex.value >= lightnessStepIndex);
</script>

<style scoped>
.offset-panel {
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    padding: 1rem 0.5rem;
}

.offset-slider-wrapper {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.5rem;
}

.offset-label {
    font-size: 0.6875rem;
    font-weight: 500;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    opacity: 0.7;
}

.slider-track-container {
    width: 100%;
}

.offset-slider {
    width: 100%;
    height: 8px;
    -webkit-appearance: none;
    appearance: none;
    border-radius: 4px;
    outline: none;
}

.offset-slider--dark {
    background: linear-gradient(to right, var(--primary-hsl), black);
}

.offset-slider::-webkit-slider-thumb {
    -webkit-appearance: none;
    appearance: none;
    width: 18px;
    height: 18px;
    border-radius: 50%;
    background: var(--color-gray-300);
    border: 2px solid white;
    cursor: pointer;
}

.offset-slider::-moz-range-thumb {
    width: 18px;
    height: 18px;
    border-radius: 50%;
    background: var(--color-gray-300);
    border: 2px solid white;
    cursor: pointer;
}

.offset-value {
    font-size: 0.75rem;
    font-variant-numeric: tabular-nums;
    opacity: 0.6;
}
</style>
