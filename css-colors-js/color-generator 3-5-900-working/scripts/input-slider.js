(function (root) {
  function initSlider(form) {
    const hueInput = form.querySelector("[data-color-hue]");
    const saturationInput = form.querySelector("[data-color-saturation]");
    const outputRoot = form.querySelector("[data-color-output]");
    const outputHue = outputRoot?.querySelector("[data-output-hue]");
    const outputSaturation = outputRoot?.querySelector(
      "[data-output-saturation]"
    );

    if (!hueInput || !saturationInput) {
      return;
    }

    const defaultHue = getDefaultValue(hueInput, 0);
    const defaultSaturation = getDefaultValue(saturationInput, 0);

    function renderOutputs() {
      const hueValue = readNumericValue(hueInput, defaultHue);
      const saturationValue = readNumericValue(
        saturationInput,
        defaultSaturation
      );

      if (outputHue) {
        outputHue.textContent = `${hueValue}°`;
      }
      if (outputSaturation) {
        outputSaturation.textContent = `${saturationValue}%`;
      }
    }

    hueInput.addEventListener("input", renderOutputs);
    saturationInput.addEventListener("input", renderOutputs);
    renderOutputs();
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
