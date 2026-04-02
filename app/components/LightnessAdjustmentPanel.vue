<template>
    <div class="lightness-adjustment-panel">
        <p class="adjustment-hint">
            Lightness compensation adjusts brightness across hues so warm tones
            (yellows, oranges) are darkened and cool tones (blues, purples)
            are brightened for perceptual uniformity. (The AI means "look the same").
        </p>
    </div>
</template>

<script setup lang="ts">
</script>

<style scoped>
.lightness-adjustment-panel {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
}

.adjustment-hint {
    color: var(--ui-text-muted);
    margin: 0;
    line-height: 1.5;
}
</style>
