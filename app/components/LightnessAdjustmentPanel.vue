<template>
    <div class="lightness-adjustment-panel">
        <p class="adjustment-hint">
            Lightness compensation adjusts brightness across hues so warm tones
            (yellows, oranges) are darkened and cool tones (blues, purples)
            are brightened for perceptual uniformity.
        </p>
    </div>
</template>

<script setup lang="ts">
import { useLightnessAdjustment } from "~/composables/input/stepLightnessAdjustment";

const { settings } = useLightnessAdjustment();
</script>

<style scoped>
.lightness-adjustment-panel {
    display: flex;
    flex-direction: column;
    gap: 1rem;
}

.adjustment-hint {
    color: var(--ui-text-muted);
    margin: 0;
}
</style>
