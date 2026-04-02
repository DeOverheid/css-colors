<template>
    <aside class="left-sidebar panel">
        <!-- Logo / Title -->
        <div class="sidebar-logo">
            <h1>Bespoke for the masses!</h1>
        </div>

        <hr class="sidebar-divider">

        <!-- Step Navigation -->
        <nav class="step-navigation rounded-group rounded-group--vertical">
            <button
                v-for="(step, index) in steps"
                :key="step.id"
                class="step-nav-item"
                :class="{ active: activeStepId === step.id }"
                @click="goTo(step.id)">
                <span class="step-number">{{ index + 1 }}</span>
                <span class="step-label">{{ step.title }}</span>
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

        <!-- Primary Color Sample -->
        <div class="sidebar-sample">
            <ColorSwatch
                :hue="colorSettings.hue.value"
                :saturation="colorSettings.saturation.value"
                :lightness="markedSampleLightness"
                class="sidebar-sample__swatch" />
            <div class="sidebar-sample__info">
                <span class="sidebar-sample__name">Primary</span>
                <span class="sidebar-sample__value">H: {{ colorSettings.hue.value }}°</span>
                <span class="sidebar-sample__value">S: {{ colorSettings.saturation.value }}%</span>
                <span class="sidebar-sample__value">L: {{ markedSampleLightness }}%</span>
            </div>
        </div>

        <!-- Dev Mode Toggle -->
        <UButton
            :icon="isDevModeEnabled ? 'i-lucide-code' : 'i-lucide-eye'"
            :color="isDevModeEnabled ? 'primary' : 'neutral'"
            size="sm"
            block
            @click="toggleDevMode">
            {{ isDevModeEnabled ? 'Dev' : 'Preview' }}
        </UButton>

        <!-- Nuxt UI Logo -->
        <div class="sidebar-branding">
            <AppLogo class="nuxt-logo" />
        </div>
    </aside>
</template>

<script setup lang="ts">
import { useStepNavigation } from "~/composables/steps/useStepNavigation";
import { useThemes } from "~/composables/themes";
import { useDevMode } from "~/composables/ui/useDevMode";
import { useColorSettings } from "~/composables/core/useColorSettings";
import { useConfig } from "~/composables/core/baseConfig";
import { useSteps } from "~/composables/input/useSteps";
import { findClosestLightnessIndex } from "~/composables/utils/lightnessIndex";

const { steps, activeStepId, goTo } = useStepNavigation();
const { currentThemeId, availableThemes } = useThemes();
const { isDevModeEnabled, toggleDevMode } = useDevMode();
const colorSettings = useColorSettings();
const config = useConfig();
const { lightnessDistribution } = useSteps();
const { lightnessSteps } = lightnessDistribution;

const targetLightness = computed(() => config.colors.lightness);

const markedSampleLightness = computed(() => {
    const idx = findClosestLightnessIndex(lightnessSteps.value, targetLightness.value);
    const allLightnesses = [0, ...lightnessSteps.value, 100];
    return allLightnesses[idx] ?? targetLightness.value;
});

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
    gap: 1rem;
}

.sidebar-logo h1 {
    font-weight: 600;
    font-size: 1.0625rem;
    margin: 0;
    white-space: nowrap;
    text-align: center;
}

.sidebar-divider {
    border: none;
    border-top: 1px solid var(--ui-border);
    margin: 0;
}

.step-navigation {
    display: flex;
    flex-direction: column;
    gap: 0;
    flex: 3;
}

.step-nav-item {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 10px;
    margin: 0;
    border: none;
    background: transparent;
    cursor: pointer;
    text-align: left;
    font-size: 13px;
    transition: background-color 0.15s;
}

.step-nav-item:hover {
    background: var(--ui-bg-accented);
}

.step-nav-item.active {
    background: var(--ui-primary);
    color: var(--color-neutral-900);
}

.step-number {
    width: 1em;
    flex-shrink: 0;
    font-weight: 600;
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

.sidebar-sample {
    display: flex;
    align-items: center;
    gap: 0.5rem;
}

.sidebar-sample__swatch {
    width: 36px;
    height: 36px;
    border-radius: 6px;
    flex-shrink: 0;
}

.sidebar-sample__info {
    display: flex;
    flex-direction: column;
    line-height: 1.3;
}

.sidebar-sample__name {
    font-weight: 600;
    font-size: 0.75rem;
}

.sidebar-sample__value {
    font-size: 0.6875rem;
    color: var(--ui-text-muted);
    font-variant-numeric: tabular-nums;
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
