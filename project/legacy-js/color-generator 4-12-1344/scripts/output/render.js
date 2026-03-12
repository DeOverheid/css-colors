(function (root) {
    const config = root.ColorGenerator?.config;
    const state = root.ColorGenerator?.state;
    const utils = root.ColorGenerator?.utils;
    const lightnessAdjustment = root.ColorGenerator?.lightnessAdjustment;

    const MATCH_ROW_CLASS = "color-output__layout--match";
    const MATCH_SWATCH_CLASS = "color-output__swatch--match";
    const LIGHTNESS_VARIABLES = [
        { name: "--lightness-white", ratio: 0 },
        { name: "--lightness-lightest", ratio: 0.1 },
        { name: "--lightness-lighter", ratio: 0.2 },
        { name: "--lightness-light", ratio: 0.3 },
        { name: "--lightness-medium-light", ratio: 0.4 },
        { name: "--lightness-medium", ratio: 0.5 },
        { name: "--lightness-medium-dark", ratio: 0.6 },
        { name: "--lightness-dark", ratio: 0.7 },
        { name: "--lightness-darker", ratio: 0.8 },
        { name: "--lightness-darkest", ratio: 0.9 },
        { name: "--lightness-black", ratio: 1 }
    ];

    if (!config || !state || !utils || !lightnessAdjustment) {
        throw new Error(
            "ColorGenerator.initRenderer requires state, utils, and lightness adjustment modules."
        );
    }

    function initRenderer() {
        state.subscribe(renderSnapshot);
    }

    function renderSnapshot(snapshot) {
        renderSampleRows(snapshot);
        renderHueRows(snapshot);
        syncCssVariables(snapshot);
    }

    function renderSampleRows(snapshot) {
        const rows = snapshot.sampleRows || {};
        const entries = Object.entries(rows);
        if (!entries.length) {
            return;
        }

        entries.forEach(([variant, row]) => {
            if (!(row instanceof HTMLElement)) {
                return;
            }
            row.style.setProperty(
                "--color-output-columns",
                String(snapshot.sampleCount)
            );
            const swatches = row.querySelectorAll(".color-output__swatch");
            const sampleSettings = resolveSampleVariantSettings(snapshot, variant);
            if (!sampleSettings) {
                return;
            }
            const baseHue = sampleSettings.hue;
            const saturation = sampleSettings.saturation;
            swatches.forEach((swatch, index) => {
                if (!(swatch instanceof HTMLElement)) {
                    return;
                }
                const lightness = snapshot.lightnessSteps[index] ?? 0;
                const adjustedLightness = adjustLightness(
                    lightness,
                    baseHue,
                    index,
                    swatches.length,
                    snapshot.lightnessAdjustmentEnabled
                );
                applySwatchStyle({
                    swatch,
                    hue: baseHue,
                    saturation,
                    lightness: adjustedLightness
                });
            });
        });
    }

    function renderHueRows(snapshot) {
        const rows = snapshot.hueRows || [];
        const highlightData = [];

        rows.forEach((entry) => {
            const element = entry.element;
            if (!(element instanceof HTMLElement)) {
                return;
            }
            const name = entry.name;
            const baseHue = utils.normalizeHue(Number(entry.baseHue));
            const offsets = snapshot.hueRowOffsets?.[name] || { light: 0, dark: 0 };
            const actualBaseHue = utils.normalizeHue(baseHue + snapshot.hueOffset);
            element.dataset.actualHue = actualBaseHue.toFixed(2);

            const swatchColumn = element.querySelector("[data-hue-swatches]");
            if (!(swatchColumn instanceof HTMLElement)) {
                return;
            }
            swatchColumn.style.setProperty(
                "--color-output-columns",
                String(snapshot.sampleCount)
            );
            const swatches = swatchColumn.querySelectorAll(".color-output__swatch");

            const sampleCount = snapshot.sampleCount;
            const denominator = sampleCount > 1 ? sampleCount - 1 : 1;

            swatches.forEach((swatch, index) => {
                if (!(swatch instanceof HTMLElement)) {
                    return;
                }
                const weight = denominator === 0 ? 0 : index / denominator;
                const offset = utils.lerp(offsets.light, offsets.dark, weight);
                const hue = utils.normalizeHue(actualBaseHue + offset);
                const lightness = snapshot.lightnessSteps[index] ?? 0;
                const adjustedLightness = adjustLightness(
                    lightness,
                    hue,
                    index,
                    sampleCount,
                    snapshot.lightnessAdjustmentEnabled
                );
                applySwatchStyle({
                    swatch,
                    hue,
                    saturation: snapshot.primary.saturation,
                    lightness: adjustedLightness,
                    offset
                });
            });

            const swatchData = Array.from(swatches, (swatch) => {
                const lightnessValue = Number.parseFloat(swatch.dataset.lightness);
                const hueValue = Number.parseFloat(swatch.dataset.hue);
                return {
                    element: swatch,
                    lightness: Number.isFinite(lightnessValue) ? lightnessValue : 0,
                    hue: Number.isFinite(hueValue) ? hueValue : actualBaseHue
                };
            });

            highlightData.push({
                element,
                hue: actualBaseHue,
                swatches: swatchData
            });
        });

        applyHighlights(snapshot, highlightData);
    }

    function resolveSampleVariantSettings(snapshot, variantKey) {
        if (!state || typeof state.getSampleVariants !== "function") {
            return null;
        }
        const variants = state.getSampleVariants(snapshot.palette);
        const definition = Array.isArray(variants)
            ? variants.find(entry => entry?.key === variantKey)
            : null;
        if (!definition) {
            return null;
        }

        const baseHue = utils.normalizeHue(snapshot.primary.hue);
        const baseSaturation = utils.clamp(snapshot.primary.saturation, 0, 100);

        switch (definition.mode) {
            case "primary":
                return {
                    hue: baseHue,
                    saturation: baseSaturation
                };
            case "primary-scale": {
                const scale = Number.isFinite(definition.saturationScale)
                    ? definition.saturationScale
                    : 1;
                return {
                    hue: baseHue,
                    saturation: utils.clamp(baseSaturation * scale, 0, 100)
                };
            }
            case "neutral":
                return {
                    hue: baseHue,
                    saturation: 0
                };
            case "fixed": {
                const hue = Number.isFinite(definition.hue)
                    ? utils.normalizeHue(definition.hue)
                    : baseHue;
                let saturation = baseSaturation;
                if (Number.isFinite(definition.saturation)) {
                    saturation = utils.clamp(definition.saturation, 0, 100);
                } else if (Number.isFinite(definition.saturationScale)) {
                    saturation = utils.clamp(
                        baseSaturation * definition.saturationScale,
                        0,
                        100
                    );
                }
                return { hue, saturation };
            }
            default:
                return {
                    hue: baseHue,
                    saturation: baseSaturation
                };
        }
    }

    function applySwatchStyle({
        swatch,
        hue,
        saturation,
        lightness,
        offset = 0
    }) {
        const roundedHue = utils.roundTo(utils.normalizeHue(hue), 2);
        const roundedSat = utils.roundTo(utils.clamp(saturation, 0, 100), 2);
        const roundedLight = utils.roundTo(utils.clamp(lightness, 0, 100), 2);
        const backgroundColor = `hsl(${roundedHue}deg ${roundedSat}% ${roundedLight}%)`;
        swatch.style.setProperty("background", backgroundColor);
        swatch.style.removeProperty("color");
        swatch.dataset.hue = roundedHue.toFixed(2);
        swatch.dataset.saturation = roundedSat.toFixed(2);
        swatch.dataset.lightness = roundedLight.toFixed(2);
        swatch.dataset.offset = offset.toFixed(2);
    }

    function adjustLightness(baseLightness, hue, index, count, enabled) {
        try {
            if (
                lightnessAdjustment
                && typeof lightnessAdjustment.apply === "function"
            ) {
                return lightnessAdjustment.apply(baseLightness, {
                    hue,
                    index,
                    count,
                    enabled
                });
            }
        } catch (error) {
            console.warn("Failed to adjust lightness", error);
        }
        return baseLightness;
    }

    function applyHighlights(snapshot, rows) {
        if (!Array.isArray(rows) || !rows.length) {
            return;
        }

        rows.forEach((row) => {
            if (!(row.element instanceof HTMLElement)) {
                return;
            }
            row.element.classList.remove(MATCH_ROW_CLASS);
            row.swatches.forEach((entry) => {
                if (entry?.element instanceof HTMLElement) {
                    entry.element.classList.remove(MATCH_SWATCH_CLASS);
                }
            });
        });

        const highlightMode = snapshot.highlightMode || "row";
        const targetHue = utils.normalizeHue(snapshot.primary.hue);

        const closestRow = rows.reduce(
            (best, row) => {
                if (!(row.element instanceof HTMLElement)) {
                    return best;
                }
                const rowHue = resolveRowHue(row);
                const delta = hueDifference(rowHue, targetHue);
                if (delta < best.delta) {
                    return { delta, row };
                }
                return best;
            },
            { delta: Number.POSITIVE_INFINITY, row: null }
        ).row;

        if (!closestRow || !(closestRow.element instanceof HTMLElement)) {
            return;
        }

        if (highlightMode === "row") {
            closestRow.element.classList.add(MATCH_ROW_CLASS);
            return;
        }

        if (highlightMode === "sample") {
            const targetLightness = Number.isFinite(snapshot.primary.lightness)
                ? snapshot.primary.lightness
                : 50;
            const bestSwatch = findClosestSwatch(closestRow, targetLightness);
            if (bestSwatch instanceof HTMLElement) {
                bestSwatch.classList.add(MATCH_SWATCH_CLASS);
            }
        }
    }

    function hueDifference(a, b) {
        const diff = Math.abs(a - b) % 360;
        return diff > 180 ? 360 - diff : diff;
    }

    function resolveRowHue(row) {
        if (!row || !Array.isArray(row.swatches) || !row.swatches.length) {
            return row?.hue ?? 0;
        }
        const middleIndex = Math.floor(row.swatches.length / 2);
        const middle = row.swatches[middleIndex];
        if (middle && Number.isFinite(middle.hue)) {
            return middle.hue;
        }
        return row.hue ?? 0;
    }

    function findClosestSwatch(row, targetLightness) {
        if (!row || !Array.isArray(row.swatches) || !row.swatches.length) {
            return null;
        }
        let best = null;
        let bestDiff = Number.POSITIVE_INFINITY;
        row.swatches.forEach((entry) => {
            if (!(entry?.element instanceof HTMLElement)) {
                return;
            }
            const diff = Math.abs(targetLightness - entry.lightness);
            if (diff < bestDiff) {
                bestDiff = diff;
                best = entry.element;
            }
        });
        return best;
    }

    let cachedMainElement = null;

    function syncCssVariables(snapshot) {
        if (!cachedMainElement) {
            const candidate = document.querySelector("main");
            if (candidate instanceof HTMLElement) {
                cachedMainElement = candidate;
            }
        }
        if (!(cachedMainElement instanceof HTMLElement)) {
            return;
        }

        const saturation = utils.roundTo(snapshot.primary.saturation, 2);
        const hue = utils.roundTo(snapshot.primary.hue, 2);
        const hueOffset = utils.roundTo(snapshot.hueOffset, 2);
        const primaryLightness = utils.roundTo(snapshot.primary.lightness, 2);

        cachedMainElement.style.setProperty(
            "--saturation-primary",
            `${saturation}%`
        );
        cachedMainElement.style.setProperty("--hue-primary", `${hue}deg`);
        cachedMainElement.style.setProperty("--hue-offset", `${hueOffset}deg`);
        cachedMainElement.style.setProperty(
            "--lightness-primary",
            `${primaryLightness}%`
        );

        const steps = Array.isArray(snapshot.lightnessSteps)
            ? snapshot.lightnessSteps
            : [];
        LIGHTNESS_VARIABLES.forEach(({ name, ratio }) => {
            const value = getLightnessAtRatio(steps, ratio);
            if (Number.isFinite(value)) {
                const rounded = utils.roundTo(value, 2);
                cachedMainElement.style.setProperty(name, `${rounded}%`);
            }
        });
    }

    function getLightnessAtRatio(steps, ratio) {
        if (!Array.isArray(steps) || !steps.length) {
            return Number.NaN;
        }
        const clampedRatio = utils.clamp(ratio, 0, 1);
        const lastIndex = steps.length - 1;
        if (lastIndex <= 0) {
            return steps[0];
        }
        const exactIndex = clampedRatio * lastIndex;
        const lowerIndex = Math.floor(exactIndex);
        const upperIndex = Math.min(lastIndex, Math.ceil(exactIndex));
        const lowerValue = steps[lowerIndex] ?? steps[0];
        const upperValue = steps[upperIndex] ?? steps[lastIndex];
        if (upperIndex === lowerIndex) {
            return lowerValue;
        }
        const t = exactIndex - lowerIndex;
        return lowerValue + (upperValue - lowerValue) * t;
    }

    root.ColorGenerator = root.ColorGenerator || {};
    root.ColorGenerator.initRenderer = initRenderer;
})(window);
