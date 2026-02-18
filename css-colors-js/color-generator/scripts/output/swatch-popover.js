(function (root) {
  const utils = root.ColorGenerator?.utils;

  if (!utils) {
    throw new Error(
      "ColorGenerator.initSwatchPopover requires utils to be loaded first."
    );
  }

  const SWATCH_SELECTOR = ".color-output__swatch";

  let initialized = false;
  let cleanup = null;

  function initSwatchPopover(scope = document) {
    if (initialized) {
      return;
    }
    initialized = true;

    const popoverRefs = createPopover();
    let currentHost = null;

    const clearPopover = () => {
      if (currentHost instanceof HTMLElement) {
        currentHost.classList.remove("color-output__swatch--popover");
      }
      if (popoverRefs.element.parentElement) {
        popoverRefs.element.parentElement.removeChild(popoverRefs.element);
      }
      currentHost = null;
    };

    const renderPopover = (swatch) => {
      if (!(swatch instanceof HTMLElement)) {
        return;
      }

      if (!swatch.contains(popoverRefs.element)) {
        if (popoverRefs.element.parentElement) {
          popoverRefs.element.parentElement.removeChild(popoverRefs.element);
        }
        swatch.appendChild(popoverRefs.element);
      }

      updateContent(popoverRefs, swatch);
      if (currentHost && currentHost !== swatch) {
        currentHost.classList.remove("color-output__swatch--popover");
      }
      currentHost = swatch;
      currentHost.classList.add("color-output__swatch--popover");
    };

    const handlePointerOver = (event) => {
      const target = event.target;
      if (!(target instanceof Element)) {
        return;
      }
      const swatch = target.closest(SWATCH_SELECTOR);
      if (!swatch || swatch === currentHost) {
        return;
      }
      renderPopover(swatch);
    };

    const handleFocusIn = (event) => {
      const target = event.target;
      if (!(target instanceof Element)) {
        return;
      }
      const swatch = target.closest(SWATCH_SELECTOR);
      if (!swatch || swatch === currentHost) {
        return;
      }
      renderPopover(swatch);
    };

    const handlePointerOut = (event) => {
      const target = event.target;
      if (!(target instanceof Element)) {
        return;
      }
      if (!target.closest(SWATCH_SELECTOR)) {
        return;
      }
      const related = event.relatedTarget;
      if (related instanceof Element && related.closest(SWATCH_SELECTOR)) {
        return;
      }
      clearPopover();
    };

    const handleFocusOut = (event) => {
      const target = event.target;
      if (!(target instanceof Element)) {
        return;
      }
      if (!target.closest(SWATCH_SELECTOR)) {
        return;
      }
      const related = event.relatedTarget;
      if (related instanceof Element && related.closest(SWATCH_SELECTOR)) {
        return;
      }
      clearPopover();
    };

    scope.addEventListener("pointerover", handlePointerOver);
    scope.addEventListener("focusin", handleFocusIn);
    scope.addEventListener("pointerout", handlePointerOut);
    scope.addEventListener("focusout", handleFocusOut);

    cleanup = () => {
      scope.removeEventListener("pointerover", handlePointerOver);
      scope.removeEventListener("focusin", handleFocusIn);
      scope.removeEventListener("pointerout", handlePointerOut);
      scope.removeEventListener("focusout", handleFocusOut);
      clearPopover();
    };
  }

  function destroySwatchPopover() {
    if (!initialized) {
      return;
    }
    initialized = false;
    if (typeof cleanup === "function") {
      cleanup();
    }
    cleanup = null;
  }

  function createPopover() {
    const element = document.createElement("div");
    element.className = "color-output__popover";
    element.setAttribute("role", "tooltip");

    const title = document.createElement("p");
    title.className = "color-output__popover-heading";

    const nameNode = document.createElement("span");
    nameNode.dataset.popoverName = "";
    const baseNode = document.createElement("span");
    baseNode.dataset.popoverBase = "";
    const offsetNode = document.createElement("span");
    offsetNode.dataset.popoverOffset = "";

    title.appendChild(nameNode);
    title.appendChild(document.createTextNode(" - "));
    title.appendChild(baseNode);
    title.appendChild(document.createTextNode(" - "));
    title.appendChild(offsetNode);

    const list = document.createElement("ul");
    list.className = "color-output__popover-list";

    const hueItem = createListItem("Hue:");
    const saturationItem = createListItem("Saturation:");
    const lightnessItem = createListItem("Lightness:");
    const hslItem = createListItem("HSL:");
    const hexItem = createListItem("HEX:");

    element.appendChild(title);
    element.appendChild(list);

    list.appendChild(hueItem.container);
    list.appendChild(saturationItem.container);
    list.appendChild(lightnessItem.container);
    list.appendChild(hslItem.container);
    list.appendChild(hexItem.container);

    return {
      element,
      heading: {
        name: nameNode,
        base: baseNode,
        offset: offsetNode,
      },
      values: {
        hue: hueItem.value,
        saturation: saturationItem.value,
        lightness: lightnessItem.value,
        hsl: hslItem.value,
        hex: hexItem.value,
      },
    };
  }

  function createListItem(labelText) {
    const container = document.createElement("li");
    container.className = "color-output__popover-item";

    const label = document.createElement("span");
    label.className = "color-output__popover-label";
    label.textContent = labelText;

    const value = document.createElement("span");
    value.className = "color-output__popover-value";

    container.appendChild(label);
    container.appendChild(value);

    return { container, value };
  }

  function updateContent(refs, swatch) {
    if (!refs || !swatch) {
      return;
    }

    const data = readSwatchData(swatch);

    refs.heading.name.textContent = data.name;
    refs.heading.base.textContent = data.baseText;
    refs.heading.offset.textContent = data.offsetText;

    refs.values.hue.textContent = data.hueText;
    refs.values.saturation.textContent = data.saturationText;
    refs.values.lightness.textContent = data.lightnessText;
    refs.values.hsl.textContent = data.hslText;
    refs.values.hex.textContent = data.hexText;
  }

  function readSwatchData(swatch) {
    const row = swatch.closest("[data-hue-row], [data-sample-row]");
    const nameKey = row?.dataset.hueRow || row?.dataset.sampleRow || "Sample";
    const formattedName = formatName(nameKey);

    const baseHueRaw = row?.dataset.actualHue || row?.dataset.hueValue;
    const baseHue = utils.toNumber(
      baseHueRaw,
      utils.toNumber(swatch.dataset.hue, 0)
    );
    const offsetValue =
      row && swatch.dataset.offset !== undefined
        ? utils.toNumber(swatch.dataset.offset, 0)
        : 0;

    const hue = utils.toNumber(swatch.dataset.hue, baseHue + offsetValue);
    const saturation = utils.toNumber(swatch.dataset.saturation, 0);
    const lightness = utils.toNumber(swatch.dataset.lightness, 0);

    const hex = hslToHex(hue, saturation, lightness);

    return {
      name: formattedName,
      baseText: formatDegrees(baseHue),
      offsetText: formatSignedDegrees(offsetValue),
      hueText: formatDegrees(hue),
      saturationText: formatPercent(saturation),
      lightnessText: formatPercent(lightness),
      hslText: formatHslString(hue, saturation, lightness),
      hexText: hex,
    };
  }

  function formatName(value) {
    if (!value) {
      return "Sample";
    }
    return value
      .toString()
      .replace(/[-_]+/g, " ")
      .replace(/\b\w/g, (char) => char.toUpperCase());
  }

  function formatDegrees(value) {
    if (!Number.isFinite(value)) {
      return "--";
    }
    return `${value.toFixed(2)} deg`;
  }

  function formatSignedDegrees(value) {
    if (!Number.isFinite(value) || value === 0) {
      return "0.00 deg";
    }
    const prefix = value > 0 ? "+" : "";
    return `${prefix}${value.toFixed(2)} deg`;
  }

  function formatPercent(value) {
    if (!Number.isFinite(value)) {
      return "--";
    }
    return `${value.toFixed(2)}%`;
  }

  function formatHslString(hue, saturation, lightness) {
    if (
      !Number.isFinite(hue) ||
      !Number.isFinite(saturation) ||
      !Number.isFinite(lightness)
    ) {
      return "hsl(--, --%, --%)";
    }
    return `hsl(${hue.toFixed(2)}, ${saturation.toFixed(
      2
    )}%, ${lightness.toFixed(2)}%)`;
  }

  function hslToHex(h, s, l) {
    if (!Number.isFinite(h) || !Number.isFinite(s) || !Number.isFinite(l)) {
      return "#--------";
    }
    const hue = ((h % 360) + 360) % 360;
    const saturation = utils.clamp(s, 0, 100) / 100;
    const lightness = utils.clamp(l, 0, 100) / 100;

    if (saturation === 0) {
      const value = Math.round(lightness * 255);
      const hex = value.toString(16).padStart(2, "0");
      return `#${hex}${hex}${hex}`.toUpperCase();
    }

    const c = (1 - Math.abs(2 * lightness - 1)) * saturation;
    const segment = hue / 60;
    const x = c * (1 - Math.abs((segment % 2) - 1));
    let r1 = 0;
    let g1 = 0;
    let b1 = 0;

    if (segment >= 0 && segment < 1) {
      r1 = c;
      g1 = x;
    } else if (segment >= 1 && segment < 2) {
      r1 = x;
      g1 = c;
    } else if (segment >= 2 && segment < 3) {
      g1 = c;
      b1 = x;
    } else if (segment >= 3 && segment < 4) {
      g1 = x;
      b1 = c;
    } else if (segment >= 4 && segment < 5) {
      r1 = x;
      b1 = c;
    } else {
      r1 = c;
      b1 = x;
    }

    const m = lightness - c / 2;
    const r = Math.round((r1 + m) * 255);
    const g = Math.round((g1 + m) * 255);
    const b = Math.round((b1 + m) * 255);

    return `#${toHex(r)}${toHex(g)}${toHex(b)}`.toUpperCase();
  }

  function toHex(value) {
    return Math.min(255, Math.max(0, value)).toString(16).padStart(2, "0");
  }

  root.ColorGenerator = root.ColorGenerator || {};
  root.ColorGenerator.initSwatchPopover = initSwatchPopover;
  root.ColorGenerator.destroySwatchPopover = destroySwatchPopover;
})(window);
