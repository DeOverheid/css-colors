# Plan: Lightness Adjustment Redesign

## Goal

Redesign Step 4 (Lightness Adjustment) to provide an intuitive, visual way to compensate for perceptual lightness differences across hues. Some colors (yellow, orange) appear brighter than others (blue, purple) at the same HSL lightness. This step lets users locally adjust lightness to create a visually balanced palette.

---

## Current State

### What exists

- `stepLightnessAdjustment.ts` — composable with `applyAdjustment(baseLightness, hue, index, count)`
- Two separate ranges: **darkening** (warm hues) and **brightening** (cool hues)
- Each range has: hue start/end, hue falloff, amplitude, light falloff, dark falloff
- `LightnessAdjustmentPanel.vue` — master toggle + two `AdjustmentRangeControls` each with 6 sliders
- Currently disabled by default (`enabled: false`)
- Adjustment is applied per-swatch: factors in hue position, swatch index (dark→light), and amplitude

### What works well (keep)

- `applyAdjustment()` function signature — takes baseLightness, hue, index, count
- Per-swatch position falloff concept (darker swatches affected more than lighter ones)
- Hue range with falloff edges concept
- The composable singleton pattern (`useLightnessAdjustment()`)

### What changes

- UI completely redesigned — no more toggle checkboxes and 12 raw sliders
- Always enabled (darkening + brightening always active)
- Swatch display reordered: hue 0° at top, 30° steps, P/S/T snapped
- Left panel = dark adjustment controls, right panel = light adjustment controls

---

## Design

### Step 4 Layout

**Top panel (center content area):**

- Title: "Lightness Adjustment"
- Description: "Some colors look brighter (like yellow and orange) or darker (like blues or purples) than the average. To create a visually balanced palette, we will make some local adjustments."

**Swatch area:**

- All 12 chromatic hue rows at 30° intervals, anchored to primary's offset within its band
- Rows sorted by hue ascending, starting from the row in the 0°–30° band (red (0-15) or orange (15-30) )
- Primary row stays at its exact hue; other rows are offset + N×30°
- Secondary and tertiary are **not shown** but their values remain stored
- Grey companion rows hidden — only keep Neutral row and the grey matching the UI tone
- Each row shows the hue value on the right
- The primary row is marked with a bold label

**Left panel — Dark adjustment:**
Vertical slider track aligned with the swatch rows (top = top of hue 0° row, bottom = bottom of hue 330° row):

1. **Center handle** — marks the hue where the darkening effect is strongest
2. **Falloff handle** — marks where the effect fades to 0 (above the center)
3. **Mirror handle** — automatically mirrors the falloff below the center (moves opposite)
Use as much plain HTML as possible, otherwise look for NUXT UI components and if nothing matches, create a component yourself

Below the Vertical slider, next to the grey swatches and in the left and right panels are the following horizontal sliders (like the dark shift sliders): 4. **Strength slider** (0–100%) — overall amplitude of the darkening effect 5. **Light falloff slider** (0–100%) — how much the effect diminishes across the swatch width (dark swatches → light swatches). 0% = uniform across all swatches, 100% = only affects the darkest swatches 6. **Hue falloff curve** (0–100%) — controls the gradient shape between center hue and the 0-effect boundary. 0% = sharp cutoff, 100% = smooth bell curve

**Right panel — Light adjustment:**
Identical layout to the left panel but for brightening:

1. **Center handle** — hue where brightening is strongest
2. **Falloff handle** — where the effect fades to 0
3. **Mirror handle** — auto-mirrors opposite
4. **Strength slider** (0–100%)
5. **Dark falloff slider** (0–100%) — same concept but from the light end
6. **Hue falloff curve** (0–100%)

### The Effect Model — "Gradient Oval"

The adjustment effect can be visualized as an oval gradient centered on the darkest swatch (left edge) at the center hue:

```
     hue falloff=0, modified by Hue falloff curve
     │
     ▼
  ┌──────────────────────────┐
  │ ░░░░░░░░░░░░░░           │  ← falloff zone (gradient 0→100%)
  │ ████████░░░░░░░░░░       │
  │ █████████████████░░░░    │  ← center zone (100% effect modified by lightness falloff)
  │ ████████░░░░░░░░░░       │
  │ ░░░░░░░░░░░░░░           │
  └──────────────────────────┘
  ▲                           ▲
  dark (max effect)     light (0 effect)
```

- **Vertical axis**: hue rows — center handle is the peak, falloff handles define where it reaches 0
- **Horizontal axis**: swatch position (dark → light) — shaped by `cubic-bezier(0.60, 0.00, 1.00, 1.00)`. Effect stays heavy through darker swatches, then tapers off quickly near lightness=100%. Both dark and light adjustments share this same lightness curve (center at lightness 0 / dark side)
- **Effect merges**: darkening and brightening are additive (can overlap, net effect is the sum)

### Swatch Row Ordering

For Step 4 only, the swatch display changes from the normal P/S/T view to a 12-hue chromatic view:

1. Determine the primary hue (e.g., 155°)
2. Compute the primary's offset within its 30° band: `155 % 30 = 5°`
3. Generate 12 hue rows using that offset: 5°, 35°, 65°, 95°, 125°, **155°** (primary), 185°, 215°, 245°, 275°, 305°, 335°
4. The first row is the one nearest red (0°–30° band), i.e., 5° in this example
5. Primary stays at its exact hue; the other 11 are primary's offset + multiples of 30°
6. Secondary and tertiary are **not shown** as distinct rows — their values are stored but hidden. The 12-row grid uses uniform saturation (primary saturation for all rows)
7. All rows use the same lightness steps from the bezier curve
8. Only the primary row is visually marked (bold label)

### Lightness Falloff Curve

The effect's tapering from dark swatches to light swatches follows a fixed bezier curve:

**`cubic-bezier(0.60, 0.00, 1.00, 1.00)`**

This keeps the effect heavy through the darker swatch positions, then drops off quickly near the light end. This is a separate curve from the main lightness distribution bezier — it only shapes the adjustment falloff.

The "Light falloff" slider (0–100%) scales how much of this curve is applied: 0% = uniform effect across all swatches, 100% = full bezier-shaped falloff.

### Vertical Hue Slider

The slider track is aligned with the 12 hue rows in the swatch area:

- Track height matches the swatch group height
- 12 tick marks correspond to the 12 hue rows
- **Center handle**: large, colored with the hue at its position
- **Falloff handles**: smaller, semi-transparent, show the 0-boundary
- The area between center and falloff handles is highlighted to show the active zone
- Moving center handle auto-repositions both falloff handles (maintaining their distance)
- Falloff handles can be independently adjusted
- Mirror handle always stays symmetrically opposite to the main falloff handle

### Integration with existing `applyAdjustment()`

The new UI controls will map to the existing adjustment model:

| New UI control            | Maps to                                           |
| ------------------------- | ------------------------------------------------- |
| Center handle position    | `start` and `end` computed from center ± span     |
| Falloff handle distance   | `hueFalloff` (degrees from center to 0-boundary)  |
| Strength slider           | `lightnessAmplitude` (0–100% maps to 0–30)        |
| Light/Dark falloff slider | `lightnessFalloffLight` / `lightnessFalloffDark`  |
| Hue falloff curve         | Additional shaping parameter (may need new field) |

The `enabled` flag will always be `true` — no toggle needed.

---

## Implementation Phases

### Phase 1: Swatch row reordering for Step 4

- Add `inputLayout: "lightness-adjustment"` to the step registry
- Create computed that produces 12 hue rows: `(primaryHue % 30) + N×30` for N=0..11, sorted ascending
- Primary row keeps exact hue, marked with bold label
- S/T values stored but rows not rendered
- Grey companions hidden — only Neutral row + UI tone grey shown
- Show all 12 rows when on Step 4 (other steps keep the normal P/S/T view)

### Phase 2: Vertical hue slider component

- New component: `HueRangeSlider.vue`
- Vertical slider with 3 handles (center, falloff-top, falloff-bottom)
- Track height synchronized with swatch row container height
- Handle colors match the hue at their position
- Active zone highlighting between falloff handles
- Emit: center hue, falloff span (in degrees or row steps)

### Phase 3: Side panel controls

- Replace existing dark/light shift sliders with the new adjustment controls
- Left panel: dark adjustment (HueRangeSlider + 3 horizontal sliders)
- Right panel: light adjustment (HueRangeSlider + 3 horizontal sliders)
- Wire UI controls to the adjustment model parameters

### Phase 4: Composable refactor

- Remove master `enabled` toggle — always on
- Update `AdjustmentRange` to work with center+span instead of start/end
- Add hue falloff curve parameter if needed
- Ensure `applyAdjustment()` output is correct for the new parameter mapping
- Keep backward compatibility with existing function signature

### Phase 5: Visual effect overlay (stretch goal)

- SVG or CSS gradient overlay on the swatch area showing the oval effect shape
- Updates in real-time as sliders move
- Low opacity so swatches remain visible underneath

---

## Resolved Questions

1. **12-hue view scope**: S/T values stored but not shown. All 12 hues displayed at 30° intervals based on primary's offset.
2. **Grey rows**: Hidden except Neutral row and the grey matching the selected UI tone.
3. **Hue falloff curve**: Simple slider (0–100%) for now, no mini bezier editor.
4. **Default center hues**: Yellow ~60° for darkening, Blue ~240° for brightening.
5. **Vertical slider positioning**: Free (continuous), not snapped to 30° steps. Effect is interpolated gradually as the handle crosses hue boundaries.
6. **Lightness falloff curve**: `cubic-bezier(0.60, 0.00, 1.00, 1.00)` — heavy through dark swatches, quick taper near light end. Separate from the main lightness distribution bezier.
7. **Side panel layout**: Both panels have identical structure (vertical hue slider + 3 horizontal sliders). Both adjustments (dark and light) center at lightness 0 (dark side).

---

## Files to Create/Modify

### New files

- `app/components/HueRangeSlider.vue` — vertical 3-handle slider
- `app/components/LightnessAdjustmentSwatches.vue` — 12-hue row swatch display (if separate from main swatches)

### Modified files

- `app/composables/input/stepLightnessAdjustment.ts` — remove toggle, add center+span model
- `app/composables/themes/lib/types.ts` — update AdjustmentRange type
- `app/composables/steps/stepRegistry.ts` — add inputLayout for step 4
- `app/components/LightnessAdjustmentPanel.vue` — new title/description, remove toggles
- `app/components/GeneratorLeftPanel.vue` — dark adjustment controls
- `app/components/GeneratorRightPanel.vue` — light adjustment controls
- `app/components/GeneratorSwatches.vue` — 12-hue row mode for step 4
- `app/components/GeneratorInput.vue` — layout support for lightness-adjustment step

---

## Implementation Status

### Completed

- [x] **Phase 1**: 12-hue swatch rows for step 4 (`63b5726`)
- [x] **Phase 2**: HueRangeSlider.vue — vertical 3-handle slider component (`3c9712f`)
- [x] **Phase 3**: Side panel controls — dark/light adjustment in left/right panels (`3c9712f`)
- [x] **Wiring**: `applyAdjustment()` plugged into `ColorSwatchRow.vue` — adjustment is now live
- [x] **Defaults updated**: Dark center 240° ± 45°, str 15, falloff 60%/30%. Light center 120° ± 90°, str 12, falloff 90%/50%
- [x] **Panel labels**: "Dark adjustment" / "Light adjustment" headers
- [x] **Always enabled**: No toggle; `DEFAULT_LIGHTNESS_ADJUSTMENT.enabled = true`

### Follow-up Tasks

1. **Verify swatch rendering**: Confirm 12-hue rows visually show the adjustment effect (darker blues, brighter greens)
2. **Fine-tune default values**: Test with various primary hues and tweak center/falloff if needed
3. **Composable refactor (Phase 4)**: 
   - Remove `enabled` boolean from `AdjustmentRange` — ranges are always active (amplitude=0 = disabled)
   - Replace start/end model with center+span internally for cleaner code
   - Keep `applyAdjustment()` signature unchanged
4. **Export integration**: Ensure exported CSS variables include adjusted lightness values
5. **Per-theme adjustment settings**: Store adjustment state per-theme like shifts
6. **Visual effect overlay (Phase 5, stretch)**: SVG/CSS gradient overlay on swatches showing the oval effect shape
7. **HueRangeSlider polish**:
   - Make track gradient dynamic (show actual hue row colors, not generic rainbow)
   - Sync track height with swatch group height via ResizeObserver
   - Consider tick marks at 12 hue row positions
8. **Hue falloff curve slider**: Currently linear — may want the bezier-shaped curve option later
