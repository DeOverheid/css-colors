export const clamp = (value, min, max) => {
    const number = Number(value);
    if (!Number.isFinite(number)) {
        return min;
    }
    return Math.min(Math.max(number, min), max);
};

export const normalizeHue = (value) => {
    const number = Number(value);
    if (!Number.isFinite(number)) {
        return 0;
    }
    const normalized = number % 360;
    return normalized < 0 ? normalized + 360 : normalized;
};

export const computeGreyFromSaturation = saturation =>
    clamp(Number(saturation) / 10, 0, 100);

export const readNumber = (value, fallback = 0) => {
    const parsed = Number.parseFloat(value ?? "");
    return Number.isFinite(parsed) ? parsed : fallback;
};

export const formatValue = (value, suffix = "") =>
    Number.isFinite(value) ? `${value.toFixed(1)}${suffix}` : "--";
