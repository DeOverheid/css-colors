# Plan: Move Theme Selector Before Export

## Concept

Flip the flow from "pick a theme, then tweak" to "build your palette, then compare with presets."

The user works through steps 1–5 in **Custom** mode by default. Every bezier edit, hue offset, and lightness tweak gets stored under Custom. At the end (step 6), they can toggle between their own settings and the Tailwind / Mathematical presets before exporting.

## Current Step Order

1. Primary Color
2. Complementary Colors
3. **Select Theme** ← currently here
4. Lightness Distribution (bezier)
5. Lightness Adjustment
6. Hue Spectrum
7. Export

## New Step Order

1. Primary Color
2. Complementary Colors
3. Lightness Distribution (bezier)
4. Lightness Adjustment
5. Hue Spectrum
6. **Select Theme** ← moved here
7. Export

## Changes Required

### 1. Reorder steps in stepRegistry.ts

Move the theme step definition from index 2 to index 5 (0-based). No IDs change — the registry is order-based, so this is a cut-and-paste.

### 2. Default theme → Custom

In `composables/themes/index.ts`, change the initial `currentThemeId` from its current default to `"custom"`. The user starts building in Custom mode from the beginning.

### 3. Initialize Custom theme with Tailwind defaults

Custom already starts as a copy of Tailwind config (same bezier, same 13 steps). Verify this is still the case and that the user gets a sensible starting point without visiting the theme step first.

### 4. Per-theme state: ensure Custom captures edits

- `stepLightnessDistribution` stores bezier per theme in `perThemeBezier[themeId]`. Since defaulting to Custom, edits land in `perThemeBezier["custom"]` automatically. **No code change needed** — just verify.
- `stepHueSpectrum` uses separate `tailwind-hue-row-states` and `mathematical-hue-row-states`. Need to add a `custom-hue-row-states` key (or a generic per-theme lookup) so Custom hue edits persist independently.
- `stepUniformLightnessShift` squeeze values — verify these are per-theme or make them so.

### 5. Remove "Save Custom" unlock/button

Currently step 3 (theme) unlocks `"save-custom"`. Since the user is _always_ working in Custom until they choose otherwise, the explicit "Save as Custom" action is no longer needed — the Custom slot is live. Remove the unlock entry and any save-custom button logic.

### 6. Update ThemeSelector context/copy

The theme selector now appears near the end. Update its heading/description to reflect the new flow, e.g.:

- Title: "Compare with Presets"
- Description: "See how your palette compares to Tailwind and Mathematical presets. Switch back to Custom to keep your settings."

### 7. Theme switching at step 6: preview behavior

When the user toggles to Tailwind or Mathematical at step 6, all theme-dependent values (bezier, hue offsets, squeeze defaults) swap to the preset. When they toggle back to Custom, their original edits are restored. This already works via per-theme state — just verify the round-trip.

### 8. Unlock system audit

Review `useSwatchUnlock.ts` to ensure moving the theme step doesn't delay any swatch unlocks that are needed earlier. Currently theme step unlocks `["save-custom"]` — if we remove that, there's nothing to worry about.

## Risks / Questions

- **First-time bezier values**: Custom starts with Tailwind's bezier. If the user never touches bezier, switching to Tailwind at the end should show identical results. That's fine — it means the preset comparison only shows a difference when the user has customized.
- **Hue spectrum per-theme state**: Currently only Tailwind and Mathematical have dedicated state keys. Need to add Custom, or switch to a generic `perThemeHueRows[themeId]` pattern (consistent with how bezier already works).
- **Theme step description in sidebar**: The step title "Select Theme" should probably become "Compare Presets" or similar to match the new intent.

## Implementation Order

1. Reorder registry (stepRegistry.ts)
2. Set default theme to custom (themes/index.ts)
3. Add custom hue spectrum state key (stepHueSpectrum.ts)
4. Remove save-custom unlock and button logic
5. Update ThemeSelector copy/title
6. Test full flow: build palette → compare presets → export
