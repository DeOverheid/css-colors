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
- Visual oval/gradient overlay to show effect shape

---

## Design

### Step 4 Layout

**Top panel (center content area):**
- Title: "Lightness Adjustment"
- Description: "Visually some colors look brighter (like orange) or darker (like blues) than the average. To create a visually balanced palette, we will make some local adjustments."

**Swatch area:**
- All chromatic hue rows unlocked at this step (not just P/S/T — all 12 hues at 30° intervals)
- Rows sorted by hue ascending, starting from the primary hue's nearest 30° step
- Primary row stays at its exact hue (defines the 0° anchor for the 30° grid)
- Secondary and tertiary are snapped to the nearest 30° step for visual alignment
- Each row shows the hue value on the right

**Left panel — Dark adjustment:**
Vertical slider track aligned with the swatch rows (top = hue 0° row, bottom = hue 330° row):
1. **Center handle** — marks the hue where the darkening effect is strongest
2. **Falloff handle** — marks where the effect fades to 0 (above the center)
3. **Mirror handle** — automatically mirrors the falloff below the center (moves opposite)

Below the hue slider, next to the grey swatches:
4. **Strength slider** (0–100%) — overall amplitude of the darkening effect
5. **Light falloff slider** (0–100%) — how much the effect diminishes across the swatch width (dark swatches → light swatches). 0% = uniform across all swatches, 100% = only affects the darkest swatches
6. **Hue falloff curve** (0–100%) — controls the gradient shape between center hue and the 0-effect boundary. 0% = sharp cutoff, 100% = smooth bell curve

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
     hue falloff=0
     │
     ▼
  ┌──────────────────────────┐
  │          ░░░░░░░          │  ← falloff zone (gradient 0→100%)
  │       ░░████████░░        │
  │     ░░████████████░░      │  ← center zone (100% effect)
  │       ░░████████░░        │
  │          ░░░░░░░          │
  └──────────────────────────┘
  ▲                           ▲
  dark (max effect)     light (0 effect)
```

- **Vertical axis**: hue rows — center handle is the peak, falloff handles define where it reaches 0
- **Horizontal axis**: swatch position (dark → light) — the "light falloff" controls how quickly the effect diminishes toward lighter swatches
- **Effect merges**: darkening and brightening are additive (can overlap, net effect is the sum)

### Swatch Row Ordering

For Step 4 only, the swatch display changes from the normal P/S/T view to a 12-hue chromatic view:

1. Determine the primary hue (e.g., 155°)
2. Compute 12 hue slots at 30° intervals starting from primary: 155°, 185°, 215°, ..., 125°
3. Snap secondary and tertiary hues to the nearest 30° slot
4. Fill remaining slots with pure hue values
5. Each row gets the primary saturation (or could use per-row saturation later)
6. All rows use the same lightness steps from the bezier curve

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

| New UI control | Maps to |
|---|---|
| Center handle position | `start` and `end` computed from center ± span |
| Falloff handle distance | `hueFalloff` (degrees from center to 0-boundary) |
| Strength slider | `lightnessAmplitude` (0–100% maps to 0–30) |
| Light/Dark falloff slider | `lightnessFalloffLight` / `lightnessFalloffDark` |
| Hue falloff curve | Additional shaping parameter (may need new field) |

The `enabled` flag will always be `true` — no toggle needed.

---

## Implementation Phases

### Phase 1: Swatch row reordering for Step 4

- Add `inputLayout: "lightness-adjustment"` to the step registry
- Create computed in GeneratorSwatches that produces 12 hue rows at 30° intervals anchored to primary
- Snap S/T to nearest 30° slot
- Show all 12 rows when on Step 4 (other steps keep the normal P/S/T view)
- Each row labeled with its hue degree

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

## Open Questions

1. Should the 12-hue view persist after leaving Step 4, or revert to P/S/T?
2. Should grey companion rows also show for all 12 hues, or only for P/S/T?
3. Should the hue falloff curve be a simple slider or a mini bezier curve?
4. What are good defaults for the center hue? (Yellow ~60° for darkening, Blue ~240° for brightening?)
5. Should the vertical slider snap to 30° hue steps or allow free positioning?

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
