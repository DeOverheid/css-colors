<template>
    <UContainer>
        <div class="home-page">
            <!-- Hero Section -->
            <div class="hero-section">
                <h1 class="hero-title">
                    Color Palette Generator
                </h1>
                <p class="hero-description">
                    Create beautiful, accessible color palettes with mathematical
                    precision. Generate full color systems with lightness curves and hue
                    adjustments.
                </p>

                <!-- Call to Action Buttons -->
                <div class="cta-buttons">
                    <UButton
                        to="/generator"
                        size="xl"
                        icon="i-lucide-palette"
                        trailing-icon="i-lucide-arrow-right">
                        Open Color Generator
                    </UButton>
                    <UButton
                        to="/tailwind"
                        size="xl"
                        variant="outline"
                        icon="i-lucide-swatches">
                        Tailwind Colors Reference
                    </UButton>
                </div>
            </div>

            <!-- Feature Cards -->
            <div class="features-grid">
                <UCard>
                    <template #header>
                        <div class="card-header">
                            <UIcon
                                name="i-lucide-sliders-horizontal"
                                class="card-icon" />
                            <h3 class="card-title">
                                Bezier Curves
                            </h3>
                        </div>
                    </template>
                    <p class="card-description">
                        Control lightness distribution with precision using cubic bezier
                        curves
                    </p>
                </UCard>

                <UCard>
                    <template #header>
                        <div class="card-header">
                            <UIcon
                                name="i-lucide-sun-moon"
                                class="card-icon" />
                            <h3 class="card-title">
                                Hue Adjustments
                            </h3>
                        </div>
                    </template>
                    <p class="card-description">
                        Fine-tune individual hues with light and dark offset controls
                    </p>
                </UCard>

                <UCard>
                    <template #header>
                        <div class="card-header">
                            <UIcon
                                name="i-lucide-download"
                                class="card-icon" />
                            <h3 class="card-title">
                                Export Ready
                            </h3>
                        </div>
                    </template>
                    <p class="card-description">
                        Export your palette configurations in multiple formats
                    </p>
                </UCard>
            </div>
        </div>
    </UContainer>
</template>

<style scoped>
.home-page {
    padding: 6rem 0;
}

.hero-section {
    text-align: center;
    margin-bottom: 4rem;
}

.hero-title {
    font-size: 3rem;
    font-weight: bold;
    margin-bottom: 1.5rem;
}

.hero-description {
    font-size: 1.25rem;
    color: var(--color-gray-600);
    max-width: 42rem;
    margin: 0 auto 2rem;
}

.cta-buttons {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    align-items: center;
}

@media (min-width: 640px) {
    .cta-buttons {
        flex-direction: row;
        justify-content: center;
    }
}

:global(.dark) .hero-description {
    color: var(--color-gray-400);
}

.features-grid {
    display: grid;
    grid-template-columns: 1fr;
    gap: 1.5rem;
    margin-top: 4rem;
}

@media (min-width: 768px) {
    .features-grid {
        grid-template-columns: repeat(3, 1fr);
    }
}

.card-header {
    display: flex;
    align-items: center;
    gap: 0.75rem;
}

.card-icon {
    width: 1.5rem;
    height: 1.5rem;
}

.card-title {
    font-size: 1.125rem;
    font-weight: 600;
}

.card-description {
    color: var(--color-gray-600);
}

:global(.dark) .card-description {
    color: var(--color-gray-400);
}
</style>
