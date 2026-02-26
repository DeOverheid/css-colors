import { useConfig } from "~/composables/core/baseConfig";
import { useLightnessAdjustment } from "~/composables/input/stepLightnessAdjustment";
import { stepHueSpectrum } from "~/composables/input/stepHueSpectrum";

/**
 * Output Module: Export Configuration
 * Generates app.config.ts format with current hue value
 */
export function useExportConfig() {
    const appConfig = useAppConfig();
    const config = useConfig();
    const colorSettings = useColorSettings();
    const { settings: lightnessAdjustment } = useLightnessAdjustment();
    const hueSpectrum = stepHueSpectrum();

    const generateConfig = () => {
        // Get current values from sliders
        const currentHue = colorSettings.step1.hue.value;
        const currentSaturation = colorSettings.step1.saturation.value;
        const currentLightness = colorSettings.step2.lightness.value;
        const adj = lightnessAdjustment.value;

        return `export default defineAppConfig({
    ui: {
        colors: {
            neutral: '${appConfig.ui?.colors?.neutral || "slate"}',
        },
    },
    colors: {
        hue: ${currentHue},
        saturation: ${currentSaturation},
        lightness: ${currentLightness},
        mutedSaturationMultiplier: ${config.colors.mutedSaturationMultiplier},
    },
    bezier: {
        x1: ${config.bezier.x1},
        y1: ${config.bezier.y1},
        x2: ${config.bezier.x2},
        y2: ${config.bezier.y2},
    },
    lightnessAdjustment: {
        enabled: ${adj.enabled},
        darkening: {
            enabled: ${adj.darkening.enabled},
            start: ${adj.darkening.start},
            end: ${adj.darkening.end},
            hueFalloff: ${adj.darkening.hueFalloff},
            lightnessFalloffLight: ${adj.darkening.lightnessFalloffLight},
            lightnessAmplitude: ${adj.darkening.lightnessAmplitude},
            lightnessFalloffDark: ${adj.darkening.lightnessFalloffDark},
        },
        brightening: {
            enabled: ${adj.brightening.enabled},
            start: ${adj.brightening.start},
            end: ${adj.brightening.end},
            hueFalloff: ${adj.brightening.hueFalloff},
            lightnessFalloffLight: ${adj.brightening.lightnessFalloffLight},
            lightnessAmplitude: ${adj.brightening.lightnessAmplitude},
            lightnessFalloffDark: ${adj.brightening.lightnessFalloffDark},
        },
    },
})`;
    };

    /**
     * Generate hue offsets in TypeScript format for tailwind.ts
     */
    const generateHueOffsets = () => {
        const rows = hueSpectrum.hueRowStates.value;
        const lines = rows.map(row => {
            const entry = row.entry as { name: string; type: string; baseHue: number; lightnessOffset?: number; saturationLightOffset?: number; saturationDarkOffset?: number };
            return `    { name: "${entry.name}", type: "${entry.type}", baseHue: ${entry.baseHue}, lightOffset: ${row.lightOffset}, darkOffset: ${row.darkOffset}, lightnessOffset: ${entry.lightnessOffset ?? 0}, saturationLightOffset: ${entry.saturationLightOffset ?? 0}, saturationDarkOffset: ${entry.saturationDarkOffset ?? 0} },`;
        });
        return `export const tailwindHues: TailwindHueEntry[] = [\n${lines.join("\n")}\n];`;
    };

    const copyToClipboard = async () => {
        const configText = generateConfig();
        try {
            await navigator.clipboard.writeText(configText);
            alert("Config copied to clipboard! Paste it into app.config.ts");
        } catch (err) {
            console.error("Failed to copy:", err);
            // Fallback: show the text in a prompt
            prompt("Copy this config to app.config.ts:", configText);
        }
    };

    const copyHueOffsetsToClipboard = async () => {
        const hueOffsetsText = generateHueOffsets();
        try {
            await navigator.clipboard.writeText(hueOffsetsText);
            alert("Hue offsets copied to clipboard! Paste into tailwind.ts");
        } catch (err) {
            console.error("Failed to copy:", err);
            prompt("Copy this config to tailwind.ts:", hueOffsetsText);
        }
    };

    return {
        generateConfig,
        generateHueOffsets,
        copyToClipboard,
        copyHueOffsetsToClipboard
    };
}
