<template>
    <UContainer>
        <div class="tailwind-page">
            <h1 class="page-title">
                Tailwind CSS Colors Reference
            </h1>
            <p class="page-description">
                Exact Tailwind CSS color values in HSL format
            </p>

            <div class="hue-spectrum-grid">
                <div
                    v-for="colorName in colorOrder"
                    :key="colorName"
                    class="hue-spectrum-row">
                    <!-- Color name label -->
                    <span class="color-name">{{ colorName }}</span>

                    <!-- Color swatches -->
                    <div class="swatches-column">
                        <div class="swatches-row">
                            <div
                                v-for="shade in shadeOrder"
                                :key="shade"
                                class="color-swatch"
                                :style="{ backgroundColor: getHslColor(colorName, shade) }"
                                :title="getTooltip(colorName, shade)" />
                        </div>
                    </div>
                </div>
            </div>

            <!-- Shade labels -->
            <div class="shade-labels">
                <span class="color-name" />
                <div class="labels-row">
                    <span
                        v-for="shade in shadeOrder"
                        :key="shade"
                        class="shade-label">{{ shade }}</span>
                </div>
            </div>

            <USeparator class="my-6" />

            <UButton
                to="/"
                icon="i-lucide-arrow-left"
                variant="ghost">
                Back to Home
            </UButton>
        </div>
    </UContainer>
</template>

<script setup lang="ts">
import { tailwindColors, colorOrder, shadeOrder, type TailwindShade } from "~/data/tailwindColors";

function getHslColor(colorName: string, shade: string): string {
    const color = tailwindColors[colorName];
    if (!color) return "transparent";
    const shadeData: TailwindShade | undefined = color.shades[shade];
    if (!shadeData) return "transparent";
    return `hsl(${shadeData.hue}, ${shadeData.saturation}%, ${shadeData.lightness}%)`;
}

function getTooltip(colorName: string, shade: string): string {
    const color = tailwindColors[colorName];
    if (!color) return "";
    const shadeData: TailwindShade | undefined = color.shades[shade];
    if (!shadeData) return "";
    return `${colorName}-${shade}\nH: ${shadeData.hue.toFixed(1)}° S: ${shadeData.saturation.toFixed(1)}% L: ${shadeData.lightness.toFixed(1)}%`;
}
</script>

<style scoped>
.tailwind-page {
    padding: 2rem 0;
}

.page-title {
    font-size: 2rem;
    font-weight: bold;
    margin-bottom: 0.5rem;
}

.page-description {
    opacity: 0.7;
    margin-bottom: 2rem;
}

.hue-spectrum-grid {
    display: flex;
    flex-direction: column;
    gap: 0.125rem;
}

.hue-spectrum-row {
    display: grid;
    grid-template-columns: 80px 1fr;
    gap: 0.5rem;
    align-items: center;
}

.color-name {
    font-size: 0.75rem;
    font-weight: 500;
    text-transform: capitalize;
    opacity: 0.8;
}

.swatches-column {
    display: flex;
    flex-direction: column;
}

.swatches-row {
    display: flex;
    gap: 0;
}

.color-swatch {
    flex: 1;
    aspect-ratio: 2 / 1;
    min-width: 0;
}

.shade-labels {
    display: grid;
    grid-template-columns: 80px 1fr;
    gap: 0.5rem;
    margin-top: 0.5rem;
}

.labels-row {
    display: flex;
    gap: 0;
}

.shade-label {
    flex: 1;
    text-align: center;
    font-size: 0.625rem;
    opacity: 0.6;
}
</style>
