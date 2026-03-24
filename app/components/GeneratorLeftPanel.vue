<template>
    <aside class="panel shift-panel">
        <!-- Step 4: Dark adjustment controls -->
        <template v-if="isAdjustmentStep">
            <div class="adjustment-panel">
                <div class="adjustment-slider-area">
                    <HueRangeSlider
                        :hue-rows="hueRows"
                        :center-hue="darkeningCenterHue"
                        :falloff-span="darkeningFalloffSpan"
                        @update:center-hue="setDarkeningCenter"
                        @update:falloff-span="setDarkeningFalloff" />
                </div>

                <div class="adjustment-controls">
                    <div class="adjustment-control">
                        <label class="shift-label">Strength</label>
                        <input
                            type="range"
                            :value="adjustmentSettings.darkening.lightnessAmplitude"
                            min="0"
                            max="30"
                            step="0.5"
                            class="shift-slider shift-slider--dark"
                            :style="{ '--primary-hsl': primaryHsl }"
                            @input="adjustmentSettings.darkening.lightnessAmplitude = Number(($event.target as HTMLInputElement).value)">
                        <span class="shift-value">{{ adjustmentSettings.darkening.lightnessAmplitude }}</span>
                    </div>

                    <div class="adjustment-control">
                        <label class="shift-label">Light falloff</label>
                        <input
                            type="range"
                            :value="Math.round(adjustmentSettings.darkening.lightnessFalloffLight * 100)"
                            min="0"
                            max="100"
                            class="shift-slider shift-slider--dark"
                            :style="{ '--primary-hsl': primaryHsl }"
                            @input="adjustmentSettings.darkening.lightnessFalloffLight = Number(($event.target as HTMLInputElement).value) / 100">
                        <span class="shift-value">{{ Math.round(adjustmentSettings.darkening.lightnessFalloffLight * 100) }}%</span>
                    </div>

                    <div class="adjustment-control">
                        <label class="shift-label">Hue falloff</label>
                        <input
                            type="range"
                            :value="adjustmentSettings.darkening.hueFalloff"
                            min="0"
                            max="90"
                            class="shift-slider shift-slider--dark"
                            :style="{ '--primary-hsl': primaryHsl }"
                            @input="adjustmentSettings.darkening.hueFalloff = Number(($event.target as HTMLInputElement).value)">
                        <span class="shift-value">{{ adjustmentSettings.darkening.hueFalloff }}°</span>
                    </div>
                </div>
            </div>
        </template>

        <!-- Other steps: shift sliders -->
        <template v-else-if="showShiftSliders">
            <div class="shift-slider-wrapper">
                <label
                    for="uniform-dark-shift"
                    class="shift-label">
                    Dark shift
                </label>
                <div class="slider-track-container">
                    <input
                        id="uniform-dark-shift"
                        type="range"
                        :value="darkShift"
                        min="0"
                        max="100"
                        class="shift-slider shift-slider--dark"
                        :style="{ '--primary-hsl': primaryHsl, '--thumb-color': darkThumbColor(darkShift) }"
                        @input="setDarkShift(Number(($event.target as HTMLInputElement).value))">
                </div>
                <span class="shift-value">{{ darkShift }}</span>
            </div>

            <div class="shift-slider-wrapper shift-slider-wrapper--grey">
                <label
                    for="grey-dark-shift"
                    class="shift-label">
                    Grey shift
                </label>
                <div class="slider-track-container">
                    <input
                        id="grey-dark-shift"
                        type="range"
                        :value="greyDarkShift"
                        min="0"
                        max="100"
                        class="shift-slider shift-slider--dark"
                        :style="{ '--primary-hsl': greyHsl, '--thumb-color': darkThumbColor(greyDarkShift, 10) }"
                        @input="setGreyDarkShift(Number(($event.target as HTMLInputElement).value))">
                </div>
                <span class="shift-value">{{ greyDarkShift }}</span>
            </div>
        </template>
    </aside>
</template>

<script setup lang="ts">
import { stepUniformLightnessShift } from "~/composables/input/stepUniformLightnessShift";
import { useColorSettings } from "~/composables/core/useColorSettings";
import { useSwatchUnlock } from "~/composables/steps/useSwatchUnlock";
import { useStepNavigation } from "~/composables/steps/useStepNavigation";
import { useLightnessAdjustment } from "~/composables/input/stepLightnessAdjustment";

const { darkShift, setDarkShift, greyDarkShift, setGreyDarkShift } = stepUniformLightnessShift();
const colorSettings = useColorSettings();
const { isUnlocked } = useSwatchUnlock();
const { activeStepId, showSidePanels } = useStepNavigation();
const { settings: adjustmentSettings } = useLightnessAdjustment();

const isAdjustmentStep = computed(() => activeStepId.value === "lightness-adjustment");

const primaryHsl = computed(() =>
    `hsl(${colorSettings.hue.value}, ${colorSettings.saturation.value}%, 50%)`
);

const greyHsl = computed(() =>
    `hsl(${colorSettings.hue.value}, 10%, 50%)`
);

const showShiftSliders = computed(() => isUnlocked("shift-sliders") && showSidePanels.value);

/** 12 hue rows matching the swatch display */
const hueRows = computed(() => {
    const offset = colorSettings.hue.value % 30;
    return Array.from({ length: 12 }, (_, i) => (offset + i * 30) % 360);
});

/** Center hue derived from darkening start/end */
const darkeningCenterHue = computed(() => {
    const { start, end } = adjustmentSettings.value.darkening;
    if (start <= end) return Math.round((start + end) / 2);
    return Math.round(((start + end + 360) / 2) % 360);
});

/** Falloff span = half the range */
const darkeningFalloffSpan = computed(() => {
    const { start, end } = adjustmentSettings.value.darkening;
    const span = start <= end ? end - start : 360 - start + end;
    return Math.round(span / 2);
});

function setDarkeningCenter(hue: number) {
    const span = darkeningFalloffSpan.value;
    adjustmentSettings.value.darkening.start = ((hue - span) % 360 + 360) % 360;
    adjustmentSettings.value.darkening.end = (hue + span) % 360;
}

function setDarkeningFalloff(span: number) {
    const center = darkeningCenterHue.value;
    adjustmentSettings.value.darkening.start = ((center - span) % 360 + 360) % 360;
    adjustmentSettings.value.darkening.end = (center + span) % 360;
}

/** Compute thumb color by mixing black → target based on slider position */
function darkThumbColor(value: number, sat: number = colorSettings.saturation.value) {
    const t = value / 100;
    const h = colorSettings.hue.value;
    return `hsl(${h}, ${Math.round(sat * t)}%, ${Math.round(50 * t)}%)`;
}
</script>

<style scoped>
.shift-panel {
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    padding: 1rem 0.5rem;
}

/* Adjustment panel layout: vertical slider + horizontal controls */
.adjustment-panel {
    display: flex;
    flex-direction: column;
    height: 100%;
    gap: 0.75rem;
}

.adjustment-slider-area {
    flex: 1;
    display: flex;
    justify-content: center;
    min-height: 0;
}

.adjustment-controls {
    flex-shrink: 0;
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
}

.adjustment-control {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.25rem;
}

/* Shift slider styles */
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

.shift-slider--dark {
    background: linear-gradient(to right, black, var(--primary-hsl));
}

.shift-slider::-webkit-slider-thumb {
    -webkit-appearance: none;
    appearance: none;
    width: 18px;
    height: 18px;
    border-radius: 50%;
    background: var(--thumb-color, var(--color-gray-300));
    border: 2px solid white;
    cursor: pointer;
}

.shift-slider::-moz-range-thumb {
    width: 18px;
    height: 18px;
    border-radius: 50%;
    background: var(--thumb-color, var(--color-gray-300));
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
