<template>
    <section class="export-code-block">
        <div class="export-code-block__actions">
            <UButton
                icon="i-lucide-copy"
                :variant="copyFeedback ? 'solid' : 'soft'"
                :color="copyFeedback ? 'primary' : 'neutral'"
                size="xs"
                @click="handleCopy">
                {{ copyFeedback ? "Copied!" : "Copy" }}
            </UButton>
            <UButton
                icon="i-lucide-download"
                variant="soft"
                color="neutral"
                size="xs"
                @click="downloadFile">
                {{ downloadFilename }}
            </UButton>
        </div>
        <pre class="export-code-block__pre"><code class="export-code-block__code">{{ exportOutput }}</code></pre>
    </section>
</template>

<script setup lang="ts">
import { useUserExport } from "~/composables/output/useUserExport";

const { exportOutput, downloadFilename, copyToClipboard, downloadFile } = useUserExport();

const copyFeedback = ref(false);

async function handleCopy() {
    const ok = await copyToClipboard();
    if (ok) {
        copyFeedback.value = true;
        setTimeout(() => { copyFeedback.value = false; }, 2000);
    }
}
</script>

<style scoped>
.export-code-block {
    position: relative;
    display: flex;
    flex-direction: column;
    height: 100%;
    overflow: hidden;
    border-radius: var(--ui-radius);
    background: var(--ui-bg-elevated);
    border: 1px solid var(--ui-border);
}

.export-code-block__actions {
    display: flex;
    gap: 8px;
    padding: 8px 12px;
    border-bottom: 1px solid var(--ui-border);
    flex-shrink: 0;
}

.export-code-block__pre {
    flex: 1;
    overflow: auto;
    margin: 0;
    padding: 12px 16px;
    font-size: 12px;
    line-height: 1.6;
}

.export-code-block__code {
    font-family: var(--font-mono, ui-monospace, monospace);
    white-space: pre;
    color: var(--ui-text);
}
</style>
