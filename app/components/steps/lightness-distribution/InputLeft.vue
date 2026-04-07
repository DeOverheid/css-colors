<template>
    <div class="sidepanel__content">
        <div class="sidepanel__middle">
            <TooltipSlider
                label="Dark shift"
                :model-value="darkShift"
                :min="0"
                :max="100"
                :disabled="isDefault"
                :style="{ '--track-background': `linear-gradient(to right, black, ${primaryHsl})`, '--thumb-color': darkThumbColor(darkShift) }"
                @update:model-value="setDarkShift($event)" />
        </div>
        <div class="sidepanel__middle">
            <TooltipSlider
                label="Grey shift"
                :model-value="greyDarkShift"
                :min="0"
                :max="100"
                :disabled="isDefault"
                :style="{ '--track-background': `linear-gradient(to right, black, ${greyHsl})`, '--thumb-color': darkThumbColor(greyDarkShift, 10) }"
                @update:model-value="setGreyDarkShift($event)" />
        </div>
    </div>
</template>

<script setup lang="ts">
import { stepUniformLightnessShift } from "~/composables/input/stepUniformLightnessShift";
import { useColorSettings } from "~/composables/core/useColorSettings";
import { useThemes } from "~/composables/themes";
import { useThemeOverrides } from "~/composables/themes/useThemeOverrides";

const { darkShift, setDarkShift, greyDarkShift, setGreyDarkShift } = stepUniformLightnessShift();
const colorSettings = useColorSettings();
const { currentThemeId } = useThemes();
const { isCustom } = useThemeOverrides();

const isDefault = computed(() => !isCustom(currentThemeId.value, "lightness-distribution"));

const primaryHsl = computed(() =>
    `hsl(${colorSettings.hue.value}, ${colorSettings.saturation.value}%, 50%)`
);

const greyHsl = computed(() =>
    `hsl(${colorSettings.hue.value}, 10%, 50%)`
);

function darkThumbColor(value: number, sat: number = colorSettings.saturation.value) {
    const t = value / 100;
    const h = colorSettings.hue.value;
    return `hsl(${h}, ${Math.round(sat * t)}%, ${Math.round(50 * t)}%)`;
}
</script>
