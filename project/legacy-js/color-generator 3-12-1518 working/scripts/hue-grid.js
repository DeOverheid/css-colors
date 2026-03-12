(function (root) {
    const config = root.ColorGenerator?.config;
    const state = root.ColorGenerator?.state;

    if (!config) {
        throw new Error(
            "ColorGenerator.initHueGrid requires config to load first."
        );
    }

    function initHueGrid(container) {
        if (!(container instanceof HTMLElement)) {
            return;
        }

        container.textContent = "";
        const fragment = document.createDocumentFragment();
        const rows = [];

        config.HUE_NAMES.forEach((name, index) => {
            const baseHue = index * config.HUE_INTERVAL;
            const layout = document.createElement("div");
            layout.className = "color-output__layout color-output__layout--hue";
            layout.dataset.hueRow = name;
            layout.dataset.hueValue = String(baseHue);

            layout.appendChild(createSliderColumn(name, baseHue, "light"));
            layout.appendChild(createSamplesColumn());
            layout.appendChild(createSliderColumn(name, baseHue, "dark"));

            fragment.appendChild(layout);
            rows.push({
                element: layout,
                name,
                baseHue
            });
        });

        container.appendChild(fragment);

        if (state) {
            state.registerHueRows(
                rows.map(entry => ({
                    element: entry.element,
                    name: entry.name,
                    baseHue: entry.baseHue
                }))
            );
            rows.forEach(entry => attachRowEvents(entry.element, entry.name));
        }
    }

    function createSliderColumn(name, baseHue, position) {
        const column = document.createElement("div");
        column.className = "color-output__column color-output__column--slider";
        column.dataset.hueSlider = position;

        const input = document.createElement("input");
        input.type = "range";
        input.id = `hue-${baseHue}-${position}`;
        input.className = "color-output__slider-input";
        input.min = String(config.HUE_SLIDER_RANGE.min);
        input.max = String(config.HUE_SLIDER_RANGE.max);
        input.value = "0";
        input.dataset.hueSliderInput = position;
        input.dataset.hueSliderName = name;

        column.appendChild(input);
        return column;
    }

    function createSamplesColumn() {
        const column = document.createElement("div");
        column.className = "color-output__column color-output__column--samples";
        column.dataset.hueSwatches = "";

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

        column.appendChild(fragment);
        return column;
    }

    function attachRowEvents(rowElement, name) {
        if (!(rowElement instanceof HTMLElement) || !state) {
            return;
        }

        const sliders = rowElement.querySelectorAll("input[data-hue-slider-input]");
        if (!sliders.length) {
            return;
        }

        const dispatch = () => {
            const values = Array.from(sliders).reduce(
                (acc, input) => {
                    if (!(input instanceof HTMLInputElement)) {
                        return acc;
                    }
                    const side = input.dataset.hueSliderInput;
                    if (side === "light" || side === "dark") {
                        acc[side] = Number(input.value);
                    }
                    return acc;
                },
                { light: 0, dark: 0 }
            );
            state.setHueRowOffset(name, values);
        };

        sliders.forEach((slider) => {
            if (slider instanceof HTMLInputElement) {
                slider.addEventListener("input", dispatch);
            }
        });

        state.onHueRowOffset(name, (offsets) => {
            sliders.forEach((slider) => {
                if (!(slider instanceof HTMLInputElement)) {
                    return;
                }
                const side = slider.dataset.hueSliderInput;
                if (side === "light" || side === "dark") {
                    const nextValue = offsets[side];
                    if (Number(slider.value) !== Number(nextValue)) {
                        slider.value = String(nextValue);
                    }
                }
            });
        });

        dispatch();
    }

    root.ColorGenerator = root.ColorGenerator || {};
    root.ColorGenerator.initHueGrid = initHueGrid;
})(window);
