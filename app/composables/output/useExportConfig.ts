import { useConfig } from "~/composables/core/baseConfig";
import { useLightnessAdjustment } from "~/composables/input/stepLightnessAdjustment";
import { stepHueSpectrum } from "~/composables/input/stepHueSpectrum";
import { useThemes } from "~/composables/themes";

/**
 * Output Module: Export Configuration
 * Generates exportable configs for theme development
 */
export function useExportConfig() {
    const appConfig = useAppConfig();
    const config = useConfig();
    const colorSettings = useColorSettings();
    const { settings: lightnessAdjustment } = useLightnessAdjustment();
    const hueSpectrum = stepHueSpectrum();
    const { currentThemeId, currentTheme } = useThemes();

    /**
     * Generate app.config.ts format with current values
     */
    const generateAppConfig = () => {
        const currentHue = colorSettings.hue.value;
        const currentSaturation = colorSettings.saturation.value;
        const currentLightness = colorSettings.lightness.value;
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
     * Generate full theme config for current theme
     * Can be used to replace REPLACEABLE THEME CONFIG section
     */
    const generateThemeConfig = () => {
        const theme = currentTheme.value;
        const adj = lightnessAdjustment.value;
        const isTailwind = currentThemeId.value === "tailwind";
        const varName = isTailwind ? "tailwindTheme" : "mathematicalTheme";

        let configStr = `export const ${varName}: ThemeConfig = {
    id: "${theme.id}",
    name: "${theme.name}",
    totalSteps: ${theme.totalSteps},
    swatchLabels: ${JSON.stringify(theme.swatchLabels)},`;

        if (theme.lightnessMin !== undefined) {
            configStr += `\n    lightnessMin: ${theme.lightnessMin},`;
        }
        if (theme.lightnessMax !== undefined) {
            configStr += `\n    lightnessMax: ${theme.lightnessMax},`;
        }
        if (theme.grayscaleLightnessMin !== undefined) {
            configStr += `\n    grayscaleLightnessMin: ${theme.grayscaleLightnessMin},`;
        }
        if (theme.grayscaleLightnessMax !== undefined) {
            configStr += `\n    grayscaleLightnessMax: ${theme.grayscaleLightnessMax},`;
        }

        configStr += `
    bezier: {
        x1: ${theme.bezier.x1},
        y1: ${theme.bezier.y1},
        x2: ${theme.bezier.x2},
        y2: ${theme.bezier.y2}
    },`;

        if (theme.grayscaleBezier) {
            configStr += `
    grayscaleBezier: {
        x1: ${theme.grayscaleBezier.x1},
        y1: ${theme.grayscaleBezier.y1},
        x2: ${theme.grayscaleBezier.x2},
        y2: ${theme.grayscaleBezier.y2}
    },`;
        }

        configStr += `
    lightnessAdjustment: {
        enabled: ${adj.enabled},
        darkening: {
            enabled: ${adj.darkening.enabled},
            start: ${adj.darkening.start},
            end: ${adj.darkening.end},
            hueFalloff: ${adj.darkening.hueFalloff},
            lightnessFalloffLight: ${adj.darkening.lightnessFalloffLight},
            lightnessAmplitude: ${adj.darkening.lightnessAmplitude},
            lightnessFalloffDark: ${adj.darkening.lightnessFalloffDark}
        },
        brightening: {
            enabled: ${adj.brightening.enabled},
            start: ${adj.brightening.start},
            end: ${adj.brightening.end},
            hueFalloff: ${adj.brightening.hueFalloff},
            lightnessFalloffLight: ${adj.brightening.lightnessFalloffLight},
            lightnessAmplitude: ${adj.brightening.lightnessAmplitude},
            lightnessFalloffDark: ${adj.brightening.lightnessFalloffDark}
        }
    },`;

        if (theme.description) {
            configStr += `\n    description: "${theme.description}"`;
        }

        configStr += "\n};";

        return configStr;
    };

    /**
     * Generate hue entries config for current theme
     * Can be used to replace REPLACEABLE HUE CONFIG section
     */
    const generateHueConfig = () => {
        const rows = hueSpectrum.hueRowStates.value;
        const isTailwind = currentThemeId.value === "tailwind";
        const varName = isTailwind ? "tailwindHues" : "mathematicalHues";
        const typeName = isTailwind ? "TailwindHueEntry" : "MathHueEntry";

        const lines = rows.map((row, index) => {
            const entry = row.entry as {
                name: string;
                type?: string;
                baseHue: number;
                lightnessOffset?: number;
                saturationLightOffset?: number;
                saturationDarkOffset?: number;
            };
            const isLast = index === rows.length - 1;
            const comma = isLast ? "" : ",";

            if (isTailwind && "type" in entry) {
                // Tailwind format with type field
                return `    { name: "${entry.name}", type: "${entry.type}", baseHue: ${entry.baseHue}, lightOffset: ${row.lightOffset}, darkOffset: ${row.darkOffset}, lightnessOffset: ${entry.lightnessOffset ?? 0}, saturationLightOffset: ${entry.saturationLightOffset ?? 0}, saturationDarkOffset: ${entry.saturationDarkOffset ?? 0} }${comma}`;
            } else {
                // Mathematical format without type field
                return `    { name: "${entry.name}", baseHue: ${entry.baseHue}, lightOffset: ${row.lightOffset}, darkOffset: ${row.darkOffset}, saturationLightOffset: ${entry.saturationLightOffset ?? 0}, saturationDarkOffset: ${entry.saturationDarkOffset ?? 0} }${comma}`;
            }
        });

        return `export const ${varName}: ${typeName}[] = [\n${lines.join("\n")}\n];`;
    };

    /**
     * Generate combined dev export with both theme and hue configs
     */
    const generateFullDevExport = () => {
        const themeConfig = generateThemeConfig();
        const hueConfig = generateHueConfig();

        return `// ============================================================================
// REPLACEABLE CONFIG - START
// Export > select this block > paste to replace
// ============================================================================

${themeConfig}

${hueConfig}

// ============================================================================
// REPLACEABLE CONFIG - END
// ============================================================================`;
    };

    const copyAppConfigToClipboard = async () => {
        const configText = generateAppConfig();
        try {
            await navigator.clipboard.writeText(configText);
            alert("App config copied to clipboard! Paste it into app.config.ts");
        } catch (err) {
            console.error("Failed to copy:", err);
            prompt("Copy this config to app.config.ts:", configText);
        }
    };

    const copyDevExportToClipboard = async () => {
        const devExportText = generateFullDevExport();
        const fileName = currentThemeId.value === "tailwind" ? "tailwind.ts" : "mathematical.ts";
        try {
            await navigator.clipboard.writeText(devExportText);
            alert(`Copied! Replace REPLACEABLE CONFIG block in:\ncomposables/themes/lib/${fileName}`);
        } catch (err) {
            console.error("Failed to copy:", err);
            prompt(`Copy to ${fileName}:`, devExportText);
        }
    };

    /**
     * Generate custom theme config to paste into custom.ts
     * This creates a custom theme based on current settings
     */
    const generateUserTheme = () => {
        const theme = currentTheme.value;
        const adj = lightnessAdjustment.value;
        const rows = hueSpectrum.hueRowStates.value;

        // Generate hue entries - always use CustomHueEntry format with type field
        const hueLines = rows.map((row, index) => {
            const entry = row.entry as {
                name: string;
                type?: string;
                baseHue: number;
                lightnessOffset?: number;
                saturationLightOffset?: number;
                saturationDarkOffset?: number;
            };
            const isLast = index === rows.length - 1;
            const comma = isLast ? "" : ",";
            const entryType = entry.type ?? "color";

            return `    { name: "${entry.name}", type: "${entryType}", baseHue: ${entry.baseHue}, lightOffset: ${row.lightOffset}, darkOffset: ${row.darkOffset}, lightnessOffset: ${entry.lightnessOffset ?? 0}, saturationLightOffset: ${entry.saturationLightOffset ?? 0}, saturationDarkOffset: ${entry.saturationDarkOffset ?? 0} }${comma}`;
        });

        // Build optional sections
        const lightnessMinStr = theme.lightnessMin !== undefined
            ? `\n    lightnessMin: ${theme.lightnessMin},`
            : "";
        const lightnessMaxStr = theme.lightnessMax !== undefined
            ? `\n    lightnessMax: ${theme.lightnessMax},`
            : "";
        const gsLightnessMinStr = theme.grayscaleLightnessMin !== undefined
            ? `\n    grayscaleLightnessMin: ${theme.grayscaleLightnessMin},`
            : "";
        const gsLightnessMaxStr = theme.grayscaleLightnessMax !== undefined
            ? `\n    grayscaleLightnessMax: ${theme.grayscaleLightnessMax},`
            : "";
        const grayscaleBezierStr = theme.grayscaleBezier
            ? `
    grayscaleBezier: {
        x1: ${theme.grayscaleBezier.x1},
        y1: ${theme.grayscaleBezier.y1},
        x2: ${theme.grayscaleBezier.x2},
        y2: ${theme.grayscaleBezier.y2}
    },`
            : "";

        return `// ============================================================================
// REPLACEABLE CONFIG - START
// Export > select this block > paste to replace
// ============================================================================

export const customTheme: ThemeConfig = {
    id: "custom",
    name: "Custom",
    totalSteps: ${theme.totalSteps},
    swatchLabels: ${JSON.stringify(theme.swatchLabels)},${lightnessMinStr}${lightnessMaxStr}
    bezier: {
        x1: ${theme.bezier.x1},
        y1: ${theme.bezier.y1},
        x2: ${theme.bezier.x2},
        y2: ${theme.bezier.y2}
    },${grayscaleBezierStr}${gsLightnessMinStr}${gsLightnessMaxStr}
    lightnessAdjustment: {
        enabled: ${adj.enabled},
        darkening: {
            enabled: ${adj.darkening.enabled},
            start: ${adj.darkening.start},
            end: ${adj.darkening.end},
            hueFalloff: ${adj.darkening.hueFalloff},
            lightnessFalloffLight: ${adj.darkening.lightnessFalloffLight},
            lightnessAmplitude: ${adj.darkening.lightnessAmplitude},
            lightnessFalloffDark: ${adj.darkening.lightnessFalloffDark}
        },
        brightening: {
            enabled: ${adj.brightening.enabled},
            start: ${adj.brightening.start},
            end: ${adj.brightening.end},
            hueFalloff: ${adj.brightening.hueFalloff},
            lightnessFalloffLight: ${adj.brightening.lightnessFalloffLight},
            lightnessAmplitude: ${adj.brightening.lightnessAmplitude},
            lightnessFalloffDark: ${adj.brightening.lightnessFalloffDark}
        }
    },
    description: "Custom theme based on ${theme.name}"
};

export const customHues: CustomHueEntry[] = [
${hueLines.join("\n")}
];

// ============================================================================
// REPLACEABLE CONFIG - END
// ============================================================================
`;
    };

    const copyUserThemeToClipboard = async () => {
        const userThemeText = generateUserTheme();
        try {
            await navigator.clipboard.writeText(userThemeText);
            alert("Custom theme copied!\n\nPaste into:\ncomposables/themes/lib/custom.ts\n\nReplace the REPLACEABLE CONFIG block.");
        } catch (err) {
            console.error("Failed to copy:", err);
            prompt("Paste into custom.ts:", userThemeText);
        }
    };

    return {
        generateAppConfig,
        generateThemeConfig,
        generateHueConfig,
        generateFullDevExport,
        generateUserTheme,
        copyAppConfigToClipboard,
        copyDevExportToClipboard,
        copyUserThemeToClipboard,
        // Legacy aliases (still used)
        generateConfig: generateAppConfig,
        copyToClipboard: copyAppConfigToClipboard
    };
}
