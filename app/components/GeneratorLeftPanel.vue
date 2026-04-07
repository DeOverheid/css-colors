<template>
    <aside class="panel sidepanel sidepanel--dark">
        <component
            :is="stepComponent"
            v-if="stepComponent" />
    </aside>
</template>

<script setup lang="ts">
import { useStepNavigation } from "~/composables/steps/useStepNavigation";
import type { Component } from "vue";

const { activeStep } = useStepNavigation();

const leftModules = import.meta.glob<{ default: Component }>("./steps/*/InputLeft.vue");

const stepComponent = computed(() => {
    const path = `./steps/${activeStep.value.id}/InputLeft.vue`;
    const loader = leftModules[path];
    return loader ? defineAsyncComponent(loader) : null;
});
</script>
