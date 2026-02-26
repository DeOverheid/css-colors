(function (root) {
    const state = root.ColorGenerator?.state;

    if (!state) {
        throw new Error(
            "ColorGenerator.initPaletteToggle requires state to load first."
        );
    }

    function initPaletteToggle(container) {
        if (!(container instanceof HTMLElement)) {
            return;
        }

        const inputs = Array.from(
            container.querySelectorAll("input[type=\"radio\"][name=\"color-system\"]")
        );

        if (!inputs.length) {
            return;
        }

        const applySnapshot = (paletteKey) => {
            inputs.forEach((input) => {
                if (input.value === paletteKey) {
                    if (!input.checked) {
                        input.checked = true;
                    }
                } else if (input.checked) {
                    input.checked = false;
                }
            });
        };

        container.addEventListener("change", (event) => {
            const target = event.target;
            if (
                target instanceof HTMLInputElement
                && target.type === "radio"
                && target.name === "color-system"
            ) {
                state.setPalette(target.value);
            }
        });

        state.subscribe((snapshot) => {
            const key = snapshot?.palette || state.getPaletteKey();
            if (typeof key === "string") {
                applySnapshot(key);
            }
        });

        const current = state.getPaletteKey();
        if (typeof current === "string") {
            applySnapshot(current);
        }
    }

    root.ColorGenerator = root.ColorGenerator || {};
    root.ColorGenerator.initPaletteToggle = initPaletteToggle;
})(window);
