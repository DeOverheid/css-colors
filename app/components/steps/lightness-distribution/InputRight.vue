<template>
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

<script setup lang="ts">
import { stepUniformLightnessShift } from "~/composables/input/stepUniformLightnessShift";
import { useColorSettings } from "~/composables/core/useColorSettings";

const { lightShift, setLightShift, greyLightShift, setGreyLightShift } = stepUniformLightnessShift();
const colorSettings = useColorSettings();

const primaryHsl = computed(() =>
    `hsl(${colorSettings.hue.value}, ${colorSettings.saturation.value}%, 50%)`
);

const greyHsl = computed(() =>
    `hsl(${colorSettings.hue.value}, 10%, 50%)`
);

function lightThumbColor(value: number, sat: number = colorSettings.saturation.value) {
    const t = value / 100;
    const h = colorSettings.hue.value;
    const lightness = 50 + (50 * t);
    return `hsl(${h}, ${Math.round(sat * (1 - t))}%, ${Math.round(lightness)}%)`;
}
</script>
