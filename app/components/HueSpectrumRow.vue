<template>
    <div class="hue-spectrum-row">
        <!-- Dark offset slider -->
        <div class="slider-column">
            <label :for="`dark-offset-${entry.name}`">
                {{ entry.name }} dark
            </label>
            <input
                :id="`dark-offset-${entry.name}`"
                type="range"
                :value="darkOffset"
                :min="offsetRange.min"
                :max="offsetRange.max"
                class="offset-slider"
                @input="$emit('update:darkOffset', Number(($event.target as HTMLInputElement).value))">
        </div>

        <!-- Dark offset value -->
        <span class="offset-value">{{ formatOffset(darkOffset) }}</span>

        <!-- Middle column: Color swatches -->
        <div class="swatches-column">
            <div class="swatches-row">
                <ColorSwatch
                    v-for="(step, index) in lightnessSteps"
                    :key="index"
                    :hue="getHueForStep(index)"
                    :saturation="getAdjustedSaturation(index)"
                    :lightness="getAdjustedLightness(step)" />
            </div>
        </div>

        <!-- Light offset value -->
        <span class="offset-value">{{ formatOffset(lightOffset) }}</span>

        <!-- Light offset slider -->
        <div class="slider-column">
            <label :for="`light-offset-${entry.name}`">
                {{ entry.name }} light
            </label>
            <input
                :id="`light-offset-${entry.name}`"
                type="range"
                :value="lightOffset"
                :min="offsetRange.min"
                :max="offsetRange.max"
                class="offset-slider"
                @input="$emit('update:lightOffset', Number(($event.target as HTMLInputElement).value))">
        </div>
    </div>
</template>

<script setup lang="ts">
import type { HueEntry } from "~/composables/input/stepHueSpectrum";

const props = defineProps<{
    entry: HueEntry;
    lightOffset: number;
    darkOffset: number;
    saturation: number;
    lightnessSteps: number[];
    offsetRange: { min: number; max: number };
}>();

defineEmits<{
    "update:lightOffset": [value: number];
    "update:darkOffset": [value: number];
}>();

const totalSteps = computed(() => props.lightnessSteps.length);

/**
 * Calculate the hue for a specific step
 * Blends from darkOffset (dark side) to lightOffset (light side)
 */
function getHueForStep(index: number): number {
    // Calculate blend factor: 0 = dark side, 1 = light side
    const blendFactor = totalSteps.value > 1
        ? index / (totalSteps.value - 1)
        : 0.5;

    // Interpolate between dark and light offsets
    const offset = props.darkOffset + (props.lightOffset - props.darkOffset) * blendFactor;

    // Apply offset to base hue and normalize to 0-360
    let hue = props.entry.baseHue + offset;
    while (hue < 0) hue += 360;
    while (hue >= 360) hue -= 360;

    return hue;
}

/**
 * Format offset value for display
 */
function formatOffset(value: number): string {
    const rounded = Math.round(value);
    if (rounded > 0) return `+${rounded}°`;
    if (rounded < 0) return `${rounded}°`;
    return "0°";
}

/**
 * Adjust lightness based on entry's lightnessOffset (relative/percentage)
 * Applies offset scaled by distance from extremes (more at middle, less at edges)
 * Offset is relative: +10 means 10% brighter, -10 means 10% darker
 */
function getAdjustedLightness(lightness: number): number {
    const offset = props.entry.lightnessOffset ?? 0;
    if (offset === 0) return lightness;

    // Scale offset based on distance from extremes (0 and 100)
    // Maximum effect at lightness 50, tapering to 0 at extremes
    const distanceFromExtreme = Math.min(lightness, 100 - lightness) / 50;

    // Apply offset as relative percentage
    const multiplier = 1 + (offset / 100) * distanceFromExtreme;

    return Math.max(0, Math.min(100, lightness * multiplier));
}

/**
 * Adjust saturation based on entry's saturationLightOffset and saturationDarkOffset (relative/percentage)
 * Interpolates from dark offset (index 0) to light offset (last index)
 * Offsets are relative: +6 means 6% more saturated, -19 means 19% less saturated
 */
function getAdjustedSaturation(index: number): number {
    const lightOffset = props.entry.saturationLightOffset ?? 0;
    const darkOffset = props.entry.saturationDarkOffset ?? 0;

    // No adjustment needed if both offsets are 0
    if (lightOffset === 0 && darkOffset === 0) return props.saturation;

    // Calculate blend factor: 0 = dark side (index 0), 1 = light side (last index)
    const blendFactor = totalSteps.value > 1
        ? index / (totalSteps.value - 1)
        : 0.5;

    // Interpolate between dark and light saturation offsets (relative percentages)
    const offsetPercent = darkOffset + (lightOffset - darkOffset) * blendFactor;

    // Apply as relative multiplier: +6 means 1.06x, -19 means 0.81x
    const multiplier = 1 + offsetPercent / 100;

    return Math.max(0, Math.min(100, props.saturation * multiplier));
}
</script>

<style scoped>
.hue-spectrum-row {
    display: grid;
    grid-template-columns: 100px 40px 1fr 40px 100px;
    gap: 0.25rem;
    align-items: center;
}

.slider-column {
    display: flex;
    flex-direction: column;
}

.slider-column label {
    font-size: 0.625rem;
    opacity: 0.7;
    text-transform: capitalize;
}

.offset-slider {
    width: 100%;
}

.offset-value {
    font-size: 0.625rem;
    font-variant-numeric: tabular-nums;
    text-align: center;
}

.swatches-column {
    display: flex;
    flex-direction: column;
}

.swatches-row {
    display: flex;
    gap: 0;
}

.swatches-row :deep(.color-swatch) {
    flex: 1;
    aspect-ratio: 2 / 1;
    min-width: 0;
}
</style>
