# Plan: Interactive Hue-Saturation Wheel

> Created: 2026-03-24
> Status: Draft

## Overview

Transform the static CSS hue-saturation wheel in Step 2 into a fully interactive color picker with draggable handles for primary, secondary, and tertiary colors. The wheel replaces the current offset slider as the main control for complementary color selection.

## Wheel Anatomy

```
            ┌──────── Outer markers (hue-only indicators) ────────┐
            │                                                      │
            │    ┌──── Gradient wheel (conic hue + radial sat) ───┐│
            │    │                                                ││
            │    │   ┌── Saturation ring (thin circle at step 1  ││
            │    │   │   saturation value)                       ││
  [Primary  │    │   │                                           ││
   marker]──┤    │   │       ● Primary handle                   ││
            │    │   │       ● Secondary handle                  ││
            │    │   │       ● Tertiary handle                   ││
            │    │   │                                           ││
            │    │   └───────────────────────────────────────────┘││
            │    └────────────────────────────────────────────────┘│
            └──────────────────────────────────────────────────────┘
```

- **Gradient wheel**: conic-gradient for hue (0–360°), radial-gradient for saturation (100% at edge → 0% at center)
- **Saturation ring**: thin circle at the radius corresponding to the saturation set in Step 1
- **Handles**: draggable circles positioned by polar coordinates (angle = hue, distance = saturation)
- **Outer markers**: small circles outside the wheel showing hue positions without saturation info

## Coordinate System

- Hue: angle in degrees, 0° = top (12 o'clock), clockwise
- Saturation: distance from center as percentage of wheel radius (0% = center, 100% = edge)
- All positions computed as `(angle, distance)` → `(x, y)` via polar-to-cartesian conversion

## Handle Behavior

### Generic behaviour

- Handles are circles with a white border, their background will be the actual color they represent
- handles share their styling with the slider handles.
- background will update when dragging
- The handles will be bound withing the circle, at the center point of the handle
- Handles will show half outside the wheel if dragged to the edge (no clipping on the wheel container)
- they will have a cursor mouse pointer.

### Saturation Ratio Model

Instead of storing an absolute secondary saturation, we store a **saturation ratio** relative to primary.

```
satRatio = complementarySaturation / primarySaturation
```

- When the user drags S or T radially, the ratio is recalculated: `satRatio = newSatValue / primarySaturation`
- When the user drags P radially, S and T are computed proportionally: `complementarySat = primarySaturation × satRatio`
- The ratio can exceed 1.0 (e.g. 1.2 means S/T are 20% more saturated than P)
- Final values are always clamped to 0–100

**Example:**

- P = 100, S = 80 → `satRatio = 0.8`
- User drags P to 90 → S becomes `90 × 0.8 = 72`, T also becomes 72
- P = 50, S = 60 → `satRatio = 1.2`
- User drags P to 40 → S becomes `40 × 1.2 = 48`

**Edge case:** If P = 0, ratio is undefined. Preserve the last absolute S/T value and recompute ratio when P becomes non-zero again.

### Primary Handle (P)

- Position: `(primaryHue, primarySaturation)`
- Dragging around the circle → adjusts `hue` in `useColorSettings` (two-way: Step 1 sliders update too)
- Dragging in/out → adjusts `saturation` in `useColorSettings` (two-way: Step 1 sliders update too)
- When P moves angularly: S and T follow maintaining their hue offsets
- When P moves radially: S and T follow proportionally via `satRatio` (not to the same absolute value)

### Secondary Handle (S)

- Initial position: `(primaryHue + hueOffset, primarySaturation × satRatio)`
- Dragging around the circle → adjusts `hueOffset` (relative to primary)
- Dragging in/out → recalculates `satRatio` from new position, T follows proportionally
- When S moves angularly: T mirrors the offset change (`T_offset = -S_offset`)
- When S moves radially: T follows to the same saturation (they share the ratio)
- Primary remains fixed when S is dragged

### Tertiary Handle (T)

- Initial position: `(primaryHue - hueOffset, primarySaturation × satRatio)`
- Same behavior as S but mirrored: dragging T adjusts offset, S mirrors
- Radial changes on T update `satRatio`, S follows
- Primary remains fixed when T is dragged
- T is always visible (even when offset = 0, it overlaps S)
- S has higher z-order than T so it sits on top when overlapping

### Offset Symmetry Rules

| Action               | P     | S                           | T                           | hueOffset slider  |
| -------------------- | ----- | --------------------------- | --------------------------- | ----------------- |
| Drag P (hue)         | moves | follows (P + offset)        | follows (P - offset)        | unchanged         |
| Drag P (sat)         | moves | follows proportionally (×R) | follows proportionally (×R) | unchanged         |
| Drag S (hue)         | fixed | moves                       | mirrors (360 - new offset)  | updates           |
| Drag S (sat)         | fixed | moves, recalcs ratio        | follows (same new ratio)    | unchanged         |
| Drag T (hue)         | fixed | mirrors                     | moves                       | updates           |
| Drag T (sat)         | fixed | follows (same new ratio)    | moves, recalcs ratio        | unchanged         |
| Adjust offset slider | fixed | follows                     | follows                     | — (is the source) |

## Outer Marker

- A round marker outside the wheel perimeter at the primary hue angle
- Purely indicates the hue position from Step 1
- Click → snaps the primary handle to that hue angle (preserves current saturation)
- Visual: small filled circle in the primary color, positioned just outside the wheel edge

## Saturation Ring

- Thin circle (1–2px) drawn at the radius corresponding to `primarySaturation` from Step 1
- Follows the primary saturation value reactively
- Purpose: visual reference so users can see Step 1's saturation without navigating back

## Implementation Phases

### Phase 1: Composable — `useWheelInteraction.ts`

New composable in `app/composables/input/` managing wheel state and drag logic.

**Responsibilities:**

- Polar ↔ cartesian coordinate conversion
- Mouse/touch → polar coordinate mapping (relative to wheel center)
- Drag state management (which handle is being dragged)
- Emit hue/saturation/offset changes to existing composables

**Inputs (from existing composables):**

- `hue`, `saturation` from `useColorSettings`
- `hueOffset`, `secondaryHue`, `tertiaryHue` from `useComplementaryColors`

**Outputs:**

- Handle positions as reactive `{ x, y }` pairs
- Saturation ring radius
- Drag event handlers (`onPointerDown`, `onPointerMove`, `onPointerUp`)

### Phase 2: Component — `HueSaturationWheel.vue`

Upgrade the existing component from static CSS to interactive SVG-over-CSS.

**Structure:**

```
<div class="hue-wheel-container">
  <div class="hue-wheel" />          ← CSS gradient (unchanged)
  <svg class="wheel-overlay">        ← SVG layer for interactive elements
    <circle class="sat-ring" />      ← Saturation reference ring
    <circle class="handle-primary" />
    <circle class="handle-secondary" />
    <circle class="handle-tertiary" />
  </svg>
  <div class="outer-marker" />       ← Primary hue marker outside wheel
</div>
```

**Rendering:**

- CSS gradient remains as background
- SVG overlay (same size as wheel) for handles and ring
- Outer marker positioned with CSS transforms

### Phase 3: Drag Interaction

- Use `pointer` events (pointerdown/pointermove/pointerup) for unified mouse+touch
- On `pointerdown` on a handle: capture pointer, set active handle
- On `pointermove`: compute polar coords from cursor position, update hue/saturation/offset
- On `pointerup`: release pointer, clear active handle
- Clamp saturation to 0–100 range
- Hue wraps at 0/360

### Phase 4: Integration

- Wire `useWheelInteraction` to `useColorSettings.setHue()` / `setSaturation()` — full two-way binding with Step 1 sliders
- Wire to `useComplementaryColors.hueOffset`
- New: add `satRatio` ref in `useComplementaryColors` (ratio of complementary saturation to primary)
- Computed `complementarySaturation = clamp(primarySaturation × satRatio, 0, 100)`
- Ensure the existing offset slider updates reactively when handles are dragged
- Ensure handles update reactively when the offset slider is used
- Ensure Step 1 hue/saturation sliders update when P handle is dragged

### Phase 5: Secondary Saturation Ratio Support

Currently saturation is a single value for all rows. This phase adds:

- A `satRatio` ref in `useComplementaryColors` (default: 1.0, meaning S/T start at same sat as P)
- Computed `complementarySaturation` derived from `primarySaturation × satRatio`, clamped 0–100
- S/T handles use `complementarySaturation` for their radial position
- Swatch rows for secondary/tertiary use `complementarySaturation` instead of primary
- When S or T is dragged radially: `satRatio = newSatValue / primarySaturation`
- When P is dragged radially: S/T recompute via the stored ratio (proportional, not absolute)
- Edge case: if P = 0, preserve last absolute S/T value; recompute ratio when P > 0 again
- Ratio can exceed 1.0 (S/T can be more saturated than P); final values clamped to 0–100

## State Flow Diagram

```
Step 1 sliders ──→ useColorSettings (hue, saturation, lightness)
                        │                    ↑
                        │              (two-way binding)
                        │                    │
                        ├──→ Primary handle position ←── Wheel drag (P)
                        │         │
                        │         └──→ complementarySat = primarySat × satRatio
                        │                    │
                        └──→ useComplementaryColors (hueOffset, satRatio)
                                │                           ↑
                                │                     Wheel drag (S/T)
                                ├──→ Secondary handle: hue = P + offset
                                │                      sat = primarySat × satRatio
                                ├──→ Tertiary handle:  hue = P - offset
                                │                      sat = primarySat × satRatio
                                └──→ Offset slider value (two-way)
```

## Resolved Questions

1. **Two-way binding**: Yes — dragging P on the wheel updates Step 1's hue/saturation sliders in real time.
2. **Saturation model**: Proportional ratio (`satRatio = complementarySat / primarySat`). Stored as a ratio, not an absolute offset. Allows values > 1.0 (S/T more saturated than P). Clamped to 0–100 on output.
3. **Tertiary visibility**: Always visible. When offset = 0, T overlaps S. S has higher z-order.
4. **Handle overflow**: Handles are NOT clipped by the wheel container. When dragged to the edge, they show half outside the wheel (visible overflow).
5. **Angle origin**: 0° = top (red at 12 o'clock), clockwise rotation confirmed.

## Files to Create/Modify

| File                                              | Action | Purpose                                                        |
| ------------------------------------------------- | ------ | -------------------------------------------------------------- |
| `app/composables/input/useWheelInteraction.ts`    | Create | Drag logic, coordinate math, state wiring                      |
| `app/components/HueSaturationWheel.vue`           | Modify | Add SVG overlay, handles, ring, outer marker, overflow visible |
| `app/composables/input/useComplementaryColors.ts` | Modify | Add satRatio ref, computed complementarySaturation             |
| `app/components/ComplementaryColorPicker.vue`     | Modify | Connect wheel events, remove redundant controls if needed      |
