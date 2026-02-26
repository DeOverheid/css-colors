(function (root) {
    const config = root.ColorGenerator?.config;
    const state = root.ColorGenerator?.state;

    if (!config) {
        throw new Error(
            "ColorGenerator.initSamples requires config to be loaded first."
        );
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

            if (!variants || !variants.length) {
                const fallbackRow = document.createElement("div");
                fallbackRow.className = "color-output__row";
                fallbackRow.dataset.sampleRow = "primary";
                populateRow(fallbackRow);
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
                populateRow(row);
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

    function populateRow(row) {
        if (!(row instanceof HTMLElement)) {
            return;
        }
        row.textContent = "";
        row.style.setProperty(
            "--color-output-columns",
            String(config.SAMPLE_COUNT)
        );

        const fragment = document.createDocumentFragment();

        for (let index = 0; index < config.SAMPLE_COUNT; index += 1) {
            const swatch = document.createElement("span");
            swatch.className = "color-output__swatch";
            if (index === 0) {
                swatch.dataset.lightness = "100";
            } else if (index === config.SAMPLE_COUNT - 1) {
                swatch.dataset.lightness = "0";
            }
            fragment.appendChild(swatch);
        }

        row.appendChild(fragment);
    }

    root.ColorGenerator = root.ColorGenerator || {};
    root.ColorGenerator.initSamples = initSamples;
})(window);
