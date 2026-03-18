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
    inputLayout?: "default" | "bezier";
    /** Component name for the footer middle slot (undefined = keep persistent) */
    footerComponent?: string;
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
        description: "Choose secondary and tertiary hues by setting the hue offset, then pick a UI tone for the app background",
        inputComponent: "ComplementaryColorPicker",
        unlocks: ["secondary", "tertiary", "secondary-grey", "tertiary-grey"]
    },
    {
        id: "select-theme",
        title: "Select Theme",
        description: "Pick a color system preset. Use Save Custom in the bottom-right to store your tweaks.",
        inputComponent: "ThemeSelector"
    },
    {
        id: "lightness-distribution",
        title: "Lightness Distribution",
        description: "Adjust the bezier curve to control lightness distribution",
        inputComponent: "BezierControls",
        inputLayout: "bezier"
    },
    {
        id: "lightness-adjustment",
        title: "Lightness Adjustment",
        description: "Fine-tune individual color lightness values",
        inputComponent: "LightnessAdjustmentPanel"
    },
    {
        id: "hue-spectrum",
        title: "Hue Spectrum",
        description: "Expand your palette with additional hue variations",
        inputComponent: "HueSpectrumControls"
    },
    {
        id: "export",
        title: "Export",
        description: "Export your color palette configuration",
        inputComponent: "ExportPanel",
        footerComponent: "ExportActions"
    }
];
