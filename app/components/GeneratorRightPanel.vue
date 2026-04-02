<template>
    <aside class="panel shift-panel">
        <!-- Step 4: Light adjustment controls -->
        <template v-if="isLightnessAdjustmentStep">
            <div class="adjustment-panel">
                <div class="adjustment-slider-area">
                    <HueRangeSlider
                        :hue-rows="hueRows"
                        :center-hue="brighteningCenterHue"
                        :falloff-span="brighteningFalloffSpan"
                        label-side="left"
                        @update:center-hue="setBrighteningCenter"
                        @update:falloff-span="setBrighteningFalloff" />
                </div>

                <div class="adjustment-controls">
                    <div class="adjustment-control">
                        <label class="shift-label">Strength</label>
                        <TooltipSlider
                            :model-value="adjustmentSettings.brightening.lightnessAmplitude"
                            :min="0"
                            :max="100"
                            :step="1"
                            class="shift-slider shift-slider--light"
                            :style="{ '--primary-hsl': primaryHsl }"
                            @update:model-value="adjustmentSettings.brightening.lightnessAmplitude = $event" />
                    </div>

                    <div class="adjustment-control">
                        <label class="shift-label">Light falloff</label>
                        <TooltipSlider
                            :model-value="Math.round(adjustmentSettings.brightening.lightnessFalloffLight * 100)"
                            :min="0"
                            :max="100"
                            :display-value="Math.round(adjustmentSettings.brightening.lightnessFalloffLight * 100) + '%'"
                            class="shift-slider shift-slider--light"
                            :style="{ '--primary-hsl': primaryHsl }"
                            @update:model-value="adjustmentSettings.brightening.lightnessFalloffLight = $event / 100" />
                    </div>

                    <div class="adjustment-control">
                        <label class="shift-label">Hue falloff</label>
                        <TooltipSlider
                            :model-value="adjustmentSettings.brightening.hueFalloff"
                            :min="0"
                            :max="100"
                            :display-value="adjustmentSettings.brightening.hueFalloff + '%'"
                            class="shift-slider shift-slider--light"
                            :style="{ '--primary-hsl': primaryHsl }"
                            @update:model-value="adjustmentSettings.brightening.hueFalloff = $event" />
                    </div>
                </div>
            </div>
        </template>

        <!-- Step 5: Light hue shift sliders -->
        <template v-else-if="isHueAdjustmentStep">
            <div class="hue-shift-area">
                <HueShiftSliders
                    :hue-rows="hueRows"
                    side="light"
                    :get-offset="getLightOffset"
                    :saturation="colorSettings.saturation.value"
                    :track-lightness="fullLightnessSteps[6] ?? 80"
                    @update:offset="setLightOffset" />
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
                <TooltipSlider
                    id="uniform-light-shift"
                    :model-value="100 - lightShift"
                    :min="0"
                    :max="100"
                    :display-value="lightShift"
                    class="shift-slider shift-slider--light"
                    :style="{ '--primary-hsl': primaryHsl, '--thumb-color': lightThumbColor(100 - lightShift) }"
                    @update:model-value="setLightShift(100 - $event)" />
            </div>

            <div class="shift-slider-wrapper shift-slider-wrapper--grey">
                <label
                    for="grey-light-shift"
                    class="shift-label">
                    Grey shift
                </label>
                <TooltipSlider
                    id="grey-light-shift"
                    :model-value="100 - greyLightShift"
                    :min="0"
                    :max="100"
                    :display-value="greyLightShift"
                    class="shift-slider shift-slider--light"
                    :style="{ '--primary-hsl': greyHsl, '--thumb-color': lightThumbColor(100 - greyLightShift, 10) }"
                    @update:model-value="setGreyLightShift(100 - $event)" />
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
import { useHueShift } from "~/composables/input/stepHueShift";
import { stepLightnessDistribution } from "~/composables/input/stepLightnessDistribution";
import { getChromaticEntriesForTheme } from "~/composables/utils/hueShiftDefaults";
import { useThemes } from "~/composables/themes";

const { lightShift, setLightShift, greyLightShift, setGreyLightShift } = stepUniformLightnessShift();
const colorSettings = useColorSettings();
const { isUnlocked } = useSwatchUnlock();
const { activeStepId, showSidePanels } = useStepNavigation();
const { settings: adjustmentSettings } = useLightnessAdjustment();
const { getLightOffset, setLightOffset } = useHueShift();
const { fullLightnessSteps } = stepLightnessDistribution();
const { currentTheme } = useThemes();

const isLightnessAdjustmentStep = computed(() => activeStepId.value === "lightness-adjustment");
const isHueAdjustmentStep = computed(() => activeStepId.value === "hue-adjustment");

const primaryHsl = computed(() =>
    `hsl(${colorSettings.hue.value}, ${colorSettings.saturation.value}%, 50%)`
);

const greyHsl = computed(() =>
    `hsl(${colorSettings.hue.value}, 10%, 50%)`
);

const showShiftSliders = computed(() => isUnlocked("shift-sliders") && showSidePanels.value);

/** Hue rows matching the swatch display, derived from theme entries */
const hueRows = computed(() => {
    const entries = getChromaticEntriesForTheme(currentTheme.value.id);
    const primaryHue = colorSettings.hue.value % 360;
    let primaryIdx = 0;
    let bestDist = Infinity;
    for (let i = 0; i < entries.length; i++) {
        const d = Math.abs(entries[i]!.baseHue - primaryHue);
        const dist = d > 180 ? 360 - d : d;
        if (dist < bestDist) {
            bestDist = dist;
            primaryIdx = i;
        }
    }
    return entries.map((e, i) => i === primaryIdx ? primaryHue : e.baseHue);
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
    padding: 10px;
    height: 100%;
}

.adjustment-panel {
    display: flex;
    flex-direction: column;
    width: 100%;
    height: 100%;
}

.adjustment-slider-area {
    flex: 1;
    display: flex;
    justify-content: center;
    min-height: 0;
}

.hue-shift-area {
    flex: 1;
    display: flex;
    flex-direction: column;
}

.adjustment-controls {
    flex-shrink: 0;
    display: flex;
    flex-direction: column;
    gap: 10px;
    margin-top: auto;
}

.adjustment-control {
    display: flex;
    flex-direction: column;
    align-items: center;
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

.shift-slider-wrapper--grey {
    margin-top: auto;
}
</style>
