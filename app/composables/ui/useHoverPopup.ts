/**
 * useHoverPopup — a standalone composable that provides a Vue directive (`v-hover-popup`)
 * for showing a formatted HTML popup on hover.
 *
 * Usage:
 *   1. Call `useHoverPopup()` in your component setup — returns the directive.
 *   2. Use `v-hover-popup` on elements. It reads HTML content from:
 *      - The directive value (string of HTML), or
 *      - A child element with `[data-hover-content]` attribute (hidden by default).
 *   3. The native `title` attribute is automatically removed to prevent double tooltips.
 *
 * Example — HTML from directive value:
 *   <div v-hover-popup="'<strong>Hello</strong> world'" />
 *
 * Example — HTML from hidden child:
 *   <div v-hover-popup>
 *       <div data-hover-content>
 *           <strong>Shade 500</strong><br>H: 210° S: 80% L: 50%
 *       </div>
 *   </div>
 */

import type { DirectiveBinding, ObjectDirective } from "vue";

interface PopupState {
    el: HTMLElement;
    popup: HTMLElement;
    onEnter: (e: MouseEvent) => void;
    onMove: (e: MouseEvent) => void;
    onLeave: () => void;
}

const POPUP_CLASS = "hover-popup";
const OFFSET_X = 12;
const OFFSET_Y = 12;

/** Shared map so we can clean up per-element */
const stateMap = new WeakMap<HTMLElement, PopupState>();

function createPopupElement(): HTMLElement {
    const el = document.createElement("div");
    el.className = POPUP_CLASS;
    el.style.cssText = [
        "position: fixed",
        "z-index: 9999",
        "pointer-events: none",
        "opacity: 0",
        "transition: opacity 0.12s ease",
        "padding: 0.5rem 0.75rem",
        "border-radius: 6px",
        "font-size: 0.75rem",
        "line-height: 1.5",
        "max-width: 280px",
        "white-space: pre-line",
        "background: var(--ui-bg-elevated, #1e1e2e)",
        "color: var(--ui-text, #cdd6f4)",
        "border: 1px solid var(--ui-border, #45475a)",
        "box-shadow: 0 4px 12px rgba(0,0,0,0.25)",
        "font-family: var(--font-family-monospace, monospace)"
    ].join("; ");
    return el;
}

function positionPopup(popup: HTMLElement, x: number, y: number) {
    const vw = window.innerWidth;
    const vh = window.innerHeight;
    const rect = popup.getBoundingClientRect();
    const w = rect.width || 200;
    const h = rect.height || 60;

    let left = x + OFFSET_X;
    let top = y + OFFSET_Y;

    // Flip horizontal if overflowing right
    if (left + w > vw - 8) left = x - w - OFFSET_X;
    // Flip vertical if overflowing bottom
    if (top + h > vh - 8) top = y - h - OFFSET_Y;

    // Clamp to viewport
    left = Math.max(4, Math.min(left, vw - w - 4));
    top = Math.max(4, Math.min(top, vh - h - 4));

    popup.style.left = `${left}px`;
    popup.style.top = `${top}px`;
}

function getContent(el: HTMLElement, binding: DirectiveBinding): string {
    // 1. Directive value takes precedence
    if (binding.value) return String(binding.value);
    // 2. Look for a [data-hover-content] child
    const contentEl = el.querySelector("[data-hover-content]") as HTMLElement | null;
    if (contentEl) return contentEl.innerHTML;
    return "";
}

function mount(el: HTMLElement, binding: DirectiveBinding) {
    // Remove native title to prevent double tooltip
    if (el.hasAttribute("title")) el.removeAttribute("title");

    const popup = createPopupElement();

    const onEnter = (e: MouseEvent) => {
        const html = getContent(el, binding);
        if (!html) return;
        popup.innerHTML = html;
        document.body.appendChild(popup);
        // Position once before showing so we can measure
        positionPopup(popup, e.clientX, e.clientY);
        // Force reflow, then fade in
        void popup.offsetHeight;
        popup.style.opacity = "1";
    };

    const onMove = (e: MouseEvent) => {
        if (popup.parentNode) positionPopup(popup, e.clientX, e.clientY);
    };

    const onLeave = () => {
        popup.style.opacity = "0";
        // Remove after transition
        setTimeout(() => {
            if (popup.parentNode) popup.parentNode.removeChild(popup);
        }, 150);
    };

    el.addEventListener("mouseenter", onEnter);
    el.addEventListener("mousemove", onMove);
    el.addEventListener("mouseleave", onLeave);

    stateMap.set(el, { el, popup, onEnter, onMove, onLeave });
}

function unmount(el: HTMLElement) {
    const state = stateMap.get(el);
    if (!state) return;
    el.removeEventListener("mouseenter", state.onEnter);
    el.removeEventListener("mousemove", state.onMove);
    el.removeEventListener("mouseleave", state.onLeave);
    if (state.popup.parentNode) state.popup.parentNode.removeChild(state.popup);
    stateMap.delete(el);
}

function update(el: HTMLElement, binding: DirectiveBinding) {
    // On value change, just update content — popup will pick up new value on next hover
    if (el.hasAttribute("title")) el.removeAttribute("title");
    const state = stateMap.get(el);
    if (state && state.popup.parentNode) {
        const html = getContent(el, binding);
        if (html) state.popup.innerHTML = html;
    }
}

/**
 * Vue directive for hover popups.
 *
 * Register locally:  `const vHoverPopup = useHoverPopup();`
 * Then use:          `<div v-hover-popup="htmlString" />`
 */
export function useHoverPopup(): ObjectDirective<HTMLElement> {
    return {
        mounted: mount,
        updated: update,
        beforeUnmount: unmount
    };
}
