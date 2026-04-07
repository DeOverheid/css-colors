<template>
    <div class="hue-adjustment-panel">
        <p class="adjustment-hint">
            Shift the hue of dark and light swatches to compensate for
            perceptual color drift at extreme lightness values.
        </p>
    </div>
</template>

<style scoped>
.hue-adjustment-panel {
    display: flex;
    flex-direction: column;
    gap: 5px;
}

.adjustment-hint {
    color: var(--ui-text-muted);
    margin: 0;
    line-height: 1.5;
}
</style>
