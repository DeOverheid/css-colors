<template>
    <aside class="panel sidepanel sidepanel--dark">
        <!-- Step 4: Dark adjustment controls -->
        <template v-if="isLightnessAdjustmentStep">
            <div class="sidepanel__content">
                <div class="sidepanel__top sidepanel--center">
                    <HueRangeSlider
                        :hue-rows="hueRows"
                        :center-hue="darkeningCenterHue"
                        :falloff-span="darkeningFalloffSpan"
                        :saturation="colorSettings.saturation.value"
                        label-side="right"
                        @update:center-hue="setDarkeningCenter"
                        @update:falloff-span="setDarkeningFalloff" />
                </div>

                <div class="sidepanel__bottom">
                    <TooltipSlider
                        label="Strength"
                        :model-value="adjustmentSettings.darkening.lightnessAmplitude"
                        :min="0"
                        :max="100"
                        :step="1"
                        :style="{ '--track-background': `linear-gradient(to right, ${darkHueHsl}, black)`, '--thumb-color': darkStrengthThumb(adjustmentSettings.darkening.lightnessAmplitude) }"
                        @update:model-value="adjustmentSettings.darkening.lightnessAmplitude = $event" />

                    <TooltipSlider
                        label="Light falloff"
                        :model-value="Math.round(adjustmentSettings.darkening.lightnessFalloffLight * 100)"
                        :min="0"
                        :max="100"
                        :display-value="Math.round(adjustmentSettings.darkening.lightnessFalloffLight * 100) + '%'"
                        :style="{ '--track-background': `linear-gradient(to right, ${darkHueHsl}, white)`, '--thumb-color': darkLightFalloffThumb(Math.round(adjustmentSettings.darkening.lightnessFalloffLight * 100)) }"
                        @update:model-value="adjustmentSettings.darkening.lightnessFalloffLight = $event / 100" />

                    <TooltipSlider
                        label="Hue falloff"
                        :model-value="adjustmentSettings.darkening.hueFalloff"
                        :min="0"
                        :max="100"
                        :display-value="adjustmentSettings.darkening.hueFalloff + '%'"
                        :style="{ '--track-background': `linear-gradient(to right, hsl(30,${colorSettings.saturation.value}%,50%), hsl(120,${colorSettings.saturation.value}%,50%))`, '--thumb-color': darkHueFalloffThumb(adjustmentSettings.darkening.hueFalloff) }"
                        @update:model-value="adjustmentSettings.darkening.hueFalloff = $event" />
                </div>
            </div>
        </template>

        <!-- Step 5: Dark hue shift sliders -->
        <template v-else-if="isHueAdjustmentStep">
            <div class="sidepanel__content">
                <HueShiftSliders
                    :hue-rows="hueRows"
                    side="dark"
                    :get-offset="getDarkOffset"
                    :saturation="colorSettings.saturation.value"
                    :track-lightness="fullLightnessSteps[3] ?? 20"
                    @update:offset="setDarkOffset" />
            </div>
        </template>

        <!-- Other steps: shift sliders -->
        <template v-else-if="showShiftSliders">
            <div class="sidepanel__content">
                <div class="sidepanel__middle">
                    <TooltipSlider
                        label="Dark shift"
                        :model-value="darkShift"
                        :min="0"
                        :max="100"
                        :style="{ '--track-background': `linear-gradient(to right, black, ${primaryHsl})`, '--thumb-color': darkThumbColor(darkShift) }"
                        @update:model-value="setDarkShift($event)" />
                </div>
                <div class="sidepanel__middle">
                    <TooltipSlider
                        label="Grey shift"
                        :model-value="greyDarkShift"
                        :min="0"
                        :max="100"
                        :style="{ '--track-background': `linear-gradient(to right, black, ${greyHsl})`, '--thumb-color': darkThumbColor(greyDarkShift, 10) }"
                        @update:model-value="setGreyDarkShift($event)" />
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

const { darkShift, setDarkShift, greyDarkShift, setGreyDarkShift } = stepUniformLightnessShift();
const colorSettings = useColorSettings();
const { isUnlocked } = useSwatchUnlock();
const { activeStepId, showSidePanels } = useStepNavigation();
const { settings: adjustmentSettings } = useLightnessAdjustment();
const { getDarkOffset, setDarkOffset } = useHueShift();
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

/** Center hue derived from darkening start/end */
const darkeningCenterHue = computed(() => {
    const { start, end } = adjustmentSettings.value.darkening;
    if (start <= end) return Math.round((start + end) / 2);
    return Math.round(((start + end + 360) / 2) % 360);
});

const darkHueHsl = computed(() =>
    `hsl(${darkeningCenterHue.value}, ${colorSettings.saturation.value}%, 50%)`
);

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

/** Strength thumb: darkHue → black */
function darkStrengthThumb(value: number) {
    const t = value / 100;
    const h = darkeningCenterHue.value;
    const s = colorSettings.saturation.value;
    return `hsl(${h}, ${Math.round(s * (1 - t))}%, ${Math.round(50 * (1 - t))}%)`;
}

/** Light falloff thumb: darkHue → white */
function darkLightFalloffThumb(value: number) {
    const t = value / 100;
    const h = darkeningCenterHue.value;
    const s = colorSettings.saturation.value;
    return `hsl(${h}, ${Math.round(s * (1 - t))}%, ${Math.round(50 + 50 * t)}%)`;
}

/** Hue falloff thumb: hsl(30) → hsl(120) */
function darkHueFalloffThumb(value: number) {
    const t = value / 100;
    return `hsl(${Math.round(30 + 90 * t)}, ${colorSettings.saturation.value}%, 50%)`;
}
</script>
