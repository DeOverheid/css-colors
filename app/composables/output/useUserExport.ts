/**
 * User Export Orchestrator
 *
 * Manages export state (format, notation) and produces the final
 * serialized output string by combining the palette collector with
 * the selected formatter.
 */
import { usePaletteCollector } from "~/composables/output/usePaletteCollector";
import { toTailwindV4Css } from "~/composables/output/formatters/tailwindV4Css";
import { toCssVariables } from "~/composables/output/formatters/cssVariables";
import { useThemes } from "~/composables/themes";
import type { ColorNotation } from "~/composables/output/formatters/tailwindV4Css";

export type ExportFormat = "tailwind-v4" | "css-variables";

export function useUserExport() {
    const format = useState<ExportFormat>("export-format", () => "tailwind-v4");
    const notation = useState<ColorNotation>("export-notation", () => "hsl");

    const { palette } = usePaletteCollector();
    const { currentTheme } = useThemes();

    /** The formatted export string, updates reactively */
    const exportOutput = computed((): string => {
        const p = palette.value;
        const n = notation.value;

        switch (format.value) {
            case "tailwind-v4":
                return toTailwindV4Css(p, n);
            case "css-variables":
                return toCssVariables(p, n);
            default:
                return toTailwindV4Css(p, n);
        }
    });

    /** File extension for download */
    const fileExtension = computed(() => "css");

    /** Download filename: {theme}-{format}-palette.{ext} */
    const downloadFilename = computed(() => {
        const themeName = currentTheme.value.id;
        const formatSlug = format.value === "tailwind-v4" ? "tw4" : "cssvars";
        return `${themeName}-${formatSlug}-palette.${fileExtension.value}`;
    });

    /** Copy the export output to clipboard */
    async function copyToClipboard(): Promise<boolean> {
        try {
            await navigator.clipboard.writeText(exportOutput.value);
            return true;
        } catch {
            return false;
        }
    }

    /** Download the export output as a file */
    function downloadFile() {
        const blob = new Blob([exportOutput.value], { type: "text/css" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = downloadFilename.value;
        a.click();
        URL.revokeObjectURL(url);
    }

    return {
        format,
        notation,
        exportOutput,
        downloadFilename,
        copyToClipboard,
        downloadFile
    };
}
