<template>
    <div class="bezier-editor">
        <div class="bezier-editor__container">
            <svg
                ref="svgElement"
                class="bezier-editor__svg"
                viewBox="-5 -5 110 110"
                preserveAspectRatio="xMidYMid meet"
                @mousedown="handleSvgMouseDown"
                @touchstart="handleSvgTouchStart">
                <!-- Background -->
                <rect
                    x="0"
                    y="0"
                    width="100"
                    height="100"
                    fill="white"
                    stroke="rgba(0,0,0,0.15)"
                    stroke-width="0.5" />
                <!-- Grid lines -->
                <g
                    class="bezier-editor__grid"
                    opacity="0.15">
                    <line
                        v-for="i in 10"
                        :key="`v-${i}`"
                        :x1="i * 10"
                        y1="0"
                        :x2="i * 10"
                        y2="100"
                        stroke="var(--ui-color-primary-700)"
                        stroke-width="0.5" />
                    <line
                        v-for="i in 10"
                        :key="`h-${i}`"
                        x1="0"
                        :y1="i * 10"
                        x2="100"
                        :y2="i * 10"
                        stroke="var(--ui-color-primary-700)"
                        stroke-width="0.5" />
                </g>

                <!-- Bezier curve -->
                <path
                    :d="curvePath"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                    class="bezier-editor__curve" />

                <!-- Control lines -->
                <line
                    :x1="0"
                    :y1="100"
                    :x2="p1.x"
                    :y2="p1.y"
                    stroke="currentColor"
                    stroke-width="1"
                    opacity="0.3"
                    stroke-dasharray="2,2" />
                <line
                    :x1="100"
                    :y1="0"
                    :x2="p2.x"
                    :y2="p2.y"
                    stroke="currentColor"
                    stroke-width="1"
                    opacity="0.3"
                    stroke-dasharray="2,2" />

                <!-- Start and end points -->
                <circle
                    cx="0"
                    cy="100"
                    r="2"
                    fill="currentColor"
                    opacity="0.5" />
                <circle
                    cx="100"
                    cy="0"
                    r="2"
                    fill="currentColor"
                    opacity="0.5" />

                <!-- Draggable control points -->
                <circle
                    :cx="p1.x"
                    :cy="p1.y"
                    r="4"
                    fill="var(--ui-primary)"
                    stroke="white"
                    stroke-width="1"
                    class="bezier-editor__handle"
                    @mousedown.stop="startDrag(1, $event)"
                    @touchstart.stop="startDrag(1, $event)" />
                <circle
                    :cx="p2.x"
                    :cy="p2.y"
                    r="4"
                    fill="var(--ui-primary)"
                    stroke="white"
                    stroke-width="1"
                    class="bezier-editor__handle"
                    @mousedown.stop="startDrag(2, $event)"
                    @touchstart.stop="startDrag(2, $event)" />
            </svg>
        </div>
    </div>
</template>

<script setup lang="ts">
const props = defineProps<{
    initialX1: number;
    initialY1: number;
    initialX2: number;
    initialY2: number;
}>();

const emit = defineEmits<{
    update: [values: { x1: number; y1: number; x2: number; y2: number }];
}>();

const svgElement = ref<SVGSVGElement | null>(null);
const dragging = ref<number | null>(null);

// Control points in SVG coordinates (0-100)
const p1 = reactive({
    x: props.initialX1 * 100,
    y: (1 - props.initialY1) * 100 // Flip Y for SVG
});

const p2 = reactive({
    x: props.initialX2 * 100,
    y: (1 - props.initialY2) * 100
});

// Computed bezier curve path
const curvePath = computed(() => {
    return `M 0 100 C ${p1.x} ${p1.y}, ${p2.x} ${p2.y}, 100 0`;
});

// Normalized values (0-1 range)
const normalizedValues = computed(() => ({
    x1: Math.round(p1.x) / 100,
    y1: Math.round(100 - p1.y) / 100,
    x2: Math.round(p2.x) / 100,
    y2: Math.round(100 - p2.y) / 100
}));

// Emit updates when values change
watch(normalizedValues, (values) => {
    emit("update", values);
}, { deep: true });

function startDrag(point: number, event: MouseEvent | TouchEvent) {
    dragging.value = point;
    event.preventDefault();

    if (typeof window !== "undefined") {
        window.addEventListener("mousemove", handleDrag);
        window.addEventListener("mouseup", stopDrag);
        window.addEventListener("touchmove", handleDrag);
        window.addEventListener("touchend", stopDrag);
    }
}

function handleDrag(event: MouseEvent | TouchEvent) {
    if (dragging.value === null || !svgElement.value) return;

    const svg = svgElement.value;
    const rect = svg.getBoundingClientRect();

    let clientX: number;
    let clientY: number;

    if (event instanceof MouseEvent) {
        clientX = event.clientX;
        clientY = event.clientY;
    } else {
        const touch = event.touches[0];
        if (!touch) return;
        clientX = touch.clientX;
        clientY = touch.clientY;
    }

    // Convert to SVG coordinates (accounting for viewBox padding)
    const pad = 5;
    const svgSize = 110;
    const x = ((clientX - rect.left) / rect.width) * svgSize - pad;
    const y = ((clientY - rect.top) / rect.height) * svgSize - pad;

    // Clamp to 0-100 range
    const clampedX = Math.max(0, Math.min(100, x));
    const clampedY = Math.max(0, Math.min(100, y));

    if (dragging.value === 1) {
        p1.x = clampedX;
        p1.y = clampedY;
    } else if (dragging.value === 2) {
        p2.x = clampedX;
        p2.y = clampedY;
    }

    event.preventDefault();
}

function stopDrag() {
    dragging.value = null;

    if (typeof window !== "undefined") {
        window.removeEventListener("mousemove", handleDrag);
        window.removeEventListener("mouseup", stopDrag);
        window.removeEventListener("touchmove", handleDrag);
        window.removeEventListener("touchend", stopDrag);
    }
}

function handleSvgMouseDown(event: MouseEvent) {
    // Click on SVG background (not on a handle) does nothing
    event.preventDefault();
}

function handleSvgTouchStart(event: TouchEvent) {
    event.preventDefault();
}

// Cleanup on unmount
onUnmounted(() => {
    if (typeof window !== "undefined") {
        window.removeEventListener("mousemove", handleDrag);
        window.removeEventListener("mouseup", stopDrag);
        window.removeEventListener("touchmove", handleDrag);
        window.removeEventListener("touchend", stopDrag);
    }
});
</script>

<style scoped>
.bezier-editor {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    height: 100%;
}

.bezier-editor__container {
    height: 100%;
    width: auto;
    aspect-ratio: 1;
}

.bezier-editor__svg {
    width: 100%;
    height: 100%;
    display: block;
    cursor: crosshair;
}

.bezier-editor__curve {
    stroke: var(--ui-primary);
}

.bezier-editor__handle {
    cursor: grab;
}

.bezier-editor__handle:active {
    cursor: grabbing;
}
</style>
