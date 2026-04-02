<template>
    <div class="hue-adjustment-panel">
        <p class="adjustment-hint">
            Shift the hue of dark and light swatches to compensate for
            perceptual color drift at extreme lightness values.
        </p>
        <button
            class="copy-offsets-btn"
            @click="copyOffsets">
            {{ copied ? "Copied!" : "Copy hue offsets" }}
        </button>
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

.copy-offsets-btn {
    align-self: flex-start;
    padding: 5px 5px;
    font-size: 0.75rem;
    border: 1px solid var(--ui-border-color, #555);
    border-radius: 0.25rem;
    background: transparent;
    color: var(--ui-text-muted);
    cursor: pointer;
    transition: background 0.15s, color 0.15s;
}

.copy-offsets-btn:hover {
    background: var(--ui-bg-elevated, #333);
    color: var(--ui-text, #fff);
}
</style>
