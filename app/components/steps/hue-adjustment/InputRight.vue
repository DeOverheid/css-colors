<template>
    <div class="sidepanel__content sidepanel--center">
        <HueShiftSliders
            :hue-rows="hueRows"
            side="light"
            :get-offset="getLightOffset"
            :saturation="colorSettings.saturation.value"
            :track-lightness="fullLightnessSteps[6] ?? 80"
            :disabled="isDefault"
            @update:offset="setLightOffset" />
    </div>
</template>

<script setup lang="ts">
import { useColorSettings } from "~/composables/core/useColorSettings";
import { useHueShift } from "~/composables/input/stepHueShift";
import { stepLightnessDistribution } from "~/composables/input/stepLightnessDistribution";
import { getChromaticEntriesForTheme } from "~/composables/utils/hueShiftDefaults";
import { useThemes } from "~/composables/themes";
import { useThemeOverrides } from "~/composables/themes/useThemeOverrides";

const colorSettings = useColorSettings();
const { getLightOffset, setLightOffset } = useHueShift();
const { fullLightnessSteps } = stepLightnessDistribution();
const { currentTheme, currentThemeId } = useThemes();
const { isCustom } = useThemeOverrides();

const isDefault = computed(() => !isCustom(currentThemeId.value, "hue-adjustment"));

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
</script>
