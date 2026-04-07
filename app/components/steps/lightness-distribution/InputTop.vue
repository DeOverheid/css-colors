<template>
    <div class="step-title">
        <h2>{{ activeStep.title }}</h2>
    </div>
    <div class="step-text">
        <p>{{ activeStep.description }}</p>
    </div>
    <div class="step2-results">
        <div class="bezier-values">
            <div class="bezier-value-row">
                <span class="bezier-label">P1:</span>
                <span class="bezier-coords">({{ bezierValues.x1.toFixed(2) }}, {{ bezierValues.y1.toFixed(2) }})</span>
            </div>
            <div class="bezier-value-row">
                <span class="bezier-label">P2:</span>
                <span class="bezier-coords">({{ bezierValues.x2.toFixed(2) }}, {{ bezierValues.y2.toFixed(2) }})</span>
            </div>
            <div class="bezier-value-row">
                <span class="bezier-label">CSS:</span>
                <ClickToCopy
                    :value="`cubic-bezier(${bezierValues.x1.toFixed(2)}, ${bezierValues.y1.toFixed(2)}, ${bezierValues.x2.toFixed(2)}, ${bezierValues.y2.toFixed(2)})`"
                    class="bezier-css">
                    cubic-bezier({{ bezierValues.x1.toFixed(2) }}, {{ bezierValues.y1.toFixed(2) }}, {{ bezierValues.x2.toFixed(2) }}, {{ bezierValues.y2.toFixed(2) }})
                </ClickToCopy>
            </div>
        </div>
    </div>
    <div class="step2-bezier">
        <BezierCurveEditor
            :key="currentThemeId"
            :initial-x1="bezierValues.x1"
            :initial-y1="bezierValues.y1"
            :initial-x2="bezierValues.x2"
            :initial-y2="bezierValues.y2"
            @update="updateBezier" />
    </div>
</template>

<script setup lang="ts">
import { useSteps } from "~/composables/input/useSteps";
import { useStepNavigation } from "~/composables/steps/useStepNavigation";
import { useThemes } from "~/composables/themes";

const { lightnessDistribution } = useSteps();
const { bezierValues, updateBezier } = lightnessDistribution;
const { activeStep } = useStepNavigation();
const { currentThemeId } = useThemes();
</script>

<style scoped>
.step-title {
    grid-area: title;
}

.step-title h2 {
    font-weight: 600;
    margin: 0;
}

.step-text {
    grid-area: text;
}

.step-text p {
    color: var(--ui-text-muted);
    margin: 0;
}

.step2-results {
    grid-area: results;
}

.step2-bezier {
    grid-area: ui-input;
    height: 100%;
    overflow: hidden;
}

.step2-bezier :deep(.bezier-editor) {
    height: 100%;
}

.step2-bezier :deep(.bezier-editor__container) {
    height: 100%;
    width: auto;
}

.bezier-values {
    display: flex;
    flex-direction: column;
    gap: 5px;
}

.bezier-value-row {
    display: flex;
    gap: 0.5rem;
    align-items: baseline;
}

.bezier-label {
    font-family: var(--font-family-header);
    font-weight: 600;
    text-transform: uppercase;
    color: var(--ui-text-muted);
    min-width: 2rem;
}

.bezier-coords {
    font-family: var(--font-family-monospace);
}
</style>
