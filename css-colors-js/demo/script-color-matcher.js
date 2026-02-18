(() => {
  const ROW_SELECTOR = "[data-hue-row]";
  const CUBE_SELECTOR = "[data-hue][data-lightness]";
  const HIGHLIGHT_CLASS = "demo-cubes__item--closest";
  const DEFAULT_MATCH_WEIGHTS = Object.freeze({
    hue: 0,
    lightness: 1,
  });

  const clamp = (value, min, max) => Math.min(Math.max(value, min), max);

  const normalizeHue = (value) => {
    if (!Number.isFinite(value)) {
      return NaN;
    }
    const normalized = value % 360;
    return normalized < 0 ? normalized + 360 : normalized;
  };

  const parseNumber = (value) => {
    const parsed = Number.parseFloat(value);
    return Number.isFinite(parsed) ? parsed : NaN;
  };

  const hueDelta = (a, b) => {
    if (!Number.isFinite(a) || !Number.isFinite(b)) {
      return Number.POSITIVE_INFINITY;
    }
    const diff = Math.abs(normalizeHue(a) - normalizeHue(b)) % 360;
    return diff > 180 ? 360 - diff : diff;
  };

  const pickSaturation = (row, fallback) => {
    const fromDataset = parseNumber(row.dataset.baseSaturation);
    if (Number.isFinite(fromDataset)) {
      return clamp(fromDataset, 0, 100);
    }
    if (Number.isFinite(fallback)) {
      return clamp(fallback, 0, 100);
    }
    return 0;
  };

  const makeColorString = (hue, saturation, lightness) => {
    if (
      !Number.isFinite(hue) ||
      !Number.isFinite(saturation) ||
      !Number.isFinite(lightness)
    ) {
      return null;
    }
    const safeHue = Math.round(normalizeHue(hue));
    const safeSat = Math.round(clamp(saturation, 0, 100));
    const safeLight = Math.round(clamp(lightness, 0, 100));
    return `hsl(${safeHue}deg ${safeSat}% ${safeLight}%)`;
  };

  const readInputFromDataset = (row) => {
    const hue = parseNumber(row.dataset.inputHue);
    const saturation = parseNumber(row.dataset.inputSaturation);
    const lightness = parseNumber(row.dataset.inputLightness);
    if (
      Number.isNaN(hue) ||
      Number.isNaN(saturation) ||
      Number.isNaN(lightness)
    ) {
      return null;
    }
    return { hue, saturation, lightness };
  };

  const ensureTooltip = (row) => {
    const tooltip = row.querySelector('[data-role="color-tooltip"]');
    if (!(tooltip instanceof HTMLElement)) {
      return null;
    }
    const inputValues = tooltip.querySelector('[data-tooltip="input"]');
    const generatedValues = tooltip.querySelector(
      '[data-tooltip="generated"]'
    );
    const inputSwatch = tooltip.querySelector(
      '.colors-demo__tooltip-swatch--input'
    );
    const generatedSwatch = tooltip.querySelector(
      '.colors-demo__tooltip-swatch--generated'
    );
    return {
      tooltip,
      inputValues:
        inputValues instanceof HTMLElement ? inputValues : null,
      generatedValues:
        generatedValues instanceof HTMLElement ? generatedValues : null,
      inputSwatch:
        inputSwatch instanceof HTMLElement ? inputSwatch : null,
      generatedSwatch:
        generatedSwatch instanceof HTMLElement ? generatedSwatch : null,
    };
  };

  const updateTooltipContent = (row, tooltipRefs, input, match) => {
    const {
      tooltip,
      inputValues,
      generatedValues,
      inputSwatch,
      generatedSwatch,
    } = tooltipRefs ?? {};

    if (!tooltip) {
      return;
    }

    if (!input || !match) {
      if (inputValues) {
        inputValues.textContent = "--";
      }
      if (generatedValues) {
        generatedValues.textContent = "--";
      }
      if (inputSwatch) {
        inputSwatch.style.backgroundColor = "";
      }
      if (generatedSwatch) {
        generatedSwatch.style.backgroundColor = "";
      }
      return;
    }

    const generatedSaturation = Number.isFinite(match.saturation)
      ? match.saturation
      : pickSaturation(row, input.saturation);
    const inputString = makeColorString(
      input.hue,
      input.saturation,
      input.lightness
    );
    const generatedString = makeColorString(
      match.hue,
      generatedSaturation,
      match.lightness
    );

    if (inputValues) {
      inputValues.textContent = inputString ?? "--";
    }
    if (generatedValues) {
      generatedValues.textContent = generatedString ?? "--";
    }
    if (inputSwatch) {
      inputSwatch.style.backgroundColor = inputString ?? "";
    }
    if (generatedSwatch) {
      generatedSwatch.style.backgroundColor = generatedString ?? "";
    }
  };

  const computeWeights = (row) => {
    const hueWeight = parseNumber(row.dataset.matchHueWeight);
    const lightnessWeight = parseNumber(row.dataset.matchLightnessWeight);
    const weights = {
      hue: Number.isFinite(hueWeight) ? hueWeight : DEFAULT_MATCH_WEIGHTS.hue,
      lightness: Number.isFinite(lightnessWeight)
        ? lightnessWeight
        : DEFAULT_MATCH_WEIGHTS.lightness,
    };
    if (weights.hue === 0 && weights.lightness === 0) {
      return { ...DEFAULT_MATCH_WEIGHTS };
    }
    return weights;
  };

  const computeClosestCube = (row, input) => {
    const cubes = row.querySelectorAll(CUBE_SELECTOR);
    if (!cubes.length) {
      return null;
    }

    const weights = computeWeights(row);
    const weightedHue = Math.max(weights.hue, 0);
    const weightedLightness = Math.max(weights.lightness, 0);

    let best = null;
    cubes.forEach((cube) => {
      if (!(cube instanceof HTMLElement)) {
        return;
      }
      const cubeHue = parseNumber(cube.dataset.hue);
      const cubeLightness = parseNumber(cube.dataset.lightness);
      const cubeSaturation = parseNumber(cube.dataset.saturation);
      if (Number.isNaN(cubeHue) || Number.isNaN(cubeLightness)) {
        return;
      }
      const hueDiff = hueDelta(cubeHue, input.hue);
      const lightnessDiff = Math.abs(cubeLightness - input.lightness);
      const distance = hueDiff * weightedHue + lightnessDiff * weightedLightness;
      if (
        !best ||
        distance < best.distance ||
        (distance === best.distance && hueDiff < best.hueDiff)
      ) {
        best = {
          cube,
          hue: cubeHue,
          lightness: cubeLightness,
          saturation: cubeSaturation,
          hueDiff,
          lightnessDiff,
          distance,
        };
      }
    });

    return best;
  };

  const initializeRow = (row) => {
    if (!(row instanceof HTMLElement)) {
      return;
    }

    const tooltipRefs = ensureTooltip(row);
    if (!tooltipRefs) {
      return;
    }

    const { tooltip } = tooltipRefs;

    const setTooltipVisibility = (isVisible) => {
      if (!tooltip) {
        return;
      }
      const visible = Boolean(isVisible);
      tooltip.classList.toggle("is-visible", visible);
      if (visible) {
        tooltip.removeAttribute("hidden");
        tooltip.setAttribute("aria-hidden", "false");
      } else {
        tooltip.setAttribute("hidden", "");
        tooltip.setAttribute("aria-hidden", "true");
      }
    };

    const state = {
      input: readInputFromDataset(row),
      match: null,
      hoverBinding: null,
    };

    const detachHover = () => {
      if (!state.hoverBinding) {
        return;
      }
      const { cube, handleEnter, handleLeave } = state.hoverBinding;
      cube.removeEventListener("mouseenter", handleEnter);
      cube.removeEventListener("mouseleave", handleLeave);
      cube.removeEventListener("focus", handleEnter);
      cube.removeEventListener("blur", handleLeave);
      state.hoverBinding = null;
    };

    const attachHover = (cube) => {
      if (!(cube instanceof HTMLElement)) {
        return;
      }
      detachHover();
      const hoverState = {
        cube,
        handleEnter: null,
        handleLeave: null,
        active: false,
      };
      const handleEnter = () => {
        hoverState.active = true;
        setTooltipVisibility(true);
      };
      const handleLeave = () => {
        hoverState.active = false;
        setTooltipVisibility(false);
      };
      hoverState.handleEnter = handleEnter;
      hoverState.handleLeave = handleLeave;
      cube.addEventListener("mouseenter", handleEnter);
      cube.addEventListener("mouseleave", handleLeave);
      cube.addEventListener("focus", handleEnter);
      cube.addEventListener("blur", handleLeave);
      state.hoverBinding = hoverState;
    };

    const releaseTooltip = () => {
      detachHover();
      setTooltipVisibility(false);
      row.appendChild(tooltip);
    };

    const highlight = (match) => {
      const previousCube = state.match?.cube;
      const nextCube = match?.cube;

      if (previousCube && previousCube !== nextCube) {
        previousCube.classList.remove(HIGHLIGHT_CLASS);
      }

      if (!nextCube) {
        if (previousCube) {
          previousCube.classList.remove(HIGHLIGHT_CLASS);
        }
        updateTooltipContent(row, tooltipRefs, null, null);
        releaseTooltip();
        state.match = null;
        return;
      }

      if (previousCube !== nextCube) {
        detachHover();
        nextCube.appendChild(tooltip);
        attachHover(nextCube);
      }

      nextCube.classList.add(HIGHLIGHT_CLASS);
      updateTooltipContent(row, tooltipRefs, state.input, match);
      const shouldShow = Boolean(state.hoverBinding?.active);
      setTooltipVisibility(shouldShow);
      state.match = match;
    };

    const recompute = () => {
      if (!state.input) {
        highlight(null);
        return;
      }
      const match = computeClosestCube(row, state.input);
      highlight(match);
    };

    const handleInput = (event) => {
      const color = event?.detail?.color;
      if (
        color &&
        Number.isFinite(color.hue) &&
        Number.isFinite(color.saturation) &&
        Number.isFinite(color.lightness)
      ) {
        state.input = color;
        recompute();
      } else {
        state.input = null;
        highlight(null);
      }
    };

    const handleRowUpdate = () => {
      recompute();
    };

    row.addEventListener("color-demo:input", handleInput);
    row.addEventListener("hue-offset:update", handleRowUpdate);

    updateTooltipContent(row, tooltipRefs, state.input, null);
    setTooltipVisibility(false);
    recompute();
  };

  const initialize = () => {
    const rows = document.querySelectorAll(ROW_SELECTOR);
    if (!rows.length) {
      return;
    }
    rows.forEach((row) => initializeRow(row));
  };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initialize, { once: true });
  } else {
    initialize();
  }
})();
