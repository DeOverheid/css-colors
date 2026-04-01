<template>
    <div class="hue-shift-sliders">
        <div
            v-for="row in hueRows"
            :key="row"
            class="hue-shift-slider-row">
            <input
                type="range"
                :value="getOffset(row)"
                :min="-maxOffset"
                :max="maxOffset"
                step="1"
                class="hue-shift-slider"
                :style="trackStyle(row)"
                :title="formatOffset(getOffset(row))"
                @input="emitOffset(row, Number(($event.target as HTMLInputElement).value))">
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
}>();

const emit = defineEmits<{
    (e: "update:offset", hue: number, value: number): void;
}>();

const maxOffset = 30;

function emitOffset(hue: number, value: number) {
    emit("update:offset", hue, value);
}

function trackStyle(hue: number) {
    const sat = props.saturation;
    const l = props.trackLightness;
    const left = `hsl(${(hue - 30 + 360) % 360}, ${sat}%, ${l}%)`;
    const mid = `hsl(${hue}, ${sat}%, ${l}%)`;
    const right = `hsl(${(hue + 30) % 360}, ${sat}%, ${l}%)`;
    return {
        "background": `linear-gradient(to right, ${left}, ${mid}, ${mid}, ${right})`,
        "--handle-hue-color": `hsl(${hue}, ${sat}%, 55%)`
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

.hue-shift-slider {
    flex: 1;
    min-width: 0;
    height: 6px;
    -webkit-appearance: none;
    appearance: none;
    border-radius: 3px;
    outline: none;
}

.hue-shift-slider::-webkit-slider-thumb {
    -webkit-appearance: none;
    appearance: none;
    width: 14px;
    height: 14px;
    border-radius: 50%;
    background: var(--handle-hue-color);
    border: 2px solid white;
    cursor: pointer;
    box-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);
}

.hue-shift-slider::-moz-range-thumb {
    width: 14px;
    height: 14px;
    border-radius: 50%;
    background: var(--handle-hue-color);
    border: 2px solid white;
    cursor: pointer;
    box-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);
}
</style>
