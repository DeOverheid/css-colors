<template>
    <div class="theme-selector">
        <div class="input-row">
            <label class="input-label">Preset</label>
            <RadioSelector
                :model-value="currentThemeId"
                name="theme"
                :options="themeOptions"
                @update:model-value="setTheme($event)" />
        </div>
    </div>
</template>

<script setup lang="ts">
import { useThemes } from "~/composables/themes";
import type { RadioOption } from "~/components/RadioSelector.vue";

const { currentThemeId, availableThemes, setTheme } = useThemes();

/** Map themes to RadioSelector options — name only, details in title */
const themeOptions = computed<RadioOption[]>(() =>
    availableThemes.value.map(theme => ({
        value: theme.id,
        label: theme.name,
        title: `${theme.totalSteps - 2} shades — ${theme.description ?? theme.name}`
    }))
);
</script>

<style scoped>
.theme-selector {
    display: flex;
    flex-direction: column;
    gap: 5px;
    grid-column: 2;
}

.input-row {
    display: grid;
    grid-template-columns: var(--label-column-width, 80px) 1fr;
    gap: 10px;
    align-items: start;
}

.input-label {
    font-family: var(--font-family-header);
    font-weight: 600;
    color: var(--ui-text-muted);
    padding-top: 5px;
    line-height: 1.5;
}
</style>
