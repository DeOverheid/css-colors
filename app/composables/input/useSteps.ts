import type { StepDefinition } from "~/types/fields";
import { useLightnessAdjustment } from "./stepLightnessAdjustment";

/**
 * Steps Orchestrator
 * Defines the order and configuration of all steps in the generator
 * Add, remove, or reorder steps here to change the workflow
 */
export function useSteps() {
    // Step composables
    const baseColor = stepBaseColor();
    const lightnessDistribution = stepLightnessDistribution();
    const lightnessAdjustment = useLightnessAdjustment();
    const hueSpectrum = stepHueSpectrum();

    /**
     * Ordered list of steps
     * The order here determines the order in the UI
     */
    const stepDefinitions: StepDefinition[] = [
        {
            id: "base-color",
            content: baseColor.content
        },
        {
            id: "lightness-distribution",
            content: lightnessDistribution.content
        },
        {
            id: "lightness-adjustment",
            content: lightnessAdjustment.content
        },
        {
            id: "hue-spectrum",
            content: hueSpectrum.content
        }
    ];

    /**
     * Get a step by ID with its composable data
     */
    function getStep(id: string) {
        switch (id) {
            case "base-color":
                return { definition: stepDefinitions[0], composable: baseColor };
            case "lightness-distribution":
                return { definition: stepDefinitions[1], composable: lightnessDistribution };
            case "lightness-adjustment":
                return { definition: stepDefinitions[2], composable: lightnessAdjustment };
            case "hue-spectrum":
                return { definition: stepDefinitions[3], composable: hueSpectrum };
            default:
                return null;
        }
    }

    return {
        definitions: stepDefinitions,
        getStep,
        // Expose individual step composables for direct access
        baseColor,
        lightnessDistribution,
        lightnessAdjustment,
        hueSpectrum
    };
}
