/**
 * Composable for managing the current wizard step state and navigation.
 */
export function useCurrentStep() {
    const currentStep = useState<1 | 2 | 3 | 4 | 5>("current-step", () => 1);

    const stepMetadata = {
        1: {
            title: "Primary Color",
            description: "Set the base hue and saturation for your color palette"
        },
        2: {
            title: "Lightness Distribution",
            description: "Adjust the bezier curve to control lightness distribution"
        },
        3: {
            title: "Lightness Adjustment",
            description: "Fine-tune individual color lightness values"
        },
        4: {
            title: "Hue Spectrum",
            description: "Expand your palette with additional hue variations"
        },
        5: {
            title: "Export",
            description: "Export your color palette configuration"
        }
    };

    const currentStepMetadata = computed(() => stepMetadata[currentStep.value]);

    function goToStep(step: 1 | 2 | 3 | 4 | 5) {
        currentStep.value = step;
    }

    function nextStep() {
        if (currentStep.value < 5) {
            currentStep.value = (currentStep.value + 1) as 1 | 2 | 3 | 4 | 5;
        }
    }

    function prevStep() {
        if (currentStep.value > 1) {
            currentStep.value = (currentStep.value - 1) as 1 | 2 | 3 | 4 | 5;
        }
    }

    return {
        currentStep,
        currentStepMetadata,
        stepMetadata,
        goToStep,
        nextStep,
        prevStep
    };
}
