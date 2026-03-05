<template>
    <div class="layout">
        <!-- Left Sidebar -->
        <aside class="left-sidebar">
            <!-- Logo / Title -->
            <div class="sidebar-logo">
                <h1>Bespoke for the masses!</h1>
            </div>

            <!-- Step Navigation -->
            <nav class="step-navigation">
                <button
                    v-for="step in 4"
                    :key="step"
                    class="step-nav-item"
                    :class="{ active: currentStep === step }"
                    @click="goToStep(step as 1 | 2 | 3 | 4)"
                >
                    <span class="step-number">{{ step }}</span>
                    <span class="step-label">{{ stepMetadata[step as 1 | 2 | 3 | 4].title }}</span>
                </button>
            </nav>

            <!-- Theme Selector (hidden for now) -->
            <div
                v-show="false"
                class="sidebar-theme"
            >
                <label class="sidebar-label">Theme</label>
                <URadioGroup
                    v-model="currentThemeId"
                    :items="themeOptions"
                    orientation="vertical"
                />
            </div>

            <!-- Spacer -->
            <div class="sidebar-spacer" />

            <!-- Export Buttons (hidden until step 4) -->
            <div
                v-show="currentStep >= 4"
                class="sidebar-export"
            >
                <UButton
                    :icon="isDevModeEnabled ? 'i-lucide-code' : 'i-lucide-eye'"
                    :color="isDevModeEnabled ? 'primary' : 'neutral'"
                    variant="soft"
                    size="sm"
                    block
                    @click="toggleDevMode"
                >
                    {{ isDevModeEnabled ? 'Dev Mode' : 'Preview Mode' }}
                </UButton>
                <UButton
                    icon="i-lucide-save"
                    variant="outline"
                    size="sm"
                    block
                    @click="exportConfig.copyUserThemeToClipboard"
                >
                    Export Theme
                </UButton>
            </div>

            <!-- Nuxt UI Logo -->
            <div class="sidebar-branding">
                <AppLogo class="nuxt-logo" />
            </div>
        </aside>

        <!-- Right Content Area -->
        <main class="right-content">
            <!-- Top Controls: Header + Primary Controls (Step-specific) -->
            <section
                class="top-controls"
                :class="{ 'top-controls--step2': currentStep === 2 }"
            >
                <!-- Step 2: Split layout with bezier on right -->
                <template v-if="currentStep === 2">
                    <div class="step2-left">
                        <div class="top-controls-header">
                            <h2>{{ currentStepMetadata.title }}</h2>
                            <p>{{ currentStepMetadata.description }}</p>
                        </div>
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
                                    class="bezier-css"
                                >
                                    cubic-bezier({{ bezierValues.x1.toFixed(2) }}, {{ bezierValues.y1.toFixed(2) }}, {{ bezierValues.x2.toFixed(2) }}, {{ bezierValues.y2.toFixed(2) }})
                                </ClickToCopy>
                            </div>
                        </div>
                    </div>
                    <div class="step2-right">
                        <BezierCurveEditor
                            :key="currentThemeId"
                            :initial-x1="bezierValues.x1"
                            :initial-y1="bezierValues.y1"
                            :initial-x2="bezierValues.x2"
                            :initial-y2="bezierValues.y2"
                            @update="handleBezierUpdate"
                        />
                    </div>
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
                            <div class="step1-controls">
                                <div class="input-row">
                                    <label class="input-label">Color</label>
                                    <UInput
                                        v-model="colorInput"
                                        placeholder="#hex, rgb(), or hsl()"
                                        class="input-field"
                                        @input="handleColorInput"
                                    />
                                    <div class="input-value" />
                                </div>
                                <div class="input-row">
                                    <label class="input-label">Hue</label>
                                    <HueSlider
                                        id="hue"
                                        v-model="colorSettings.step1.hue.value"
                                        :min="0"
                                        :max="360"
                                        class="input-field"
                                    />
                                    <div class="input-value">
                                        {{ colorSettings.step1.hue.value }}°
                                    </div>
                                </div>
                                <div class="input-row">
                                    <label class="input-label">Saturation</label>
                                    <SaturationSlider
                                        id="saturation"
                                        v-model="colorSettings.step1.saturation.value"
                                        :hue="colorSettings.step1.hue.value"
                                        :min="0"
                                        :max="100"
                                        class="input-field"
                                    />
                                    <div class="input-value">
                                        {{ colorSettings.step1.saturation.value }}%
                                    </div>
                                </div>
                            </div>
                        </template>

                        <!-- Step 3: Lightness Adjustment -->
                        <template v-if="currentStep === 3">
                            <div class="step3-controls">
                                <LightnessAdjustmentPanel />
                            </div>
                        </template>

                        <!-- Step 4: Hue Spectrum -->
                        <template v-if="currentStep === 4">
                            <div class="step4-controls">
                                <div class="hue-spectrum-grid">
                                    <HueSpectrumRow
                                        v-for="rowState in hueSpectrumStates"
                                        :key="rowState.entry.name"
                                        :entry="rowState.entry"
                                        :light-offset="rowState.lightOffset"
                                        :dark-offset="rowState.darkOffset"
                                        :saturation="colorSettings.step1.saturation.value"
                                        :lightness-steps="getLightnessStepsForEntry(rowState.entry)"
                                        :offset-range="hueSpectrumOffsetRange"
                                        @update:light-offset="hueSpectrum.setLightOffset(rowState.entry.name, $event)"
                                        @update:dark-offset="hueSpectrum.setDarkOffset(rowState.entry.name, $event)"
                                    />
                                </div>
                            </div>
                        </template>
                    </div>
                </template>
            </section>

            <!-- Left Panel (placeholder for future use) -->
            <aside class="left-panel" />

            <!-- Swatches Preview (PERSISTENT) -->
            <section class="swatches-preview">
                <!-- Primary Color Row -->
                <div class="swatch-row">
                    <div class="swatch-row-label">
                        Primary
                    </div>
                    <ColorSwatchRow
                        :hue="colorSettings.step1.hue.value"
                        :saturation="colorSettings.step1.saturation.value"
                        :lightness-steps="lightnessSteps"
                        :total-steps="totalSteps"
                        :show-marker="true"
                        :marker-index="markerIndex"
                        class="swatch-row-swatches"
                    />
                    <div class="swatch-row-value">
                        {{ colorSettings.step1.saturation.value }}%
                    </div>
                </div>

                <!-- Grey Row -->
                <div class="swatch-row">
                    <div class="swatch-row-label">
                        Grey
                    </div>
                    <ColorSwatchRow
                        :hue="colorSettings.step1.hue.value"
                        :saturation="mutedSaturation"
                        :lightness-steps="lightnessSteps"
                        :total-steps="totalSteps"
                        class="swatch-row-swatches"
                    />
                    <div class="swatch-row-value">
                        {{ mutedSaturation }}%
                    </div>
                </div>

                <!-- Neutral Row -->
                <div class="swatch-row">
                    <div class="swatch-row-label">
                        Neutral
                    </div>
                    <ColorSwatchRow
                        :hue="colorSettings.step1.hue.value"
                        :saturation="0"
                        :lightness-steps="lightnessSteps"
                        :total-steps="totalSteps"
                        class="swatch-row-swatches"
                    />
                    <div class="swatch-row-value">
                        0%
                    </div>
                </div>
            </section>

            <!-- Color Preview Panel (Step 1 only) -->
            <aside class="color-preview-area">
                <template v-if="currentStep === 1">
                    <div class="color-preview-panel">
                        <ColorSwatch
                            :hue="colorSettings.step1.hue.value"
                            :saturation="colorSettings.step1.saturation.value"
                            :lightness="markedSampleLightness"
                            class="large-sample"
                        />
                        <div class="color-preview-info">
                            <div class="color-sample-label">
                                Primary-{{ markedSwatchLabel }}
                            </div>
                            <div class="color-values">
                                <span>H: {{ colorSettings.step1.hue.value }}°</span>
                                <span>S: {{ colorSettings.step1.saturation.value }}%</span>
                                <span>L: {{ markedSampleLightness }}%</span>
                            </div>
                        </div>
                    </div>
                </template>
            </aside>

            <!-- Bottom Panel (placeholder for future use) -->
            <div class="bottom-panel" />
        </main>
    </div>
</template>

<script setup lang="ts">
import { useSteps } from "~/composables/input/useSteps";
import type { HueEntry } from "~/composables/input/stepHueSpectrum";
import { useExportConfig } from "~/composables/output/useExportConfig";
import { useColorSettings } from "~/composables/core/useColorSettings";
import { useBezierCurve } from "~/composables/core/useBezierCurve";
import { parseColor } from "~/composables/utils/parseColor";
import { useConfig } from "~/composables/core/baseConfig";
import { useThemes } from "~/composables/themes";
import { useDevMode } from "~/composables/ui/useDevMode";
import { useCurrentStep } from "~/composables/ui/useCurrentStep";

definePageMeta({
    layout: "blank"
});

useHead({
    title: "Color Generator"
});

const { hueSpectrum } = useSteps();
const { currentStep, currentStepMetadata, stepMetadata, goToStep } = useCurrentStep();
const exportConfig = useExportConfig();
const colorSettings = useColorSettings();
const { generateLightnessSteps } = useBezierCurve();
const config = useConfig();
const { isDevModeEnabled, toggleDevMode } = useDevMode();

const { currentThemeId, currentTheme, availableThemes } = useThemes();

// Hue spectrum state and offset range (filter out grayscale colors for now)
const hueSpectrumStates = computed(() =>
    hueSpectrum.hueRowStates.value.filter(state =>
        !("type" in state.entry) || state.entry.type !== "grayscale"
    )
);
const hueSpectrumOffsetRange = computed(() => hueSpectrum.offsetRange.value);

// Convert themes to radio group options
const themeOptions = computed(() =>
    availableThemes.value.map(theme => ({
        label: theme.name,
        value: theme.id
    }))
);

const bezierValues = ref({
    x1: currentTheme.value.bezier.x1,
    y1: currentTheme.value.bezier.y1,
    x2: currentTheme.value.bezier.x2,
    y2: currentTheme.value.bezier.y2
});

// Grayscale bezier values (falls back to main bezier if not defined)
const grayscaleBezierValues = computed(() => {
    const grayscale = currentTheme.value.grayscaleBezier;
    if (grayscale) {
        return grayscale;
    }
    return bezierValues.value;
});

// Update bezier values when theme changes
watch(currentTheme, (newTheme) => {
    bezierValues.value = {
        x1: newTheme.bezier.x1,
        y1: newTheme.bezier.y1,
        x2: newTheme.bezier.x2,
        y2: newTheme.bezier.y2
    };
});

const colorInput = ref("");
const userInputLightness = ref<number | null>(null);

// Get total steps from current theme
const totalSteps = computed(() => currentTheme.value.totalSteps);

// Get swatch labels from current theme
const swatchLabels = computed(() => currentTheme.value.swatchLabels);

// Calculate muted saturation based on config multiplier
const mutedSaturation = computed(() => {
    return Math.round(colorSettings.step1.saturation.value * config.colors.mutedSaturationMultiplier);
});

// Generate lightness steps from bezier curve (for color hues)
const lightnessSteps = computed(() => {
    return generateLightnessSteps(
        bezierValues.value.x1,
        bezierValues.value.y1,
        bezierValues.value.x2,
        bezierValues.value.y2,
        totalSteps.value,
        currentTheme.value.lightnessMin ?? 0,
        currentTheme.value.lightnessMax ?? 100
    );
});

// Full lightness steps including 0 (black) and 100 (white)
const fullLightnessSteps = computed(() => {
    return [0, ...lightnessSteps.value, 100];
});

// Generate lightness steps for grayscale (uses grayscaleBezier if available)
const grayscaleLightnessSteps = computed(() => {
    const gb = grayscaleBezierValues.value;
    return generateLightnessSteps(
        gb.x1,
        gb.y1,
        gb.x2,
        gb.y2,
        totalSteps.value,
        currentTheme.value.lightnessMin ?? 0,
        currentTheme.value.lightnessMax ?? 100
    );
});

// Full grayscale lightness steps including 0 (black) and 100 (white)
const fullGrayscaleLightnessSteps = computed(() => {
    return [0, ...grayscaleLightnessSteps.value, 100];
});

// Get the appropriate lightness steps for an entry based on its type
function getLightnessStepsForEntry(entry: HueEntry): number[] {
    // Check if entry has type 'grayscale' (TailwindHueEntry)
    if ("type" in entry && entry.type === "grayscale") {
        return fullGrayscaleLightnessSteps.value;
    }
    return fullLightnessSteps.value;
}

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

// Get the label for the currently marked swatch
const markedSwatchLabel = computed(() => swatchLabels.value[markerIndex.value] ?? currentTheme.value.swatchLabels[Math.floor(currentTheme.value.swatchLabels.length / 2)]);

function handleBezierUpdate(values: { x1: number; y1: number; x2: number; y2: number }) {
    bezierValues.value = values;
}

function handleColorInput() {
    const parsed = parseColor(colorInput.value);
    if (parsed) {
        colorSettings.step1.hue.value = parsed.hue;
        colorSettings.step1.saturation.value = parsed.saturation;
        userInputLightness.value = parsed.lightness;
    }
}
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

/* Left Sidebar */
.left-sidebar {
    width: 20%;
    min-width: 200px;
    max-width: 280px;
    display: flex;
    flex-direction: column;
    gap: 10px;
    padding: 1rem;
    background: var(--ui-bg-elevated);
    border-radius: 8px;
}

.sidebar-logo h1 {
    font-size: 1.25rem;
    font-weight: 600;
    margin: 0;
}

.step-navigation {
    display: flex;
    flex-direction: column;
    gap: 4px;
    flex: 3;
}

.step-nav-item {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    padding: 0.75rem 1rem;
    border: none;
    background: transparent;
    border-radius: 6px;
    cursor: pointer;
    text-align: left;
    transition: background-color 0.15s;
}

.step-nav-item:hover {
    background: var(--ui-bg-accented);
}

.step-nav-item.active {
    background: var(--ui-primary);
    color: white;
}

.step-number {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 28px;
    height: 28px;
    border-radius: 50%;
    background: var(--ui-bg-accented);
    font-weight: 600;
    font-size: 0.875rem;
}

.step-nav-item.active .step-number {
    background: rgba(255, 255, 255, 0.2);
}

.step-label {
    font-size: 0.875rem;
}

.sidebar-theme {
    padding-top: 0.5rem;
}

.sidebar-label {
    display: block;
    font-size: 0.75rem;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    color: var(--ui-text-muted);
    margin-bottom: 0.5rem;
}

.sidebar-spacer {
    flex: 3;
}

.sidebar-export {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    flex: 1;
}

.sidebar-branding {
    padding-top: 1rem;
    border-top: 1px solid var(--ui-border);
}

.nuxt-logo {
    width: 100%;
    height: auto;
    max-height: 24px;
    opacity: 0.6;
}

/* Right Content Area */
.right-content {
    flex: 1;
    display: grid;
    grid-template-columns: 15% auto 15%;
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

/* Align header with swatches when not in step2 */
.top-controls:not(.top-controls--step2) > .top-controls-header {
    padding-left: calc(15% + 10px);
    padding-right: calc(15% + 10px);
}

.top-controls-header h2 {
    font-size: 1.5rem;
    font-weight: 600;
    margin: 0 0 0.25rem 0;
}

.top-controls-header p {
    font-size: 0.875rem;
    color: var(--ui-text-muted);
    margin: 0;
}

.top-controls-content {
    flex: 1;
    overflow: auto;
    /* Align with swatches grid (15% columns + gap) */
    padding-left: calc(15% + 10px);
    padding-right: calc(15% + 10px);
}

/* Step-specific control containers */
.step1-controls,
.step3-controls,
.step4-controls {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    height: 100%;
}

/* Step 2: Full-height side-by-side layout */
.top-controls--step2 {
    display: grid;
    grid-template-columns: 1fr auto;
    gap: 2rem;
}

.step2-left {
    display: flex;
    flex-direction: column;
    gap: 1rem;
}

.step2-right {
    height: 100%;
    overflow: hidden;
}

.step2-right :deep(.bezier-editor) {
    height: 100%;
}

.step2-right :deep(.bezier-editor__container) {
    height: 100%;
    width: auto;
}

.bezier-values {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
}

.bezier-value-row {
    display: flex;
    gap: 0.5rem;
    align-items: baseline;
}

.bezier-label {
    font-size: 0.75rem;
    font-weight: 600;
    text-transform: uppercase;
    color: var(--ui-text-muted);
    min-width: 2rem;
}

.bezier-coords {
    font-family: ui-monospace, SFMono-Regular, monospace;
    font-size: 0.875rem;
}

.bezier-css {
    font-size: 0.75rem;
}

.swatches-preview {
    grid-column: 2;
    grid-row: 2;
    padding: 1rem;
    background: var(--ui-bg-elevated);
    border-radius: 8px;
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    overflow: hidden;
}

.color-preview-area {
    grid-column: 3;
    grid-row: 2;
    padding: 1rem;
    background: var(--ui-bg-elevated);
    border-radius: 8px;
    overflow: auto;
}

.bottom-panel {
    grid-column: 2;
    grid-row: 3;
    background: var(--ui-bg-elevated);
    border-radius: 8px;
    padding: 1rem;
}

/* 3-Column Input Row */
.input-row {
    display: grid;
    grid-template-columns: 1fr 8fr 1fr;
    gap: 1rem;
    align-items: center;
}

.input-label {
    font-size: 0.75rem;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    color: var(--ui-text-muted);
}

.input-field {
    width: 100%;
}

.input-value {
    font-size: 0.875rem;
    font-variant-numeric: tabular-nums;
    text-align: right;
    color: var(--ui-text-muted);
}

/* Swatch Rows - 3 Column Grid */
.swatch-row {
    display: grid;
    grid-template-columns: 1fr 8fr 1fr;
    gap: 1rem;
    align-items: center;
}

.swatch-row-label {
    font-size: 0.75rem;
    font-weight: 500;
    color: var(--ui-text-muted);
}

.swatch-row-swatches {
    width: 100%;
}

.swatch-row-value {
    font-size: 0.75rem;
    font-variant-numeric: tabular-nums;
    text-align: right;
    color: var(--ui-text-muted);
}

/* Color Preview Panel */
.color-preview-panel {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
    align-items: center;
}

.large-sample {
    width: 100%;
    max-width: 120px;
    aspect-ratio: 1;
    border-radius: 8px;
}

.color-preview-info {
    text-align: center;
}

.color-sample-label {
    font-size: 0.875rem;
    font-weight: 600;
    margin-bottom: 0.25rem;
}

.color-values {
    font-size: 0.75rem;
    font-variant-numeric: tabular-nums;
    color: var(--ui-text-muted);
    display: flex;
    gap: 0.75rem;
    justify-content: center;
}

/* Hue Spectrum Grid */
.hue-spectrum-grid {
    display: flex;
    flex-direction: column;
    gap: 1px;
}

/* Responsive */
@media (max-width: 1024px) {
    .layout {
        flex-direction: column;
        height: auto;
    }

    .left-sidebar {
        width: 100%;
        max-width: none;
        flex-direction: row;
        flex-wrap: wrap;
    }

    .step-navigation {
        flex-direction: row;
        flex: none;
    }

    .sidebar-spacer {
        display: none;
    }

    .right-content {
        grid-template-columns: 1fr;
        grid-template-rows: auto auto auto auto;
        max-height: none;
    }

    .top-controls,
    .swatches-preview,
    .secondary-controls,
    .right-panel {
        grid-column: 1;
    }

    .top-controls {
        grid-row: 1;
        height: auto;
        max-height: none;
    }

    .swatches-preview {
        grid-row: 2;
        height: auto;
    }

    .secondary-controls {
        grid-row: 3;
        height: auto;
    }

    .right-panel {
        grid-row: 4;
    }
}
</style>
