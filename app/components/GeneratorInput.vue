<template>
    <section
        class="generator-input panel"
        :class="layoutClass">
        <!-- Bezier / hue-wheel layout: step owns title + description -->
        <template v-if="activeStep.inputLayout === 'bezier' || activeStep.inputLayout === 'hue-wheel'">
            <component :is="inputComponent" />
        </template>

        <!-- Default / lightness-adjustment layout: shell owns title + description -->
        <template v-else>
            <div class="step-title">
                <h2>{{ activeStep.title }}</h2>
            </div>
            <div class="step-text">
                <p>{{ activeStep.description }}</p>
            </div>
            <div class="input-content">
                <component :is="inputComponent" />
            </div>
        </template>

        <!-- Dev mode: copy settings button -->
        <div v-if="isDevMode" class="action-row">
            <button class="dev-copy-btn" @click="copyCurrentStepSettings">
                {{ copied ? 'Copied!' : 'Copy settings' }}
            </button>
            <StepModeToggle v-if="showModeToggle" :step-id="activeStep.id as OverridableStepId" />
        </div>
        <!-- Normal mode: next step or export -->
        <div v-else-if="!isLast" class="action-row">
            <button class="next-step-btn" @click="next">
                Next step
            </button>
            <StepModeToggle v-if="showModeToggle" :step-id="activeStep.id as OverridableStepId" />
        </div>
        <div v-else class="action-slot">
            <ExportActions />
        </div>
    </section>
</template>

<script setup lang="ts">
import { useStepNavigation } from "~/composables/steps/useStepNavigation";
import { useDevMode } from "~/composables/ui/useDevMode";
import { useDevCopy } from "~/composables/ui/useDevCopy";
import { OVERRIDABLE_STEPS, type OverridableStepId } from "~/composables/themes/useThemeOverrides";
import { useSwatchUnlock } from "~/composables/steps/useSwatchUnlock";
import type { Component } from "vue";

const { activeStep, isLast, next } = useStepNavigation();
const { isDevModeEnabled: isDevMode } = useDevMode();
const { copyCurrentStepSettings, copied } = useDevCopy();
const { isUnlocked } = useSwatchUnlock();

/** Toggle visible only on overridable steps AND after step 6 has been visited */
const showModeToggle = computed(() =>
    OVERRIDABLE_STEPS.includes(activeStep.value.id as OverridableStepId)
    && isUnlocked("compare-themes")
);

const topModules = import.meta.glob<{ default: Component }>("./steps/*/InputTop.vue");

const inputComponent = computed(() => {
    const path = `./steps/${activeStep.value.id}/InputTop.vue`;
    const loader = topModules[path];
    return loader ? defineAsyncComponent(loader) : null;
});

const layoutClass = computed(() => {
    const layout = activeStep.value.inputLayout ?? "default";
    return [`generator-input--grid`, `generator-input--${layout}`];
});
</script>

<style scoped>
.generator-input {
    overflow: hidden;
}

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

.input-content {
    grid-area: content;
    overflow: auto;
}

/* Grid layout base — applied to all steps */
.generator-input--grid {
    display: grid;
    grid-template-columns: var(--panel-column-width, 15%) 1fr auto var(--panel-column-width, 15%);
    grid-template-rows: auto auto 1fr auto;
    gap: 5px 10px;
}

/* Default layout */
.generator-input--default {
    grid-template-areas:
        "title    title    title    title"
        "text     text     text     text"
        ".        content  content  ."
        ".        action   .        .";
}

/* Lightness-adjustment layout */
.generator-input--lightness-adjustment {
    grid-template-areas:
        "title    title    title    title"
        "text     text     text     text"
        ".        content  content  ."
        ".        action   .        .";
}

/* Bezier layout */
.generator-input--bezier {
    grid-template-areas:
        "title    title    ui-input  ."
        "text     text     ui-input  ."
        ".        results  ui-input  ."
        ".        action   .         .";
}

/* Hue-wheel layout */
.generator-input--hue-wheel {
    grid-template-areas:
        "title    title    ui-input  ."
        "text     text     ui-input  ."
        ".        controls ui-input  ."
        ".        action   .         .";
}

.next-step-btn,
.action-slot,
.action-row {
    grid-area: action;
    justify-self: start;
}

.action-row {
    display: flex;
    align-items: center;
    gap: 10px;
}

.next-step-btn {
    padding: 5px 15px;
    border: 1px solid var(--ui-border);
    border-radius: 6px;
    background: transparent;
    color: var(--ui-text);
    cursor: pointer;
    font-size: 0.875rem;
    transition: background-color 0.15s;
}

.next-step-btn:hover {
    background: var(--ui-bg-accented);
}

.dev-copy-btn {
    grid-area: action;
    justify-self: start;
    padding: 5px 15px;
    border: 1px solid var(--ui-border);
    border-radius: 6px;
    background: transparent;
    color: var(--ui-text-muted);
    cursor: pointer;
    font-size: 0.75rem;
    transition: background-color 0.15s, color 0.15s;
}

.dev-copy-btn:hover {
    background: var(--ui-bg-accented);
    color: var(--ui-text);
}
</style>
