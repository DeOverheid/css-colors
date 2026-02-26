<template>
    <div class="lightness-labels">
        <div class="lightness-label">
            0
        </div>
        <div
            v-for="(value, index) in lightnessSteps"
            :key="`label-${index}`"
            class="lightness-label"
        >
            {{ value }}
        </div>
        <div class="lightness-label">
            100
        </div>
    </div>
</template>

<script setup lang="ts">
defineProps<{
    lightnessSteps: number[];
    totalSteps: number;
}>();
</script>

<style scoped>
.lightness-labels {
    display: grid;
    grid-template-columns: repeat(v-bind(totalSteps), 1fr);
    gap: 0;
    width: 100%;
}

.lightness-label {
    font-size: 0.625rem;
    text-align: center;
    font-variant-numeric: tabular-nums;
}
</style>
