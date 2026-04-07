import type { StepDefinition } from "~/composables/steps/stepRegistry";

export const config: Omit<StepDefinition, "id"> = {
    title: "Complementary Colors",
    description: "A good theme uses complementary colors for added contrast",
    inputLayout: "hue-wheel",
    unlocks: ["secondary", "tertiary", "secondary-grey", "tertiary-grey"],
};
