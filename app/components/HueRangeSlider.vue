<template>
    <div
        ref="trackRef"
        class="hue-range-slider"
        @pointerdown="onTrackPointerDown"
    >
        <!-- Track background: vertical hue gradient matching swatch rows -->
        <div class="hue-range-track">
            <!-- Active zone highlight between falloff handles -->
            <div
                class="hue-range-zone"
                :style="zoneStyle"
            />
        </div>

        <!-- Falloff handle (top) -->
        <div
            class="hue-range-handle hue-range-handle--falloff"
            :style="{ 'top': falloffTopPx + 'px', '--handle-hue-color': hueColorAt(falloffTopHue) }"
            @pointerdown.stop="startDrag('falloff-top', $event)"
        >
            <div class="hue-range-handle-thumb" />
        </div>

        <!-- Center handle -->
        <div
            class="hue-range-handle hue-range-handle--center"
            :style="{ 'top': centerPx + 'px', '--handle-hue-color': hueColorAt(centerHue) }"
            @pointerdown.stop="startDrag('center', $event)"
        >
            <div class="hue-range-handle-thumb" />
        </div>

        <!-- Mirror handle (bottom) -->
        <div
            class="hue-range-handle hue-range-handle--falloff"
            :style="{ 'top': falloffBottomPx + 'px', '--handle-hue-color': hueColorAt(falloffBottomHue) }"
            @pointerdown.stop="startDrag('falloff-bottom', $event)"
        >
            <div class="hue-range-handle-thumb" />
        </div>
    </div>
</template>

<script setup lang="ts">
const props = defineProps<{
    /** The 12 hue values in order (top to bottom) */
    hueRows: number[];
    /** Center hue of the effect (degrees) */
    centerHue: number;
    /** Falloff span in degrees from center to zero-boundary */
    falloffSpan: number;
}>();

const emit = defineEmits<{
    (e: "update:centerHue" | "update:falloffSpan", value: number): void;
}>();

const trackRef = ref<HTMLElement | null>(null);
const dragging = ref<"center" | "falloff-top" | "falloff-bottom" | null>(null);

const totalHueSpan = 360;

/** Convert a hue value to pixel position within the track */
function hueToPx(hue: number): number {
    if (!trackRef.value) return 0;
    const trackHeight = trackRef.value.clientHeight;
    const firstHue = props.hueRows[0] ?? 0;
    // Distance from first row's hue, wrapping around 360
    const dist = ((hue - firstHue) % totalHueSpan + totalHueSpan) % totalHueSpan;
    return (dist / totalHueSpan) * trackHeight;
}

/** Convert a pixel position to hue value */
function pxToHue(px: number): number {
    if (!trackRef.value) return 0;
    const trackHeight = trackRef.value.clientHeight;
    const firstHue = props.hueRows[0] ?? 0;
    const fraction = Math.max(0, Math.min(1, px / trackHeight));
    return (firstHue + fraction * totalHueSpan) % 360;
}

/** Pixel position of center handle */
const centerPx = computed(() => hueToPx(props.centerHue));

/** Top falloff hue: center - falloffSpan (wrapped) */
const falloffTopHue = computed(() =>
    ((props.centerHue - props.falloffSpan) % 360 + 360) % 360
);

/** Bottom falloff hue: center + falloffSpan (wrapped) */
const falloffBottomHue = computed(() =>
    (props.centerHue + props.falloffSpan) % 360
);

/** Pixel positions for falloff handles */
const falloffTopPx = computed(() => hueToPx(falloffTopHue.value));
const falloffBottomPx = computed(() => hueToPx(falloffBottomHue.value));

/** Style for the active zone between falloff handles */
const zoneStyle = computed(() => {
    const top = Math.min(falloffTopPx.value, falloffBottomPx.value);
    const bottom = Math.max(falloffTopPx.value, falloffBottomPx.value);
    return {
        top: top + "px",
        height: (bottom - top) + "px"
    };
});

/** HSL color string for a given hue */
function hueColorAt(hue: number): string {
    return `hsl(${hue}, 80%, 55%)`;
}

function startDrag(handle: "center" | "falloff-top" | "falloff-bottom", event: PointerEvent) {
    dragging.value = handle;
    (event.target as HTMLElement).setPointerCapture(event.pointerId);
    document.addEventListener("pointermove", onPointerMove);
    document.addEventListener("pointerup", onPointerUp);
}

function onTrackPointerDown(event: PointerEvent) {
    // Clicking the track moves the center handle
    if (!trackRef.value) return;
    const rect = trackRef.value.getBoundingClientRect();
    const y = event.clientY - rect.top;
    const newHue = pxToHue(y);
    emit("update:centerHue", Math.round(newHue));
}

function onPointerMove(event: PointerEvent) {
    if (!dragging.value || !trackRef.value) return;
    const rect = trackRef.value.getBoundingClientRect();
    const y = event.clientY - rect.top;
    const hue = pxToHue(y);

    if (dragging.value === "center") {
        emit("update:centerHue", Math.round(hue));
    } else {
        // Falloff handle: compute new span as distance from center
        let dist = Math.abs(hue - props.centerHue);
        if (dist > 180) dist = 360 - dist;
        emit("update:falloffSpan", Math.round(Math.max(10, Math.min(180, dist))));
    }
}

function onPointerUp() {
    dragging.value = null;
    document.removeEventListener("pointermove", onPointerMove);
    document.removeEventListener("pointerup", onPointerUp);
}

onUnmounted(() => {
    document.removeEventListener("pointermove", onPointerMove);
    document.removeEventListener("pointerup", onPointerUp);
});
</script>

<style scoped>
.hue-range-slider {
    position: relative;
    width: 28px;
    height: 100%;
    cursor: pointer;
    user-select: none;
    touch-action: none;
}

.hue-range-track {
    position: absolute;
    inset: 0;
    width: 8px;
    left: 50%;
    transform: translateX(-50%);
    border-radius: 4px;
    background: linear-gradient(to bottom,
            hsl(0, 70%, 50%),
            hsl(30, 70%, 50%),
            hsl(60, 70%, 50%),
            hsl(90, 70%, 50%),
            hsl(120, 70%, 50%),
            hsl(150, 70%, 50%),
            hsl(180, 70%, 50%),
            hsl(210, 70%, 50%),
            hsl(240, 70%, 50%),
            hsl(270, 70%, 50%),
            hsl(300, 70%, 50%),
            hsl(330, 70%, 50%),
            hsl(360, 70%, 50%));
    opacity: 0.4;
}

.hue-range-zone {
    position: absolute;
    left: 0;
    right: 0;
    border-radius: 4px;
    background: var(--handle-hue-color, hsl(60, 80%, 55%));
    opacity: 0.35;
    pointer-events: none;
}

.hue-range-handle {
    position: absolute;
    left: 50%;
    transform: translate(-50%, -50%);
    z-index: 2;
    cursor: grab;
    touch-action: none;
}

.hue-range-handle:active {
    cursor: grabbing;
}

.hue-range-handle--center .hue-range-handle-thumb {
    width: 20px;
    height: 20px;
    border-radius: 50%;
    background: var(--handle-hue-color);
    border: 2px solid white;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.3);
}

.hue-range-handle--falloff .hue-range-handle-thumb {
    width: 14px;
    height: 14px;
    border-radius: 50%;
    background: var(--handle-hue-color);
    border: 2px solid white;
    opacity: 0.7;
    box-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);
}
</style>
