<template>
    <div class="hue-spectrum-controls">
        <div class="hue-spectrum-grid">
            <HueSpectrumRow
                v-for="rowState in hueSpectrumStates"
                :key="rowState.entry.name"
                :entry="rowState.entry"
                :light-offset="rowState.lightOffset"
                :dark-offset="rowState.darkOffset"
                :saturation="saturation"
                :lightness-steps="getLightnessStepsForEntry(rowState.entry)"
                :offset-range="hueSpectrumOffsetRange"
                @update:light-offset="hueSpectrum.setLightOffset(rowState.entry.name, $event)"
                @update:dark-offset="hueSpectrum.setDarkOffset(rowState.entry.name, $event)" />
        </div>
    </div>
</template>

<script setup lang="ts">
import type { HueEntry } from "~/composables/input/stepHueSpectrum";
import { useSteps } from "~/composables/input/useSteps";
import { useColorSettings } from "~/composables/core/useColorSettings";

const { hueSpectrum, lightnessDistribution } = useSteps();
const { fullLightnessSteps, fullGrayscaleLightnessSteps } = lightnessDistribution;
const colorSettings = useColorSettings();

const saturation = computed(() => colorSettings.step1.saturation.value);

const hueSpectrumStates = computed(() =>
    hueSpectrum.hueRowStates.value.filter(state =>
        !("type" in state.entry) || state.entry.type !== "grayscale"
    )
);

const hueSpectrumOffsetRange = computed(() => hueSpectrum.offsetRange.value);

function getLightnessStepsForEntry(entry: HueEntry): number[] {
    if ("type" in entry && entry.type === "grayscale") {
        return fullGrayscaleLightnessSteps.value;
    }
    return fullLightnessSteps.value;
}
</script>

<style scoped>
.hue-spectrum-controls {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    height: 100%;
    grid-column: 2;
}

.hue-spectrum-grid {
    display: flex;
    flex-direction: column;
    gap: 1px;
}
</style>
