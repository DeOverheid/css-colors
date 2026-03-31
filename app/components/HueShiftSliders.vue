<template>
    <div class="hue-shift-sliders">
        <div
            v-for="row in hueRows"
            :key="row"
            class="hue-shift-slider-row"
        >
            <input
                type="range"
                :value="getOffset(row)"
                :min="-maxOffset"
                :max="maxOffset"
                step="1"
                class="hue-shift-slider"
                :style="{ '--handle-hue-color': hueColor(row) }"
                @input="emitOffset(row, Number(($event.target as HTMLInputElement).value))"
            >
            <span class="hue-shift-value">{{ formatOffset(getOffset(row)) }}</span>
        </div>
    </div>
</template>

<script setup lang="ts">
defineProps<{
    /** The 12 hue values matching the swatch rows */
    hueRows: number[];
    /** 'dark' or 'light' side */
    side: "dark" | "light";
    /** Function to get the current offset for a hue row */
    getOffset: (hue: number) => number;
}>();

const emit = defineEmits<{
    (e: "update:offset", hue: number, value: number): void;
}>();

const maxOffset = 30;

function emitOffset(hue: number, value: number) {
    emit("update:offset", hue, value);
}

function hueColor(hue: number): string {
    return `hsl(${hue}, 70%, 55%)`;
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
}

.hue-shift-slider-row {
    display: flex;
    align-items: center;
    gap: 0.25rem;
    height: var(--swatch-row-height, 28px);
}

.hue-shift-slider {
    flex: 1;
    height: 6px;
    -webkit-appearance: none;
    appearance: none;
    border-radius: 3px;
    outline: none;
    background: linear-gradient(
        to right,
        var(--handle-hue-color),
        var(--ui-bg-muted, #e5e5e5) 50%,
        var(--handle-hue-color)
    );
    opacity: 0.6;
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

.hue-shift-value {
    font-size: 0.625rem;
    font-variant-numeric: tabular-nums;
    white-space: nowrap;
    width: 2.5rem;
    text-align: right;
    opacity: 0.6;
}
</style>
