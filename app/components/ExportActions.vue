<template>
    <UButton
        icon="i-lucide-save"
        variant="outline"
        size="sm"
        @click="exportConfig.copyUserThemeToClipboard"
    >
        Export Theme
    </UButton>
</template>

<script setup lang="ts">
import { useExportConfig } from "~/composables/output/useExportConfig";

const exportConfig = useExportConfig();
</script>
