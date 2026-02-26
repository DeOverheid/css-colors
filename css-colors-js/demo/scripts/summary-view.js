import { findAll } from "./dom.js";
import { formatValue } from "./color-utils.js";

const SUFFIX_MAP = {
    hue: "deg",
    saturation: "pct",
    grey: "pct",
    lightness: "pct"
};

const resolveSuffix = (key) => {
    const token = SUFFIX_MAP[key] ?? "";
    if (token === "deg") {
        return "deg";
    }
    if (token === "pct") {
        return "%";
    }
    return "";
};

export const createSummaryUpdater = (root) => {
    if (!(root instanceof HTMLElement)) {
        return () => {};
    }

    const fields = findAll("[data-color-summary]", root).map(node => ({
        element: node,
        key: node.getAttribute("data-color-summary")
    }));

    return (color = {}) => {
        fields.forEach(({ element, key }) => {
            if (!element || !key) {
                return;
            }
            const valueKey = key === "grey" ? "greySaturation" : key;
            const raw = color?.[valueKey];
            switch (key) {
                case "hue":
                case "saturation":
                case "grey":
                case "lightness":
                    element.textContent = formatValue(raw, resolveSuffix(key));
                    break;
                default:
                    element.textContent = "--";
            }
        });
    };
};
