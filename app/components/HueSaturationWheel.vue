<template>
    <div class="hue-wheel-container">
        <div
            ref="wheelRef"
            class="hue-wheel-wrapper"
        >
            <!-- CSS gradient wheel -->
            <div class="hue-wheel" />

            <!-- Outer marker: fixed at step 1 hue, behind handles -->
            <div
                class="outer-marker"
                :style="outerMarkerStyle"
                @click="snapToStep1Hue"
            />

            <!-- SVG overlay for interactive elements -->
            <svg
                class="wheel-overlay"
                viewBox="0 0 100 100"
                @pointermove="handlePointerMove"
                @pointerup="handlePointerUp"
                @pointerleave="handlePointerUp"
            >
                <!-- Step 1 saturation reference ring (fixed, half opacity) -->
                <circle
                    class="sat-ring sat-ring--step1"
                    cx="50"
                    cy="50"
                    :r="step1SatRingRadius * 50"
                    fill="none"
                    stroke="rgba(255,255,255,0.25)"
                    stroke-width="0.5"
                />

                <!-- Live saturation ring -->
                <circle
                    class="sat-ring"
                    cx="50"
                    cy="50"
                    :r="satRingRadius * 50"
                    fill="none"
                    stroke="rgba(255,255,255,0.5)"
                    stroke-width="0.5"
                />

                <!-- Complementary saturation ring -->
                <circle
                    class="sat-ring sat-ring--comp"
                    cx="50"
                    cy="50"
                    :r="compSatRingRadius * 50"
                    fill="none"
                    stroke="rgba(255,255,255,0.35)"
                    stroke-width="0.5"
                    stroke-dasharray="2 2"
                />

                <!-- Tertiary handle (lower z-order) -->
                <circle
                    class="handle handle--tertiary"
                    :cx="tertiaryPos.x * 100"
                    :cy="tertiaryPos.y * 100"
                    r="4"
                    :fill="tertiaryColor"
                    stroke="white"
                    stroke-width="1"
                    opacity="0.8"
                    cursor="pointer"
                    @pointerdown.prevent="startDrag('tertiary', $event)"
                />

                <!-- Secondary handle (higher z-order than T) -->
                <circle
                    class="handle handle--secondary"
                    :cx="secondaryPos.x * 100"
                    :cy="secondaryPos.y * 100"
                    r="4"
                    :fill="secondaryColor"
                    stroke="white"
                    stroke-width="1"
                    opacity="0.8"
                    cursor="pointer"
                    @pointerdown.prevent="startDrag('secondary', $event)"
                />

                <!-- Primary handle (highest z-order) -->
                <circle
                    class="handle handle--primary"
                    :cx="primaryPos.x * 100"
                    :cy="primaryPos.y * 100"
                    r="5"
                    :fill="primaryColor"
                    stroke="white"
                    stroke-width="1.5"
                    cursor="pointer"
                    @pointerdown.prevent="startDrag('primary', $event)"
                />
            </svg>

        </div>
    </div>
</template>

<script setup lang="ts">
import { useWheelInteraction, type HandleId } from "~/composables/input/useWheelInteraction";

const {
    primaryPos,
    secondaryPos,
    tertiaryPos,
    primaryColor,
    secondaryColor,
    tertiaryColor,
    satRingRadius,
    step1SatRingRadius,
    compSatRingRadius,
    step1Hue,
    snapToStep1Hue,
    onPointerDown,
    onPointerMove,
    onPointerUp
} = useWheelInteraction();

const wheelRef = ref<HTMLElement | null>(null);

/** Convert pointer event to normalized 0–1 coordinates relative to wheel */
function getRelativeCoords(e: PointerEvent): { x: number; y: number } | null {
    if (!wheelRef.value) return null;
    const rect = wheelRef.value.getBoundingClientRect();
    return {
        x: (e.clientX - rect.left) / rect.width,
        y: (e.clientY - rect.top) / rect.height
    };
}

function startDrag(handle: HandleId, e: PointerEvent) {
    (e.target as SVGElement).setPointerCapture(e.pointerId);
    onPointerDown(handle);
}

function handlePointerMove(e: PointerEvent) {
    const coords = getRelativeCoords(e);
    if (coords) {
        onPointerMove(coords.x, coords.y);
    }
}

function handlePointerUp() {
    onPointerUp();
}

/** Outer marker: fixed at step 1 hue, positioned just outside the wheel */
const outerMarkerStyle = computed(() => {
    const hue = step1Hue.value;
    const angleRad = ((hue - 90) * Math.PI) / 180;
    const r = 60;
    const x = 50 + r * Math.cos(angleRad);
    const y = 50 + r * Math.sin(angleRad);
    return {
        left: `${x}%`,
        top: `${y}%`,
        background: `hsl(${hue}, 100%, 50%)`
    };
});
</script>

<style scoped>
.hue-wheel-container {
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 10%;
}

.hue-wheel-wrapper {
    position: relative;
    width: 100%;
    max-height: 100%;
    aspect-ratio: 1 / 1;
    overflow: visible;
}

.hue-wheel {
    width: 100%;
    height: 100%;
    border-radius: 50%;
    background:
        radial-gradient(circle,
            hsl(0, 0%, 50%) 0%,
            hsl(0, 0%, 50%) 10%,
            transparent 70%
        ),
        conic-gradient(
            from 0deg,
            hsl(0, 100%, 50%),
            hsl(30, 100%, 50%),
            hsl(60, 100%, 50%),
            hsl(90, 100%, 50%),
            hsl(120, 100%, 50%),
            hsl(150, 100%, 50%),
            hsl(180, 100%, 50%),
            hsl(210, 100%, 50%),
            hsl(240, 100%, 50%),
            hsl(270, 100%, 50%),
            hsl(300, 100%, 50%),
            hsl(330, 100%, 50%),
            hsl(360, 100%, 50%)
        );
}

.wheel-overlay {
    position: absolute;
    inset: 0;
    overflow: visible;
}

.handle {
    filter: drop-shadow(0 1px 2px rgba(0, 0, 0, 0.3));
    transition: r 0.1s ease;
}

.handle:hover {
    r: 6;
}

.sat-ring {
    pointer-events: none;
}

.outer-marker {
    position: absolute;
    width: 10px;
    height: 10px;
    border-radius: 50%;
    border: 2px solid white;
    transform: translate(-50%, -50%);
    cursor: pointer;
    filter: drop-shadow(0 1px 2px rgba(0, 0, 0, 0.3));
    pointer-events: auto;
}
</style>
