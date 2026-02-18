(function (root) {
  const detectColor = root.ColorGenerator?.detectColor;
  const state = root.ColorGenerator?.state;

  function initColorInput(form) {
    if (!detectColor || !state || !form) {
      return;
    }

    const input = form.querySelector("[data-color-input]");
    if (!(input instanceof HTMLInputElement)) {
      return;
    }

    function applyColor() {
      const rawValue = input.value.trim();
      if (!rawValue) {
        return false;
      }
      const parsed = detectColor(rawValue);
      if (!parsed) {
        input.setAttribute("aria-invalid", "true");
        return false;
      }
      input.removeAttribute("aria-invalid");
      state.applyParsedColor(parsed);
      return true;
    }

    form.addEventListener("submit", (event) => {
      event.preventDefault();
      applyColor();
    });

    input.addEventListener("blur", () => {
      applyColor();
    });
  }

  root.ColorGenerator = root.ColorGenerator || {};
  root.ColorGenerator.initColorInput = initColorInput;
})(window);
