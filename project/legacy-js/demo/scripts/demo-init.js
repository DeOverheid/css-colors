import { find, findAll } from "./dom.js";
import { createColorDemo } from "./color-form.js";

const initializeHueRows = () => {
    if (!window.HueOffset || typeof window.HueOffset.initRow !== "function") {
        return;
    }
    findAll("[data-hue-row]").forEach((row) => {
        window.HueOffset.initRow(row);
    });
};

const startDemo = () => {
    initializeHueRows();

    const form = find("[data-color-form]");
    const colorInput = find("[data-color-input]", form);
    const statusElement = find("[data-color-status]", form);
    const summaryElement = find("[data-color-summary-root]");
    const sliderRoot = find("[data-color-sliders]", form);

    const primaryRow = find("[data-color-row=\"primary\"]");
    const zeroRow = find("[data-color-row=\"zero\"]");

    const extraRows = [];
    if (zeroRow) {
        extraRows.push({
            element: zeroRow,
            transform: color => ({
                ...color,
                hue: 0
            })
        });
    }

    const parseColor = value =>
        typeof window.ColorParser?.detect === "function"
            ? window.ColorParser.detect(value)
            : null;

    const controller = createColorDemo({
        form,
        colorInput,
        statusElement,
        summaryElement,
        sliderRoot,
        primaryRow,
        extraRows,
        parseColor
    });

    controller.init();

    const publicApi = Object.freeze({
        applyColor: controller.applyColor,
        parse: parseColor,
        getRow: controller.getPrimaryRow,
        getLastColor: controller.getLastColor
    });

    Object.defineProperty(window, "ColorDemo", {
        value: publicApi,
        enumerable: false,
        configurable: true,
        writable: false
    });
};

if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", startDemo, { once: true });
} else {
    startDemo();
}
