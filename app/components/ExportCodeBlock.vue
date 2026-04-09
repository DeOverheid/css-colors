<template>
    <section class="panel export-code-block">
        <div class="export-code-block__scroll-wrapper">
            <div class="export-code-block__actions">
                <UTooltip :text="isSelected ? 'Deselect text' : 'Select all text'">
                    <UButton
                        icon="i-lucide-text-cursor-input"
                        :variant="isSelected ? 'soft' : 'ghost'"
                        color="primary"
                        @click="toggleSelectAll" />
                </UTooltip>
                <UTooltip text="Copy to clipboard">
                    <UButton
                        :icon="copyFeedback ? 'i-lucide-check' : 'i-lucide-copy'"
                        variant="ghost"
                        color="primary"
                        @click="handleCopy" />
                </UTooltip>
                <UTooltip :text="`Download as ${downloadFilename}`">
                    <UButton
                        icon="i-lucide-download"
                        variant="ghost"
                        color="primary"
                        @click="downloadFile" />
                </UTooltip>
            </div>
            <pre
                ref="preRef"
                class="export-code-block__pre"><code class="export-code-block__code">{{ exportOutput }}</code></pre>
        </div>
    </section>
</template>

<script setup lang="ts">
import { useUserExport } from "~/composables/output/useUserExport";

const { exportOutput, downloadFilename, copyToClipboard, downloadFile } = useUserExport();

const preRef = ref<HTMLElement | null>(null);
const copyFeedback = ref(false);

const isSelected = ref(false);

function toggleSelectAll() {
    if (!preRef.value) return;
    const sel = window.getSelection();

    if (isSelected.value) {
        sel?.removeAllRanges();
        isSelected.value = false;
        return;
    }

    const range = document.createRange();
    range.selectNodeContents(preRef.value);
    sel?.removeAllRanges();
    sel?.addRange(range);
    isSelected.value = true;
}

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
    display: flex;
    flex-direction: column;
    height: 100%;
    overflow: hidden;
}

.export-code-block__scroll-wrapper {
    position: relative;
    flex: 1;
    min-height: 0;
}

.export-code-block__actions {
    position: absolute;
    top: 4px;
    right: 19px;
    display: flex;
    gap: 2px;
    z-index: 1;
}

.export-code-block__pre {
    height: 100%;
    overflow: auto;
    margin: 0;
    padding: 12px 16px;
    font-size: 12px;
    line-height: 1.6;
    border-radius: 5px;
    background: var(--ui-color-neutral-950);
    border: 1px solid var(--ui-border);
}

.export-code-block__code {
    font-family: var(--font-mono, ui-monospace, monospace);
    white-space: pre;
    color: var(--ui-color-neutral-200);
}
</style>
