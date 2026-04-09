<template>
    <div class="export-controls">
        <div class="export-controls__row">
            <label class="export-controls__label">Format</label>
            <RadioSelector
                v-model="format"
                name="export-format"
                :options="formatOptions"
                segmented
                class="export-controls__selector" />
        </div>
        <div class="export-controls__row">
            <label class="export-controls__label">Notation</label>
            <RadioSelector
                v-model="notation"
                name="export-notation"
                :options="notationOptions"
                segmented
                class="export-controls__selector" />
        </div>
    </div>
</template>

<script setup lang="ts">
import { useUserExport } from "~/composables/output/useUserExport";

interface RadioOption {
    value: string;
    label: string;
}

const { format, notation } = useUserExport();

const formatOptions: RadioOption[] = [
    { value: "tailwind-v4", label: "Tailwind v4" },
    { value: "css-variables", label: "CSS Variables" }
];

const notationOptions: RadioOption[] = [
    { value: "hsl", label: "HSL" },
    { value: "hex", label: "Hex" }
];
</script>

<style scoped>
.export-controls {
    display: flex;
    flex-direction: column;
    gap: 12px;
}

.export-controls__row {
    display: flex;
    align-items: center;
    gap: 12px;
}

.export-controls__label {
    min-width: 60px;
    font-size: 13px;
    color: var(--ui-text-muted);
}
</style>
