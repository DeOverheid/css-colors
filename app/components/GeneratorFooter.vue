<template>
    <footer class="bottom-panel panel">
        <!-- Left: Primary Color Sample (persistent) -->
        <div class="footer-left">
            <ColorSwatch
                :hue="hue"
                :saturation="saturation"
                :lightness="markedSampleLightness"
                class="footer-sample" />
            <div class="footer-color-info">
                <span class="footer-color-name">Primary</span>
                <span class="footer-color-value">H: {{ hue }}°</span>
                <span class="footer-color-value">S: {{ saturation }}%</span>
                <span class="footer-color-value">L: {{ markedSampleLightness }}%</span>
            </div>
        </div>

        <!-- Middle: Step-specific content -->
        <div class="footer-middle">
            <component
                :is="footerComponent"
                v-if="footerComponent"
            />
        </div>

        <!-- Right: Dev Mode button (persistent) -->
        <div class="footer-right">
            <UButton :icon="isDevModeEnabled ? 'i-lucide-code' : 'i-lucide-eye'" :color="isDevModeEnabled ? 'primary' : 'neutral'" variant="soft" size="xs" @click="toggleDevMode">
                {{ isDevModeEnabled ? 'Dev' : 'Preview' }}
            </UButton>
        </div>
    </footer>
</template>

<script setup lang="ts">
import { useStepNavigation } from "~/composables/steps/useStepNavigation";
import { useDevMode } from "~/composables/ui/useDevMode";
import { useSteps } from "~/composables/input/useSteps";
import { findClosestLightnessIndex } from "~/composables/utils/lightnessIndex";
import type { Component } from "vue";

const props = defineProps<{
    hue: number;
    saturation: number;
    targetLightness: number;
}>();

const { activeStep } = useStepNavigation();
const { isDevModeEnabled, toggleDevMode } = useDevMode();
const { lightnessDistribution } = useSteps();
const { lightnessSteps } = lightnessDistribution;

/** Map step footerComponent names to lazy-loaded components */
const footerComponentMap: Record<string, Component> = {
    ExportActions: defineAsyncComponent(() => import("~/components/ExportActions.vue"))
};

const footerComponent = computed(() => {
    const name = activeStep.value.footerComponent;
    return name ? footerComponentMap[name] ?? null : null;
});

const markedSampleLightness = computed(() => {
    const idx = findClosestLightnessIndex(lightnessSteps.value, props.targetLightness);
    const allLightnesses = [0, ...lightnessSteps.value, 100];
    return allLightnesses[idx] ?? props.targetLightness;
});
</script>

<style scoped>
.bottom-panel {
    grid-column: 1 / -1;
    grid-row: 3;
    padding: 0.75rem 1rem;
    display: grid;
    grid-template-columns: var(--panel-column-width, 15%) auto var(--panel-column-width, 15%);
    align-items: center;
    gap: 10px;
}

.footer-left {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    min-width: 0;
}

.footer-sample {
    width: 36px;
    height: 36px;
    border-radius: 6px;
    flex-shrink: 0;
}

.footer-color-info {
    display: flex;
    flex-direction: column;
    gap: 0;
    line-height: 1.3;
}

.footer-color-name {
    font-weight: 600;
    font-size: 0.75rem;
}

.footer-color-value {
    font-size: 0.6875rem;
    color: var(--ui-text-muted);
    font-variant-numeric: tabular-nums;
}

.footer-middle {
    display: flex;
    justify-content: center;
    align-items: center;
}

.footer-right {
    display: flex;
    justify-content: flex-end;
    align-items: center;
}
</style>
