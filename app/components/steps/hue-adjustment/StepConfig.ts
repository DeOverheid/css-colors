import type { StepDefinition } from "~/composables/steps/stepRegistry";

export const config: Omit<StepDefinition, "id"> = {
    title: "Hue Adjustment",
    description: "Shift hue per swatch",
    inputLayout: "lightness-adjustment",
    unlocks: ["hue-adjustment"],
};
