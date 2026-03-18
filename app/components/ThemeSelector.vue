<template>
    <div class="theme-selector">
        <div class="theme-cards">
            <button
                v-for="theme in availableThemes"
                :key="theme.id"
                class="theme-card"
                :class="{ 'theme-card--active': currentThemeId === theme.id }"
                @click="setTheme(theme.id)"
            >
                <span class="theme-card-name">{{ theme.name }}</span>
                <span class="theme-card-steps">{{ theme.totalSteps - 2 }} shades</span>
                <span
                    v-if="theme.description"
                    class="theme-card-desc"
                >
                    {{ theme.description }}
                </span>
            </button>
        </div>

        <div class="theme-info">
            <div class="info-row">
                <span class="info-label">Steps</span>
                <span class="info-value">{{ currentTheme.totalSteps }} (incl. black & white)</span>
            </div>
            <div class="info-row">
                <span class="info-label">Labels</span>
                <span class="info-value info-value--labels">{{ innerLabels.join(", ") }}</span>
            </div>
            <div class="info-row">
                <span class="info-label">Range</span>
                <span class="info-value">{{ currentTheme.lightnessMin ?? 0 }}% – {{ currentTheme.lightnessMax ?? 100 }}%</span>
            </div>
        </div>

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
</template>

<script setup lang="ts">
import { useThemes } from "~/composables/themes";
import { stepLightnessDistribution } from "~/composables/input/stepLightnessDistribution";

const { currentTheme, currentThemeId, availableThemes, setTheme, saveAsCustom } = useThemes();
const { bezierValues } = stepLightnessDistribution();

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
    gap: 1.5rem;
}

.theme-cards {
    display: flex;
    gap: 0.75rem;
}

.theme-card {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
    padding: 0.75rem 1rem;
    border: 2px solid var(--ui-border);
    border-radius: 8px;
    background: var(--ui-bg);
    cursor: pointer;
    transition: border-color 0.15s, background 0.15s;
    text-align: left;
}

.theme-card:hover {
    border-color: var(--ui-border-hover, var(--ui-border));
    background: var(--ui-bg-elevated);
}

.theme-card--active {
    border-color: var(--ui-color-primary-500);
    background: var(--ui-bg-elevated);
}

.theme-card-name {
    font-family: var(--font-family-header);
    font-weight: 600;
    font-size: 1rem;
}

.theme-card-steps {
    font-family: var(--font-family-monospace);
    font-size: 0.75rem;
    color: var(--ui-text-muted);
}

.theme-card-desc {
    font-size: 0.75rem;
    color: var(--ui-text-muted);
    margin-top: 0.25rem;
}

.theme-info {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
}

.info-row {
    display: grid;
    grid-template-columns: var(--panel-column-width, 15%) auto;
    gap: 1rem;
    align-items: baseline;
}

.info-label {
    font-family: var(--font-family-header);
    font-weight: 600;
    color: var(--ui-text-muted);
}

.info-value {
    font-family: var(--font-family-monospace);
}

.info-value--labels {
    font-size: 0.8125rem;
}

.theme-actions {
    display: flex;
    gap: 0.5rem;
}
</style>
