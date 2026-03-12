<template>
    <aside class="left-sidebar panel">
        <!-- Logo / Title -->
        <div class="sidebar-logo">
            <h1>Bespoke for the masses!</h1>
        </div>

        <!-- Step Navigation -->
        <nav class="step-navigation">
            <button
                v-for="step in 5"
                :key="step"
                class="step-nav-item"
                :class="{ active: currentStep === step }"
                @click="goToStep(step as 1 | 2 | 3 | 4 | 5)">
                <span class="step-number">{{ step }}</span>
                <span class="step-label">{{ stepMetadata[step as 1 | 2 | 3 | 4 | 5].title }}</span>
            </button>
        </nav>

        <!-- Theme Selector (hidden for now) -->
        <div
            v-show="false"
            class="sidebar-theme">
            <label class="sidebar-label">Theme</label>
            <URadioGroup
                v-model="currentThemeId"
                :items="themeOptions"
                orientation="vertical" />
        </div>

        <!-- Spacer -->
        <div class="sidebar-spacer" />

        <!-- Spacer for removed export buttons -->
        <div class="sidebar-export" />

        <!-- Nuxt UI Logo -->
        <div class="sidebar-branding">
            <AppLogo class="nuxt-logo" />
        </div>
    </aside>
</template>

<script setup lang="ts">
import { useCurrentStep } from "~/composables/ui/useCurrentStep";
import { useThemes } from "~/composables/themes";

const { currentStep, stepMetadata, goToStep } = useCurrentStep();
const { currentThemeId, availableThemes } = useThemes();

const themeOptions = computed(() =>
    availableThemes.value.map(theme => ({
        label: theme.name,
        value: theme.id
    }))
);
</script>

<style scoped>
.left-sidebar {
    width: 20%;
    min-width: 220px;
    max-width: 300px;
    display: flex;
    flex-direction: column;
    gap: 10px;
}

.sidebar-logo h1 {
    font-weight: 600;
    font-size: 0.9375rem;
    margin: 0;
    white-space: nowrap;
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
}

.step-nav-item.active .step-number {
    background: rgba(255, 255, 255, 0.2);
}

.sidebar-theme {
    padding-top: 0.5rem;
}

.sidebar-label {
    display: block;
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

@media (max-width: 1024px) {
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
}
</style>
