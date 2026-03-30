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

- **Replaces Step 5** (Hue Spectrum). The old top input area and swatch preview are removed.
- Hue adjustment sliders live in the **left and right panels**
- Sliders are positioned to match the vertical position of the swatch rows they adjust
- The swatch area continues to show the 12 chromatic hue rows from Step 4

### UI

**Swatch area (unchanged from Step 4):**

- Same 12 chromatic hue rows at 30° intervals
- When hue shift sliders are adjusted, swatches update in real time

**Left panel — Dark hue shift:**

- One horizontal mini-slider per hue row (-30° to +30°)
- Each slider is vertically aligned with its corresponding swatch row
- Controls the hue offset for the **darker** swatches in that row
- Tapering effect: 100% at the darkest swatch, linearly decreasing to 0% at the middle swatch
- Example for dark side (3 swatches before center): +3°, +2°, +1°, center: 0°

**Right panel — Light hue shift:**

- One horizontal mini-slider per hue row (-30° to +30°)
- Each slider is vertically aligned with its corresponding swatch row
- Controls the hue offset for the **lighter** swatches in that row
- Tapering effect: 100% at the lightest swatch, linearly decreasing to 0% at the middle swatch
- Example for light side (3 swatches after center): center: 0°, -2°, -4°, -6°

**Combined effect:**

For a row where the user sets dark shift = +15° and light shift = -6°:
- Darkest swatch: +15° (more purple-red)
- Middle swatch: exactly the base hue (unaffected)
- Lightest swatch: -6° (more orange-red)
- Intermediate swatches: linearly interpolated

### Data Model

```typescript
interface HueShiftConfig {
    /** Whether per-swatch hue shifting is enabled */
    enabled: boolean
    /** Per-hue-row shift values: hue degree → { dark shift, light shift } */
    rows: Record<number, { dark: number; light: number }>
}
```

Note: The `rows` record is keyed by the hue degree of each row (0, 30, 60, ..., 330 offset by primary). Each entry stores two values: the dark-side shift and the light-side shift. The tapering is computed, not stored.

Per-theme defaults:
- **Custom**: all shifts start at 0°
- **Mathematical**: handpicked sinusoidal curve across hues
- **Tailwind**: derived by comparing Tailwind's actual swatch hues and finding best-fit offsets

### Application

In `ColorSwatchRow.vue`, after `applyAdjustment()` for lightness:

```typescript
const adjustedHue = baseHue + getHueShift(hue, swatchIndex, swatchCount, darkShift, lightShift)
```

Where `getHueShift` computes the linear taper:
- For swatches on the dark side (index < middle): `darkShift * (1 - index / middleIndex)`
- For swatches on the light side (index > middle): `lightShift * ((index - middleIndex) / (count - 1 - middleIndex))`
- For the middle swatch: 0° (no shift)

---

## Implementation Phases

### Phase 1: Data model + composable

- Add `HueShiftConfig` to types
- Add composable `stepHueShift.ts` with per-row shift state
- Initialize 12 rows with 0° shifts for Custom theme
- Store/restore per-theme defaults

### Phase 2: Wire into rendering

- Apply hue shift in `ColorSwatchRow.vue` after lightness adjustment
- Compute linear taper per swatch based on position relative to middle
- Show shifted hue values in swatch tooltips

### Phase 3: UI controls — side panel sliders

- Left panel: 12 horizontal mini-sliders (-30° to +30°), one per hue row
- Right panel: 12 horizontal mini-sliders (-30° to +30°), one per hue row
- Vertical alignment: each slider matches the vertical position of its swatch row
- Live preview as sliders are adjusted

### Phase 4: Defaults + presets

- **Custom**: all shifts at 0°
- **Mathematical**: handpicked sinusoidal curve (analyze perceptual hue drift)
- **Tailwind**: compare Tailwind's actual per-swatch hue values, derive best-fit offsets
- Reset all to 0° button

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

- `app/composables/input/stepHueShift.ts` — hue shift composable with per-row state
- `app/composables/themes/lib/types.ts` — add `HueShiftConfig`
- `app/components/HueShiftSliders.vue` — 12 mini-sliders aligned with swatch rows (used in both panels)

### Modified files

- `app/components/ColorSwatchRow.vue` — apply hue shift after lightness adjustment
- `app/components/GeneratorLeftPanel.vue` — show dark hue shift sliders on Step 5
- `app/components/GeneratorRightPanel.vue` — show light hue shift sliders on Step 5
- `app/composables/steps/stepRegistry.ts` — update step 5 definition
