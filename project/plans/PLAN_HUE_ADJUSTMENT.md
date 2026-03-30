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

This will be:

- Replacing step 5. Hue Spectrum, we will remove the input and swatches on top
- The hue adjustment sliders will be placed in the left and right panels
- the sliders will match the vertical position of the swatches they will adjust.

### UI

**Swatch area (unchanged):**

- Same 12 chromatic hue rows at 30° intervals
- When hue shift sliders are adjusted, swatches visually show the shifted in real time.

**Side panels in "Hue shift" mode:**

- Instead of vertical hue range sliders, show a **per-swatch hue offset grid**
- Two sets offset controls per hue swatch row
- Sliders on the left panel control the hue offset for darker swatches
- Sliders on the right panel control lighter swatches
- A horizontal mini-slider (-30° to +30°)
- sliders are positioned to match the hue vertical position (same grid height)
- the offset is applied with a tapering effect, 100% at the darkest (or lightest) swatch in that hue row, and 0 effect on the middle swatch. (example: dark: 3 Swatches +3 +2 +1 center: no offset -2 -4 -6 at light: -6 )

### Data Model

Update the model to the changes made above since the plan was drafted

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
   Answer: We will do a per hue shift, two sliders per hue, one left for the darker tones, and a slider on the right for the lighter tones, Each hue can be adjusted individually, experience shows the sliders actually form a sinus like pattern across the hues, so a single modifier would be useless.
2. Should the shift be relative (offset from base) or absolute (snap to specific hue)?
   A: relative. the user has set the base Hue already in step 1 or 2, adjustmenst will be made on the lightness swatches for that hue with the two sliders. For example if they set red: 0. The dark reds could be shifted to a more ourple red with -15 and the lighter colors would be made more orange with +15. The middle will always be exacly what they chose before, so the middle swatch is unaffected by any slider, but the effect grows larger if you move to the lightest or darkest swatches in a linear fashion.
3. Do we need different curves for different themes, or is one curve universal?
   We will store defaults per theme, the mathematical will be a handpicked sine curve, custom will remain at 0 to start and Tailwind will have a custom adjustment we will figure out from comparing their own swatches and finding close defaults.
4. Maximum shift range: ±15°? ±30°? ±45°?
   A: Use +/- 30 degrees for now, I used 45 in the past but you never use those extremes as you will enter the next or previous swatch.
5. Should this also shift saturation slightly? (Some colors lose saturation at extreme lightness)
   A: No, this will be handled already by the saturation setup from before. We will check but we are already using a custom saturation distribution that more or less follows the Tailwind swatches. If now, we will add it back in step 1.

---

## Files to Create/Modify

### New files

- `app/composables/input/stepHueShift.ts` — hue shift composable
- `app/composables/themes/lib/types.ts` — add `HueShiftConfig`

### Modified files

- `app/components/ColorSwatchRow.vue` — apply hue shift after lightness adjustment
- `app/components/GeneratorLeftPanel.vue` / `GeneratorRightPanel.vue` — mode toggle
- `app/composables/steps/stepRegistry.ts` — if adding a new step
