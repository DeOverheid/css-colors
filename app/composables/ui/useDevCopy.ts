/**
 * Dev Copy — serializes the current step's settings to clipboard.
 * Used in dev mode to quickly capture settings for updating defaults.
 */
import { useStepNavigation } from "~/composables/steps/useStepNavigation";
import { useColorSettings } from "~/composables/core/useColorSettings";
import { useComplementaryColors } from "~/composables/input/useComplementaryColors";
import { stepLightnessDistribution } from "~/composables/input/stepLightnessDistribution";
import { stepUniformLightnessShift } from "~/composables/input/stepUniformLightnessShift";
import { useLightnessAdjustment } from "~/composables/input/stepLightnessAdjustment";
import { stepHueSpectrum } from "~/composables/input/stepHueSpectrum";
import { useHueShift } from "~/composables/input/stepHueShift";
import { useThemes } from "~/composables/themes";

type StepSerializer = () => string;

function serializePrimaryColor(): string {
    const { hue, saturation, lightness } = useColorSettings();
    const { currentThemeId } = useThemes();
    return [
        `Theme: ${currentThemeId.value}`,
        `Step: 1 (primary-color)`,
        "",
        `hue: ${hue.value}`,
        `saturation: ${saturation.value}`,
        `lightness: ${lightness.value}`
    ].join("\n");
}

function serializeComplementaryColors(): string {
    const { hueOffset, satRatio, uiToneSource } = useComplementaryColors();
    const { currentThemeId } = useThemes();
    return [
        `Theme: ${currentThemeId.value}`,
        `Step: 2 (complementary-colors)`,
        "",
        `hueOffset: ${hueOffset.value}`,
        `satRatio: ${satRatio.value}`,
        `uiToneSource: ${uiToneSource.value}`
    ].join("\n");
}

function serializeLightnessDistribution(): string {
    const { bezierValues } = stepLightnessDistribution();
    const { darkShift, lightShift, greyDarkShift, greyLightShift } = stepUniformLightnessShift();
    const { currentThemeId } = useThemes();
    return [
        `Theme: ${currentThemeId.value}`,
        `Step: 3 (lightness-distribution)`,
        "",
        "bezier:",
        `  x1: ${bezierValues.value.x1}`,
        `  y1: ${bezierValues.value.y1}`,
        `  x2: ${bezierValues.value.x2}`,
        `  y2: ${bezierValues.value.y2}`,
        "",
        "shifts:",
        `  darkShift: ${darkShift.value}`,
        `  lightShift: ${lightShift.value}`,
        `  greyDarkShift: ${greyDarkShift.value}`,
        `  greyLightShift: ${greyLightShift.value}`
    ].join("\n");
}

function serializeLightnessAdjustment(): string {
    const { settings } = useLightnessAdjustment();
    const { currentThemeId } = useThemes();

    function formatRange(label: string, range: typeof settings.value.darkening): string[] {
        return [
            `${label}:`,
            `  start: ${range.start}`,
            `  end: ${range.end}`,
            `  lightnessAmplitude: ${range.lightnessAmplitude}`,
            `  lightnessFalloffLight: ${range.lightnessFalloffLight}`,
            `  lightnessFalloffDark: ${range.lightnessFalloffDark}`,
            `  hueFalloff: ${range.hueFalloff}`
        ];
    }

    return [
        `Theme: ${currentThemeId.value}`,
        `Step: 4 (lightness-adjustment)`,
        "",
        ...formatRange("darkening", settings.value.darkening),
        "",
        ...formatRange("brightening", settings.value.brightening)
    ].join("\n");
}

function serializeHueAdjustment(): string {
    const { settings } = useHueShift();
    const { currentThemeId } = useThemes();
    const lines = [`Theme: ${currentThemeId.value}`, `Step: 5 (hue-adjustment)`, ""];
    for (const [name, entry] of Object.entries(settings.value.rows)) {
        lines.push(`${name}: light ${entry.light}, dark ${entry.dark}`);
    }
    return lines.join("\n");
}

function serializeSelectTheme(): string {
    const { currentThemeId, currentTheme } = useThemes();
    return [
        `themeId: ${currentThemeId.value}`,
        `name: ${currentTheme.value.name}`,
        `totalSteps: ${currentTheme.value.totalSteps}`
    ].join("\n");
}

function serializeExport(): string {
    // Full combined dump of all steps
    return [
        "=== Primary Color ===",
        serializePrimaryColor(),
        "",
        "=== Complementary Colors ===",
        serializeComplementaryColors(),
        "",
        "=== Lightness Distribution ===",
        serializeLightnessDistribution(),
        "",
        "=== Lightness Adjustment ===",
        serializeLightnessAdjustment(),
        "",
        "=== Hue Adjustment ===",
        serializeHueAdjustment(),
        "",
        "=== Theme ===",
        serializeSelectTheme()
    ].join("\n");
}

const serializers: Record<string, StepSerializer> = {
    "primary-color": serializePrimaryColor,
    "complementary-colors": serializeComplementaryColors,
    "lightness-distribution": serializeLightnessDistribution,
    "lightness-adjustment": serializeLightnessAdjustment,
    "hue-adjustment": serializeHueAdjustment,
    "select-theme": serializeSelectTheme,
    "export": serializeExport
};

export function useDevCopy() {
    const { activeStep } = useStepNavigation();
    const copied = ref(false);

    async function copyCurrentStepSettings() {
        const serializer = serializers[activeStep.value.id];
        if (!serializer) return;

        const text = serializer();
        try {
            await navigator.clipboard.writeText(text);
        } catch {
            // Fallback: let user copy manually
            prompt("Copy settings:", text);
        }
        copied.value = true;
        setTimeout(() => { copied.value = false; }, 1500);
    }

    return { copyCurrentStepSettings, copied };
}
