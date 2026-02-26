(function (root) {
    const HUE_NAMES = [
        "crimson",
        "orange",
        "gold",
        "chartreuse",
        "emerald",
        "teal",
        "cerulean",
        "indigo",
        "violet",
        "magenta",
        "rose",
        "scarlet"
    ];
    const HUE_STEP = 30;
    const HUE_SAMPLE_COUNT = 13;
    const SLIDER_MIN = -30;
    const SLIDER_MAX = 30;

    function initHueGrid(container) {
        container.textContent = "";

        const fragment = document.createDocumentFragment();

        HUE_NAMES.forEach((name, index) => {
            const hueValue = index * HUE_STEP;
            fragment.appendChild(createHueRow(name, hueValue));
        });

        container.appendChild(fragment);
    }

    function createHueRow(name, hueValue) {
        const layout = document.createElement("div");
        layout.className = "color-output__layout color-output__layout--hue";
        layout.dataset.hueName = name;
        layout.dataset.hueValue = String(hueValue);

        layout.appendChild(createSliderColumn(name, hueValue, "light"));
        layout.appendChild(createSamplesColumn(name));
        layout.appendChild(createSliderColumn(name, hueValue, "dark"));

        return layout;
    }

    function createSliderColumn(name, hueValue, position) {
        const column = document.createElement("div");
        column.className = "color-output__column";

        const sliderId = `hue-${hueValue}-${position}`;
        const label = document.createElement("label");
        label.htmlFor = sliderId;
        label.textContent = `${capitalize(name)} ${position} offset`;

        const input = document.createElement("input");
        input.type = "range";
        input.id = sliderId;
        input.name = sliderId;
        input.min = String(SLIDER_MIN);
        input.max = String(SLIDER_MAX);
        input.value = "0";
        input.dataset.hueSlider = position;
        input.dataset.hueValue = String(hueValue);

        column.append(input);
        return column;
    }

    function createSamplesColumn(name) {
        const column = document.createElement("div");
        column.className = "color-output__column";

        const row = document.createElement("div");
        row.className = "color-output__row";
        row.dataset.hueRow = name;
        row.style.setProperty("--color-output-columns", String(HUE_SAMPLE_COUNT));

        const fragment = document.createDocumentFragment();

        for (let index = 0; index < HUE_SAMPLE_COUNT; index += 1) {
            const swatch = document.createElement("div");
            swatch.className = "color-output__swatch";
            swatch.dataset.hueSampleIndex = String(index);
            fragment.appendChild(swatch);
        }

        row.appendChild(fragment);
        column.appendChild(row);
        return column;
    }

    function capitalize(value) {
        return value.charAt(0).toUpperCase() + value.slice(1);
    }

    root.ColorGenerator = root.ColorGenerator || {};
    root.ColorGenerator.initHueGrid = initHueGrid;
})(window);
