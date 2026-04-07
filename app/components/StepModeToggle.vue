<template>
    <div class="step-mode-toggle rounded-group rounded-group--horizontal">
        <UButton
            :color="!isCustomMode ? 'primary' : 'neutral'"
            size="xs"
            @click="setDefault">
            Default
        </UButton>
        <UButton
            :color="isCustomMode ? 'primary' : 'neutral'"
            size="xs"
            @click="setCustom">
            Custom
        </UButton>
    </div>
</template>

<script setup lang="ts">
import { useThemeOverrides, type OverridableStepId } from "~/composables/themes/useThemeOverrides";
import { useThemes } from "~/composables/themes";

const props = defineProps<{
    stepId: OverridableStepId;
}>();

const { currentThemeId } = useThemes();
const { getMode, setMode } = useThemeOverrides();

const isCustomMode = computed(() => getMode(currentThemeId.value, props.stepId) === "custom");

function setDefault() {
    setMode(currentThemeId.value, props.stepId, "default");
}

function setCustom() {
    setMode(currentThemeId.value, props.stepId, "custom");
}
</script>

<style scoped>
.step-mode-toggle {
    display: flex;
}

.step-mode-toggle :deep(button) {
    border-radius: 0;
}

.step-mode-toggle :deep(:first-child button) {
    border-top-left-radius: 5px;
    border-bottom-left-radius: 5px;
}

.step-mode-toggle :deep(:last-child button) {
    border-top-right-radius: 5px;
    border-bottom-right-radius: 5px;
}
</style>
