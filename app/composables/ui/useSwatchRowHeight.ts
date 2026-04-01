/**
 * Shared reactive swatch-row height, measured via ResizeObserver in GeneratorSwatches.
 * Side-panel slider rows bind to this so they stay pixel-aligned with the swatch grid.
 */
const swatchRowHeight = ref(28);

let observer: ResizeObserver | null = null;
let observedEl: Element | null = null;

/** Start observing a swatch-row element. Call once from GeneratorSwatches on mount. */
export function observeSwatchRow(el: Element) {
    stopObserving();
    observedEl = el;
    observer = new ResizeObserver((entries) => {
        const height = entries[0]?.borderBoxSize?.[0]?.blockSize
            ?? entries[0]?.contentRect.height;
        if (height && height > 0) {
            swatchRowHeight.value = height;
        }
    });
    observer.observe(el, { box: "border-box" });
}

/** Stop observing (call on unmount). */
export function stopObserving() {
    if (observer && observedEl) {
        observer.unobserve(observedEl);
        observer.disconnect();
    }
    observer = null;
    observedEl = null;
}

/** Reactive pixel height of one swatch row. */
export function useSwatchRowHeight() {
    return swatchRowHeight;
}
