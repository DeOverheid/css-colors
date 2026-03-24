<template>
    <aside class="panel shift-panel">
        <div
            v-if="showShiftSliders"
            class="shift-slider-wrapper"
        >
            <label
                for="uniform-light-shift"
                class="shift-label"
            >
                Light shift
            </label>
            <div class="slider-track-container slider-track-container--rtl">
                <input
                    id="uniform-light-shift"
                    type="range"
                    :value="lightShift"
                    min="0"
                    max="100"
                    class="shift-slider shift-slider--light"
                    :style="{ '--primary-hsl': primaryHsl }"
                    @input="setLightShift(Number(($event.target as HTMLInputElement).value))"
                >
            </div>
            <span class="shift-value">{{ lightShift }}</span>
        </div>

        <div
            v-if="showShiftSliders"
            class="shift-slider-wrapper shift-slider-wrapper--grey"
        >
            <label
                for="grey-light-shift"
                class="shift-label"
            >
                Grey shift
            </label>
            <div class="slider-track-container slider-track-container--rtl">
                <input
                    id="grey-light-shift"
                    type="range"
                    :value="greyLightShift"
                    min="0"
                    max="100"
                    class="shift-slider shift-slider--light"
                    :style="{ '--primary-hsl': greyHsl }"
                    @input="setGreyLightShift(Number(($event.target as HTMLInputElement).value))"
                >
            </div>
            <span class="shift-value">{{ greyLightShift }}</span>
        </div>
    </aside>
</template>

<script setup lang="ts">
import { stepUniformLightnessShift } from "~/composables/input/stepUniformLightnessShift";
import { useColorSettings } from "~/composables/core/useColorSettings";
import { useSwatchUnlock } from "~/composables/steps/useSwatchUnlock";

const { lightShift, setLightShift, greyLightShift, setGreyLightShift } = stepUniformLightnessShift();
const colorSettings = useColorSettings();
const { isUnlocked } = useSwatchUnlock();

const primaryHsl = computed(() =>
    `hsl(${colorSettings.hue.value}, ${colorSettings.saturation.value}%, 50%)`
);

const greyHsl = computed(() =>
    `hsl(${colorSettings.hue.value}, 10%, 50%)`
);

const showShiftSliders = computed(() => isUnlocked("shift-sliders"));
</script>

<style scoped>
.shift-panel {
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    padding: 1rem 0.5rem;
}

.shift-slider-wrapper {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.5rem;
}

.shift-label {
    font-size: 0.6875rem;
    font-weight: 500;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    opacity: 0.7;
}

.slider-track-container {
    width: 100%;
}

.shift-slider {
    width: 100%;
    height: 8px;
    -webkit-appearance: none;
    appearance: none;
    border-radius: 4px;
    outline: none;
}

.shift-slider--light {
    background: linear-gradient(to right, var(--primary-hsl), white);
}

.slider-track-container--rtl {
    direction: rtl;
}

.shift-slider::-webkit-slider-thumb {
    -webkit-appearance: none;
    appearance: none;
    width: 18px;
    height: 18px;
    border-radius: 50%;
    background: var(--color-gray-300);
    border: 2px solid white;
    cursor: pointer;
}

.shift-slider::-moz-range-thumb {
    width: 18px;
    height: 18px;
    border-radius: 50%;
    background: var(--color-gray-300);
    border: 2px solid white;
    cursor: pointer;
}

.shift-value {
    font-size: 0.75rem;
    font-variant-numeric: tabular-nums;
    opacity: 0.6;
}

.shift-slider-wrapper--grey {
    margin-top: 0.75rem;
    padding-top: 0.75rem;
    border-top: 1px solid var(--ui-border-muted, rgba(0, 0, 0, 0.1));
}
</style>
