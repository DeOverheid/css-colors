# Plan: Per-Swatch Hue Adjustment

## Goal

Allow users to shift the hue of individual swatches (by lightness position) within a row. Some colors look off at specific lightness levels — e.g., a yellow at 90% lightness drifts toward green. This step lets you nudge individual swatch hues to compensate.

---

## Context

Currently, all swatches in a row share the same hue. The lightness adjustment (Step 4) only modifies lightness, not hue. In reality, perceptually accurate colors often need hue rotation at extreme lightness values (very dark blues shift toward purple, very light yellows shift toward green).

This feature adds per-swatch hue offsets that are applied on top of the row's base hue.

---

## Design

### Where in the Wizard

This could be:

- **Option A**: A sub-feature within Step 4 (Lightness Adjustment) — toggle between "lightness mode" and "hue mode"
- **Option B**: A new Step 4b between Lightness Adjustment and Hue Spectrum
- **Option C**: Part of Step 5 (Hue Spectrum) since it's hue-related

**Recommendation**: Option A — keep it in Step 4 as a mode toggle. The 12-hue swatch rows are already displayed. Add a "Hue shift" toggle that switches the side panels from lightness controls to hue controls.

### UI

**Swatch area (unchanged):**

- Same 12 chromatic hue rows at 30° intervals
- When hue shift is active, swatches visually show the shifted hue

**Side panels in "Hue shift" mode:**

- Instead of vertical hue range sliders, show a **per-swatch hue offset grid**
- One row of offset controls per lightness position (matching swatch columns)
- Small +/- buttons or a mini-slider (-30° to +30°) for each swatch position
- Or a single "hue curve" — a bezier or spline that maps lightness position → hue offset

**Simpler alternative: Hue Shift Curve**

- Single curve editor (like the bezier editor in Step 3)
- X-axis = lightness position (dark → light)
- Y-axis = hue offset (-30° to +30°)
- Curve defines how much hue shifts at each lightness level
- Same curve applied to all hue rows (universal correction)

### Data Model

```typescript
interface HueShiftConfig {
    /** Whether per-swatch hue shifting is enabled */
    enabled: boolean;
    /** Hue shift curve: maps lightness position (0-1) to hue offset (-30 to +30) */
    curve: BezierCurve; // or array of control points
    /** Per-row overrides (optional, for fine-tuning specific hues) */
    overrides?: Record<number, number[]>; // hue → per-swatch offsets
}
```

### Application

In `ColorSwatchRow.vue`, after `applyAdjustment()` for lightness:

```typescript
const adjustedHue = baseHue + getHueShift(lightnessPosition);
```

---

## Implementation Phases

### Phase 1: Data model + curve editor

- Add `HueShiftConfig` to types
- Add composable `stepHueShift.ts`
- Reuse bezier curve editor component (or create a simpler spline editor)

### Phase 2: Wire into rendering

- Apply hue shift in `ColorSwatchRow.vue` after lightness adjustment
- Show shifted hue values in swatch tooltips

### Phase 3: UI controls

- Mode toggle in Step 4 sidebar (lightness vs hue mode)
- Curve editor in side panel or main content area
- Live preview as curve is adjusted

### Phase 4: Defaults + presets

- Default hue shift curve for common corrections (yellow→green at high lightness)
- Preset curves: "Warm shift", "Cool shift", "Natural"
- Reset to flat (no shift)

---

## Open Questions

1. Should hue shift be a universal curve or per-hue-row? Universal is simpler; per-row allows fixing specific problem hues
2. Should the shift be relative (offset from base) or absolute (snap to specific hue)?
3. Do we need different curves for different themes, or is one curve universal?
4. Maximum shift range: ±15°? ±30°? ±45°?
5. Should this also shift saturation slightly? (Some colors lose saturation at extreme lightness)

---

## Files to Create/Modify

### New files

- `app/composables/input/stepHueShift.ts` — hue shift composable
- `app/composables/themes/lib/types.ts` — add `HueShiftConfig`

### Modified files

- `app/components/ColorSwatchRow.vue` — apply hue shift after lightness adjustment
- `app/components/GeneratorLeftPanel.vue` / `GeneratorRightPanel.vue` — mode toggle
- `app/composables/steps/stepRegistry.ts` — if adding a new step
