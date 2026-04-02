<template>
    <footer class="bottom-panel panel">
        <!-- Left -->
        <div class="footer-left" />

        <!-- Middle: Step-specific content -->
        <div class="footer-middle">
            <component
                :is="footerComponent"
                v-if="footerComponent" />
        </div>

        <!-- Right -->
        <div class="footer-right" />
    </footer>
</template>

<script setup lang="ts">
import { useStepNavigation } from "~/composables/steps/useStepNavigation";
import type { Component } from "vue";

const { activeStep } = useStepNavigation();

/** Map step footerComponent names to lazy-loaded components */
const footerComponentMap: Record<string, Component> = {
    ExportActions: defineAsyncComponent(() => import("~/components/ExportActions.vue"))
};

const footerComponent = computed(() => {
    const name = activeStep.value.footerComponent;
    return name ? footerComponentMap[name] ?? null : null;
});
</script>

<style scoped>
.bottom-panel {
    grid-column: 1 / -1;
    grid-row: 3;
    padding: 0.75rem 1rem;
    display: grid;
    grid-template-columns: var(--panel-column-width, 15%) auto var(--panel-column-width, 15%);
    align-items: center;
    gap: 10px;
}

.footer-left {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    min-width: 0;
}

.footer-middle {
    display: flex;
    justify-content: center;
    align-items: center;
}

.footer-right {
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    gap: 0.375rem;
}
</style>
