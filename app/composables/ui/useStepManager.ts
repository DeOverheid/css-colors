import type { StepDefinition, StepState } from "~/types/fields";

/**
 * Manages accordion-style step navigation
 * Tracks active step and completion state for each step
 */
export function useStepManager() {
    const steps = useState<StepDefinition[]>("step-definitions", () => []);
    const activeStepId = useState<string | null>("active-step", () => null);
    const completedSteps = useState<Set<string>>("completed-steps", () => new Set());

    /**
     * Register a step with the manager
     */
    function registerStep(step: StepDefinition) {
        const existing = steps.value.find(s => s.id === step.id);
        if (!existing) {
            steps.value = [...steps.value, step];
        }

        // Activate first step by default
        if (activeStepId.value === null) {
            activeStepId.value = step.id;
        }
    }

    /**
     * Get state for a specific step
     */
    function getStepState(stepId: string): ComputedRef<StepState> {
        return computed(() => ({
            isActive: activeStepId.value === stepId,
            isComplete: completedSteps.value.has(stepId)
        }));
    }

    /**
     * Set a step as active (expands it)
     */
    function setActiveStep(stepId: string) {
        activeStepId.value = stepId;
    }

    /**
     * Toggle a step's expanded state
     */
    function toggleStep(stepId: string) {
        if (activeStepId.value === stepId) {
            activeStepId.value = null;
        } else {
            activeStepId.value = stepId;
        }
    }

    /**
     * Mark a step as complete and optionally advance to next
     */
    function completeStep(stepId: string, advanceToNext = true) {
        completedSteps.value = new Set([...completedSteps.value, stepId]);

        if (advanceToNext) {
            const currentIndex = steps.value.findIndex(s => s.id === stepId);
            const nextStep = steps.value[currentIndex + 1];
            if (nextStep) {
                activeStepId.value = nextStep.id;
            }
        }
    }

    /**
     * Mark a step as incomplete
     */
    function uncompleteStep(stepId: string) {
        const newSet = new Set(completedSteps.value);
        newSet.delete(stepId);
        completedSteps.value = newSet;
    }

    /**
     * Go to next step
     */
    function nextStep() {
        const currentIndex = steps.value.findIndex(s => s.id === activeStepId.value);
        const nextStep = steps.value[currentIndex + 1];
        if (nextStep) {
            activeStepId.value = nextStep.id;
        }
    }

    /**
     * Go to previous step
     */
    function previousStep() {
        const currentIndex = steps.value.findIndex(s => s.id === activeStepId.value);
        const prevStep = steps.value[currentIndex - 1];
        if (prevStep) {
            activeStepId.value = prevStep.id;
        }
    }

    return {
        steps: computed(() => steps.value),
        activeStepId: computed(() => activeStepId.value),
        completedSteps: computed(() => completedSteps.value),
        registerStep,
        getStepState,
        setActiveStep,
        toggleStep,
        completeStep,
        uncompleteStep,
        nextStep,
        previousStep
    };
}
