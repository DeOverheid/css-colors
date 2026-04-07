/**
 * Step Registry
 * Single source of truth for all wizard steps.
 * Steps are ordered by array position — no numeric IDs in logic.
 * Each step's UI components live in ~/components/steps/<id>/.
 */
import { config as primaryColor } from "~/components/steps/primary-color/StepConfig";
import { config as complementaryColors } from "~/components/steps/complementary-colors/StepConfig";
import { config as lightnessDistribution } from "~/components/steps/lightness-distribution/StepConfig";
import { config as lightnessAdjustment } from "~/components/steps/lightness-adjustment/StepConfig";
import { config as hueAdjustment } from "~/components/steps/hue-adjustment/StepConfig";
import { config as selectTheme } from "~/components/steps/select-theme/StepConfig";
import { config as exportStep } from "~/components/steps/export/StepConfig";

export interface StepDefinition {
    /** Unique string identifier — matches folder name under components/steps/ */
    id: string;
    /** Display title */
    title: string;
    /** Display description */
    description: string;
    /** Layout variant for the input panel */
    inputLayout?: "default" | "bezier" | "hue-wheel" | "lightness-adjustment";
    /** Swatch row IDs unlocked upon first visiting this step */
    unlocks?: string[];
}

export const steps: StepDefinition[] = [
    { id: "primary-color", ...primaryColor },
    { id: "complementary-colors", ...complementaryColors },
    { id: "lightness-distribution", ...lightnessDistribution },
    { id: "lightness-adjustment", ...lightnessAdjustment },
    { id: "hue-adjustment", ...hueAdjustment },
    { id: "select-theme", ...selectTheme },
    { id: "export", ...exportStep },
];
