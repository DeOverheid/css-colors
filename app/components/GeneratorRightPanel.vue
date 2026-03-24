<template>
    <aside class="panel shift-panel">
        <!-- Step 4: Light adjustment controls -->
        <template v-if="isAdjustmentStep">
            <div class="adjustment-panel">
                <div class="adjustment-slider-area">
                    <HueRangeSlider
                        :hue-rows="hueRows"
                        :center-hue="brighteningCenterHue"
                        :falloff-span="brighteningFalloffSpan"
                        @update:center-hue="setBrighteningCenter"
                        @update:falloff-span="setBrighteningFalloff" />
                </div>

                <div class="adjustment-controls">
                    <div class="adjustment-control">
                        <label class="shift-label">Strength</label>
                        <input
                            type="range"
                            :value="adjustmentSettings.brightening.lightnessAmplitude"
                            min="0"
                            max="30"
                            step="0.5"
                            class="shift-slider shift-slider--light"
                            :style="{ '--primary-hsl': primaryHsl }"
                            @input="adjustmentSettings.brightening.lightnessAmplitude = Number(($event.target as HTMLInputElement).value)">
                        <span class="shift-value">{{ adjustmentSettings.brightening.lightnessAmplitude }}</span>
                    </div>

                    <div class="adjustment-control">
                        <label class="shift-label">Dark falloff</label>
                        <input
                            type="range"
                            :value="Math.round(adjustmentSettings.brightening.lightnessFalloffDark * 100)"
                            min="0"
                            max="100"
                            class="shift-slider shift-slider--light"
                            :style="{ '--primary-hsl': primaryHsl }"
                            @input="adjustmentSettings.brightening.lightnessFalloffDark = Number(($event.target as HTMLInputElement).value) / 100">
                        <span class="shift-value">{{ Math.round(adjustmentSettings.brightening.lightnessFalloffDark * 100) }}%</span>
                    </div>

                    <div class="adjustment-control">
                        <label class="shift-label">Hue falloff</label>
                        <input
                            type="range"
                            :value="adjustmentSettings.brightening.hueFalloff"
                            min="0"
                            max="90"
                            class="shift-slider shift-slider--light"
                            :style="{ '--primary-hsl': primaryHsl }"
                            @input="adjustmentSettings.brightening.hueFalloff = Number(($event.target as HTMLInputElement).value)">
                        <span class="shift-value">{{ adjustmentSettings.brightening.hueFalloff }}°</span>
                    </div>
                </div>
            </div>
        </template>

        <!-- Other steps: shift sliders -->
        <template v-else-if="showShiftSliders">
            <div class="shift-slider-wrapper">
                <label
                    for="uniform-light-shift"
                    class="shift-label">
                    Light shift
                </label>
                <div class="slider-track-container">
                    <input
                        id="uniform-light-shift"
                        type="range"
                        :value="100 - lightShift"
                        min="0"
                        max="100"
                        class="shift-slider shift-slider--light"
                        :style="{ '--primary-hsl': primaryHsl, '--thumb-color': lightThumbColor(100 - lightShift) }"
                        @input="setLightShift(100 - Number(($event.target as HTMLInputElement).value))">
                </div>
                <span class="shift-value">{{ lightShift }}</span>
            </div>

            <div class="shift-slider-wrapper shift-slider-wrapper--grey">
                <label
                    for="grey-light-shift"
                    class="shift-label">
                    Grey shift
                </label>
                <div class="slider-track-container">
                    <input
                        id="grey-light-shift"
                        type="range"
                        :value="100 - greyLightShift"
                        min="0"
                        max="100"
                        class="shift-slider shift-slider--light"
                        :style="{ '--primary-hsl': greyHsl, '--thumb-color': lightThumbColor(100 - greyLightShift, 10) }"
                        @input="setGreyLightShift(100 - Number(($event.target as HTMLInputElement).value))">
                </div>
                <span class="shift-value">{{ greyLightShift }}</span>
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

const { lightShift, setLightShift, greyLightShift, setGreyLightShift } = stepUniformLightnessShift();
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

/** Center hue derived from brightening start/end */
const brighteningCenterHue = computed(() => {
    const { start, end } = adjustmentSettings.value.brightening;
    if (start <= end) return Math.round((start + end) / 2);
    return Math.round(((start + end + 360) / 2) % 360);
});

/** Falloff span = half the range */
const brighteningFalloffSpan = computed(() => {
    const { start, end } = adjustmentSettings.value.brightening;
    const span = start <= end ? end - start : 360 - start + end;
    return Math.round(span / 2);
});

function setBrighteningCenter(hue: number) {
    const span = brighteningFalloffSpan.value;
    adjustmentSettings.value.brightening.start = ((hue - span) % 360 + 360) % 360;
    adjustmentSettings.value.brightening.end = (hue + span) % 360;
}

function setBrighteningFalloff(span: number) {
    const center = brighteningCenterHue.value;
    adjustmentSettings.value.brightening.start = ((center - span) % 360 + 360) % 360;
    adjustmentSettings.value.brightening.end = (center + span) % 360;
}

/** Compute thumb color by mixing target → white based on slider position */
function lightThumbColor(value: number, sat: number = colorSettings.saturation.value) {
    const t = value / 100;
    const h = colorSettings.hue.value;
    const lightness = 50 + (50 * t);
    return `hsl(${h}, ${Math.round(sat * (1 - t))}%, ${Math.round(lightness)}%)`;
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

.shift-slider--light {
    background: linear-gradient(to right, var(--primary-hsl), white);
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
