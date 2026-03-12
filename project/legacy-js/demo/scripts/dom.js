export const find = (selector, root = document) => {
    const context = root ?? document;
    const node = context.querySelector(selector);
    return node instanceof HTMLElement ? node : null;
};

export const findAll = (selector, root = document) => {
    const context = root ?? document;
    return Array.from(context.querySelectorAll(selector)).filter(
        node => node instanceof HTMLElement
    );
};

export const toArray = value => (Array.isArray(value) ? value : [value]);

export const getDatasetNumber = (element, key, fallback = 0) => {
    if (!(element instanceof HTMLElement)) {
        return fallback;
    }
    const value = element.dataset?.[key];
    if (typeof value === "string" && value.length > 0) {
        const parsed = Number.parseFloat(value);
        if (Number.isFinite(parsed)) {
            return parsed;
        }
    }
    return fallback;
};

export const setDatasetNumber = (element, key, value, precision = 2) => {
    if (!(element instanceof HTMLElement)) {
        return;
    }
    const store = Number.isFinite(value) ? value : 0;
    element.dataset[key] = store.toFixed(precision);
};

export const dispatchCustomEvent = (element, type, detail = {}) => {
    if (!(element instanceof HTMLElement)) {
        return;
    }
    const event = new CustomEvent(type, { detail });
    element.dispatchEvent(event);
};
