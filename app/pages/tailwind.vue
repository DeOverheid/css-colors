<template>
    <UContainer>
        <div class="tailwind-page">
            <h1 class="page-title">
                Tailwind CSS v4 Colors Reference
            </h1>
            <p class="page-description">
                All 26 default colors — converted from OKLCH to HSL.
                Shade 950 is new in v4.
            </p>

            <template
                v-for="cat in categoryOrder"
                :key="cat"
            >
                <h2 class="category-title">
                    {{ categoryLabels[cat] }}
                </h2>

                <div class="hue-spectrum-grid">
                    <div
                        v-for="colorName in colorsByCategory[cat]"
                        :key="colorName"
                        class="hue-spectrum-row"
                    >
                        <!-- Color name label -->
                        <span class="color-name">{{ tailwindColors[colorName]?.name }}</span>

                        <!-- Color swatches -->
                        <div class="swatches-column">
                            <div class="swatches-row">
                                <div
                                    v-for="shade in shadeOrder"
                                    :key="shade"
                                    v-hover-popup="getTooltipHtml(colorName, shade)"
                                    class="color-swatch"
                                    :style="{ backgroundColor: getHslColor(colorName, shade) }"
                                />
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Shade labels (after each category) -->
                <div class="shade-labels">
                    <span class="color-name" />
                    <div class="labels-row">
                        <span
                            v-for="shade in shadeOrder"
                            :key="shade"
                            class="shade-label"
                        >{{ shade }}</span>
                    </div>
                </div>
            </template>

            <USeparator class="my-6" />

            <UButton
                to="/"
                icon="i-lucide-arrow-left"
                variant="ghost"
            >
                Back to Home
            </UButton>
        </div>
    </UContainer>
</template>

<script setup lang="ts">
import {
    tailwindColors,
    colorOrder,
    shadeOrder,
    categoryOrder,
    categoryLabels,
    type TailwindShade
} from "~/data/tailwindColors";
import { useHoverPopup } from "~/composables/ui/useHoverPopup";

const vHoverPopup = useHoverPopup();

/** Group colorOrder entries by their category */
const colorsByCategory = computed(() => {
    const map: Record<string, string[]> = {};
    for (const cat of categoryOrder) map[cat] = [];
    for (const name of colorOrder) {
        const c = tailwindColors[name];
        if (c) map[c.category]?.push(name);
    }
    return map;
});

function getHslColor(colorName: string, shade: string): string {
    const color = tailwindColors[colorName];
    if (!color) return "transparent";
    const shadeData: TailwindShade | undefined = color.shades[shade];
    if (!shadeData) return "transparent";
    return `hsl(${shadeData.hue}, ${shadeData.saturation}%, ${shadeData.lightness}%)`;
}

function getTooltipHtml(colorName: string, shade: string): string {
    const color = tailwindColors[colorName];
    if (!color) return "";
    const s: TailwindShade | undefined = color.shades[shade];
    if (!s) return "";
    const hsl = `hsl(${s.hue}, ${s.saturation}%, ${s.lightness}%)`;
    return [
        `<strong>${color.name}-${shade}</strong>`,
        `<span style="display:inline-block;width:10px;height:10px;border-radius:2px;background:${hsl};vertical-align:middle;margin-right:4px"></span>`,
        `H: ${s.hue.toFixed(1)}°`,
        `S: ${s.saturation.toFixed(1)}%`,
        `L: ${s.lightness.toFixed(1)}%`
    ].join("<br>");
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

.category-title {
    font-size: 1rem;
    font-weight: 600;
    opacity: 0.65;
    margin-top: 1.75rem;
    margin-bottom: 0.5rem;
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
