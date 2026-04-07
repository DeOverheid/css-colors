<template>
    <div class="hue-shift-sliders">
        <div
            v-for="row in hueRows"
            :key="row"
            class="hue-shift-slider-row">
            <TooltipSlider
                :model-value="getOffset(row)"
                :min="-maxOffset"
                :max="maxOffset"
                :step="1"
                :display-value="formatOffset(getOffset(row))"
                :style="sliderStyle(row)"
                :disabled="disabled"
                @update:model-value="emitOffset(row, $event)" />
        </div>
    </div>
</template>

<script setup lang="ts">
import { useSwatchRowHeight } from "~/composables/ui/useSwatchRowHeight";

const swatchRowHeight = useSwatchRowHeight();

const props = defineProps<{
    /** The 12 hue values matching the swatch rows */
    hueRows: number[];
    /** 'dark' or 'light' side */
    side: "dark" | "light";
    /** Function to get the current offset for a hue row */
    getOffset: (hue: number) => number;
    /** User-set saturation (0-100) */
    saturation: number;
    /** Fixed lightness for all slider tracks (e.g. 800-swatch lightness for dark, 200-swatch for light) */
    trackLightness: number;
    /** Disable all sliders (read-only, muted visuals) */
    disabled?: boolean;
}>();

const emit = defineEmits<{
    (e: "update:offset", hue: number, value: number): void;
}>();

const maxOffset = 30;

function emitOffset(hue: number, value: number) {
    emit("update:offset", hue, value);
}

function sliderStyle(hue: number) {
    const sat = props.saturation;
    const l = props.trackLightness;
    const left = `hsl(${(hue - 30 + 360) % 360}, ${sat}%, ${l}%)`;
    const mid = `hsl(${hue}, ${sat}%, ${l}%)`;
    const right = `hsl(${(hue + 30) % 360}, ${sat}%, ${l}%)`;
    return {
        '--track-background': `linear-gradient(to right, ${left}, ${mid}, ${mid}, ${right})`,
        '--thumb-color': `hsl(${hue}, ${sat}%, 55%)`
    };
}

function formatOffset(value: number): string {
    if (value > 0) return `+${value}°`;
    if (value < 0) return `${value}°`;
    return "0°";
}
</script>

<style scoped>
.hue-shift-sliders {
    display: flex;
    flex-direction: column;
    gap: 0;
    width: 100%;
    max-width: 100%;
}

.hue-shift-slider-row {
    display: flex;
    align-items: center;
    height: v-bind(swatchRowHeight + 'px');
    max-width: 100%;
}
</style>
