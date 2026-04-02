<template>
    <section
        class="generator-input panel"
        :class="{
            'generator-input--bezier': activeStep.inputLayout === 'bezier',
            'generator-input--hue-wheel': activeStep.inputLayout === 'hue-wheel',
            'generator-input--lightness-adjustment': activeStep.inputLayout === 'lightness-adjustment'
        }">
        <!-- Bezier layout: component fills entire panel -->
        <template v-if="activeStep.inputLayout === 'bezier' || activeStep.inputLayout === 'hue-wheel'">
            <component :is="inputComponent" />
            <button
                v-if="!isLast"
                class="next-step-btn"
                @click="next">
                Next step
            </button>
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

            <button
                v-if="!isLast"
                class="next-step-btn"
                @click="next">
                Next step
            </button>
        </template>
    </section>
</template>

<script setup lang="ts">
import { useStepNavigation } from "~/composables/steps/useStepNavigation";
import type { Component } from "vue";

const userInputLightness = defineModel<number | null>("userInputLightness");
const { activeStep, isLast, next } = useStepNavigation();

/** Map step inputComponent names to lazy-loaded components */
const componentMap: Record<string, Component> = {
    ColorInputControls: defineAsyncComponent(() => import("~/components/ColorInputControls.vue")),
    ComplementaryColorPicker: defineAsyncComponent(() => import("~/components/ComplementaryColorPicker.vue")),
    ThemeSelector: defineAsyncComponent(() => import("~/components/ThemeSelector.vue")),
    BezierControls: defineAsyncComponent(() => import("~/components/BezierControls.vue")),
    LightnessAdjustmentPanel: defineAsyncComponent(() => import("~/components/LightnessAdjustmentPanel.vue")),
    HueSpectrumControls: defineAsyncComponent(() => import("~/components/HueSpectrumControls.vue")),
    HueAdjustmentPanel: defineAsyncComponent(() => import("~/components/HueAdjustmentPanel.vue")),
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
    margin-bottom: 10px;
}

.input-header h2 {
    font-weight: 600;
    margin: 0 0 5px 0;
}

.input-header p {
    color: var(--ui-text-muted);
    margin: 0;
}

.input-content {
    flex: 1;
    overflow: auto;
    display: grid;
    grid-template-columns: var(--panel-column-width, 15%) 1fr var(--panel-column-width, 15%);
    gap: 0 1rem;
    align-content: start;
}

/* Bezier layout: Named grid */
.generator-input--bezier {
    display: grid;
    grid-template-columns: var(--panel-column-width, 15%) 1fr 1fr var(--panel-column-width, 15%);
    grid-template-rows: auto auto 1fr auto;
    grid-template-areas:
        "title   title   bezier  ."
        "text    text    bezier  ."
        "results results bezier  ."
        "action  .       .       .";
    gap: 0.75rem 1rem;
}

/* Hue-wheel layout: controls left, wheel right */
.generator-input--hue-wheel {
    display: grid;
    grid-template-columns: var(--panel-column-width, 15%) 1fr auto var(--panel-column-width, 15%);
    grid-template-rows: auto auto 1fr auto;
    grid-template-areas:
        "title   title   wheel  ."
        "text    text    wheel  ."
        ".       controls wheel  ."
        "action  .       .      .";
    gap: 0.75rem 1rem;
}

/* Lightness-adjustment layout: simple header + content, no side padding */
.generator-input--lightness-adjustment .input-content {
    grid-template-columns: 1fr;
}

.next-step-btn {
    grid-area: action;
    justify-self: start;
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
</style>
