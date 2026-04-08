<template>
    <div class="hue-adjustment-panel">
        <p class="adjustment-hint">
            Shift the hue of dark and light swatches to compensate for
            perceptual color drift at extreme lightness values.
        </p>
        <UButton color="neutral" variant="ghost" size="xs" @click="copyOffsets">
            {{ copied ? "Copied!" : "Copy hue offsets" }}
        </UButton>
    </div>
</template>

<script setup lang="ts">
import { useHueShift } from "~/composables/input/stepHueShift";
import { useThemes } from "~/composables/themes";

const { settings } = useHueShift();
const { currentTheme } = useThemes();
const copied = ref(false);

function copyOffsets() {
    const lines: string[] = [];
    lines.push(`Theme: ${currentTheme.value.id}`);
    lines.push("");
    for (const [name, entry] of Object.entries(settings.value.rows)) {
        lines.push(`${name}: light ${entry.light}, dark ${entry.dark}`);
    }
    navigator.clipboard.writeText(lines.join("\n"));
    copied.value = true;
    setTimeout(() => { copied.value = false; }, 2000);
}
</script>

<style scoped>
.hue-adjustment-panel {
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
