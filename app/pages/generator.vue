<template>
    <div class="layout">
        <!-- Left Sidebar -->
        <GeneratorSidebar />

        <!-- Right Content Area -->
        <main class="right-content">
            <!-- Top Controls: Header + Primary Controls (Step-specific) -->
            <GeneratorInput
                v-model:user-input-lightness="userInputLightness"
                class="top-controls" />

            <!-- Left Panel (placeholder for future use) -->
            <GeneratorLeftPanel class="left-panel" />

            <!-- Swatches Preview (PERSISTENT) -->
            <GeneratorSwatches
                :hue="colorSettings.hue.value"
                :saturation="colorSettings.saturation.value"
                :lightness-steps="lightnessSteps"
                :total-steps="totalSteps"
                :target-lightness="targetLightness" />

            <!-- Right Panel (placeholder) -->
            <GeneratorRightPanel class="right-panel" />

            <!-- Footer -->
            <GeneratorFooter
                :hue="colorSettings.hue.value"
                :saturation="colorSettings.saturation.value"
                :target-lightness="targetLightness" />
        </main>
    </div>
</template>

<script setup lang="ts">
import { useSteps } from "~/composables/input/useSteps";
import { useColorSettings } from "~/composables/core/useColorSettings";
import { useConfig } from "~/composables/core/baseConfig";
import { useThemes } from "~/composables/themes";

definePageMeta({
    layout: "blank"
});

useHead({
    title: "Color Generator"
});

const { lightnessDistribution } = useSteps();
const { lightnessSteps } = lightnessDistribution;
const colorSettings = useColorSettings();
const config = useConfig();
const { currentTheme } = useThemes();

const userInputLightness = ref<number | null>(null);

// Get total steps from current theme
const totalSteps = computed(() => currentTheme.value.totalSteps);

// Target lightness: user-entered value or config default
const targetLightness = computed(() => userInputLightness.value ?? config.colors.lightness);
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
    grid-template-rows: 3fr 6fr 1fr;
    gap: 10px;
    min-width: 0;
    overflow: hidden;
}

/* Grid Area Assignments */
.top-controls {
    grid-column: 1 / -1;
    grid-row: 1;
}

.left-panel {
    grid-column: 1;
    grid-row: 2;
}

.right-panel {
    grid-column: 3;
    grid-row: 2;
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
    }
}
</style>
