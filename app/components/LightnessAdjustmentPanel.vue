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
            <AdjustmentRangeControls
                title="Darkening"
                description="Reduce brightness for warm hues (yellows, oranges) that appear visually lighter."
                :settings="settings.darkening"
                id-prefix="darkening" />

            <USeparator class="my-4" />

            <AdjustmentRangeControls
                title="Brightening"
                description="Increase brightness for cool hues (blues, purples) that appear visually darker."
                :settings="settings.brightening"
                id-prefix="brightening" />

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

.reset-row {
    display: flex;
    justify-content: flex-end;
    margin-top: 0.5rem;
}
</style>
