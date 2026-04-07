<template>
    <div class="theme-selector">
        <p class="theme-description">
            Switch between presets to compare palettes.
            Each preset preserves your edits — tweak settings, switch away, and come back without losing changes.
        </p>
        <div class="theme-buttons rounded-group rounded-group--horizontal">
            <UButton
                v-for="theme in availableThemes"
                :key="theme.id"
                :color="currentThemeId === theme.id ? 'primary' : 'neutral'"
                size="sm"
                @click="setTheme(theme.id)">
                {{ theme.name }}
            </UButton>
        </div>
    </div>
</template>

<script setup lang="ts">
import { useThemes } from "~/composables/themes";

const { currentThemeId, availableThemes, setTheme } = useThemes();
</script>

<style scoped>
.theme-selector {
    display: flex;
    flex-direction: column;
    gap: 10px;
}

.theme-description {
    color: var(--ui-text-muted);
    margin: 0;
    font-size: 0.875rem;
    line-height: 1.5;
}

.theme-buttons {
    display: flex;
}

.theme-buttons :deep(button) {
    flex: 1;
    border-radius: 0;
}

.theme-buttons :deep(:first-child button) {
    border-top-left-radius: 5px;
    border-bottom-left-radius: 5px;
}

.theme-buttons :deep(:last-child button) {
    border-top-right-radius: 5px;
    border-bottom-right-radius: 5px;
}
</style>
