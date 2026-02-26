(() => {
    const HEX_REGEX
        = /^#([a-fA-F0-9]{3}|[a-fA-F0-9]{4}|[a-fA-F0-9]{6}|[a-fA-F0-9]{8})$/;
    const HEX_SHORTCUT_REGEX
        = /^([a-fA-F0-9]{3}|[a-fA-F0-9]{4}|[a-fA-F0-9]{6}|[a-fA-F0-9]{8})$/;
    const RGB_REGEX
        = /^rgb\s*\(\s*([+-]?\d+(?:\.\d+)?)\s*,\s*([+-]?\d+(?:\.\d+)?)\s*,\s*([+-]?\d+(?:\.\d+)?)(?:\s*,\s*([+-]?\d+(?:\.\d+)?)(%)?)?\s*\)$/i;
    const HSL_REGEX
        = /^hsl\s*\(\s*([+-]?\d+(?:\.\d+)?)\s*,\s*([+-]?\d+(?:\.\d+)?)%\s*,\s*([+-]?\d+(?:\.\d+)?)%\s*\)$/i;
    const OKLCH_REGEX
        = /^oklch\s*\(\s*([+-]?\d*\.?\d+)(%)?\s+([+-]?\d*\.?\d+)(%)?\s+([+-]?\d+(?:\.\d+)?)deg(?:\s*\/\s*([+-]?\d*\.?\d+))?\s*\)$/i;

    const clamp = (value, min, max) => Math.min(Math.max(value, min), max);

    const parseHex = (input) => {
        if (!HEX_REGEX.test(input)) {
            return null;
        }
        const value = input.slice(1);
        const size = value.length;
        let r;
        let g;
        let b;
        if (size === 3 || size === 4) {
            r = parseInt(value[0] + value[0], 16);
            g = parseInt(value[1] + value[1], 16);
            b = parseInt(value[2] + value[2], 16);
        } else {
            r = parseInt(value.slice(0, 2), 16);
            g = parseInt(value.slice(2, 4), 16);
            b = parseInt(value.slice(4, 6), 16);
        }
        return rgbToHsl(r, g, b);
    };

    const parseRgb = (input) => {
        const match = input.match(RGB_REGEX);
        if (!match) {
            return null;
        }
        const r = clamp(parseFloat(match[1]), 0, 255);
        const g = clamp(parseFloat(match[2]), 0, 255);
        const b = clamp(parseFloat(match[3]), 0, 255);
        return rgbToHsl(r, g, b);
    };

    const parseHsl = (input) => {
        const match = input.match(HSL_REGEX);
        if (!match) {
            return null;
        }
        const h = ((parseFloat(match[1]) % 360) + 360) % 360;
        const s = clamp(parseFloat(match[2]), 0, 100);
        const l = clamp(parseFloat(match[3]), 0, 100);
        return { format: "hsl", hue: h, saturation: s, lightness: l };
    };

    const parseOklch = (input) => {
        const match = input.match(OKLCH_REGEX);
        if (!match) {
            return null;
        }
        const lValue = parseFloat(match[1]);
        const lPercent = match[2] === "%";
        const cValue = parseFloat(match[3]);
        const cPercent = match[4] === "%";
        const hueRaw = parseFloat(match[5]);

        const L = clamp(lPercent ? lValue : lValue * 100, 0, 100);
        const C = clamp(cPercent ? cValue : cValue * 100, 0, 100);
        const hue = ((hueRaw % 360) + 360) % 360;
        const chromaNormalized = clamp(cPercent ? cValue / 100 : cValue, 0, 1);
        const saturation = clamp(chromaNormalized * 100, 0, 100);
        return {
            format: "oklch",
            hue,
            saturation,
            lightness: L
        };
    };

    const rgbToHsl = (r, g, b) => {
        const rNorm = r / 255;
        const gNorm = g / 255;
        const bNorm = b / 255;

        const max = Math.max(rNorm, gNorm, bNorm);
        const min = Math.min(rNorm, gNorm, bNorm);
        const delta = max - min;

        let hue = 0;
        if (delta !== 0) {
            if (max === rNorm) {
                hue = ((gNorm - bNorm) / delta) % 6;
            } else if (max === gNorm) {
                hue = (bNorm - rNorm) / delta + 2;
            } else {
                hue = (rNorm - gNorm) / delta + 4;
            }
            hue *= 60;
            if (hue < 0) {
                hue += 360;
            }
        }

        const lightness = (max + min) / 2;
        let saturation = 0;
        if (delta !== 0) {
            saturation = delta / (1 - Math.abs(2 * lightness - 1));
        }

        return {
            format: "rgb",
            hue,
            saturation: clamp(saturation * 100, 0, 100),
            lightness: clamp(lightness * 100, 0, 100)
        };
    };

    const detectColor = (input) => {
        if (typeof input !== "string") {
            return null;
        }
        const trimmed = input.trim();

        if (!trimmed) {
            return null;
        }

        const directMatch
            = parseHsl(trimmed)
                || parseRgb(trimmed)
                || parseHex(trimmed)
                || parseOklch(trimmed);

        if (directMatch) {
            return directMatch;
        }

        if (HEX_SHORTCUT_REGEX.test(trimmed)) {
            return parseHex(`#${trimmed}`);
        }

        return null;
    };

    const api = Object.freeze({
        detect: detectColor
    });

    Object.defineProperty(window, "ColorParser", {
        value: api,
        configurable: true,
        enumerable: false,
        writable: false
    });
})();
