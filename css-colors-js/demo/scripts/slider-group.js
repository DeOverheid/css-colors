import { findAll } from "./dom.js";
import { clamp } from "./color-utils.js";

const readRangeConfig = (input) => {
  if (!(input instanceof HTMLInputElement)) {
    return { min: 0, max: 100, step: 1 };
  }
import { findAll } from "./dom.js";
import { clamp } from "./color-utils.js";

const readRangeConfig = (input) => {
    if (!(input instanceof HTMLInputElement)) {
        return { min: 0, max: 100, step: 1 };
    }
    const min = Number.parseFloat(input.min ?? "0");
    const max = Number.parseFloat(input.max ?? "100");
    const step = Number.parseFloat(input.step ?? "1");
    return {
        min: Number.isFinite(min) ? min : 0,
        max: Number.isFinite(max) ? max : 100,
        step: Number.isFinite(step) && step > 0 ? step : 1,
    };
};

export const createSliderGroup = (root, { onInput } = {}) => {
    if (!(root instanceof HTMLElement)) {
        return {
            getState: () => ({}),
            setState: () => {},
            setValue: () => {},
        };
    }

    const sliders = new Map();

    findAll("[data-color-slider]", root).forEach((wrapper) => {
        const name = wrapper.getAttribute("data-color-slider");
        if (!name || sliders.has(name)) {
            return;
        }

        const input = wrapper.querySelector("[data-color-slider-input]");
        if (!(input instanceof HTMLInputElement)) {
            return;
        }
        const output = wrapper.querySelector("[data-color-slider-output]");
        const unit = wrapper.getAttribute("data-color-slider-unit") ?? "";
        const config = readRangeConfig(input);

        const syncOutput = (value) => {
            if (output instanceof HTMLElement) {
                output.textContent = `${Math.round(value)}${unit}`;
            }
        };

        const initial = clamp(Number.parseFloat(input.value), config.min, config.max);
        const roundedInitial = Math.round(initial / config.step) * config.step;

        const store = {
            name,
            input,
            output,
            config,
            value: roundedInitial,
            syncOutput,
        };

        input.addEventListener("input", () => {
            const parsed = Number.parseFloat(input.value);
            const clamped = clamp(Number.isFinite(parsed) ? parsed : store.value, config.min, config.max);
            const rounded = Math.round(clamped / config.step) * config.step;
            store.value = rounded;
            input.value = String(rounded);
            syncOutput(store.value);
            if (typeof onInput === "function") {
                onInput(name, store.value, getState());
            }
        });

        syncOutput(store.value);
        sliders.set(name, store);
    });

    const setValue = (name, value, { silent = false } = {}) => {
        const slider = sliders.get(name);
        if (!slider) {
            return;
        }
        const { input, config } = slider;
        const clamped = clamp(value, config.min, config.max);
        const rounded = Math.round(clamped / config.step) * config.step;
        slider.value = rounded;
        input.value = String(rounded);
        slider.syncOutput(slider.value);
        if (!silent && typeof onInput === "function") {
            onInput(name, slider.value, getState());
        }
    };

    const setState = (nextState = {}, options = {}) => {
        Object.entries(nextState).forEach(([key, value]) => {
            setValue(key, value, options);
        });
    };

    const getState = () => {
        const state = {};
        sliders.forEach((slider, key) => {
            state[key] = slider.value;
        });
        return state;
    };

    return {
        getState,
        setState,
        setValue,
    };
};
