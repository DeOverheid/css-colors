<script setup lang="ts">
import type { StepDefinition } from "~/types/fields";

interface Props {
    step: StepDefinition;
    stepNumber?: number;
}

const props = defineProps<Props>();

const stepManager = useStepManager();
const state = stepManager.getStepState(props.step.id);

// Register step on mount
onMounted(() => {
    stepManager.registerStep(props.step);
});

function toggleExpanded() {
    stepManager.toggleStep(props.step.id);
}

function handleComplete() {
    stepManager.completeStep(props.step.id);
}
</script>

<template>
    <UCard class="step-accordion">
        <template #header>
            <div
                class="step-header"
                @click="toggleExpanded">
                <div class="step-title-row">
                    <UBadge
                        v-if="stepNumber"
                        :color="state.isComplete ? 'success' : 'neutral'"
                        variant="solid"
                        size="sm">
                        {{ state.isComplete ? '✓' : stepNumber }}
                    </UBadge>
                    <span class="step-title">
                        {{ step.content.value.title }}
                    </span>
                </div>
                <UIcon
                    :name="state.isActive ? 'i-lucide-chevron-up' : 'i-lucide-chevron-down'" />
            </div>
        </template>

        <div v-show="state.isActive">
            <p v-if="step.content.value.description" class="step-description">
                {{ step.content.value.description }}
            </p>

            <slot />

            <div class="step-actions">
                <slot name="actions">
                    <UButton v-if="!state.isComplete" @click="handleComplete">
                        Continue
                    </UButton>
                </slot>
            </div>
        </div>
    </UCard>
</template>

<style scoped>
.step-accordion {
    margin-bottom: 1rem;
}

.step-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    cursor: pointer;
    user-select: none;
}

.step-title-row {
    display: flex;
    align-items: center;
    gap: 0.75rem;
}

.step-title {
    font-weight: 600;
}

.step-description {
    margin-bottom: 1rem;
}

.step-actions {
    display: flex;
    justify-content: flex-end;
    margin-top: 1.5rem;
}
</style>
