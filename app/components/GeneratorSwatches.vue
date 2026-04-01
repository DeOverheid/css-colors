<template>
    <section
        ref="containerRef"
        class="swatches-preview panel">
        <!-- Chromatic section: 17 slots -->
        <div
            class="swatch-section swatch-section--chromatic"
            :style="{ height: chromaticHeight + 'px' }">
            <!-- Adjustment steps: 12 hue rows -->
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

            <!-- Normal steps: up to 17 chromatic slots -->
            <template v-else>
                <template
                    v-for="row in chromaticSlots"
                    :key="row.slotIndex">
                    <div
                        v-if="row.visible"
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
                    <div
                        v-else
                        class="swatch-row swatch-row--empty"
                        :style="{ height: rowHeight + 'px' }" />
                </template>
            </template>
        </div>

        <!-- 10px gap -->
        <div class="swatch-section-gap" />

        <!-- Grey section: 5 slots -->
        <div class="swatch-section swatch-section--grey" :style="{ height: greyHeight + 'px' }">
            <!-- Adjustment steps: neutral only -->
            <template v-if="isAdjustmentStep">
                <div
                    v-if="isUnlocked('neutral')"
                    class="swatch-row swatch__row swatch__row--neutral"
                    :style="{ height: rowHeight + 'px' }">
                    <div class="swatch-row-label swatch__label">
                        Neutral
                    </div>
                    <ColorSwatchRow
                        :hue="hue"
                        :saturation="0"
                        :lightness-steps="greyLightnessSteps"
                        :total-steps="totalSteps"
                        class="swatch-row-swatches" />
                </div>
                <div
                    v-else
                    class="swatch-row swatch-row--empty"
                    :style="{ height: rowHeight + 'px' }" />
            </template>

            <!-- Normal steps: grey companion + neutral rows -->
            <template v-else>
                <template
                    v-for="slot in greySlots"
                    :key="slot.slotIndex">
                    <div
                        v-if="slot.visible"
                        class="swatch-row swatch__row"
                        :class="slot.isNeutral ? 'swatch__row--neutral' : 'swatch__row--grey'"
                        :style="{ height: rowHeight + 'px' }">
                        <div class="swatch-row-label swatch__label">
                            {{ slot.label }}
                        </div>
                        <ColorSwatchRow
                            :hue="slot.hue"
                            :saturation="slot.saturation"
                            :lightness-steps="greyLightnessSteps"
                            :total-steps="totalSteps"
                            class="swatch-row-swatches" />
                    </div>
                    <div
                        v-else
                        class="swatch-row swatch-row--empty"
                        :style="{ height: rowHeight + 'px' }" />
                </template>
            </template>
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

const { chromaticSlots: CHROMATIC_SLOTS, greySlots: GREY_SLOTS, totalSlots: TOTAL_SLOTS, gapPx: GAP_PX } = SWATCH_SLOT_CONFIG;

const containerRef = ref<HTMLElement | null>(null);
const containerHeight = ref(400);

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

// Measure container height with ResizeObserver
let containerObserver: ResizeObserver | null = null;
onMounted(() => {
    if (containerRef.value) {
        containerHeight.value = containerRef.value.clientHeight;
        containerObserver = new ResizeObserver((entries) => {
            const h = entries[0]?.contentRect.height;
            if (h && h > 0) containerHeight.value = h;
        });
        containerObserver.observe(containerRef.value);
    }
});

onUnmounted(() => {
    stopObserving();
    containerObserver?.disconnect();
});

const rowHeight = computed(() => Math.max(10, (containerHeight.value - GAP_PX) / TOTAL_SLOTS));
const chromaticHeight = computed(() => rowHeight.value * CHROMATIC_SLOTS);
const greyHeight = computed(() => rowHeight.value * GREY_SLOTS);

const props = defineProps<{
    hue: number;
    saturation: number;
    lightnessSteps: number[];
    totalSteps: number;
    targetLightness: number;
}>();

const { grayscaleLightnessSteps: greyLightnessSteps } = stepLightnessDistribution();

const { isUnlocked } = useSwatchUnlock();
const { orderedRows, greyCompanionRows, primaryGreyName, complementarySaturation } = useComplementaryColors();
const { activeStepId } = useStepNavigation();

const isAdjustmentStep = computed(() =>
    activeStepId.value === "lightness-adjustment" || activeStepId.value === "hue-adjustment"
);

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

const greySaturations = computed(() => greySaturationSteps(props.saturation, props.totalSteps));

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

/** 17 chromatic slots — filled rows placed at top, rest empty */
const chromaticSlots = computed(() => {
    const rows = chromaticRows.value;
    const slots: Array<{
        slotIndex: number;
        visible: boolean;
        rowId: string;
        hue: number;
        label: string;
        saturation: number;
    }> = [];
    for (let i = 0; i < CHROMATIC_SLOTS; i++) {
        const row = rows[i];
        if (row) {
            slots.push({ slotIndex: i, visible: true, ...row });
        } else {
            slots.push({ slotIndex: i, visible: false, rowId: "", hue: 0, label: "", saturation: 0 });
        }
    }
    return slots;
});

/** Grey companion rows data (only unlocked ones) */
const greyRowsData = computed(() => {
    const greyLabelByParent: Record<string, string> = {};
    for (const g of greyCompanionRows.value) {
        greyLabelByParent[g.parentId] = g.label;
    }

    const rows: Array<{ rowId: string; hue: number; label: string; isNeutral: boolean; saturation: number[] | number }> = [];

    for (const row of orderedRows.value) {
        if (!isUnlocked(row.rowId)) continue;
        rows.push({
            rowId: `${row.rowId}-grey`,
            hue: row.hue,
            label: row.rowId === "primary" ? primaryGreyName.value : (greyLabelByParent[row.rowId] ?? "Gray"),
            isNeutral: false,
            saturation: greySaturations.value
        });
    }

    if (isUnlocked("neutral")) {
        rows.push({
            rowId: "neutral",
            hue: props.hue,
            label: "Neutral",
            isNeutral: true,
            saturation: 0
        });
    }

    return rows;
});

/** 5 grey slots — filled rows placed at top, rest empty */
const greySlots = computed(() => {
    const rows = greyRowsData.value;
    const slots: Array<{
        slotIndex: number;
        visible: boolean;
        rowId: string;
        hue: number;
        label: string;
        isNeutral: boolean;
        saturation: number[] | number;
    }> = [];
    for (let i = 0; i < GREY_SLOTS; i++) {
        const row = rows[i];
        if (row) {
            slots.push({ slotIndex: i, visible: true, ...row });
        } else {
            slots.push({ slotIndex: i, visible: false, rowId: "", hue: 0, label: "", isNeutral: false, saturation: 0 });
        }
    }
    return slots;
});

const markedSampleLightness = computed(() => {
    const allLightnesses = [0, ...props.lightnessSteps, 100];
    return allLightnesses[markerIndex.value] ?? props.targetLightness;
});

defineExpose({ markedSampleLightness });
</script>

<style scoped>
.swatches-preview {
    grid-column: 2;
    grid-row: 2;
    display: flex;
    flex-direction: column;
    overflow: hidden;
}

.swatch-section {
    display: flex;
    flex-direction: column;
    flex-shrink: 0;
}

.swatch-section-gap {
    height: 10px;
    flex-shrink: 0;
}

.swatch-row {
    display: grid;
    grid-template-columns: var(--label-column-width, 80px) 1fr var(--label-column-width, 80px);
    gap: 1rem;
    align-items: center;
}

.swatch-row--empty {
    display: block;
}

.swatch-row-label {
    font-family: var(--font-family-header);
    font-weight: 600;
    color: var(--ui-text-muted);
}

.swatch-row-label--primary {
    font-weight: 700;
    color: var(--ui-text);
}

.swatch-row-value {
    font-family: var(--font-family-header);
    font-weight: 600;
    font-variant-numeric: tabular-nums;
    text-align: right;
    color: var(--ui-text-muted);
}

.swatch-row-swatches {
    width: 100%;
}

@media (max-width: 1024px) {
    .swatches-preview {
        grid-column: 1;
        grid-row: 2;
        height: auto;
    }
}
</style>
