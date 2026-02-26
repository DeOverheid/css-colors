(function (root) {
    const state = root.ColorGenerator?.state;
    const config = root.ColorGenerator?.config;

    if (!state || !config) {
        throw new Error(
            "ColorGenerator.initSlider requires state and config modules to load first."
        );
    }

    function initSlider(form) {
        if (!state || !form) {
            return;
        }

        const hueInput = form.querySelector("[data-color-hue]");
        const saturationInput = form.querySelector("[data-color-saturation]");
        const lightnessInput = form.querySelector("[data-color-lightness]");
        const outputRoot = form.querySelector("[data-color-output]");
        const outputHue = outputRoot?.querySelector("[data-output-hue]");
        const outputSaturation = outputRoot?.querySelector(
            "[data-output-saturation]"
        );
        const outputLightness = outputRoot?.querySelector(
            "[data-output-lightness]"
        );

        if (!(hueInput instanceof HTMLInputElement)) {
            return;
        }
        if (!(saturationInput instanceof HTMLInputElement)) {
            return;
        }
        if (!(lightnessInput instanceof HTMLInputElement)) {
            return;
        }

        const defaults = {
            hue: getDefaultValue(hueInput, config?.DEFAULT_HUE ?? 0),
            saturation: getDefaultValue(
                saturationInput,
                config?.DEFAULT_SATURATION ?? 0
            ),
            lightness: getDefaultValue(
                lightnessInput,
                config?.DEFAULT_LIGHTNESS ?? 50
            )
        };

        let syncing = false;

        function renderOutputs(hueValue, saturationValue, lightnessValue) {
            if (outputHue) {
                outputHue.textContent = `${Math.round(hueValue)}°`;
            }
            if (outputSaturation) {
                outputSaturation.textContent = `${Math.round(saturationValue)}%`;
            }
            if (outputLightness) {
                outputLightness.textContent = `${Math.round(lightnessValue)}%`;
            }
        }

        function applySliderValues() {
            if (syncing) {
                return;
            }
            const hueValue = readNumericValue(hueInput, defaults.hue);
            const saturationValue = readNumericValue(
                saturationInput,
                defaults.saturation
            );
            const lightnessValue = readNumericValue(
                lightnessInput,
                defaults.lightness
            );
            renderOutputs(hueValue, saturationValue, lightnessValue);
            state.setPrimaryFromSliders({
                hue: hueValue,
                saturation: saturationValue,
                lightness: lightnessValue
            });
        }

        hueInput.addEventListener("input", applySliderValues);
        saturationInput.addEventListener("input", applySliderValues);
        lightnessInput.addEventListener("input", applySliderValues);

        state.subscribe((snapshot) => {
            syncing = true;
            if (Number(hueInput.value) !== Number(snapshot.primary.hue)) {
                hueInput.value = String(Math.round(snapshot.primary.hue));
            }
            if (
                Number(saturationInput.value) !== Number(snapshot.primary.saturation)
            ) {
                saturationInput.value = String(Math.round(snapshot.primary.saturation));
            }
            if (Number(lightnessInput.value) !== Number(snapshot.primary.lightness)) {
                lightnessInput.value = String(Math.round(snapshot.primary.lightness));
            }
            renderOutputs(
                snapshot.primary.hue,
                snapshot.primary.saturation,
                snapshot.primary.lightness
            );
            syncing = false;
        });

        applySliderValues();
    }

    function getDefaultValue(input, fallback) {
        if (!input) {
            return fallback;
        }
        const valueAttr = input.getAttribute("value");
        if (valueAttr && Number.isFinite(Number(valueAttr))) {
            return Number(valueAttr);
        }
        const minAttr = input.getAttribute("min");
        if (minAttr && Number.isFinite(Number(minAttr))) {
            return Number(minAttr);
        }
        return fallback;
    }

    function readNumericValue(input, fallback) {
        if (!input) {
            return fallback;
        }
        const number = Number(input.value);
        return Number.isFinite(number) ? number : fallback;
    }

    root.ColorGenerator = root.ColorGenerator || {};
    root.ColorGenerator.initSlider = initSlider;
})(window);
