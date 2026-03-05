<template>
    <div class="lightness-adjustment-panel">
        <!-- Master toggle -->
        <div class="master-toggle">
            <label class="toggle-label">
                <input
                    v-model="settings.enabled"
                    type="checkbox">
                <span>Apply lightness compensation</span>
            </label>
        </div>

        <div
            v-if="settings.enabled"
            class="adjustment-controls">
            <!-- Darkening Section -->
            <div class="adjustment-section">
                <div class="section-header">
                    <h4>Darkening</h4>
                    <label class="toggle-label small">
                        <input
                            v-model="settings.darkening.enabled"
                            type="checkbox">
                        <span>Enabled</span>
                    </label>
                </div>
                <p class="section-description">
                    Reduce brightness for warm hues (yellows, oranges) that appear visually lighter.
                </p>

                <div
                    v-if="settings.darkening.enabled"
                    class="control-grid">
                    <div class="control-row">
                        <label :for="`darkening-start-${id}`">Hue Start</label>
                        <input
                            :id="`darkening-start-${id}`"
                            v-model.number="settings.darkening.start"
                            type="range"
                            min="0"
                            max="360"
                            step="1">
                        <output>{{ settings.darkening.start }}°</output>
                    </div>

                    <div class="control-row">
                        <label :for="`darkening-end-${id}`">Hue End</label>
                        <input
                            :id="`darkening-end-${id}`"
                            v-model.number="settings.darkening.end"
                            type="range"
                            min="0"
                            max="360"
                            step="1">
                        <output>{{ settings.darkening.end }}°</output>
                    </div>

                    <div class="control-row">
                        <label :for="`darkening-falloff-${id}`">Hue Falloff</label>
                        <input
                            :id="`darkening-falloff-${id}`"
                            v-model.number="settings.darkening.hueFalloff"
                            type="range"
                            min="0"
                            max="60"
                            step="1">
                        <output>{{ settings.darkening.hueFalloff }}°</output>
                    </div>

                    <div class="control-row">
                        <label :for="`darkening-amplitude-${id}`">Amplitude</label>
                        <input
                            :id="`darkening-amplitude-${id}`"
                            v-model.number="settings.darkening.lightnessAmplitude"
                            type="range"
                            min="0"
                            max="30"
                            step="0.5">
                        <output>{{ settings.darkening.lightnessAmplitude.toFixed(1) }}</output>
                    </div>

                    <div class="control-row">
                        <label :for="`darkening-light-falloff-${id}`">Light Falloff</label>
                        <input
                            :id="`darkening-light-falloff-${id}`"
                            v-model.number="settings.darkening.lightnessFalloffLight"
                            type="range"
                            min="0"
                            max="1"
                            step="0.01">
                        <output>{{ settings.darkening.lightnessFalloffLight.toFixed(2) }}</output>
                    </div>

                    <div class="control-row">
                        <label :for="`darkening-dark-falloff-${id}`">Dark Falloff</label>
                        <input
                            :id="`darkening-dark-falloff-${id}`"
                            v-model.number="settings.darkening.lightnessFalloffDark"
                            type="range"
                            min="0"
                            max="1"
                            step="0.01">
                        <output>{{ settings.darkening.lightnessFalloffDark.toFixed(2) }}</output>
                    </div>
                </div>
            </div>

            <USeparator class="my-4" />

            <!-- Brightening Section -->
            <div class="adjustment-section">
                <div class="section-header">
                    <h4>Brightening</h4>
                    <label class="toggle-label small">
                        <input
                            v-model="settings.brightening.enabled"
                            type="checkbox">
                        <span>Enabled</span>
                    </label>
                </div>
                <p class="section-description">
                    Increase brightness for cool hues (blues, purples) that appear visually darker.
                </p>

                <div
                    v-if="settings.brightening.enabled"
                    class="control-grid">
                    <div class="control-row">
                        <label :for="`brightening-start-${id}`">Hue Start</label>
                        <input
                            :id="`brightening-start-${id}`"
                            v-model.number="settings.brightening.start"
                            type="range"
                            min="0"
                            max="360"
                            step="1">
                        <output>{{ settings.brightening.start }}°</output>
                    </div>

                    <div class="control-row">
                        <label :for="`brightening-end-${id}`">Hue End</label>
                        <input
                            :id="`brightening-end-${id}`"
                            v-model.number="settings.brightening.end"
                            type="range"
                            min="0"
                            max="360"
                            step="1">
                        <output>{{ settings.brightening.end }}°</output>
                    </div>

                    <div class="control-row">
                        <label :for="`brightening-falloff-${id}`">Hue Falloff</label>
                        <input
                            :id="`brightening-falloff-${id}`"
                            v-model.number="settings.brightening.hueFalloff"
                            type="range"
                            min="0"
                            max="60"
                            step="1">
                        <output>{{ settings.brightening.hueFalloff }}°</output>
                    </div>

                    <div class="control-row">
                        <label :for="`brightening-amplitude-${id}`">Amplitude</label>
                        <input
                            :id="`brightening-amplitude-${id}`"
                            v-model.number="settings.brightening.lightnessAmplitude"
                            type="range"
                            min="0"
                            max="30"
                            step="0.5">
                        <output>{{ settings.brightening.lightnessAmplitude.toFixed(1) }}</output>
                    </div>

                    <div class="control-row">
                        <label :for="`brightening-light-falloff-${id}`">Light Falloff</label>
                        <input
                            :id="`brightening-light-falloff-${id}`"
                            v-model.number="settings.brightening.lightnessFalloffLight"
                            type="range"
                            min="0"
                            max="1"
                            step="0.01">
                        <output>{{ settings.brightening.lightnessFalloffLight.toFixed(2) }}</output>
                    </div>

                    <div class="control-row">
                        <label :for="`brightening-dark-falloff-${id}`">Dark Falloff</label>
                        <input
                            :id="`brightening-dark-falloff-${id}`"
                            v-model.number="settings.brightening.lightnessFalloffDark"
                            type="range"
                            min="0"
                            max="1"
                            step="0.01">
                        <output>{{ settings.brightening.lightnessFalloffDark.toFixed(2) }}</output>
                    </div>
                </div>
            </div>

            <!-- Reset Button -->
            <div class="reset-row">
                <UButton
                    size="sm"
                    variant="ghost"
                    icon="i-lucide-rotate-ccw"
                    @click="resetToDefaults">
                    Reset to defaults
                </UButton>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { useLightnessAdjustment } from "~/composables/input/stepLightnessAdjustment";

// Unique ID for this instance (for label associations)
const id = useId();

const { settings, resetToDefaults } = useLightnessAdjustment();
</script>

<style scoped>
.lightness-adjustment-panel {
    display: flex;
    flex-direction: column;
    gap: 1rem;
}

.master-toggle {
    padding-bottom: 0.5rem;
    border-bottom: 1px solid var(--ui-border);
}

.toggle-label {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    cursor: pointer;
}

.toggle-label.small {
    font-size: 0.75rem;
}

.toggle-label input[type="checkbox"] {
    width: 1rem;
    height: 1rem;
    cursor: pointer;
}

.adjustment-controls {
    display: flex;
    flex-direction: column;
    gap: 1rem;
}

.adjustment-section {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
}

.section-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.section-header h4 {
    margin: 0;
    font-size: 0.75rem;
    font-weight: 600;
}

.section-description {
    font-size: 0.75rem;
    opacity: 0.7;
    margin: 0;
}

.control-grid {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
}

.control-row {
    display: grid;
    grid-template-columns: 80px 1fr 80px;
    gap: 0.75rem;
    align-items: center;
}

.control-row label {
    font-size: 0.75rem;
}

.control-row input[type="range"] {
    width: 100%;
}

.control-row output {
    font-size: 0.75rem;
    font-variant-numeric: tabular-nums;
    text-align: right;
}

.reset-row {
    display: flex;
    justify-content: flex-end;
    margin-top: 0.5rem;
}
</style>
