(function () {
  const scripts = [
    "./scripts/config/practical.js",
    "./scripts/config/tailwind.js",
    "./scripts/config/config.js",
    "./scripts/core/utils.js",
    "./scripts/core/lightness-curve.js",
    "./scripts/core/lightness-adjustment.js",
    "./scripts/core/state.js",
    "./scripts/input/color-parser.js",
    "./scripts/input/input-slider.js",
    "./scripts/input/input-color.js",
    "./scripts/input/palette-toggle.js",
    "./scripts/input/input-samples.js",
    "./scripts/input/hue-grid.js",
    "./scripts/output/render.js",
    "./scripts/output/swatch-popover.js",
    "./scripts/output/export-config.js",
    "./scripts/input/lightness-sliders.js",
  ];

  loadScriptsSequentially(scripts)
    .then(initialize)
    .catch((error) => {
      console.error("Failed to load ColorGenerator scripts", error);
    });

  function loadScript(src) {
    return new Promise((resolve, reject) => {
      const element = document.createElement("script");
      element.src = src;
      element.addEventListener("load", resolve, { once: true });
      element.addEventListener("error", reject, { once: true });
      document.head.appendChild(element);
    });
  }

  function loadScriptsSequentially(list) {
    return list.reduce((promise, src) => {
      return promise.then(() => loadScript(src));
    }, Promise.resolve());
  }

  function initialize() {
    const registry = window.ColorGenerator;
    if (!registry) {
      return;
    }

    const form = document.querySelector("[data-color-form]");
    if (typeof registry.initRenderer === "function") {
      registry.initRenderer();
    }

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

    const systemSelector = document.querySelector("[data-palette-selector]");
    if (systemSelector && typeof registry.initPaletteToggle === "function") {
      registry.initPaletteToggle(systemSelector);
    }

    const hueGrid = document.querySelector("[data-hue-grid]");
    if (hueGrid && typeof registry.initHueGrid === "function") {
      registry.initHueGrid(hueGrid);
    }

    const topLayout = document.querySelector(".color-output__layout--top");
    if (topLayout && typeof registry.initLightnessControls === "function") {
      registry.initLightnessControls(topLayout);
    }

    const adjustmentControls = document.querySelector(
      "[data-lightness-adjustments]"
    );
    if (
      adjustmentControls &&
      typeof registry.initLightnessAdjustmentControls === "function"
    ) {
      registry.initLightnessAdjustmentControls(adjustmentControls);
    }

    const exportPanel = document.querySelector("[data-export-panel]");
    if (exportPanel && typeof registry.initExportControls === "function") {
      registry.initExportControls(exportPanel);
    }

    const main = document.querySelector("main");
    if (typeof registry.initSwatchPopover === "function") {
      registry.initSwatchPopover(main || document);
    }
  }
})();
