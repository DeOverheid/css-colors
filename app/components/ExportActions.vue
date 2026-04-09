<template>
    <UButton
        icon="i-lucide-save"
        color="primary"
        @click="exportConfig.copyUserThemeToClipboard">
        Export Theme
    </UButton>
</template>

<script setup lang="ts">
import { useExportConfig } from "~/composables/output/useExportConfig";

const exportConfig = useExportConfig();
</script>
