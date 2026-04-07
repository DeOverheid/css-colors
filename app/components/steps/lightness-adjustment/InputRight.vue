<template>
    <div class="sidepanel__content">
        <div class="sidepanel__top sidepanel--center">
            <HueRangeSlider
                :hue-rows="hueRows"
                :center-hue="brighteningCenterHue"
                :falloff-span="brighteningFalloffSpan"
                :saturation="colorSettings.saturation.value"
                label-side="left"
                :disabled="isDefault"
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
                :disabled="isDefault"
                :style="{ '--track-background': `linear-gradient(to right, ${lightHueHsl}, white)`, '--thumb-color': lightStrengthThumb(adjustmentSettings.brightening.lightnessAmplitude) }"
                @update:model-value="adjustmentSettings.brightening.lightnessAmplitude = $event" />

            <TooltipSlider
                label="Light falloff"
                :model-value="Math.round(adjustmentSettings.brightening.lightnessFalloffLight * 100)"
                :min="0"
                :max="100"
                :display-value="Math.round(adjustmentSettings.brightening.lightnessFalloffLight * 100) + '%'"
                :disabled="isDefault"
                :style="{ '--track-background': `linear-gradient(to right, ${lightHueHsl}, white)`, '--thumb-color': lightLightFalloffThumb(Math.round(adjustmentSettings.brightening.lightnessFalloffLight * 100)) }"
                @update:model-value="adjustmentSettings.brightening.lightnessFalloffLight = $event / 100" />

            <TooltipSlider
                label="Hue falloff"
                :model-value="adjustmentSettings.brightening.hueFalloff"
                :min="0"
                :max="100"
                :display-value="adjustmentSettings.brightening.hueFalloff + '%'"
                :disabled="isDefault"
                :style="{ '--track-background': `linear-gradient(to right, hsl(180,${colorSettings.saturation.value}%,50%), hsl(270,${colorSettings.saturation.value}%,50%))`, '--thumb-color': lightHueFalloffThumb(adjustmentSettings.brightening.hueFalloff) }"
                @update:model-value="adjustmentSettings.brightening.hueFalloff = $event" />
        </div>
    </div>
</template>

<script setup lang="ts">
import { useColorSettings } from "~/composables/core/useColorSettings";
import { useLightnessAdjustment } from "~/composables/input/stepLightnessAdjustment";
import { getChromaticEntriesForTheme } from "~/composables/utils/hueShiftDefaults";
import { useThemes } from "~/composables/themes";
import { useThemeOverrides } from "~/composables/themes/useThemeOverrides";

const colorSettings = useColorSettings();
const { settings: adjustmentSettings } = useLightnessAdjustment();
const { currentTheme, currentThemeId } = useThemes();
const { isCustom } = useThemeOverrides();

const isDefault = computed(() => !isCustom(currentThemeId.value, "lightness-adjustment"));

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

const brighteningCenterHue = computed(() => {
    const { start, end } = adjustmentSettings.value.brightening;
    if (start <= end) return Math.round((start + end) / 2);
    return Math.round(((start + end + 360) / 2) % 360);
});

const lightHueHsl = computed(() =>
    `hsl(${brighteningCenterHue.value}, ${colorSettings.saturation.value}%, 50%)`
);

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

function lightStrengthThumb(value: number) {
    const t = value / 100;
    const h = brighteningCenterHue.value;
    const s = colorSettings.saturation.value;
    return `hsl(${h}, ${Math.round(s * (1 - t))}%, ${Math.round(50 + 50 * t)}%)`;
}

function lightLightFalloffThumb(value: number) {
    const t = value / 100;
    const h = brighteningCenterHue.value;
    const s = colorSettings.saturation.value;
    return `hsl(${h}, ${Math.round(s * (1 - t))}%, ${Math.round(50 + 50 * t)}%)`;
}

function lightHueFalloffThumb(value: number) {
    const t = value / 100;
    return `hsl(${Math.round(180 + 90 * t)}, ${colorSettings.saturation.value}%, 50%)`;
}
</script>
