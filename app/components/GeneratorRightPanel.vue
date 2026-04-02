<template>
    <aside class="panel sidepanel sidepanel--light">
        <!-- Step 4: Light adjustment controls -->
        <template v-if="isLightnessAdjustmentStep">
            <div class="sidepanel__content">
                <div class="sidepanel__top sidepanel--center">
                    <HueRangeSlider
                        :hue-rows="hueRows"
                        :center-hue="brighteningCenterHue"
                        :falloff-span="brighteningFalloffSpan"
                        :saturation="colorSettings.saturation.value"
                        label-side="left"
                        @update:center-hue="setBrighteningCenter"
                        @update:falloff-span="setBrighteningFalloff" />
                </div>

                <div class="sidepanel__bottom">
                    <TooltipSlider
                        label="Strength"
                        :model-value="adjustmentSettings.brightening.lightnessAmplitude"
                        :min="0"
                        :max="100"
                        :step="1"
                        :style="{ '--track-background': `linear-gradient(to right, ${lightHueHsl}, white)`, '--thumb-color': lightStrengthThumb(adjustmentSettings.brightening.lightnessAmplitude) }"
                        @update:model-value="adjustmentSettings.brightening.lightnessAmplitude = $event" />

                    <TooltipSlider
                        label="Light falloff"
                        :model-value="Math.round(adjustmentSettings.brightening.lightnessFalloffLight * 100)"
                        :min="0"
                        :max="100"
                        :display-value="Math.round(adjustmentSettings.brightening.lightnessFalloffLight * 100) + '%'"
                        :style="{ '--track-background': `linear-gradient(to right, ${lightHueHsl}, white)`, '--thumb-color': lightLightFalloffThumb(Math.round(adjustmentSettings.brightening.lightnessFalloffLight * 100)) }"
                        @update:model-value="adjustmentSettings.brightening.lightnessFalloffLight = $event / 100" />

                    <TooltipSlider
                        label="Hue falloff"
                        :model-value="adjustmentSettings.brightening.hueFalloff"
                        :min="0"
                        :max="100"
                        :display-value="adjustmentSettings.brightening.hueFalloff + '%'"
                        :style="{ '--track-background': `linear-gradient(to right, hsl(180,${colorSettings.saturation.value}%,50%), hsl(270,${colorSettings.saturation.value}%,50%))`, '--thumb-color': lightHueFalloffThumb(adjustmentSettings.brightening.hueFalloff) }"
                        @update:model-value="adjustmentSettings.brightening.hueFalloff = $event" />
                </div>
            </div>
        </template>

        <!-- Step 5: Light hue shift sliders -->
        <template v-else-if="isHueAdjustmentStep">
            <div class="sidepanel__content sidepanel--center">
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
            <div class="sidepanel__content">
                <div class="sidepanel__middle">
                    <TooltipSlider
                        label="Light shift"
                        :model-value="100 - lightShift"
                        :min="0"
                        :max="100"
                        :display-value="lightShift"
                        :style="{ '--track-background': `linear-gradient(to right, ${primaryHsl}, white)`, '--thumb-color': lightThumbColor(100 - lightShift) }"
                        @update:model-value="setLightShift(100 - $event)" />
                </div>
                <div class="sidepanel__middle">
                    <TooltipSlider
                        label="Grey shift"
                        :model-value="100 - greyLightShift"
                        :min="0"
                        :max="100"
                        :display-value="greyLightShift"
                        :style="{ '--track-background': `linear-gradient(to right, ${greyHsl}, white)`, '--thumb-color': lightThumbColor(100 - greyLightShift, 10) }"
                        @update:model-value="setGreyLightShift(100 - $event)" />
                </div>
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

const lightHueHsl = computed(() =>
    `hsl(${brighteningCenterHue.value}, ${colorSettings.saturation.value}%, 50%)`
);

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

/** Strength thumb: lightHue → white */
function lightStrengthThumb(value: number) {
    const t = value / 100;
    const h = brighteningCenterHue.value;
    const s = colorSettings.saturation.value;
    return `hsl(${h}, ${Math.round(s * (1 - t))}%, ${Math.round(50 + 50 * t)}%)`;
}

/** Light falloff thumb: lightHue → white */
function lightLightFalloffThumb(value: number) {
    const t = value / 100;
    const h = brighteningCenterHue.value;
    const s = colorSettings.saturation.value;
    return `hsl(${h}, ${Math.round(s * (1 - t))}%, ${Math.round(50 + 50 * t)}%)`;
}

/** Hue falloff thumb: hsl(180) → hsl(270) */
function lightHueFalloffThumb(value: number) {
    const t = value / 100;
    return `hsl(${Math.round(180 + 90 * t)}, ${colorSettings.saturation.value}%, 50%)`;
}
</script>

<style scoped>
.sidepanel__bottom--padded {
    padding-bottom: 30px;
}
</style>
