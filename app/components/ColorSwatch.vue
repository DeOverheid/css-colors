<template>
    <div
        v-hover-popup="tooltipHtml"
        class="color-swatch swatch"
        :style="{
            backgroundColor: hslColor
        }"
        @click="handleCopy">
        <span
            v-if="copied"
            class="swatch__copy-feedback">
            Copied!
        </span>
    </div>
</template>

<script setup lang="ts">
import { useHoverPopup } from "~/composables/ui/useHoverPopup";
import { useClickToCopy } from "~/composables/ui/useClickToCopy";

const vHoverPopup = useHoverPopup();
const { copied, copyText } = useClickToCopy();

const props = defineProps<{
    hue: number;
    saturation: number;
    lightness: number;
}>();

const hslColor = computed(() =>
    `hsl(${props.hue}, ${props.saturation}%, ${props.lightness}%)`
);

const tooltipHtml = computed(() =>
    `<strong>H:</strong> ${props.hue}° <strong>S:</strong> ${props.saturation}% <strong>L:</strong> ${props.lightness}%`
);

function handleCopy() {
    copyText(hslColor.value);
}
</script>

<style scoped>
.color-swatch {
    width: 100%;
    aspect-ratio: 1;
    cursor: pointer;
    position: relative;
}

.swatch__copy-feedback {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    font-size: 0.5rem;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    background: rgba(0, 0, 0, 0.7);
    color: white;
    padding: 0.125rem 0.375rem;
    border-radius: 3px;
    white-space: nowrap;
    pointer-events: none;
}
</style>
