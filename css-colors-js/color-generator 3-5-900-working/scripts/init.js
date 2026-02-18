(function () {
  const scripts = [
    "./scripts/input-slider.js",
    "./scripts/input-color.js",
    "./scripts/input-samples.js",
    "./scripts/hue-grid.js",
  ];

  Promise.all(scripts.map(loadScript)).then(initialize);

  function loadScript(src) {
    return new Promise((resolve, reject) => {
      const element = document.createElement("script");
      element.src = src;
      element.addEventListener("load", resolve, { once: true });
      element.addEventListener("error", reject, { once: true });
      document.head.appendChild(element);
    });
  }

  function initialize() {
    const registry = window.ColorGenerator;
    if (!registry) {
      return;
    }

    const form = document.querySelector("[data-color-form]");
    if (form) {
      if (
        form.querySelector("[data-color-sliders]") &&
        typeof registry.initSlider === "function"
      ) {
        registry.initSlider(form);
      }

      if (
        form.querySelector("[data-color-input]") &&
        typeof registry.initColorInput === "function"
      ) {
        registry.initColorInput(form);
      }
    }

    const samplesContainer = document.querySelector("[data-color-samples]");
    if (samplesContainer && typeof registry.initSamples === "function") {
      registry.initSamples(samplesContainer);
    }

    const hueGrid = document.querySelector("[data-hue-grid]");
    if (hueGrid && typeof registry.initHueGrid === "function") {
      registry.initHueGrid(hueGrid);
    }
  }
})();
