<template>
    <UFieldGroup
        orientation="horizontal">
        <UButton
            color="primary"
            :variant="!isCustomMode ? 'solid' : 'soft'"
            @click="setDefault">
            Default
        </UButton>
        <UButton
            color="primary"
            :variant="isCustomMode ? 'solid' : 'soft'"
            @click="setCustom">
            Custom
        </UButton>
    </UFieldGroup>
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

<style scoped></style>
