<template>
    <div class="theme-selector">
        <div class="input-row">
            <label class="input-label">Theme</label>
            <RadioSelector
                :model-value="currentThemeId"
                name="theme"
                :options="themeOptions"
                @update:model-value="setTheme($event)"
            />
        </div>

        <div class="input-row">
            <label class="input-label">Steps</label>
            <span class="input-value">{{ currentTheme.totalSteps }} (incl. black & white)</span>
        </div>
        <div class="input-row">
            <label class="input-label">Labels</label>
            <span class="input-value input-value--labels">{{ innerLabels.join(", ") }}</span>
        </div>
        <div class="input-row">
            <label class="input-label">Range</label>
            <span class="input-value">{{ currentTheme.lightnessMin ?? 0 }}% – {{ currentTheme.lightnessMax ?? 100 }}%</span>
        </div>

        <div class="input-row">
            <label class="input-label" />
            <div class="theme-actions">
                <UButton
                    :disabled="currentThemeId === 'custom'"
                    variant="soft"
                    size="sm"
                    icon="i-lucide-save"
                    @click="handleSaveAsCustom"
                >
                    Save as Custom
                </UButton>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { useThemes } from "~/composables/themes";
import { stepLightnessDistribution } from "~/composables/input/stepLightnessDistribution";
import type { RadioOption } from "~/components/RadioSelector.vue";

const { currentTheme, currentThemeId, availableThemes, setTheme, saveAsCustom } = useThemes();
const { bezierValues } = stepLightnessDistribution();

/** Map themes to RadioSelector options — name only, details in title */
const themeOptions = computed<RadioOption[]>(() =>
    availableThemes.value.map(theme => ({
        value: theme.id,
        label: theme.name,
        title: `${theme.totalSteps - 2} shades — ${theme.description ?? theme.name}`
    }))
);

/** Swatch labels without the black/white endpoints */
const innerLabels = computed(() => {
    const labels = currentTheme.value.swatchLabels;
    return labels.slice(1, labels.length - 1);
});

function handleSaveAsCustom() {
    saveAsCustom(bezierValues.value);
}
</script>

<style scoped>
.theme-selector {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
    grid-column: 2;
}

.input-row {
    display: grid;
    grid-template-columns: var(--label-column-width, 80px) 1fr;
    gap: 1rem;
    align-items: center;
}

.input-label {
    font-family: var(--font-family-header);
    font-weight: 600;
    color: var(--ui-text-muted);
}

.input-value {
    font-family: var(--font-family-monospace);
}

.input-value--labels {
    font-size: 0.8125rem;
}

.theme-actions {
    display: flex;
    gap: 0.5rem;
}
</style>
