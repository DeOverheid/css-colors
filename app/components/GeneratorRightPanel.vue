<template>
    <aside class="panel sidepanel sidepanel--light">
        <component
            :is="stepComponent"
            v-if="stepComponent" />
    </aside>
</template>

<script setup lang="ts">
import { useStepNavigation } from "~/composables/steps/useStepNavigation";
import type { Component } from "vue";

const { activeStep } = useStepNavigation();

const rightModules = import.meta.glob<{ default: Component }>("./steps/*/InputRight.vue");

const stepComponent = computed(() => {
    const path = `./steps/${activeStep.value.id}/InputRight.vue`;
    const loader = rightModules[path];
    return loader ? defineAsyncComponent(loader) : null;
});
</script>
