<template>
    <section
        class="generator-input panel"
        :class="{ 'generator-input--step2': currentStep === 2 }">
        <!-- Step 2: Bezier curve controls -->
        <template v-if="currentStep === 2">
            <BezierControls />
        </template>

        <!-- Other steps: Standard header + content layout -->
        <template v-else>
            <div class="input-header">
                <h2>{{ currentStepMetadata.title }}</h2>
                <p>{{ currentStepMetadata.description }}</p>
            </div>

            <div class="input-content">
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
</template>

<script setup lang="ts">
import { useCurrentStep } from "~/composables/ui/useCurrentStep";

const userInputLightness = defineModel<number | null>("userInputLightness");
const { currentStep, currentStepMetadata } = useCurrentStep();
</script>

<style scoped>
.generator-input {
    display: flex;
    flex-direction: column;
    overflow: hidden;
}

.input-header {
    flex-shrink: 0;
    margin-bottom: 1rem;
}

.input-header h2 {
    font-weight: 600;
    margin: 0 0 0.25rem 0;
}

.input-header p {
    color: var(--ui-text-muted);
    margin: 0;
}

.input-content {
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
.generator-input--step2 {
    display: grid;
    grid-template-columns: var(--panel-column-width, 15%) 1fr 1fr var(--panel-column-width, 15%);
    grid-template-rows: auto 1fr;
    grid-template-areas:
        "title  title  bezier  ."
        ".      results bezier  .";
    gap: 1rem;
}
</style>
