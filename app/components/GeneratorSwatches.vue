<template>
    <section
        ref="containerRef"
        class="panel panel--preview">
        <div
            v-show="containerHeight > 0"
            class="swatches-preview">
            <!-- Chromatic section -->
            <div
                class="swatch-section swatch-section--chromatic"
                :style="isStep1 ? { minHeight: (rowHeight * 3) + 'px' } : undefined">
                <!-- Adjustment steps: all hue rows -->
                <template v-if="isAdjustmentStep">
                    <div
                        v-for="(row, idx) in adjustmentHueRows"
                        :ref="setSwatchRowRef(idx)"
                        :key="row.hue"
                        class="swatch-row swatch__row swatch__row--chromatic"
                        :style="{ height: rowHeight + 'px' }">
                        <div
                            class="swatch-row-label swatch__label"
                            :class="{ 'swatch-row-label--primary': row.isPrimary }">
                            {{ row.label }}
                        </div>
                        <ColorSwatchRow
                            :hue="row.hue"
                            :saturation="saturation"
                            :lightness-steps="lightnessSteps"
                            :total-steps="totalSteps"
                            :show-marker="false"
                            class="swatch-row-swatches" />
                        <div class="swatch-row-value swatch__value">
                            {{ row.hue }}°
                        </div>
                    </div>
                </template>

                <!-- Normal steps: visible chromatic rows only -->
                <template v-else>
                    <div
                        v-for="row in chromaticRows"
                        :key="row.rowId"
                        class="swatch-row swatch__row swatch__row--chromatic"
                        :style="{ height: rowHeight + 'px' }">
                        <div class="swatch-row-label swatch__label">
                            {{ row.label }}
                        </div>
                        <ColorSwatchRow
                            :hue="row.hue"
                            :saturation="row.saturation"
                            :lightness-steps="lightnessSteps"
                            :total-steps="totalSteps"
                            :show-marker="false"
                            class="swatch-row-swatches" />
                        <div class="swatch-row-value swatch__value">
                            {{ row.hue }}°
                        </div>
                    </div>
                </template>
            </div>

            <!-- Grey section -->
            <div class="swatch-section swatch-section--grey">
                <div v-for="row in greyRowsData" :key="row.rowId" class="swatch-row swatch__row" :class="row.isNeutral ? 'swatch__row--neutral' : 'swatch__row--grey'" :style="{ height: rowHeight + 'px' }">
                    <div class="swatch-row-label swatch__label">
                        {{ row.label }}
                    </div>
                    <ColorSwatchRow :hue="row.hue" :saturation="row.saturation" :lightness-steps="greyLightnessSteps" :total-steps="totalSteps" skip-adjustment class="swatch-row-swatches" />
                </div>
            </div>
        </div>
    </section>
</template>

<script setup lang="ts">
import { findClosestLightnessIndex } from "~/composables/utils/lightnessIndex";
import { useSwatchUnlock } from "~/composables/steps/useSwatchUnlock";
import { useComplementaryColors } from "~/composables/input/useComplementaryColors";
import { greySaturationSteps } from "~/composables/utils/greySaturation";
import { stepLightnessDistribution } from "~/composables/input/stepLightnessDistribution";
import { useStepNavigation } from "~/composables/steps/useStepNavigation";
import { observeSwatchRow, stopObserving } from "~/composables/ui/useSwatchRowHeight";
import { getChromaticEntriesForTheme } from "~/composables/utils/hueShiftDefaults";
import { useThemes } from "~/composables/themes";
import { SWATCH_SLOT_CONFIG } from "~/composables/utils/swatchSlotConfig";

const { maxVisibleRows: MAX_VISIBLE_ROWS } = SWATCH_SLOT_CONFIG;

const containerRef = ref<HTMLElement | null>(null);
const containerHeight = ref(0);

const swatchRowRef = ref<HTMLElement | null>(null);

function setSwatchRowRef(idx: number) {
    return (el: Element | ComponentPublicInstance | null) => {
        if (idx === 0) swatchRowRef.value = el as HTMLElement | null;
    };
}

watch(swatchRowRef, (el) => {
    if (el) observeSwatchRow(el);
    else stopObserving();
});

// Measure container height once on mount; overflow:hidden prevents content feedback loop
onMounted(() => {
    if (containerRef.value) {
        containerHeight.value = containerRef.value.clientHeight;
    }
});

onUnmounted(() => {
    stopObserving();
});

const rowHeight = computed(() => Math.max(10, (containerHeight.value - 30) / MAX_VISIBLE_ROWS));

const props = defineProps<{
    hue: number;
    saturation: number;
    lightnessSteps: number[];
    totalSteps: number;
    targetLightness: number;
}>();

const { grayscaleLightnessSteps: greyLightnessSteps } = stepLightnessDistribution();

const { isUnlocked } = useSwatchUnlock();
const { orderedRows, greyCompanionRows, primaryGreyName, complementarySaturation, uiToneSource } = useComplementaryColors();
const { activeStepId } = useStepNavigation();

const isAdjustmentStep = computed(() =>
    activeStepId.value === "lightness-adjustment" || activeStepId.value === "hue-adjustment"
);

const isStep1 = computed(() => activeStepId.value === "primary-color");

const { currentTheme } = useThemes();

const adjustmentHueRows = computed(() => {
    const entries = getChromaticEntriesForTheme(currentTheme.value.id);
    const primaryHue = props.hue % 360;
    // Find which entry is closest to the user's primary hue
    let primaryIdx = 0;
    let bestDist = Infinity;
    for (let i = 0; i < entries.length; i++) {
        const d = Math.abs(entries[i]!.baseHue - primaryHue);
        const dist = d > 180 ? 360 - d : d;
        if (dist < bestDist) {
            bestDist = dist;
            primaryIdx = i;
        }
    }
    return entries.map((entry, idx) => ({
        hue: idx === primaryIdx ? primaryHue : entry.baseHue,
        isPrimary: idx === primaryIdx,
        label: entry.name.charAt(0).toUpperCase() + entry.name.slice(1)
    }));
});

const markerIndex = computed(() => {
    const baseIndex = findClosestLightnessIndex(props.lightnessSteps, props.targetLightness);
    return Math.max(0, baseIndex - 1);
});

const greySaturations = computed(() => greySaturationSteps(
    props.saturation,
    props.totalSteps,
    currentTheme.value.greySaturationMax ?? 25,
    currentTheme.value.greySaturationMin ?? 3
));

const chromaticLabels: Record<string, string> = {
    primary: "Primary",
    secondary: "Secondary",
    tertiary: "Tertiary"
};

/** Chromatic rows data (only unlocked ones) */
const chromaticRows = computed(() =>
    orderedRows.value
        .filter(row => isUnlocked(row.rowId))
        .map(row => ({
            rowId: row.rowId,
            hue: row.hue,
            label: chromaticLabels[row.rowId] ?? row.rowId,
            saturation: row.rowId === "primary" ? props.saturation : complementarySaturation.value
        }))
);

/** Grey companion rows data (only unlocked ones) — neutral always on top */
const greyRowsData = computed(() => {
    const greyLabelByParent: Record<string, string> = {};
    for (const g of greyCompanionRows.value) {
        greyLabelByParent[g.parentId] = g.label;
    }

    const rows: Array<{ rowId: string; hue: number; label: string; isNeutral: boolean; saturation: number[] | number }> = [];

    // Neutral always first
    if (isUnlocked("neutral")) {
        rows.push({
            rowId: "neutral",
            hue: props.hue,
            label: "Neutral",
            isNeutral: true,
            saturation: 0
        });
    }

    // Grey companions below neutral
    const stepId = activeStepId.value;
    const isStep2 = stepId === "complementary-colors";
    for (const row of orderedRows.value) {
        if (!isUnlocked(row.rowId)) continue;
        // Step 1: only show primary grey
        if (isStep1.value) {
            if (row.rowId !== "primary") continue;
            // Step 2: show all companion greys
        } else if (!isStep2) {
            // All other steps: only show the one matching uiToneSource (hide all if "neutral")
            if (uiToneSource.value === "neutral" || row.rowId !== uiToneSource.value) continue;
        }
        const greyLabels: Record<string, string> = { primary: "Grey-P", secondary: "Grey-S", tertiary: "Grey-T" };
        rows.push({
            rowId: `${row.rowId}-grey`,
            hue: row.hue,
            label: (isStep1.value || isStep2) ? (greyLabels[row.rowId] ?? "Grey") : "Grey",
            isNeutral: false,
            saturation: greySaturations.value
        });
    }

    return rows;
});

const markedSampleLightness = computed(() => {
    const allLightnesses = [0, ...props.lightnessSteps, 100];
    return allLightnesses[markerIndex.value] ?? props.targetLightness;
});

defineExpose({ markedSampleLightness });
</script>

<style scoped>
.panel--preview {
    overflow: hidden;
}

.swatches-preview {
    display: flex;
    flex-direction: column;
    gap: 10px;
}

.swatch-section {}

.swatch-row {
    display: grid;
    font-family: var(--font-family-header);
    grid-template-columns: var(--label-column-width, 80px) 1fr var(--label-column-width, 80px);
    align-items: center;
}

.swatch-row:first-child .swatch-row-swatches {
    border-top-left-radius: 5px;
    border-top-right-radius: 5px;
    overflow: hidden;
}

.swatch-row:last-child .swatch-row-swatches {
    border-bottom-left-radius: 5px;
    border-bottom-right-radius: 5px;
    overflow: hidden;
}

.swatch-row-label {}

.swatch-row-label--primary {
    font-weight: 800;
}

.swatch-row-value {
    font-variant-numeric: tabular-nums;
    text-align: right;
}

.swatch-row-swatches {
    width: 100%;
}
</style>
