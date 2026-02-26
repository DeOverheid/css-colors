const inputSelectors = ["#x1", "#x2"];
const INTERIOR_COUNT = 11;
const Y1_DEFAULT = 0;
const Y2_DEFAULT = 1;

const clamp = (value, min, max) => Math.min(Math.max(value, min), max);

const bezierCoord = (t, p0, p1, p2, p3) => {
    const mt = 1 - t;
    return (
        mt * mt * mt * p0
        + 3 * mt * mt * t * p1
        + 3 * mt * t * t * p2
        + t * t * t * p3
    );
};

const bezierDerivative = (t, p0, p1, p2, p3) => {
    const mt = 1 - t;
    return (
        3 * mt * mt * (p1 - p0) + 6 * mt * t * (p2 - p1) + 3 * t * t * (p3 - p2)
    );
};

const solveForT = (x, x1, x2) => {
    // Newton-Raphson iteration in parameter space
    let t = clamp(x, 0, 1);
    for (let i = 0; i < 12; i += 1) {
        const xt = bezierCoord(t, 0, x1, x2, 1);
        const dxt = bezierDerivative(t, 0, x1, x2, 1);
        if (Math.abs(dxt) < 1e-6) {
            break;
        }
        t -= (xt - x) / dxt;
        t = clamp(t, 0, 1);
    }
    return t;
};

const computeLightnessSteps = (x1, y1, x2, y2) => {
    const steps = [];
    for (let index = 0; index < INTERIOR_COUNT; index += 1) {
        const progress = (index + 1) / (INTERIOR_COUNT + 1);
        const flippedX = 1 - progress;
        const t = solveForT(flippedX, x1, x2);
        const y = bezierCoord(t, 0, y1, y2, 1);
        const lightness = clamp(100 * y, 0, 100);
        steps.push(lightness);
    }
    return steps;
};

const initializeDemo = () => {
    const inputs = inputSelectors
        .map(selector => document.querySelector(selector))
        .filter(input => input instanceof HTMLInputElement);
    if (inputs.length !== inputSelectors.length) {
        return;
    }

    const valueDisplays = new Map();
    inputs.forEach((input) => {
        const display = document.querySelector(
            `.slider__value[data-value-for="${input.id}"]`
        );
        if (display instanceof HTMLElement) {
            valueDisplays.set(input, display);
        }
    });

    const cubeSteps = Array.from(
        document.querySelectorAll(".step--cube[data-step]")
    );
    if (cubeSteps.length !== INTERIOR_COUNT) {
        return;
    }

    const anchorSamples = {
        start: document.querySelector(".step--sample[data-anchor=\"start\"]"),
        end: document.querySelector(".step--sample[data-anchor=\"end\"]")
    };
    const anchorCubes = {
        start: document.querySelector(".step--cube[data-anchor=\"start\"]"),
        end: document.querySelector(".step--cube[data-anchor=\"end\"]")
    };
    const anchorLightnessDisplays = {
        start: document.querySelector("[data-lightness-id=\"anchor-start\"]"),
        end: document.querySelector("[data-lightness-id=\"anchor-end\"]")
    };
    const anchorHslButtons = {
        start: document.querySelector("[data-hsl-id=\"anchor-start\"]"),
        end: document.querySelector("[data-hsl-id=\"anchor-end\"]")
    };

    if (!(anchorSamples.start instanceof HTMLElement)) {
        return;
    }
    if (!(anchorSamples.end instanceof HTMLElement)) {
        return;
    }
    if (!(anchorCubes.start instanceof HTMLElement)) {
        return;
    }
    if (!(anchorCubes.end instanceof HTMLElement)) {
        return;
    }
    if (!(anchorLightnessDisplays.start instanceof HTMLElement)) {
        return;
    }
    if (!(anchorLightnessDisplays.end instanceof HTMLElement)) {
        return;
    }
    if (!(anchorHslButtons.start instanceof HTMLElement)) {
        return;
    }
    if (!(anchorHslButtons.end instanceof HTMLElement)) {
        return;
    }

    const interiorSamples = [];
    const interiorLightnessDisplays = [];
    const interiorHslButtons = [];
    for (let index = 0; index < INTERIOR_COUNT; index += 1) {
        const sample = document.querySelector(
            `.step--sample[data-step="${index}"]`
        );
        const lightnessDisplay = document.querySelector(
            `[data-lightness-id="interior-${index}"]`
        );
        const hslButton = document.querySelector(
            `[data-hsl-id="interior-${index}"]`
        );
        if (
            !(sample instanceof HTMLElement)
            || !(lightnessDisplay instanceof HTMLElement)
            || !(hslButton instanceof HTMLElement)
        ) {
            return;
        }
        interiorSamples.push(sample);
        interiorLightnessDisplays.push(lightnessDisplay);
        interiorHslButtons.push(hslButton);
    }

    const root = document.documentElement;
    const allHslButtons = [
        anchorHslButtons.start,
        ...interiorHslButtons,
        anchorHslButtons.end
    ];
    const COPIED_CLASS = "step-hsl--copied";

    const formatLabel = value => `${Math.round(value)}%`;
    const formatHsl = (value) => {
        const normalized = Number.isInteger(value)
            ? value.toFixed(0)
            : value.toFixed(2);
        return `hsl(0 0% ${normalized}%)`;
    };

    const setSampleSwatch = (element, lightness) => {
        if (!element) {
            return;
        }
        element.style.backgroundColor = `hsl(0 0% ${lightness}%)`;
    };

    const setLightnessDisplay = (element, label) => {
        if (!element) {
            return;
        }
        element.textContent = label;
    };

    const setHslDisplay = (element, numericValue) => {
        if (!element) {
            return;
        }
        const hslValue = formatHsl(numericValue);
        element.textContent = hslValue;
        element.dataset.hslValue = hslValue;
        element.setAttribute("aria-label", `Copy ${hslValue}`);
        element.setAttribute("title", `Copy ${hslValue}`);
        element.setAttribute("href", "#");
    };

    const copyToClipboard = async (value) => {
        if (navigator.clipboard?.writeText) {
            await navigator.clipboard.writeText(value);
            return;
        }
        const textarea = document.createElement("textarea");
        textarea.value = value;
        textarea.setAttribute("readonly", "true");
        textarea.style.position = "fixed";
        textarea.style.opacity = "0";
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand("copy");
        document.body.removeChild(textarea);
    };

    const handleCopyClick = async (event) => {
        event.preventDefault();
        const link = event.currentTarget;
        if (!(link instanceof HTMLElement)) {
            return;
        }
        const value = link.dataset.hslValue || link.textContent || "";
        try {
            await copyToClipboard(value.trim());
            link.classList.add(COPIED_CLASS);
            window.setTimeout(() => {
                link.classList.remove(COPIED_CLASS);
            }, 1200);
        } catch (error) {
            // no-op fallback if clipboard copy fails
        }
    };

    allHslButtons.forEach((link) => {
        link.addEventListener("click", handleCopyClick);
    });

    const updateSwatches = () => {
        const inputValues = inputs.map(input => clamp(Number(input.value), 0, 1));
        inputs.forEach((input, index) => {
            const display = valueDisplays.get(input);
            if (display) {
                display.textContent = inputValues[index].toFixed(2);
            }
        });

        const [x1, x2] = inputValues;
        const lightnessValues = computeLightnessSteps(
            x1,
            Y1_DEFAULT,
            x2,
            Y2_DEFAULT
        );

        setSampleSwatch(anchorSamples.start, 100);
        setLightnessDisplay(anchorLightnessDisplays.start, formatLabel(100));
        setHslDisplay(anchorHslButtons.start, 100);
        anchorCubes.start.dataset.lightness = formatLabel(100);
        anchorCubes.start.style.color = "hsl(0 0% 15%)";

        lightnessValues.forEach((lightness, index) => {
            const lightnessNumeric = Number(lightness.toFixed(2));
            const lightnessLabel = formatLabel(lightnessNumeric);
            const cube = cubeSteps[index];
            cube.dataset.lightness = lightnessLabel;
            root.style.setProperty(`--step-${index}`, `${lightnessNumeric}%`);
            const textColor = lightness < 55 ? "hsl(0 0% 98%)" : "hsl(0 0% 15%)";
            cube.style.color = textColor;
            const sample = interiorSamples[index];
            const display = interiorLightnessDisplays[index];
            const hslButton = interiorHslButtons[index];
            setSampleSwatch(sample, lightnessNumeric);
            setLightnessDisplay(display, lightnessLabel);
            setHslDisplay(hslButton, lightnessNumeric);
        });

        setSampleSwatch(anchorSamples.end, 0);
        setLightnessDisplay(anchorLightnessDisplays.end, formatLabel(0));
        setHslDisplay(anchorHslButtons.end, 0);
        anchorCubes.end.dataset.lightness = formatLabel(0);
        anchorCubes.end.style.color = "hsl(0 0% 96%)";
    };

    inputs.forEach((input) => {
        input.addEventListener("input", updateSwatches);
    });

    updateSwatches();
};

if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initializeDemo, {
        once: true
    });
} else {
    initializeDemo();
}
