<template>
    <div class="color-swatch-row swatch__row">
        <!-- Pure black (L: 0) -->
        <ColorSwatch
            :hue="swatchHues[0] ?? hue"
            :saturation="satValues[0] ?? 0"
            :lightness="adjustedLightness[0] ?? 0"
            :dot-color="dotColors[0]"
            :class="['swatch__cell swatch__cell--black', { 'marked': showMarker && markerIndex === 0, 'swatch__cell--marked': showMarker && markerIndex === 0 }]" />

        <!-- Steps from bezier curve -->
        <ColorSwatch
            v-for="(_, index) in lightnessSteps"
            :key="`step-${index}`"
            :hue="swatchHues[index + 1] ?? hue"
            :saturation="satValues[index + 1] ?? 0"
            :lightness="adjustedLightness[index + 1] ?? 0"
            :dot-color="dotColors[index + 1]"
            :class="['swatch__cell', { 'marked': showMarker && markerIndex === index + 1, 'swatch__cell--marked': showMarker && markerIndex === index + 1 }]" />

        <!-- Pure white (L: 100) -->
        <ColorSwatch
            :hue="swatchHues[totalSteps - 1] ?? hue"
            :saturation="satValues[totalSteps - 1] ?? 0"
            :lightness="adjustedLightness[totalSteps - 1] ?? 100"
            :dot-color="dotColors[totalSteps - 1]"
            :class="['swatch__cell swatch__cell--white', { 'marked': showMarker && markerIndex === totalSteps - 1, 'swatch__cell--marked': showMarker && markerIndex === totalSteps - 1 }]" />
    </div>
</template>

<script setup lang="ts">
import { useLightnessAdjustment } from "~/composables/input/stepLightnessAdjustment";
import { useHueShift } from "~/composables/input/stepHueShift";
import { hslToRgb, contrastRatioRgb } from "~/composables/utils/wcagContrast";
import { useDevMode } from "~/composables/ui/useDevMode";

const props = defineProps<{
    hue: number;
    /** Single saturation value (applied to all swatches) or per-swatch array (length = totalSteps) */
    saturation: number | number[];
    lightnessSteps: number[];
    totalSteps: number;
    showMarker?: boolean;
    markerIndex?: number;
    /** When true, lightness adjustment is not applied (used for grey rows) */
    skipAdjustment?: boolean;
}>();

const { applyAdjustment } = useLightnessAdjustment();
const { getHueForSwatch } = useHueShift();
const { isDevModeEnabled } = useDevMode();

/** Per-swatch hue values with hue shift applied */
const swatchHues = computed((): number[] =>
    Array.from({ length: props.totalSteps }, (_, i) =>
        getHueForSwatch(props.hue, i, props.totalSteps)
    )
);

/** Resolved per-swatch saturation values */
const satValues = computed((): number[] => {
    if (Array.isArray(props.saturation)) {
        return props.saturation;
    }
    return Array(props.totalSteps).fill(props.saturation);
});

/** All lightness values with adjustment applied: [0, ...steps, 100] */
const adjustedLightness = computed((): number[] => {
    const allBase = [0, ...props.lightnessSteps, 100];
    if (props.skipAdjustment) return allBase;
    const lastIndex = allBase.length - 1;
    return allBase.map((baseLightness, index) => {
        if (index === 0 || index === lastIndex) return baseLightness;
        return applyAdjustment(baseLightness, swatchHues.value[index] ?? props.hue, index, props.totalSteps);
    });
});

/** WCAG AA (4.5:1) contrast dots — test dark shades against swatch-50, light shades against swatch-950 */
const WCAG_AA = 4.5;
const dotColors = computed((): (string | null)[] => {
    if (!isDevModeEnabled.value) return Array(props.totalSteps).fill(null);

    const hues = swatchHues.value;
    const sats = satValues.value;
    const lights = adjustedLightness.value;
    const n = props.totalSteps;

    // Midpoint index: for 13-step theme, shades [0..6] are dark side, [7..12] are light side
    const mid = Math.floor(n / 2);

    // Reference colors: shade-50 (second-to-last) and shade-950 (second)
    const ref50 = hslToRgb(hues[n - 2] ?? 0, sats[n - 2] ?? 0, lights[n - 2] ?? 95);
    const ref950 = hslToRgb(hues[1] ?? 0, sats[1] ?? 0, lights[1] ?? 5);

    return Array.from({ length: n }, (_, i) => {
        const rgb = hslToRgb(hues[i] ?? 0, sats[i] ?? 0, lights[i] ?? 0);
        if (i <= mid) {
            // Dark swatch: test against shade-50 (light reference), show white-ish dot
            const ratio = contrastRatioRgb(rgb[0], rgb[1], rgb[2], ref50[0], ref50[1], ref50[2]);
            return ratio >= WCAG_AA ? `rgb(${ref50[0]},${ref50[1]},${ref50[2]})` : null;
        } else {
            // Light swatch: test against shade-950 (dark reference), show dark dot
            const ratio = contrastRatioRgb(rgb[0], rgb[1], rgb[2], ref950[0], ref950[1], ref950[2]);
            return ratio >= WCAG_AA ? `rgb(${ref950[0]},${ref950[1]},${ref950[2]})` : null;
        }
    });
});
</script>

<style scoped>
.color-swatch-row {
    display: grid;
    grid-template-columns: repeat(v-bind(totalSteps), 1fr);
    gap: 0;
    width: 100%;
    height: 100%;
}

.color-swatch-row :deep(.marked) {
    outline: 3px solid var(--ui-primary);
    outline-offset: -3px;
    z-index: 1;
    position: relative;
}
</style>
