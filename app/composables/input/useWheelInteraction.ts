import { useColorSettings } from "~/composables/core/useColorSettings";
import { useComplementaryColors } from "~/composables/input/useComplementaryColors";

export type HandleId = "primary" | "secondary" | "tertiary";

interface HandlePosition {
    x: number;
    y: number;
}

/**
 * Wheel Interaction
 * Manages drag logic and coordinate math for the hue-saturation wheel.
 * Converts between polar (hue°, saturation%) and cartesian (x, y) coordinates.
 * 0° = top (12 o'clock), clockwise rotation.
 */
export function useWheelInteraction() {
    const colorSettings = useColorSettings();
    const { hueOffset, complementarySaturation, setComplementarySaturation } = useComplementaryColors();

    const activeHandle = ref<HandleId | null>(null);

    /**
     * Step 1 snapshots: remember the hue and saturation from step 1
     * so the outer marker and reference ring stay fixed while dragging on the wheel.
     * Updated only from step 1 sliders, not from wheel drag.
     */
    const step1Hue = useState<number>("wheel-step1-hue", () => colorSettings.hue.value);
    const step1Saturation = useState<number>("wheel-step1-sat", () => colorSettings.saturation.value);

    /** Snap the step 1 bookmark to the current hue/saturation values */
    function updateStep1Snapshot() {
        step1Hue.value = colorSettings.hue.value;
        step1Saturation.value = colorSettings.saturation.value;
    }

    /** Snap primary hue to the step 1 marker hue (preserves current saturation) */
    function snapToStep1Hue() {
        colorSettings.hue.value = step1Hue.value;
    }

    // --- Polar ↔ Cartesian conversion ---
    // Angle: 0° = top, clockwise. Radius: 0 = center, 1 = edge.

    /** Convert hue (degrees) and saturation (0–100) to cartesian (0–1 range, center = 0.5,0.5) */
    function polarToCartesian(hueDeg: number, satPercent: number): HandlePosition {
        const angleRad = ((hueDeg - 90) * Math.PI) / 180;
        const r = satPercent / 100;
        return {
            x: 0.5 + r * 0.5 * Math.cos(angleRad),
            y: 0.5 + r * 0.5 * Math.sin(angleRad)
        };
    }

    /** Convert cartesian (0–1 range) to hue (degrees) and saturation (0–100) */
    function cartesianToPolar(x: number, y: number): { hue: number; saturation: number } {
        const dx = x - 0.5;
        const dy = y - 0.5;
        const angleRad = Math.atan2(dy, dx);
        let hueDeg = (angleRad * 180) / Math.PI + 90;
        hueDeg = ((hueDeg % 360) + 360) % 360;
        const r = Math.sqrt(dx * dx + dy * dy) / 0.5;
        const saturation = Math.min(100, Math.max(0, r * 100));
        return { hue: Math.round(hueDeg), saturation: Math.round(saturation) };
    }

    // --- Handle positions (reactive) ---

    const primaryPos = computed(() =>
        polarToCartesian(colorSettings.hue.value, colorSettings.saturation.value)
    );

    const secondaryHue = computed(() =>
        ((colorSettings.hue.value + hueOffset.value) % 360 + 360) % 360
    );

    const tertiaryHue = computed(() =>
        ((colorSettings.hue.value - hueOffset.value) % 360 + 360) % 360
    );

    const secondaryPos = computed(() =>
        polarToCartesian(secondaryHue.value, complementarySaturation.value)
    );

    const tertiaryPos = computed(() =>
        polarToCartesian(tertiaryHue.value, complementarySaturation.value)
    );

    /** Saturation ring radius as fraction of wheel radius (0–1) — follows live saturation */
    const satRingRadius = computed(() => colorSettings.saturation.value / 100);

    /** Step 1 saturation ring radius — stays fixed at the step 1 snapshot */
    const step1SatRingRadius = computed(() => step1Saturation.value / 100);

    /** Complementary saturation ring radius — follows secondary/tertiary saturation */
    const compSatRingRadius = computed(() => complementarySaturation.value / 100);

    // --- Handle colors ---

    const primaryColor = computed(() =>
        `hsl(${colorSettings.hue.value}, ${colorSettings.saturation.value}%, 50%)`
    );

    const secondaryColor = computed(() =>
        `hsl(${secondaryHue.value}, ${complementarySaturation.value}%, 50%)`
    );

    const tertiaryColor = computed(() =>
        `hsl(${tertiaryHue.value}, ${complementarySaturation.value}%, 50%)`
    );

    // --- Drag handling ---

    function onPointerDown(handle: HandleId) {
        activeHandle.value = handle;
    }

    function onPointerMove(x: number, y: number) {
        if (!activeHandle.value) return;

        const { hue, saturation } = cartesianToPolar(x, y);

        switch (activeHandle.value) {
            case "primary": {
                colorSettings.hue.value = hue;
                colorSettings.saturation.value = saturation;
                break;
            }
            case "secondary": {
                // Compute new offset from primary
                let newOffset = hue - colorSettings.hue.value;
                // Normalize to -180..180
                newOffset = ((newOffset + 540) % 360) - 180;
                hueOffset.value = newOffset;
                setComplementarySaturation(saturation);
                break;
            }
            case "tertiary": {
                // Tertiary is primary - offset, so offset = primary - tertiary
                let newOffset = colorSettings.hue.value - hue;
                newOffset = ((newOffset + 540) % 360) - 180;
                hueOffset.value = newOffset;
                setComplementarySaturation(saturation);
                break;
            }
        }
    }

    function onPointerUp() {
        activeHandle.value = null;
    }

    return {
        // Positions
        primaryPos,
        secondaryPos,
        tertiaryPos,
        // Colors
        primaryColor,
        secondaryColor,
        tertiaryColor,
        // Rings
        satRingRadius,
        step1SatRingRadius,
        compSatRingRadius,
        // Step 1 snapshots
        step1Hue,
        step1Saturation,
        updateStep1Snapshot,
        snapToStep1Hue,
        // Drag
        activeHandle,
        onPointerDown,
        onPointerMove,
        onPointerUp,
        // Utilities
        polarToCartesian,
        cartesianToPolar
    };
}
