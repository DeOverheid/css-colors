import { find } from "./dom.js";
import {
    clamp,
    normalizeHue,
    readNumber,
    computeGreyFromSaturation
} from "./color-utils.js";
import { createSliderGroup } from "./slider-group.js";
import { createSummaryUpdater } from "./summary-view.js";
import { createStatusReporter } from "./status-view.js";
import { applyColorToRows } from "./color-rows.js";

export const createColorDemo = (config = {}) => {
    const form = config.form instanceof HTMLFormElement ? config.form : null;
    const colorField
        = config.colorInput instanceof HTMLInputElement
            ? config.colorInput
            : (() => {
                    const candidate = find("[data-color-input]", form);
                    return candidate instanceof HTMLInputElement ? candidate : null;
                })();
    const statusElement
        = config.statusElement ?? find("[data-color-status]", form);
    const summaryElement
        = config.summaryElement ?? find("[data-color-summary-root]");
    const sliderRoot = config.sliderRoot ?? find("[data-color-sliders]", form);

    const primaryRow = config.primaryRow ?? find("[data-color-row=\"primary\"]");
    const auxiliaryRows = Array.isArray(config.extraRows) ? config.extraRows : [];
    const parseColor
        = typeof config.parseColor === "function" ? config.parseColor : null;

    const rows = [primaryRow, ...auxiliaryRows]
        .map((entry) => {
            if (!entry) {
                return null;
            }
            if (entry instanceof HTMLElement) {
                return { element: entry, transform: null };
            }
            if (entry.element instanceof HTMLElement) {
                return {
                    element: entry.element,
                    transform:
            typeof entry.transform === "function" ? entry.transform : null
                };
            }
            return null;
        })
        .filter(Boolean);

    if (!form || !colorField || !rows.length) {
        return {
            init: () => {},
            applyColor: () => null,
            applySliderOverrides: () => null,
            getPrimaryRow: () => null,
            getLastColor: () => null
        };
    }

    const status = createStatusReporter(statusElement);
    const updateSummary = createSummaryUpdater(summaryElement);

    let sliderGroup = null;
    let sliderActive = false;
    let sliderMessageShown = false;
    let lastParsedColor = null;

    const getPrimaryRow = () => rows[0]?.element ?? null;

    const getActiveLightness = () => {
        if (lastParsedColor && Number.isFinite(lastParsedColor.lightness)) {
            return clamp(lastParsedColor.lightness, 0, 100);
        }
        const primary = getPrimaryRow();
        if (!primary) {
            return 50;
        }
        return clamp(readNumber(primary.dataset?.inputLightness, 50), 0, 100);
    };

    const buildSliderColor = () => {
        const state = sliderGroup ? sliderGroup.getState() : {};
        const hue = Number.isFinite(state.hue) ? state.hue : 0;
        const saturation = Number.isFinite(state.saturation) ? state.saturation : 0;
        const lightness = getActiveLightness();
        return {
            hue,
            saturation,
            lightness,
            greySaturation: computeGreyFromSaturation(saturation),
            neutralSaturation: 0
        };
    };

    const applySliderOverrides = ({ announce = false } = {}) => {
        const payload = buildSliderColor();
        const result = applyColorToRows(rows, payload);
        updateSummary(result);
        if (announce) {
            status.success("Using slider overrides.");
        }
        return result;
    };

    const handleSliderInput = () => {
        if (!sliderGroup) {
            return;
        }
        const announce = !sliderActive && !sliderMessageShown;
        sliderActive = true;
        applySliderOverrides({ announce });
        sliderMessageShown = true;
    };

    sliderGroup = createSliderGroup(sliderRoot, {
        onInput: handleSliderInput
    });

    const syncSlidersFromRow = () => {
        const primary = getPrimaryRow();
        if (!primary || !sliderGroup) {
            return;
        }
        const hue = Math.round(
            normalizeHue(
                readNumber(primary.dataset?.baseHue ?? primary.dataset?.inputHue, 0)
            )
        );
        const saturation = Math.round(
            clamp(
                readNumber(
                    primary.dataset?.baseSaturation ?? primary.dataset?.inputSaturation,
                    66
                ),
                0,
                100
            )
        );
        sliderGroup.setState(
            {
                hue,
                saturation
            },
            { silent: true }
        );
    };

    const applyParsedColor = (value, options = {}) => {
        if (!parseColor) {
            return null;
        }
        const parsed = parseColor(value);
        if (!parsed) {
            if (options.showStatus !== false) {
                status.error("Unrecognized color format.");
            }
            if (options.updateSummary !== false) {
                updateSummary();
            }
            return null;
        }

        const hue = Math.round(normalizeHue(parsed.hue));
        const saturation = Math.round(clamp(parsed.saturation, 0, 100));
        const lightness = clamp(parsed.lightness, 0, 100);

        if (sliderGroup) {
            sliderGroup.setState(
                {
                    hue,
                    saturation
                },
                { silent: true }
            );
        }

        const colorPayload = {
            hue,
            saturation,
            lightness,
            greySaturation: computeGreyFromSaturation(saturation),
            neutralSaturation: 0
        };

        const result = applyColorToRows(rows, colorPayload);

        if (options.updateSummary !== false) {
            updateSummary(result);
        }

        if (options.showStatus !== false) {
            status.success("Color applied.");
        }

        lastParsedColor = {
            hue: parsed.hue,
            saturation: parsed.saturation,
            lightness: parsed.lightness
        };

        sliderActive = false;
        sliderMessageShown = false;

        return parsed;
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        applyParsedColor(colorField.value);
    };

    const handleBlur = () => {
        if (sliderActive) {
            return;
        }
        const value = colorField.value.trim();
        if (value) {
            applyParsedColor(value, { showStatus: false });
        }
    };

    const init = () => {
        syncSlidersFromRow();
        if (form) {
            form.addEventListener("submit", handleSubmit);
        }
        if (colorField) {
            colorField.addEventListener("blur", handleBlur);
        }
    };

    return {
        init,
        applyColor: applyParsedColor,
        applySliderOverrides,
        getPrimaryRow,
        getLastColor: () => lastParsedColor
    };
};
