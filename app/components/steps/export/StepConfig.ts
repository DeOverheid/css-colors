import type { StepDefinition } from "~/composables/steps/stepRegistry";

export const config: Omit<StepDefinition, "id"> = {
    title: "Export",
    description: "Export your color palette configuration",
    unlocks: [
        "primary", "grey", "neutral",
        "secondary", "tertiary", "secondary-grey", "tertiary-grey",
        "shift-sliders", "lightness-adjustment", "hue-adjustment",
        "compare-themes",
    ],
};
