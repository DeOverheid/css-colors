<template>
    <div class="layout">
        <!-- Left Sidebar -->
        <GeneratorSidebar />

        <!-- Right Content Area -->
        <main class="right-content">
            <!-- Top Controls: Header + Primary Controls (Step-specific) -->
            <section
                class="top-controls"
                :class="{ 'top-controls--step2': currentStep === 2 }">
                <!-- Step 2: Bezier curve controls -->
                <template v-if="currentStep === 2">
                    <BezierControls />
                </template>

                <!-- Other steps: Standard header + content layout -->
                <template v-else>
                    <div class="top-controls-header">
                        <h2>{{ currentStepMetadata.title }}</h2>
                        <p>{{ currentStepMetadata.description }}</p>
                    </div>

                    <div class="top-controls-content">
                        <!-- Step 1: Color Input -->
                        <template v-if="currentStep === 1">
                            <ColorInputControls v-model:user-input-lightness="userInputLightness" />
                        </template>

                        <!-- Step 3: Lightness Adjustment -->
                        <template v-if="currentStep === 3">
                            <div class="step3-controls">
                                <LightnessAdjustmentPanel />
                            </div>
                        </template>

                        <!-- Step 4: Hue Spectrum -->
                        <template v-if="currentStep === 4">
                            <HueSpectrumControls />
                        </template>
                    </div>
                </template>
            </section>

            <!-- Left Panel (placeholder for future use) -->
            <aside class="left-panel" />

            <!-- Swatches Preview (PERSISTENT) -->
            <GeneratorSwatches :hue="colorSettings.step1.hue.value" :saturation="colorSettings.step1.saturation.value" :muted-saturation="mutedSaturation" :lightness-steps="lightnessSteps" :total-steps="totalSteps" :marker-index="markerIndex" />

            <!-- Right Panel (placeholder) -->
            <aside class="color-preview-area" />

            <!-- Footer -->
            <GeneratorFooter :hue="colorSettings.step1.hue.value" :saturation="colorSettings.step1.saturation.value" :marked-sample-lightness="markedSampleLightness" />
        </main>
    </div>
</template>

<script setup lang="ts">
import { useSteps } from "~/composables/input/useSteps";
import { useColorSettings } from "~/composables/core/useColorSettings";
import { useConfig } from "~/composables/core/baseConfig";
import { useThemes } from "~/composables/themes";
import { useCurrentStep } from "~/composables/ui/useCurrentStep";

definePageMeta({
    layout: "blank"
});

useHead({
    title: "Color Generator"
});

const { lightnessDistribution } = useSteps();
const { lightnessSteps } = lightnessDistribution;
const { currentStep, currentStepMetadata } = useCurrentStep();
const colorSettings = useColorSettings();
const config = useConfig();

const { currentTheme } = useThemes();

const userInputLightness = ref<number | null>(null);

// Get total steps from current theme
const totalSteps = computed(() => currentTheme.value.totalSteps);

// Calculate muted saturation based on config multiplier
const mutedSaturation = computed(() => {
    return Math.round(colorSettings.step1.saturation.value * config.colors.mutedSaturationMultiplier);
});

// Find the index of the swatch that matches the target lightness most closely
function findClosestLightnessIndex(targetLightness: number): number {
    const allLightnesses = [0, ...lightnessSteps.value, 100];
    let closestIndex = 0;
    let smallestDiff = Math.abs((allLightnesses[0] ?? 0) - targetLightness);

    allLightnesses.forEach((lightness, index) => {
        const diff = Math.abs(lightness - targetLightness);
        if (diff < smallestDiff) {
            smallestDiff = diff;
            closestIndex = index;
        }
    });

    return closestIndex;
}

// Marker index based on user input or config lightness
const markerIndex = computed(() => {
    const targetLightness = userInputLightness.value ?? config.colors.lightness;
    return findClosestLightnessIndex(targetLightness);
});

// Marked sample lightness from the actual marked swatch
const markedSampleLightness = computed(() => {
    const allLightnesses = [0, ...lightnessSteps.value, 100];
    return allLightnesses[markerIndex.value] ?? config.colors.lightness;
});
</script>

<style scoped>
/* Main Layout */
.layout {
    display: flex;
    flex-direction: row;
    gap: 10px;
    height: 100dvh;
    padding: 10px;
    overflow: hidden;
    box-sizing: border-box;
}

/* Right Content Area */
.right-content {
    flex: 1;
    display: grid;
    grid-template-columns: var(--panel-column-width, 15%) auto var(--panel-column-width, 15%);
    grid-template-rows: 2fr 3fr 1fr;
    gap: 10px;
    min-width: 0;
    overflow: hidden;
}

/* Grid Area Assignments */
.top-controls {
    grid-column: 1 / -1;
    grid-row: 1;
    padding: 1rem;
    background: var(--ui-bg-elevated);
    border-radius: 8px;
    display: flex;
    flex-direction: column;
    overflow: hidden;
}

.left-panel {
    grid-column: 1;
    grid-row: 2;
    background: var(--ui-bg-elevated);
    border-radius: 8px;
    padding: 1rem;
}

.top-controls-header {
    flex-shrink: 0;
    margin-bottom: 1rem;
}

.top-controls-header h2 {
    font-weight: 600;
    margin: 0 0 0.25rem 0;
}

.top-controls-header p {
    color: var(--ui-text-muted);
    margin: 0;
}

.top-controls-content {
    flex: 1;
    overflow: auto;
    display: grid;
    grid-template-columns: var(--panel-column-width, 15%) auto var(--panel-column-width, 15%);
    gap: 0 1rem;
    align-content: start;
}

/* Step 3 controls container */
.step3-controls {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    height: 100%;
    grid-column: 2;
}

/* Step 2: Named grid layout */
.top-controls--step2 {
    display: grid;
    grid-template-columns: var(--panel-column-width, 15%) 1fr 1fr var(--panel-column-width, 15%);
    grid-template-rows: auto 1fr;
    grid-template-areas:
        "title  title  bezier  ."
        ".      results bezier  .";
    gap: 1rem;
}

.color-preview-area {
    grid-column: 3;
    grid-row: 2;
    padding: 1rem;
    background: var(--ui-bg-elevated);
    border-radius: 8px;
    overflow: auto;
}

/* Responsive */
@media (max-width: 1024px) {
    .layout {
        flex-direction: column;
        height: auto;
    }

    .right-content {
        grid-template-columns: 1fr;
        grid-template-rows: auto auto auto auto;
        max-height: none;
    }

    .top-controls {
        grid-column: 1;
        grid-row: 1;
        height: auto;
        max-height: none;
    }
}
</style>
