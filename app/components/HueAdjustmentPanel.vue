<template>
    <div class="hue-adjustment-panel">
        <p class="adjustment-hint">
            Shift the hue of dark and light swatches to compensate for
            perceptual color drift at extreme lightness values.
        </p>
        <p class="adjustment-hint">
            Use the <strong>left panel</strong> for dark hue shifts and the
            <strong>right panel</strong> for light hue shifts.
        </p>
    </div>
</template>

<script setup lang="ts">
</script>

<style scoped>
.hue-adjustment-panel {
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
