/**
 * Step Registry
 * Single source of truth for all wizard steps.
 * Steps are ordered by array position — no numeric IDs in logic.
 */

export interface StepDefinition {
    /** Unique string identifier */
    id: string;
    /** Display title */
    title: string;
    /** Display description */
    description: string;
    /** Component name rendered in the input panel */
    inputComponent: string;
    /** Layout variant for the input panel */
    inputLayout?: "default" | "bezier" | "hue-wheel" | "lightness-adjustment";
    /** Whether the left/right side panels are visible on this step (default: true once unlocked) */
    sidePanels?: boolean;
    /** Swatch row IDs unlocked upon first visiting this step */
    unlocks?: string[];
}

export const steps: StepDefinition[] = [
    {
        id: "primary-color",
        title: "Primary Color",
        description: "Set the base hue and saturation for your color palette",
        inputComponent: "ColorInputControls",
        unlocks: ["primary", "grey", "neutral"]
    },
    {
        id: "complementary-colors",
        title: "Complementary Colors",
        description: "Use the wheel to pick complimentary colors and pick a UI tone",
        inputComponent: "ComplementaryColorPicker",
        inputLayout: "hue-wheel",
        unlocks: ["secondary", "tertiary", "secondary-grey", "tertiary-grey"]
    },
    {
        id: "lightness-distribution",
        title: "Lightness Distribution",
        description: "Adjust the bezier curve to control lightness distribution",
        inputComponent: "BezierControls",
        inputLayout: "bezier",
        unlocks: ["shift-sliders"]
    },
    {
        id: "lightness-adjustment",
        title: "Lightness Adjustment",
        description: "Fine-tune individual color lightness values",
        inputComponent: "LightnessAdjustmentPanel",
        inputLayout: "lightness-adjustment",
        unlocks: ["lightness-adjustment"]
    },
    {
        id: "hue-adjustment",
        title: "Hue Adjustment",
        description: "Shift hue per swatch",
        inputComponent: "HueAdjustmentPanel",
        inputLayout: "lightness-adjustment",
        unlocks: ["hue-adjustment"]
    },
    {
        id: "select-theme",
        title: "Compare Presets",
        description: "Compare your custom palette with Tailwind and Mathematical presets",
        inputComponent: "ThemeSelector"
    },
    {
        id: "export",
        title: "Export",
        description: "Export your color palette configuration",
        inputComponent: "ExportPanel"
    }
];
