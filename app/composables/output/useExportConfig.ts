import { useConfig } from "~/composables/core/baseConfig";
import { useLightnessAdjustment } from "~/composables/input/stepLightnessAdjustment";

/**
 * Output Module: Export Configuration
 * Generates app.config.ts format with current hue value
 */
export function useExportConfig() {
    const appConfig = useAppConfig();
    const config = useConfig();
    const colorSettings = useColorSettings();
    const { settings: lightnessAdjustment } = useLightnessAdjustment();

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

    return {
        generateConfig,
        copyToClipboard
    };
}
