(function (root) {
  const config = root.ColorGenerator?.config;
  const state = root.ColorGenerator?.state;

  if (!config) {
    throw new Error(
      "ColorGenerator.initHueGrid requires config to load first."
    );
  }

  const sliderRange = config.HUE_SLIDER_RANGE || { min: -30, max: 30 };

  function initHueGrid(container) {
    if (!(container instanceof HTMLElement)) {
      return;
    }

    const offsetSubscriptions = new Map();

    const rebuild = (paletteKey) => {
      detachAll(offsetSubscriptions);
      container.textContent = "";

      const definitions =
        state && typeof state.getHueDefinitions === "function"
          ? state.getHueDefinitions(paletteKey)
          : [];

      if (!definitions.length) {
        if (state) {
          state.registerHueRows([]);
        }
        return;
      }

      const fragment = document.createDocumentFragment();
      const rows = [];

      definitions.forEach((definition) => {
        if (!definition?.name) {
          return;
        }
        const name = definition.name;
        const baseHue = Number.isFinite(definition.baseHue)
          ? definition.baseHue
          : 0;
        const layout = document.createElement("div");
        layout.className = "color-output__layout color-output__layout--hue";
        layout.dataset.hueRow = name;
        layout.dataset.hueValue = String(baseHue);
        if (definition.family) {
          layout.dataset.hueFamily = definition.family;
        }

        layout.appendChild(createSliderColumn(name, baseHue, "light"));
        layout.appendChild(createSamplesColumn());
        layout.appendChild(createSliderColumn(name, baseHue, "dark"));

        fragment.appendChild(layout);
        rows.push({ element: layout, name, baseHue });
      });

      container.appendChild(fragment);

      if (state) {
        state.registerHueRows(
          rows.map((entry) => ({
            element: entry.element,
            name: entry.name,
            baseHue: entry.baseHue,
          }))
        );
        rows.forEach((entry) =>
          attachRowEvents(entry.element, entry.name, offsetSubscriptions)
        );
      }
    };

    if (!state || typeof state.subscribe !== "function") {
      rebuild(config.DEFAULT_PALETTE || "practical");
      return;
    }

    let currentPalette = null;
    state.subscribe((snapshot) => {
      const paletteKey = snapshot && snapshot.palette;
      if (typeof paletteKey === "string" && paletteKey !== currentPalette) {
        currentPalette = paletteKey;
        rebuild(paletteKey);
      } else if (!currentPalette) {
        currentPalette = config.DEFAULT_PALETTE || "practical";
        rebuild(currentPalette);
      }
    });
  }

  function createSliderColumn(name, baseHue, position) {
    const column = document.createElement("div");
    column.className = "color-output__column color-output__column--slider";
    column.dataset.hueSlider = position;

    const input = document.createElement("input");
    input.type = "range";
    const safeName = name.replace(/[^a-z0-9-]/gi, "-");
    input.id = `hue-${safeName}-${position}`;
    input.className = "color-output__slider-input";
    input.min = String(sliderRange.min);
    input.max = String(sliderRange.max);
    input.value = String(getDefaultSliderValue(name, position));
    input.dataset.hueSliderInput = position;
    input.dataset.hueSliderName = name;

    column.appendChild(input);
    return column;
  }

  function createSamplesColumn() {
    const column = document.createElement("div");
    column.className = "color-output__column color-output__column--samples";
    column.dataset.hueSwatches = "";

    const fragment = document.createDocumentFragment();

    for (let index = 0; index < config.SAMPLE_COUNT; index += 1) {
      const swatch = document.createElement("span");
      swatch.className = "color-output__swatch";
      if (index === 0) {
        swatch.dataset.lightness = "100";
      } else if (index === config.SAMPLE_COUNT - 1) {
        swatch.dataset.lightness = "0";
      }
      fragment.appendChild(swatch);
    }

    column.appendChild(fragment);
    return column;
  }

  function attachRowEvents(rowElement, name, subscriptions) {
    if (!(rowElement instanceof HTMLElement) || !state) {
      return;
    }

    const sliders = rowElement.querySelectorAll("input[data-hue-slider-input]");
    if (!sliders.length) {
      return;
    }

    if (subscriptions && subscriptions.has(name)) {
      const unsubscribe = subscriptions.get(name);
      if (typeof unsubscribe === "function") {
        unsubscribe();
      }
      subscriptions.delete(name);
    }

    const dispatch = () => {
      const values = Array.from(sliders).reduce(
        (acc, input) => {
          if (!(input instanceof HTMLInputElement)) {
            return acc;
          }
          const side = input.dataset.hueSliderInput;
          if (side === "light" || side === "dark") {
            acc[side] = Number(input.value);
          }
          return acc;
        },
        { light: 0, dark: 0 }
      );
      state.setHueRowOffset(name, values);
    };

    sliders.forEach((slider) => {
      if (slider instanceof HTMLInputElement) {
        slider.addEventListener("input", dispatch);
      }
    });

    const unsubscribe = state.onHueRowOffset(name, (offsets) => {
      sliders.forEach((slider) => {
        if (!(slider instanceof HTMLInputElement)) {
          return;
        }
        const side = slider.dataset.hueSliderInput;
        if (side === "light" || side === "dark") {
          const nextValue = offsets[side];
          if (Number(slider.value) !== Number(nextValue)) {
            slider.value = String(nextValue);
          }
        }
      });
    });

    if (subscriptions) {
      subscriptions.set(name, unsubscribe);
    }

    dispatch();
  }

  function getDefaultSliderValue(name, position) {
    if (!state || typeof state.getSnapshot !== "function") {
      return 0;
    }
    const snapshot = state.getSnapshot();
    const offsets = snapshot?.hueRowOffsets?.[name];
    if (!offsets) {
      return 0;
    }
    const value = position === "light" ? offsets.light : offsets.dark;
    const number = Number(value);
    if (!Number.isFinite(number)) {
      return 0;
    }
    return Math.min(Math.max(number, sliderRange.min), sliderRange.max);
  }

  function detachAll(subscriptions) {
    if (!subscriptions) {
      return;
    }
    subscriptions.forEach((unsubscribe) => {
      if (typeof unsubscribe === "function") {
        unsubscribe();
      }
    });
    subscriptions.clear();
  }

  root.ColorGenerator = root.ColorGenerator || {};
  root.ColorGenerator.initHueGrid = initHueGrid;
})(window);
