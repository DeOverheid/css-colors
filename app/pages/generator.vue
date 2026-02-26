<template>
    <UContainer>
        <div>
            <h1>
                Color Generator
            </h1>
            <p>
                Adjust the sliders below to customize your color palette.
            </p>

            <div class="generator-content">
                <!-- Step 1: Base Color -->
                <StepAccordion
                    :step="stepDefinitions[0]!"
                    :step-number="1">
                    <!-- Theme Selection -->
                    <div class="form-group form-group-row">
                        <div>
                            <label>Theme</label>
                            <URadioGroup
                                v-model="currentThemeId"
                                :items="themeOptions"
                                orientation="horizontal" />
                        </div>
                        <UButton
                            :icon="isDevModeEnabled ? 'i-lucide-code' : 'i-lucide-eye'"
                            :color="isDevModeEnabled ? 'primary' : 'neutral'"
                            variant="soft"
                            size="sm"
                            @click="toggleDevMode">
                            {{ isDevModeEnabled ? 'Dev Mode' : 'Preview Mode' }}
                        </UButton>
                    </div>

                    <!-- Hue and Saturation Controls -->
                    <div class="controls-grid">
                        <div class="controls-column">
                            <div class="form-group">
                                <label>Color Input</label>
                                <UInput
                                    v-model="colorInput"
                                    placeholder="#hex, rgb(), or hsl()"
                                    @input="handleColorInput" />
                            </div>
                            <HueSlider
                                id="hue"
                                v-model="colorSettings.step1.hue.value"
                                label="Hue"
                                :min="0"
                                :max="360"
                                unit="°" />
                            <SaturationSlider
                                id="saturation"
                                v-model="colorSettings.step1.saturation.value"
                                label="Saturation"
                                :hue="colorSettings.step1.hue.value"
                                :min="0"
                                :max="100"
                                unit="%" />
                        </div>

                        <div class="sample-column">
                            <div class="color-sample-label">
                                Primary color: Primary-{{ markedSwatchLabel }}
                            </div>
                            <ColorSwatch
                                :hue="colorSettings.step1.hue.value"
                                :saturation="colorSettings.step1.saturation.value"
                                :lightness="markedSampleLightness"
                                class="large-sample" />
                        </div>
                    </div>
                </StepAccordion>

                <!-- Step 2: Lightness Distribution -->
                <StepAccordion
                    :step="stepDefinitions[1]!"
                    :step-number="2">
                    <div class="bezier-grid">
                        <div class="bezier-column">
                            <BezierCurveEditor
                                :key="currentThemeId"
                                :initial-x1="bezierValues.x1"
                                :initial-y1="bezierValues.y1"
                                :initial-x2="bezierValues.x2"
                                :initial-y2="bezierValues.y2"
                                @update="handleBezierUpdate" />
                        </div>

                        <div class="swatches-column">
                            <div class="swatch-row-container">
                                <div class="swatch-row-label">
                                    {{ currentTheme.name }} swatches
                                </div>
                                <div
                                    class="theme-labels"
                                    :style="{ '--total-steps': totalSteps }">
                                    <div
                                        v-for="label in swatchLabels"
                                        :key="label"
                                        class="theme-label">
                                        {{ label }}
                                    </div>
                                </div>
                            </div>

                            <div class="swatch-row-container">
                                <div class="swatch-row-label">
                                    Full Color
                                </div>
                                <ColorSwatchRow
                                    :hue="colorSettings.step1.hue.value"
                                    :saturation="colorSettings.step1.saturation.value"
                                    :lightness-steps="lightnessSteps"
                                    :total-steps="totalSteps"
                                    :show-marker="true"
                                    :marker-index="markerIndex" />
                            </div>

                            <div class="swatch-row-container">
                                <div class="swatch-row-label">
                                    Muted: Greyscale
                                </div>
                                <ColorSwatchRow
                                    :hue="colorSettings.step1.hue.value"
                                    :saturation="mutedSaturation"
                                    :lightness-steps="lightnessSteps"
                                    :total-steps="totalSteps" />
                            </div>

                            <div class="swatch-row-container">
                                <div class="swatch-row-label">
                                    Neutral
                                </div>
                                <ColorSwatchRow
                                    :hue="colorSettings.step1.hue.value"
                                    :saturation="0"
                                    :lightness-steps="lightnessSteps"
                                    :total-steps="totalSteps" />
                            </div>

                            <div class="swatch-row-container">
                                <div class="swatch-row-label">
                                    Lightness values (%)
                                </div>
                                <LightnessLabels
                                    :lightness-steps="lightnessSteps"
                                    :total-steps="totalSteps" />
                            </div>
                        </div>
                    </div>
                </StepAccordion>

                <!-- Step 3: Lightness Adjustment -->
                <StepAccordion
                    :step="stepDefinitions[2]!"
                    :step-number="3">
                    <LightnessAdjustmentPanel />
                </StepAccordion>

                <!-- Step 4: Hue Spectrum -->
                <StepAccordion
                    :step="stepDefinitions[3]!"
                    :step-number="4">
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
                            @update:dark-offset="hueSpectrum.setDarkOffset(rowState.entry.name, $event)" />
                    </div>
                </StepAccordion>

                <div class="button-group">
                    <UButton
                        v-if="isDevModeEnabled"
                        icon="i-lucide-copy"
                        @click="exportConfig.copyToClipboard">
                        Export Config
                    </UButton>
                    <UButton
                        v-if="isDevModeEnabled"
                        icon="i-lucide-palette"
                        variant="soft"
                        @click="exportConfig.copyDevExportToClipboard">
                        Export Theme Config
                    </UButton>
                    <UButton
                        icon="i-lucide-save"
                        variant="outline"
                        @click="exportConfig.copyUserThemeToClipboard">
                        Export Custom Theme
                    </UButton>
                </div>
            </div>

            <USeparator class="my-6" />

            <UButton
                to="/"
                icon="i-lucide-arrow-left"
                variant="ghost">
                Back to Home
            </UButton>
        </div>
    </UContainer>
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

useHead({
    title: "Color Generator"
});

const { definitions: stepDefinitions, hueSpectrum } = useSteps();
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
/* Layout styles only - no decorative styling */
.generator-content {
    margin: 2rem 0;
}

.form-group {
    margin-bottom: 1rem;
}

.form-group-row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 1rem;
}

.controls-grid {
    display: grid;
    grid-template-columns: 1fr auto;
    gap: 2rem;
}

.sample-column {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    min-width: 120px;
}

.large-sample {
    width: 120px;
    height: 120px;
}

.bezier-grid {
    display: grid;
    grid-template-columns: 320px 1fr;
    gap: 2rem;
}

.swatches-column {
    display: flex;
    flex-direction: column;
    gap: 1rem;
}

.swatch-row-container {
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
}

.theme-labels {
    display: grid;
    grid-template-columns: repeat(var(--total-steps), 1fr);
    gap: 0;
    width: 100%;
}

.theme-label {
    font-size: 0.625rem;
    text-align: center;
    font-variant-numeric: tabular-nums;
}

.button-group {
    display: flex;
    gap: 1rem;
    margin-top: 1.5rem;
}

.hue-spectrum-grid {
    display: flex;
    flex-direction: column;
    gap: 1px;
}

@media (max-width: 768px) {
    .controls-grid {
        grid-template-columns: 1fr;
    }

    .bezier-grid {
        grid-template-columns: 1fr;
    }
}
</style>
