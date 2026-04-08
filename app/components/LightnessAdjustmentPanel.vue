<template>
    <div class="lightness-adjustment-panel">
        <p class="adjustment-hint">
            Lightness compensation adjusts brightness across hues so warm tones
            (yellows, oranges) are darkened and cool tones (blues, purples)
            are brightened for perceptual uniformity. (The AI means "look the same").
        </p>
        <UButton color="neutral" variant="ghost" size="xs" @click="copySettings">
            {{ copied ? "Copied!" : "Copy adjustment values" }}
        </UButton>
    </div>
</template>

<script setup lang="ts">
import { useLightnessAdjustment } from "~/composables/input/stepLightnessAdjustment";
import { useThemes } from "~/composables/themes";

const { settings } = useLightnessAdjustment();
const { currentTheme } = useThemes();
const copied = ref(false);

function formatRange(label: string, range: typeof settings.value.darkening) {
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

function copySettings() {
    const lines: string[] = [];
    lines.push(`Theme: ${currentTheme.value.id}`);
    lines.push("");
    lines.push(...formatRange("darkening", settings.value.darkening));
    lines.push("");
    lines.push(...formatRange("brightening", settings.value.brightening));
    navigator.clipboard.writeText(lines.join("\n"));
    copied.value = true;
    setTimeout(() => { copied.value = false; }, 2000);
}
</script>

<style scoped>
.lightness-adjustment-panel {
    display: flex;
    flex-direction: column;
    gap: 5px;
}

.adjustment-hint {
    color: var(--ui-text-muted);
    margin: 0;
    line-height: 1.5;
}
</style>
