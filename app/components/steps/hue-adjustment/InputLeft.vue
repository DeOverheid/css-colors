<template>
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

<script setup lang="ts">
import { useColorSettings } from "~/composables/core/useColorSettings";
import { useHueShift } from "~/composables/input/stepHueShift";
import { stepLightnessDistribution } from "~/composables/input/stepLightnessDistribution";
import { getChromaticEntriesForTheme } from "~/composables/utils/hueShiftDefaults";
import { useThemes } from "~/composables/themes";

const colorSettings = useColorSettings();
const { getDarkOffset, setDarkOffset } = useHueShift();
const { fullLightnessSteps } = stepLightnessDistribution();
const { currentTheme } = useThemes();

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
