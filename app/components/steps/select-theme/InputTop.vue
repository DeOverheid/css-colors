<template>
    <div class="theme-selector">
        <p class="theme-description">
            Switch between presets to compare palettes.
            Each preset preserves your edits — tweak settings, switch away, and come back without losing changes.
        </p>
        <UFieldGroup
            orientation="horizontal">
            <UButton
                v-for="theme in availableThemes"
                :key="theme.id"
                color="primary"
                :variant="currentThemeId === theme.id ? 'solid' : 'soft'"
                @click="setTheme(theme.id)">
                {{ theme.name }}
            </UButton>
        </UFieldGroup>
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
</style>
