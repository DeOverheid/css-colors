import { useLightnessAdjustment } from "./stepLightnessAdjustment";

/**
 * Steps Orchestrator
 * Initializes all step composables and exposes their state.
 * Step metadata (titles, descriptions) lives in steps/stepRegistry.ts.
 */
export function useSteps() {
    // Initialize step composables
    // lightnessDistribution first: its useState bezier refs must exist before useCssVariables reads them
    const lightnessDistribution = stepLightnessDistribution();
    const baseColor = stepBaseColor();
    const lightnessAdjustment = useLightnessAdjustment();
    const hueSpectrum = stepHueSpectrum();

    return {
        baseColor,
        lightnessDistribution,
        lightnessAdjustment,
        hueSpectrum
    };
}
