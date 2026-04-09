<template>
    <div class="export-controls">
        <div class="export-control-row">
            <label class="export-controls__label">Format</label>
            <UFieldGroup>
                <UButton
                    v-for="opt in formatOptions"
                    :key="opt.value"
                    :variant="format === opt.value ? 'solid' : 'soft'"
                    color="primary"
                    @click="format = opt.value">
                    {{ opt.label }}
                </UButton>
            </UFieldGroup>
        </div>
        <div class="export-control-row">
            <label class="export-controls__label">Notation</label>
            <UFieldGroup>
                <UButton
                    v-for="opt in notationOptions"
                    :key="opt.value"
                    :variant="notation === opt.value ? 'solid' : 'soft'"
                    color="primary"
                    @click="notation = opt.value">
                    {{ opt.label }}
                </UButton>
            </UFieldGroup>
        </div>
    </div>
</template>

<script setup lang="ts">
import { useUserExport } from "~/composables/output/useUserExport";
import type { ExportFormat } from "~/composables/output/useUserExport";
import type { ColorNotation } from "~/composables/output/formatters/tailwindV4Css";

const { format, notation } = useUserExport();

const formatOptions: { value: ExportFormat; label: string }[] = [
    { value: "tailwind-v4", label: "Tailwind v4" },
    { value: "css-variables", label: "CSS Variables" }
];

const notationOptions: { value: ColorNotation; label: string }[] = [
    { value: "hsl", label: "HSL" },
    { value: "hex", label: "Hex" }
];
</script>

<style scoped>
.export-controls {
    display: flex;
    flex-direction: column;
    gap: 10px;
}

.export-control-row {
    display: flex;
    align-items: center;
    gap: 20px;
}

.export-controls__label {
    font-size: 13px;
    color: var(--ui-text-muted);
}

.export-controls__label {
    min-width: 80px;
}

.export-controls__buttons {
    display: flex;
    gap: 4px;
}
</style>
