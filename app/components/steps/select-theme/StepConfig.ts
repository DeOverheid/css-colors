import type { StepDefinition } from "~/composables/steps/stepRegistry";

export const config: Omit<StepDefinition, "id"> = {
    title: "Compare Presets",
    description: "Compare your custom palette with Tailwind and Mathematical presets",
};
