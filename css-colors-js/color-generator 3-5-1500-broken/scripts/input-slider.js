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
    const outputRoot = form.querySelector("[data-color-output]");
    const outputHue = outputRoot?.querySelector("[data-output-hue]");
    const outputSaturation = outputRoot?.querySelector(
      "[data-output-saturation]"
    );

    if (!(hueInput instanceof HTMLInputElement)) {
      return;
    }
    if (!(saturationInput instanceof HTMLInputElement)) {
      return;
    }

    const defaults = {
      hue: getDefaultValue(hueInput, config?.DEFAULT_HUE ?? 0),
      saturation: getDefaultValue(
        saturationInput,
        config?.DEFAULT_SATURATION ?? 0
      ),
    };

    let syncing = false;

    function renderOutputs(hueValue, saturationValue) {
      if (outputHue) {
        outputHue.textContent = `${Math.round(hueValue)}°`;
      }
      if (outputSaturation) {
        outputSaturation.textContent = `${Math.round(saturationValue)}%`;
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
      renderOutputs(hueValue, saturationValue);
      state.setPrimaryFromSliders({
        hue: hueValue,
        saturation: saturationValue,
      });
    }

    hueInput.addEventListener("input", applySliderValues);
    saturationInput.addEventListener("input", applySliderValues);

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
      renderOutputs(snapshot.primary.hue, snapshot.primary.saturation);
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
