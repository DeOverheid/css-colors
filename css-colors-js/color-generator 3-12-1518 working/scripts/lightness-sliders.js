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
      !(lightInput instanceof HTMLInputElement) ||
      !(darkInput instanceof HTMLInputElement)
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
  root.ColorGenerator = root.ColorGenerator || {};
  root.ColorGenerator.initLightnessControls = initLightnessControls;
})(window);
