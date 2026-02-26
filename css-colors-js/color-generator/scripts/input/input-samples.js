(function (root) {
    const config = root.ColorGenerator?.config;
    const state = root.ColorGenerator?.state;

    if (!config) {
        throw new Error(
            "ColorGenerator.initSamples requires config to be loaded first."
        );
    }

    const DEFAULT_SAMPLE_COUNT = sanitizeSampleCount(config.SAMPLE_COUNT, 15);

    function getSampleCountForPalette(paletteKey) {
        if (config && typeof config.getPaletteSampleCount === "function") {
            const value = config.getPaletteSampleCount(paletteKey);
            return sanitizeSampleCount(value, DEFAULT_SAMPLE_COUNT);
        }
        const palette = config.PALETTES?.[paletteKey];
        if (palette && Number.isFinite(palette.sampleCount)) {
            return sanitizeSampleCount(palette.sampleCount, DEFAULT_SAMPLE_COUNT);
        }
        return DEFAULT_SAMPLE_COUNT;
    }

    function sanitizeSampleCount(value, fallback) {
        const number = Number(value);
        if (!Number.isFinite(number)) {
            return Number.isFinite(fallback) ? fallback : 2;
        }
        const rounded = Math.round(number);
        if (rounded < 2) {
            return 2;
        }
        return rounded;
    }

    function initSamples(container) {
        if (!(container instanceof HTMLElement)) {
            return;
        }
        const rebuild = (paletteKey) => {
            container.textContent = "";
            const variants
                = state && typeof state.getSampleVariants === "function"
                    ? state.getSampleVariants(paletteKey)
                    : [];
            const sampleCount = getSampleCountForPalette(paletteKey);

            if (!variants || !variants.length) {
                const fallbackRow = document.createElement("div");
                fallbackRow.className = "color-output__row";
                fallbackRow.dataset.sampleRow = "primary";
                populateRow(fallbackRow, sampleCount);
                container.appendChild(fallbackRow);
                if (state) {
                    state.registerSampleRows({ primary: fallbackRow });
                }
                return;
            }

            const registry = {};
            const fragment = document.createDocumentFragment();

            variants.forEach((variant) => {
                if (!variant?.key) {
                    return;
                }
                const row = document.createElement("div");
                row.className = "color-output__row";
                row.dataset.sampleRow = variant.key;
                row.dataset.samplePalette = paletteKey;
                populateRow(row, sampleCount);
                registry[variant.key] = row;
                fragment.appendChild(row);
            });

            container.appendChild(fragment);

            if (state && Object.keys(registry).length) {
                state.registerSampleRows(registry);
            }
        };

        if (!state || typeof state.subscribe !== "function") {
            rebuild(config.DEFAULT_PALETTE || "practical");
            return;
        }

        let currentPalette = null;
        state.subscribe((snapshot) => {
            const snapshotPalette = snapshot && snapshot.palette;
            const statePalette
                = typeof state.getPaletteKey === "function"
                    ? state.getPaletteKey()
                    : null;
            const paletteKey
                = typeof snapshotPalette === "string"
                    ? snapshotPalette
                    : typeof statePalette === "string"
                        ? statePalette
                        : null;

            if (typeof paletteKey === "string" && paletteKey !== currentPalette) {
                currentPalette = paletteKey;
                rebuild(paletteKey);
            } else if (!currentPalette) {
                currentPalette = config.DEFAULT_PALETTE || "practical";
                rebuild(currentPalette);
            }
        });
    }

    function populateRow(row, count) {
        if (!(row instanceof HTMLElement)) {
            return;
        }
        const sampleCount = sanitizeSampleCount(count, DEFAULT_SAMPLE_COUNT);
        row.textContent = "";
        row.style.setProperty("--color-output-columns", String(sampleCount));

        const fragment = document.createDocumentFragment();

        for (let index = 0; index < sampleCount; index += 1) {
            const swatch = document.createElement("span");
            swatch.className = "color-output__swatch";
            swatch.tabIndex = 0;
            if (index === 0) {
                swatch.dataset.lightness = "100";
            } else if (index === sampleCount - 1) {
                swatch.dataset.lightness = "0";
            }
            fragment.appendChild(swatch);
        }

        row.appendChild(fragment);
    }

    root.ColorGenerator = root.ColorGenerator || {};
    root.ColorGenerator.initSamples = initSamples;
})(window);
