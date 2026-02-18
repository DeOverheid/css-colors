const rowsRegistry = new WeakMap();

const clamp = (value, min, max) => Math.min(Math.max(value, min), max);

const normalizeAngle = (value) => {
  const normalized = Number.isFinite(value) ? value % 360 : 0;
  return normalized < 0 ? normalized + 360 : normalized;
};

const formatOffset = (value) => {
  const rounded = Math.round(value);
  if (rounded > 0) {
    return `+${rounded}deg`;
  }
  if (rounded < 0) {
    return `${rounded}deg`;
  }
  return "0deg";
};

const initializeHueRow = (row) => {
  if (!(row instanceof HTMLElement)) {
    return;
  }

  if (rowsRegistry.has(row)) {
    const existing = rowsRegistry.get(row);
    existing.update();
    return existing;
  }

  const stepCount = Number.parseInt(row.dataset.stepCount ?? "12", 10) || 12;

  if (
    !window.LightnessCurve ||
    typeof window.LightnessCurve.generate !== "function"
  ) {
    return;
  }

  const lightnessSteps = window.LightnessCurve.generate({ stepCount });
  const cubesContainer = row.querySelector('[data-role="cubes"]');
  const primaryHost =
    row.querySelector('[data-role="cubes-primary"]') || cubesContainer;
  const secondaryHost = row.querySelector('[data-role="cubes-secondary"]');
  const leftSlider = row.querySelector('input[data-side="left"]');
  const rightSlider = row.querySelector('input[data-side="right"]');
  const leftOutput = row.querySelector('[data-output="left"]');
  const rightOutput = row.querySelector('[data-output="right"]');

  if (
    !primaryHost ||
    !(leftSlider instanceof HTMLInputElement) ||
    !(rightSlider instanceof HTMLInputElement)
  ) {
    return;
  }

  const createGroupEntries = (host, variant) =>
    lightnessSteps.map((lightness, index) => {
      const cube = document.createElement("div");
      cube.className = "hue-cube demo-cubes__item";
      cube.dataset.index = String(index);
      cube.dataset.variant = variant;
      host.appendChild(cube);
      return { cube, lightness, index, variant };
    });

  const primaryEntries = createGroupEntries(primaryHost, "primary");
  const secondaryEntries =
    secondaryHost instanceof HTMLElement
      ? createGroupEntries(secondaryHost, "secondary")
      : [];

  const cubeEntries = [...primaryEntries, ...secondaryEntries];

  const updateRow = () => {
    const baseHue = normalizeAngle(
      Number.parseFloat(row.dataset.baseHue ?? "0") || 0
    );
    const baseSaturation = clamp(
      Number.parseFloat(row.dataset.baseSaturation ?? "66") || 66,
      0,
      100
    );
    const inputSaturationRaw = Number.parseFloat(
      row.dataset.inputSaturation ?? ""
    );
    const effectiveInputSaturation = clamp(
      Number.isFinite(inputSaturationRaw) ? inputSaturationRaw : baseSaturation,
      0,
      100
    );

    const leftOffset = clamp(Number.parseFloat(leftSlider.value) || 0, -30, 30);
    const rightOffset = clamp(
      Number.parseFloat(rightSlider.value) || 0,
      -30,
      30
    );

    if (leftOutput instanceof HTMLElement) {
      leftOutput.textContent = formatOffset(leftOffset);
    }
    if (rightOutput instanceof HTMLElement) {
      rightOutput.textContent = formatOffset(rightOffset);
    }

    const span = lightnessSteps.length > 1 ? lightnessSteps.length - 1 : 1;
    const positions = lightnessSteps.map((lightness, index) => {
      const weight = span === 0 ? 0 : index / span;
      const offset = leftOffset + (rightOffset - leftOffset) * weight;
      const hue = normalizeAngle(baseHue + offset);
      return {
        hue,
        offset,
        lightness,
      };
    });

    const saturationsByVariant = {
      primary: effectiveInputSaturation,
      secondary: clamp(effectiveInputSaturation / 10, 0, 100),
    };

    cubeEntries.forEach(({ cube, index, variant }) => {
      const position = positions[index] || positions[positions.length - 1];
      const lightness = position.lightness;
      const hue = position.hue;
      const offset = position.offset;
      const saturation = saturationsByVariant[variant] ?? baseSaturation;
      cube.style.backgroundColor = `hsl(${hue}deg, ${saturation}%, ${lightness}%)`;
      cube.style.color = lightness < 55 ? "hsl(0, 0%, 96%)" : "hsl(0, 0%, 10%)";
      cube.dataset.hue = hue.toFixed(2);
      cube.dataset.offset = offset.toFixed(2);
      cube.dataset.lightness = String(Math.round(lightness));
      cube.dataset.saturation = saturation.toFixed(2);
    });

    row.dispatchEvent(
      new CustomEvent("hue-offset:update", {
        detail: { row },
      })
    );
  };

  leftSlider.addEventListener("input", updateRow);
  rightSlider.addEventListener("input", updateRow);

  const api = {
    update: updateRow,
    leftSlider,
    rightSlider,
    leftOutput: leftOutput instanceof HTMLElement ? leftOutput : null,
    rightOutput: rightOutput instanceof HTMLElement ? rightOutput : null,
  };

  rowsRegistry.set(row, api);
  updateRow();

  return api;
};

const initializeHueDemo = () => {
  const rows = document.querySelectorAll("[data-hue-row]");
  if (!rows.length) {
    return;
  }
  rows.forEach((row) => {
    initializeHueRow(row);
  });
};

const setOffsets = (row, offsets = {}) => {
  const entry = rowsRegistry.get(row);
  if (!entry) {
    return;
  }
  if (typeof offsets.left === "number" && entry.leftSlider) {
    entry.leftSlider.value = String(clamp(offsets.left, -30, 30));
  }
  if (typeof offsets.right === "number" && entry.rightSlider) {
    entry.rightSlider.value = String(clamp(offsets.right, -30, 30));
  }
  entry.update();
};

const getOffsets = (row) => {
  const entry = rowsRegistry.get(row);
  if (!entry) {
    return { left: 0, right: 0 };
  }
  const left = entry.leftSlider ? Number(entry.leftSlider.value) || 0 : 0;
  const right = entry.rightSlider ? Number(entry.rightSlider.value) || 0 : 0;
  return {
    left: clamp(left, -30, 30),
    right: clamp(right, -30, 30),
  };
};

const hueOffsetApi = Object.freeze({
  initRow: initializeHueRow,
  updateRow: (row) => {
    const entry = rowsRegistry.get(row);
    if (entry) {
      entry.update();
    }
  },
  setOffsets,
  getOffsets,
});

Object.defineProperty(window, "HueOffset", {
  value: hueOffsetApi,
  configurable: true,
  enumerable: false,
  writable: false,
});

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initializeHueDemo, {
    once: true,
  });
} else {
  initializeHueDemo();
}
