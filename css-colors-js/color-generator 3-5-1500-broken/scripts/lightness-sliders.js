(function (root) {
    const state = root.ColorGenerator?.state;
    const utils = root.ColorGenerator?.utils;
    const config = root.ColorGenerator?.config;

    if (!state || !utils || !config) {
        throw new Error(
            "ColorGenerator.initLightnessControls requires state, utils, and config modules."
        );
    }

    function initLightnessControls(container) {
        const lightInput = container?.querySelector?.("#top-light-slider");
        const darkInput = container?.querySelector?.("#top-dark-slider");

        const range = config.LIGHT_CONTROL_RANGE;
        const defaultLight = config.DEFAULT_LIGHT_CONTROL;
        const defaultDark = config.DEFAULT_DARK_CONTROL;

        if (
            !(lightInput instanceof HTMLInputElement)
            || !(darkInput instanceof HTMLInputElement)
        ) {
            return;
        }

        lightInput.min = String(range.min);
        lightInput.max = String(range.max);
        lightInput.step = String(range.step);
        if (!lightInput.value) {
            lightInput.value = String(defaultLight);
        }

        darkInput.min = String(range.min);
        darkInput.max = String(range.max);
        darkInput.step = String(range.step);
        if (!darkInput.value) {
            darkInput.value = String(defaultDark);
        }

        let syncing = false;

        const applyInputs = () => {
            if (syncing) {
                return;
            }
            const lightValue = utils.toNumber(lightInput.value, defaultLight);
            const darkValue = utils.toNumber(darkInput.value, defaultDark);
            state.setLightControls({ light: lightValue, dark: darkValue });
        };

        state.subscribe((snapshot) => {
            syncing = true;
            const nextLight = snapshot.controls.light;
            const nextDark = snapshot.controls.dark;
            if (Number(lightInput.value) !== Number(nextLight)) {
                lightInput.value = String(nextLight);
            }
            if (Number(darkInput.value) !== Number(nextDark)) {
                darkInput.value = String(nextDark);
            }
            syncing = false;
        });

        lightInput.addEventListener("input", applyInputs);
        darkInput.addEventListener("input", applyInputs);

        applyInputs();
    }

    function initLightnessAdjustmentControls(container) {
        if (!container) {
            return;
        }

        const sliderEntries = Array.from(
            container.querySelectorAll("[data-adjustment-slider]")
        )
            .filter(input => input instanceof HTMLInputElement)
            .map((input) => {
                const range = input.dataset.adjustmentRange;
                const field = input.dataset.adjustmentField;
                if (!range || !field) {
                    return null;
                }
                const output = input.parentElement?.querySelector?.(
                    "[data-adjustment-value]"
                );
                return {
                    input,
                    range,
                    field,
                    output: output instanceof HTMLElement ? output : null
                };
            })
            .filter(Boolean);

        if (!sliderEntries.length) {
            return;
        }

        const toggle = container.querySelector("[data-lightness-adjust-toggle]");
        let syncing = false;

        const applyOutput = (entry, value) => {
            if (!entry?.output) {
                return;
            }
            if (!Number.isFinite(value)) {
                entry.output.textContent = "";
                return;
            }
            entry.output.textContent = formatAdjustmentValue(entry.field, value);
        };

        const handleInput = (entry) => {
            entry.input.addEventListener("input", () => {
                const value = Number(entry.input.value);
                applyOutput(entry, value);
                if (syncing || !Number.isFinite(value)) {
                    return;
                }
                state.setLightnessAdjustment(entry.range, entry.field, value);
            });
        };

        sliderEntries.forEach(handleInput);

        if (toggle instanceof HTMLInputElement) {
            toggle.addEventListener("change", () => {
                if (syncing) {
                    return;
                }
                state.setLightnessAdjustmentEnabled(Boolean(toggle.checked));
            });
        }

        state.subscribe((snapshot) => {
            syncing = true;
            const adjustments = snapshot.lightnessAdjustments || {};
            sliderEntries.forEach((entry) => {
                const nextValue = adjustments?.[entry.range]?.[entry.field];
                if (Number.isFinite(nextValue)) {
                    if (Number(entry.input.value) !== Number(nextValue)) {
                        entry.input.value = String(nextValue);
                    }
                    applyOutput(entry, nextValue);
                }
            });
            if (toggle instanceof HTMLInputElement) {
                const nextChecked = Boolean(snapshot.lightnessAdjustmentEnabled);
                if (toggle.checked !== nextChecked) {
                    toggle.checked = nextChecked;
                }
            }
            syncing = false;
        });
    }

    function formatAdjustmentValue(field, value) {
        if (!Number.isFinite(value)) {
            return "";
        }
        const decimals = field === "lightnessAmplitude" ? 2 : 2;
        const formatted = value.toFixed(decimals);
        return formatted.replace(/(\.\d*?[1-9])0+$|\.0+$/u, "$1");
    }

    root.ColorGenerator = root.ColorGenerator || {};
    root.ColorGenerator.initLightnessControls = initLightnessControls;
    root.ColorGenerator.initLightnessAdjustmentControls
        = initLightnessAdjustmentControls;
})(window);
