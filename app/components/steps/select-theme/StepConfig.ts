import type { StepDefinition } from "~/composables/steps/stepRegistry";

export const config: Omit<StepDefinition, "id"> = {
    title: "Compare Presets",
    description: "Compare your custom palette with Tailwind and Mathematical presets",
    unlocks: [
        "primary", "grey", "neutral",
        "secondary", "tertiary", "secondary-grey", "tertiary-grey",
        "shift-sliders", "lightness-adjustment", "hue-adjustment",
        "compare-themes",
    ],
};
