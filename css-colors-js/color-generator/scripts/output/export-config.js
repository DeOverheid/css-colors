(function (root) {
    const state = root.ColorGenerator?.state;
    const utils = root.ColorGenerator?.utils;
    const lightnessAdjustment = root.ColorGenerator?.lightnessAdjustment;

    const SHADE_LABELS = Object.freeze([
        "50",
        "100",
        "200",
        "300",
        "400",
        "500",
        "600",
        "700",
        "800",
        "900",
        "950"
    ]);

    function initExportControls(panel) {
        if (!(panel instanceof HTMLElement)) {
            return;
        }

        const generateButton = panel.querySelector("[data-export-generate]");
        const copyButton = panel.querySelector("[data-export-copy]");
        const output = panel.querySelector("[data-export-output]");
        const message = panel.querySelector("[data-export-message]");
        let lastValue = "";

        const setMessage = (text, status = "info") => {
            if (!(message instanceof HTMLElement)) {
                return;
            }
            if (!text) {
                message.textContent = "";
                message.hidden = true;
                message.removeAttribute("data-status");
                return;
            }
            message.textContent = text;
            message.dataset.status = status;
            message.hidden = false;
        };

        const toggleOutputVisibility = (visible) => {
            if (output instanceof HTMLTextAreaElement) {
                output.hidden = !visible;
                if (visible) {
                    output.scrollTop = 0;
                }
            }
        };

        const setCopyDisabled = (disabled) => {
            if (copyButton instanceof HTMLButtonElement) {
                copyButton.disabled = Boolean(disabled);
            }
        };

        setCopyDisabled(true);

        if (!state || typeof state.getSnapshot !== "function") {
            if (generateButton instanceof HTMLButtonElement) {
                generateButton.disabled = true;
            }
            setMessage("State module not ready, export unavailable.", "error");
            return;
        }

        const handleGenerate = () => {
            const payload = buildExportPayload(state);
            if (!payload) {
                setMessage("Unable to capture the current settings.", "error");
                return;
            }
            const formatted = formatPayload(payload);
            lastValue = formatted;
            if (output instanceof HTMLTextAreaElement) {
                output.value = formatted;
                toggleOutputVisibility(true);
                output.focus();
                output.select();
            }
            setCopyDisabled(false);
            setMessage(
                "Settings captured. Copy them and send them my way.",
                "success"
            );
        };

        const handleCopy = async () => {
            if (!lastValue) {
                setMessage("Generate the config before copying.", "error");
                return;
            }
            const success = await copyToClipboard(lastValue, output);
            if (success) {
                setMessage("Settings copied to your clipboard.", "success");
            } else {
                setMessage(
                    "Copy failed. Select the text above and copy manually.",
                    "error"
                );
            }
        };

        if (generateButton instanceof HTMLButtonElement) {
            generateButton.addEventListener("click", handleGenerate);
        }

        if (copyButton instanceof HTMLButtonElement) {
            copyButton.addEventListener("click", () => {
                handleCopy().catch(() => {
                    setMessage(
                        "Copy failed unexpectedly. Please copy manually.",
                        "error"
                    );
                });
            });
        }
    }

    function buildExportPayload(stateApi) {
        if (!stateApi || typeof stateApi.getSnapshot !== "function") {
            return null;
        }
        const snapshot = stateApi.getSnapshot();
        if (!snapshot) {
            return null;
        }
        const paletteKey
            = typeof snapshot.palette === "string" ? snapshot.palette : null;

        const payload = {
            version: 1,
            generatedAt: new Date().toISOString(),
            palette: paletteKey,
            sampleCount: snapshot.sampleCount,
            hueOffset: snapshot.hueOffset,
            highlightMode: snapshot.highlightMode,
            primary: { ...snapshot.primary },
            lightness: {
                controls: { ...snapshot.controls },
                curve: { ...snapshot.controlPoints },
                range: { ...snapshot.lightnessRange },
                steps: Array.isArray(snapshot.lightnessSteps)
                    ? snapshot.lightnessSteps.map(value => coerceNumeric(value, 0))
                    : []
            },
            hueOffsets: cloneOffsets(snapshot.hueRowOffsets),
            adjustments: {
                enabled: Boolean(snapshot.lightnessAdjustmentEnabled),
                ranges: cloneAdjustments(snapshot.lightnessAdjustments)
            }
        };

        if (stateApi && typeof stateApi.getHueDefinitions === "function") {
            const definitions = stateApi.getHueDefinitions(paletteKey) || [];
            payload.hueDefinitions = definitions
                .map(sanitizeHueDefinition)
                .filter(Boolean);
        }

        if (stateApi && typeof stateApi.getSampleVariants === "function") {
            const variants = stateApi.getSampleVariants(paletteKey) || [];
            payload.sampleVariants = variants
                .map(sanitizeSampleVariant)
                .filter(Boolean);
        }

        if (stateApi && typeof stateApi.getPalette === "function") {
            const paletteDefinition = stateApi.getPalette(paletteKey);
            const sanitizedPalette = sanitizePaletteDefinition(paletteDefinition);
            if (sanitizedPalette) {
                payload.paletteDefinition = sanitizedPalette;
            }
        }

        payload.sampleSwatches = buildSampleSwatches(snapshot, stateApi);
        payload.hueSwatches = buildHueSwatches(snapshot, stateApi);

        return payload;
    }

    function cloneOffsets(map) {
        const result = {};
        if (!map || typeof map !== "object") {
            return result;
        }
        Object.keys(map).forEach((key) => {
            const entry = map[key] || {};
            result[key] = {
                light: coerceNumeric(entry.light, 0),
                dark: coerceNumeric(entry.dark, 0)
            };
        });
        return result;
    }

    function cloneAdjustments(adjustments) {
        const output = {};
        if (!adjustments || typeof adjustments !== "object") {
            return output;
        }
        Object.keys(adjustments).forEach((key) => {
            const entry = adjustments[key] || {};
            output[key] = {
                enabled: Boolean(entry.enabled ?? true),
                start: coerceNumeric(entry.start, 0),
                end: coerceNumeric(entry.end, 0),
                hueFalloff: coerceNumeric(entry.hueFalloff, 0),
                lightnessFalloff: coerceNumeric(entry.lightnessFalloff, 0),
                lightnessFalloffLight: coerceNumeric(entry.lightnessFalloffLight, 0),
                lightnessAmplitude: coerceNumeric(entry.lightnessAmplitude, 0),
                lightnessFalloffDark: coerceNumeric(entry.lightnessFalloffDark, 0)
            };
        });
        return output;
    }

    function sanitizeHueDefinition(entry) {
        if (!entry) {
            return null;
        }
        return {
            name: entry.name || "",
            baseHue: coerceNumeric(entry.baseHue, 0),
            family: entry.family || null,
            offsets: {
                light: coerceNumeric(entry.offsets?.light, 0),
                dark: coerceNumeric(entry.offsets?.dark, 0)
            },
            saturation: coerceNumeric(entry.saturation, 1)
        };
    }

    function sanitizeSampleVariant(entry) {
        if (!entry) {
            return null;
        }
        const sanitized = {
            key: entry.key || "",
            mode: entry.mode || "primary"
        };
        if (Object.prototype.hasOwnProperty.call(entry, "hue")) {
            sanitized.hue = coerceNumeric(entry.hue, 0);
        }
        if (Object.prototype.hasOwnProperty.call(entry, "saturation")) {
            sanitized.saturation = coerceNumeric(entry.saturation, 0);
        }
        if (Object.prototype.hasOwnProperty.call(entry, "saturationScale")) {
            sanitized.saturationScale = coerceNumeric(entry.saturationScale, 1);
        }
        return sanitized;
    }

    function sanitizePaletteDefinition(definition) {
        if (!definition || typeof definition !== "object") {
            return null;
        }
        const sanitized = {
            key: definition.key || "",
            label: definition.label || "",
            sampleCount: coerceNumeric(definition.sampleCount, 0),
            hues: [],
            samples: []
        };
        if (Array.isArray(definition.hues)) {
            sanitized.hues = definition.hues
                .map(sanitizeHueDefinition)
                .filter(Boolean);
        }
        if (Array.isArray(definition.samples)) {
            sanitized.samples = definition.samples
                .map(sanitizeSampleVariant)
                .filter(Boolean);
        }
        return sanitized;
    }

    function buildSampleSwatches(snapshot, stateApi) {
        const steps = Array.isArray(snapshot.lightnessSteps)
            ? snapshot.lightnessSteps
            : [];
        if (!steps.length) {
            return [];
        }
        let variants = [];
        if (stateApi && typeof stateApi.getSampleVariants === "function") {
            variants = stateApi.getSampleVariants(snapshot.palette) || [];
        }
        if (!variants.length) {
            variants = [{ key: "primary", mode: "primary" }];
        }
        const output = [];
        variants.forEach((variant) => {
            const settings = resolveSampleVariantSettings(snapshot, variant);
            if (!settings) {
                return;
            }
            const swatches = steps.map((baseLightness, index) => {
                const adjusted = applyLightnessAdjustments(
                    baseLightness,
                    settings.hue,
                    index,
                    steps.length,
                    snapshot.lightnessAdjustmentEnabled
                );
                return createSwatchRecord({
                    label: String(index),
                    index,
                    hue: settings.hue,
                    saturation: settings.saturation,
                    lightness: adjusted
                });
            });
            output.push({
                key: settings.key,
                mode: settings.mode,
                hue: settings.hue,
                saturation: settings.saturation,
                swatches
            });
        });
        return output;
    }

    function buildHueSwatches(snapshot, stateApi) {
        if (!stateApi || typeof stateApi.getHueDefinitions !== "function") {
            return [];
        }
        const definitions = stateApi.getHueDefinitions(snapshot.palette) || [];
        if (!definitions.length) {
            return [];
        }
        const steps = Array.isArray(snapshot.lightnessSteps)
            ? snapshot.lightnessSteps
            : [];
        if (!steps.length) {
            return [];
        }
        const offsetsMap = snapshot.hueRowOffsets || {};
        const denominator = SHADE_LABELS.length > 1 ? SHADE_LABELS.length - 1 : 1;
        const saturation = utils.clamp(snapshot.primary?.saturation, 0, 100);

        return definitions.map((definition) => {
            const offsetEntry = offsetsMap[definition.name] || { light: 0, dark: 0 };
            const baseHue = utils.normalizeHue(
                coerceNumeric(definition.baseHue, 0)
                + coerceNumeric(snapshot.hueOffset, 0)
            );
            const shades = SHADE_LABELS.map((label, index) => {
                const ratio = denominator > 0 ? index / denominator : 0;
                const offset = utils.lerp(
                    coerceNumeric(offsetEntry.light, 0),
                    coerceNumeric(offsetEntry.dark, 0),
                    ratio
                );
                const hue = utils.normalizeHue(baseHue + offset);
                const baseLightness = getLightnessAtRatio(steps, ratio);
                const adjusted = applyLightnessAdjustments(
                    baseLightness,
                    hue,
                    index,
                    SHADE_LABELS.length,
                    snapshot.lightnessAdjustmentEnabled
                );
                return createSwatchRecord({
                    label,
                    index,
                    hue,
                    saturation,
                    lightness: adjusted,
                    offset
                });
            });
            return {
                name: definition.name || "",
                baseHue,
                shades
            };
        });
    }

    function resolveSampleVariantSettings(snapshot, variant) {
        if (!variant) {
            return null;
        }
        const baseHue = utils.normalizeHue(coerceNumeric(snapshot.primary?.hue, 0));
        const baseSaturation = utils.clamp(
            coerceNumeric(snapshot.primary?.saturation, 0),
            0,
            100
        );
        const mode = variant.mode || "primary";
        switch (mode) {
            case "primary":
                return {
                    key: variant.key || "primary",
                    mode,
                    hue: baseHue,
                    saturation: baseSaturation
                };
            case "primary-scale": {
                const scale = coerceNumeric(variant.saturationScale, 1);
                return {
                    key: variant.key || "primary-scale",
                    mode,
                    hue: baseHue,
                    saturation: utils.clamp(baseSaturation * scale, 0, 100)
                };
            }
            case "neutral":
                return {
                    key: variant.key || "neutral",
                    mode,
                    hue: baseHue,
                    saturation: 0
                };
            case "fixed": {
                const hue = utils.normalizeHue(
                    Object.prototype.hasOwnProperty.call(variant, "hue")
                        ? coerceNumeric(variant.hue, baseHue)
                        : baseHue
                );
                let saturation = baseSaturation;
                if (Object.prototype.hasOwnProperty.call(variant, "saturation")) {
                    saturation = utils.clamp(
                        coerceNumeric(variant.saturation, baseSaturation),
                        0,
                        100
                    );
                } else if (
                    Object.prototype.hasOwnProperty.call(variant, "saturationScale")
                ) {
                    const scale = coerceNumeric(variant.saturationScale, 1);
                    saturation = utils.clamp(baseSaturation * scale, 0, 100);
                }
                return {
                    key: variant.key || "fixed",
                    mode,
                    hue,
                    saturation
                };
            }
            default:
                return {
                    key: variant.key || mode,
                    mode,
                    hue: baseHue,
                    saturation: baseSaturation
                };
        }
    }

    function createSwatchRecord({
        label,
        index,
        hue,
        saturation,
        lightness,
        offset = 0
    }) {
        const normalizedHue = utils.roundTo(utils.normalizeHue(hue), 2);
        const normalizedSat = utils.roundTo(utils.clamp(saturation, 0, 100), 2);
        const normalizedLight = utils.roundTo(utils.clamp(lightness, 0, 100), 2);
        const normalizedOffset = utils.roundTo(coerceNumeric(offset, 0), 2);
        return {
            label,
            index,
            hue: normalizedHue,
            saturation: normalizedSat,
            lightness: normalizedLight,
            offset: normalizedOffset,
            hsl: `hsl(${normalizedHue}deg ${normalizedSat}% ${normalizedLight}%)`
        };
    }

    function applyLightnessAdjustments(
        baseLightness,
        hue,
        index,
        count,
        enabled
    ) {
        const sanitized = utils.clamp(coerceNumeric(baseLightness, 0), 0, 100);
        if (
            !lightnessAdjustment
            || typeof lightnessAdjustment.apply !== "function"
        ) {
            return sanitized;
        }
        try {
            return lightnessAdjustment.apply(sanitized, {
                hue,
                index,
                count,
                enabled
            });
        } catch (error) {
            console.warn("Failed to evaluate lightness adjustment for export", error);
            return sanitized;
        }
    }

    function getLightnessAtRatio(steps, ratio) {
        if (!Array.isArray(steps) || !steps.length) {
            return 0;
        }
        const clampedRatio = utils.clamp(coerceNumeric(ratio, 0), 0, 1);
        const lastIndex = steps.length - 1;
        if (lastIndex <= 0) {
            return coerceNumeric(steps[0], 0);
        }
        const exactIndex = clampedRatio * lastIndex;
        const lowerIndex = Math.floor(exactIndex);
        const upperIndex = Math.min(lastIndex, Math.ceil(exactIndex));
        const lowerValue = coerceNumeric(steps[lowerIndex], 0);
        const upperValue = coerceNumeric(steps[upperIndex], 0);
        if (upperIndex === lowerIndex) {
            return lowerValue;
        }
        const t = exactIndex - lowerIndex;
        return lowerValue + (upperValue - lowerValue) * t;
    }

    function formatPayload(payload) {
        return JSON.stringify(payload, null, 2);
    }

    async function copyToClipboard(text, textarea) {
        if (!text) {
            return false;
        }
        try {
            if (
                navigator.clipboard
                && typeof navigator.clipboard.writeText === "function"
            ) {
                await navigator.clipboard.writeText(text);
                return true;
            }
        } catch (error) {
            // Swallow clipboard API failures and try the fallback below.
        }
        if (textarea instanceof HTMLTextAreaElement) {
            const activeElement = document.activeElement;
            textarea.focus();
            textarea.select();
            let success = false;
            try {
                success = document.execCommand("copy");
            } catch (error) {
                success = false;
            }
            if (activeElement && typeof activeElement.focus === "function") {
                activeElement.focus();
            }
            return success;
        }
        return false;
    }

    function coerceNumeric(value, fallback) {
        const safeFallback = Number.isFinite(fallback) ? fallback : 0;
        if (utils && typeof utils.coerceNumber === "function") {
            return utils.coerceNumber(value, safeFallback);
        }
        const number = Number(value);
        return Number.isFinite(number) ? number : safeFallback;
    }

    root.ColorGenerator = root.ColorGenerator || {};
    root.ColorGenerator.initExportControls = initExportControls;
})(window);
