<template>
    <code
        class="click-to-copy"
        :class="{ 'click-to-copy--copied': copied }"
        :title="copied ? 'Copied!' : 'Click to copy'"
        @click="handleCopy"
    >
        <slot />
        <span
            v-if="copied"
            class="click-to-copy__feedback"
        >
            Copied!
        </span>
    </code>
</template>

<script setup lang="ts">
import { useClickToCopy } from "~/composables/ui/useClickToCopy";

const props = defineProps<{
    value: string;
}>();

const { copied, copyText } = useClickToCopy();

function handleCopy() {
    copyText(props.value);
}
</script>

<style scoped>
.click-to-copy {
    cursor: pointer;
    position: relative;
    transition: background-color 0.15s, color 0.15s;
    font-family: ui-monospace, SFMono-Regular, monospace;
    background: var(--ui-bg-accented);
    padding: 5px 5px;
    border-radius: 4px;
}

.click-to-copy:hover {
    background: var(--ui-bg-elevated);
}

.click-to-copy--copied {
    background: var(--ui-success, #22c55e);
    color: white;
}

.click-to-copy__feedback {
    position: absolute;
    top: -1.75rem;
    left: 50%;
    transform: translateX(-50%);
    font-size: 0.625rem;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    background: var(--ui-success, #22c55e);
    color: white;
    padding: 5px 5px;
    border-radius: 3px;
    white-space: nowrap;
    pointer-events: none;
}
</style>
