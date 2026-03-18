<template>
    <section
        class="generator-input panel"
        :class="{ 'generator-input--bezier': activeStep.inputLayout === 'bezier' }">
        <!-- Bezier layout: component fills entire panel -->
        <template v-if="activeStep.inputLayout === 'bezier'">
            <component :is="inputComponent" />
        </template>

        <!-- Default layout: header + content area -->
        <template v-else>
            <div class="input-header">
                <h2>{{ activeStep.title }}</h2>
                <p>{{ activeStep.description }}</p>
            </div>

            <div class="input-content">
                <component
                    :is="inputComponent"
                    v-model:user-input-lightness="userInputLightness" />
            </div>
        </template>
    </section>
</template>

<script setup lang="ts">
import { useStepNavigation } from "~/composables/steps/useStepNavigation";
import type { Component } from "vue";

const userInputLightness = defineModel<number | null>("userInputLightness");
const { activeStep } = useStepNavigation();

/** Map step inputComponent names to lazy-loaded components */
const componentMap: Record<string, Component> = {
    ColorInputControls: defineAsyncComponent(() => import("~/components/ColorInputControls.vue")),
    ComplementaryColorPicker: defineAsyncComponent(() => import("~/components/ComplementaryColorPicker.vue")),
    ThemeSelector: defineAsyncComponent(() => import("~/components/ThemeSelector.vue")),
    BezierControls: defineAsyncComponent(() => import("~/components/BezierControls.vue")),
    LightnessAdjustmentPanel: defineAsyncComponent(() => import("~/components/LightnessAdjustmentPanel.vue")),
    HueSpectrumControls: defineAsyncComponent(() => import("~/components/HueSpectrumControls.vue")),
    ExportPanel: defineAsyncComponent(() => import("~/components/ExportPanel.vue"))
};

const inputComponent = computed(() =>
    componentMap[activeStep.value.inputComponent]
);
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

/* Bezier layout: Named grid */
.generator-input--bezier {
    display: grid;
    grid-template-columns: var(--panel-column-width, 15%) 1fr 1fr var(--panel-column-width, 15%);
    grid-template-rows: auto 1fr;
    grid-template-areas:
        "title  title  bezier  ."
        ".      results bezier  .";
    gap: 1rem;
}
</style>
