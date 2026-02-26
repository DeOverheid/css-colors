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
        const rows = Array.from(container.querySelectorAll("[data-sample-row]"));
        const registry = {};

        rows.forEach((row) => {
            populateRow(row);
            const key = row.getAttribute("data-sample-row");
            if (key) {
                registry[key] = row;
            }
        });

        if (state && Object.keys(registry).length) {
            state.registerSampleRows(registry);
        }
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
