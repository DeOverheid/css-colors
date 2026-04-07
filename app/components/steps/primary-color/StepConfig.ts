import type { StepDefinition } from "~/composables/steps/stepRegistry";

export const config: Omit<StepDefinition, "id"> = {
    title: "Primary Color",
    description: "Set the base hue and saturation for your color palette",
    unlocks: ["primary", "grey", "neutral"],
};
