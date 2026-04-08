<template>
    <div
        v-hover-popup="tooltipHtml"
        class="color-swatch swatch"
        :style="{
            backgroundColor: hslColor
        }"
        @click="handleCopy">
        <span
            v-if="dotColor"
            class="swatch__dot"
            :style="{ backgroundColor: dotColor }" />
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
    dotColor?: string | null;
}>();

function fmt(n: number) {
    return Number.isInteger(n) ? String(n) : n.toFixed(1);
}

const hslColor = computed(() =>
    `hsl(${fmt(props.hue)}, ${fmt(props.saturation)}%, ${fmt(props.lightness)}%)`
);

const tooltipHtml = computed(() =>
    `<strong>H:</strong> ${fmt(props.hue)}° <strong>S:</strong> ${fmt(props.saturation)}% <strong>L:</strong> ${fmt(props.lightness)}%`
);

function handleCopy() {
    copyText(hslColor.value);
}
</script>

<style scoped>
.color-swatch {
    width: 100%;
    height: 100%;
    cursor: pointer;
    position: relative;
}

.swatch__dot {
    position: absolute;
    top: 50%;
    left: 50%;
    width: 6px;
    height: 6px;
    border-radius: 50%;
    transform: translate(-50%, -50%);
    pointer-events: none;
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
    padding: 5px 5px;
    border-radius: 3px;
    white-space: nowrap;
    pointer-events: none;
}
</style>
