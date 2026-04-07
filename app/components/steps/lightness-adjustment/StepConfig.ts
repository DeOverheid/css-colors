import type { StepDefinition } from "~/composables/steps/stepRegistry";

export const config: Omit<StepDefinition, "id"> = {
    title: "Lightness Adjustment",
    description: "Fine-tune individual color lightness values",
    inputLayout: "lightness-adjustment",
    unlocks: ["lightness-adjustment"],
};
