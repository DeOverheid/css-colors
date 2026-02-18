import { useConfig } from "~/composables/core/baseConfig";

/**
 * Output Module: Export Configuration
 * Generates app.config.ts format with current hue value
 */
export function useExportConfig() {
    const appConfig = useAppConfig();
    const config = useConfig();
    const colorSettings = useColorSettings();

    const generateConfig = () => {
        // Get current values from sliders
        const currentHue = colorSettings.step1.hue.value;
        const currentSaturation = colorSettings.step1.saturation.value;
        const currentLightness = colorSettings.step2.lightness.value;

        return `export default defineAppConfig({
    ui: {
        colors: {
            neutral: '${appConfig.ui?.colors?.neutral || 'slate'}',
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
