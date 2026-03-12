import { useLightnessAdjustment } from "./stepLightnessAdjustment";

/**
 * Steps Orchestrator
 * Initializes all step composables and exposes their state.
 * Step metadata (titles, descriptions) lives in useCurrentStep.ts.
 */
export function useSteps() {
    // Initialize step composables (order matters for side-effects)
    const baseColor = stepBaseColor();
    const lightnessDistribution = stepLightnessDistribution();
    const lightnessAdjustment = useLightnessAdjustment();
    const hueSpectrum = stepHueSpectrum();

    return {
        baseColor,
        lightnessDistribution,
        lightnessAdjustment,
        hueSpectrum
    };
}
