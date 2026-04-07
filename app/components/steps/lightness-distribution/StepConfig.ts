import type { StepDefinition } from "~/composables/steps/stepRegistry";

export const config: Omit<StepDefinition, "id"> = {
    title: "Lightness Distribution",
    description: "Adjust the bezier curve to control lightness distribution",
    inputLayout: "bezier",
    unlocks: ["shift-sliders"],
};
