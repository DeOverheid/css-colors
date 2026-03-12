/**
 * Step Navigation
 * Manages the active step and provides navigation functions.
 * Automatically triggers swatch unlocking on step visit.
 */
import { steps, type StepDefinition } from "./stepRegistry";
import { useSwatchUnlock } from "~/composables/steps/useSwatchUnlock";

export function useStepNavigation() {
    const activeStepId = useState<string>("active-step", () => steps[0]!.id);
    const { visitStep } = useSwatchUnlock();

    const activeStep = computed<StepDefinition>(() =>
        steps.find(s => s.id === activeStepId.value) ?? steps[0]!
    );

    const activeIndex = computed(() =>
        steps.findIndex(s => s.id === activeStepId.value)
    );

    const isFirst = computed(() => activeIndex.value === 0);
    const isLast = computed(() => activeIndex.value === steps.length - 1);

    function goTo(id: string) {
        const step = steps.find(s => s.id === id);
        if (step) {
            activeStepId.value = id;
            visitStep(step);
        }
    }

    function next() {
        if (!isLast.value) {
            const nextStep = steps[activeIndex.value + 1]!;
            activeStepId.value = nextStep.id;
            visitStep(nextStep);
        }
    }

    function prev() {
        if (!isFirst.value) {
            const prevStep = steps[activeIndex.value - 1]!;
            activeStepId.value = prevStep.id;
            visitStep(prevStep);
        }
    }

    // Unlock swatches for the initial step
    visitStep(activeStep.value);

    return {
        steps,
        activeStep,
        activeStepId,
        activeIndex,
        isFirst,
        isLast,
        goTo,
        next,
        prev
    };
}
