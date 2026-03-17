# Plan: Select Theme Step

## Goal

Add a new step between Complementary Colors (step 2) and Lightness Distribution (step 3) where the user selects a theme: **Tailwind**, **Mathematical**, or **Custom**. The step shows a radio/toggle UI and introduces a "Save Custom" button. Switching themes swaps bezier curves, step counts, swatch labels, and lightness ranges — everything updates live in the swatch preview.

---

## Current State

### What already works

- `useThemes()` composable exists with `setTheme(id)`, `currentTheme`, `availableThemes`
- `stepLightnessDistribution` watches `currentTheme` and resets bezier values on change
- `stepHueSpectrum` maintains per-theme hue state (separate `useState` per theme ID)
- Three themes defined: `tailwindTheme`, `mathematicalTheme`, `customTheme`
- `customTheme` is a clone of Tailwind — placeholder for user overrides

### What does not work yet

- No UI to call `setTheme()` — it is wired but never invoked from a component
- `useLightnessAdjustment` does NOT react to theme changes (uses its own ref) (this will be the next step to be implemented.)
- `customTheme` has no save/load mechanism, normally the user is required to export the settings and paste them into their own theme. Decide if it is a large amount of work
  for this feature, otherwise we will skip it and rely on the export function. Make the assesment before implementation and interupt the prompter
- Step registry has no "Select Theme" step
- Changing `totalSteps` mid-session has no downstream testing (swatch grid, CSS variables, grey saturation array length)

---

## Architecture

### Data flow on theme switch

```
User clicks theme toggle
  → useThemes().setTheme(id)
    → currentThemeId changes
      → currentTheme computed updates
        → stepLightnessDistribution watches and resets:
            - bezier {x1,y1,x2,y2} → from new theme.bezier
            - lightnessSteps recomputed (new bezier + new lightnessMin/Max)
            - grayscaleLightnessSteps recomputed (new grayscaleBezier + range)
            - Note that if the user made adjustments to the bezier in the next step and comes back, the changes should remain in place, just like changes in hue and saturation.
        → generator.vue recomputes totalSteps, swatch labels
        → useCssVariables watches lightnessSteps → pushes new CSS vars
        → stepHueSpectrum switches to correct hue row state set
        → useLightnessAdjustment resets to new theme.lightnessAdjustment (FIX NEEDED)
```

### What a theme switch must change

| Property                    | Source                                   | Consumers                                                                  |
| --------------------------- | ---------------------------------------- | -------------------------------------------------------------------------- |
| `totalSteps`                | `currentTheme.totalSteps`                | generator.vue, GeneratorSwatches, ColorSwatchRow grid, greySaturationSteps |
| `swatchLabels`              | `currentTheme.swatchLabels`              | generator.vue footer                                                       |
| `bezier`                    | `currentTheme.bezier`                    | stepLightnessDistribution → lightnessSteps                                 |
| `grayscaleBezier`           | `currentTheme.grayscaleBezier`           | stepLightnessDistribution → grayscaleLightnessSteps                        |
| `lightnessMin/Max`          | `currentTheme.lightnessMin/Max`          | stepLightnessDistribution                                                  |
| `grayscaleLightnessMin/Max` | `currentTheme.grayscaleLightnessMin/Max` | stepLightnessDistribution                                                  |
| `lightnessAdjustment`       | `currentTheme.lightnessAdjustment`       | useLightnessAdjustment (NEEDS FIX)                                         |
| `hue rows`                  | per-theme state in stepHueSpectrum       | already handled                                                            |

---

## Implementation Steps

### Step 1: Add "Select Theme" to the step registry

Insert at position 3 (between complementary-colors and lightness-distribution):

```ts
{
    id: "select-theme",
    title: "Select Theme",
    description: "Choose a color system theme — Tailwind, Mathematical, or your own custom preset",
    inputComponent: "ThemeSelector",
    inputLayout: "default",
    unlocks: []   // no new swatch rows — theme switch affects existing rows
}
```

This bumps lightness-distribution to step 4, lightness-adjustment to step 5, hue-spectrum to step 6, export to step 7.

### Step 2: Create ThemeSelector.vue component

**UI layout:**

- Three theme cards/radio buttons: Tailwind, Mathematical, Custom
- Each card shows: name, step count (e.g. "13 shades"), a short description
- Active theme is highlighted
- Below the selector: "Save current as Custom" button (disabled if already custom or if nothing has changed)

**On toggle:**

- Calls `useThemes().setTheme(id)`
- Everything downstream reacts via existing watchers

### Step 3: Verify totalSteps propagation

When switching from Tailwind (13 steps) to Mathematical (9 steps) or back:

- `generator.vue` already reads `totalSteps` from `currentTheme` — should auto-update
- `greySaturationSteps()` takes 13 hardcoded `TOTAL_STEPS` — **NEEDS FIX** to be dynamic
- `ColorSwatchRow` grid uses `v-bind(totalSteps)` for columns — should auto-update
- Primary shade labels in `useCssVariables.ts` are hardcoded to 11 TW shades — **NEEDS FIX** to use `currentTheme.swatchLabels`
- Grey shade labels in `greyConstants.ts` are hardcoded — **NEEDS FIX** to derive from theme

### Step 4: "Save as Custom" functionality

When user clicks "Save as Custom":

1. Snapshot current state into the custom theme slot:
    - Current bezier values (may have been user-edited)
    - Current lightnessMin/Max
    - Current grayscaleBezier + range
    - Current totalSteps + swatchLabels
    - Current lightnessAdjustment config
2. Update `customTheme` in memory (mutate the registered theme object)
3. Optionally persist to `localStorage` (future enhancement — not for initial implementation)
4. Switch to the custom theme

### Step 5: Wire up step navigation

- Update `useStepNavigation` if needed (currently linear, should just work with the new step count)
- Verify swatch unlock still functions correctly (select-theme unlocks nothing new)

---

## Risks and Considerations

### totalSteps mismatch

The biggest risk is that `greySaturationSteps()` and CSS variable label arrays assume 13 steps. Mathematical theme uses 9. All step-count-dependent code must read from `currentTheme.totalSteps`.
A solution might be to call the functions with the initial value, like it's own lightness, or percentage and use that as the X for the function to return the Y used. So we are not dependendt on step 1/n but call from the middle step, get Y value for X=0.5 (50% - middle). Or, get the saturation bezier for lightness 0.8.

### Per-theme user state

The old JS version preserved per-palette hue offsets. The current Nuxt version already does this for hue rows (separate `useState` per theme). Bezier edits are NOT preserved per-theme — switching resets to theme defaults. This is must be changed as the user should be able to modify the bezier and them come back to change the theme, so all bezier values should be stored and updated.

### CSS variable count

With 13 steps, we set 11 `--primary-lightness-{shade}` variables (950→50). With 9 steps, we'd only have 7 inner shades. The CSS in `main.css` has all 11 hardcoded. This needs a strategy:

- Option A: Keep 11 CSS variables, only update the ones the current theme uses (others stale but unused)
- Option B: Clear all and only set the theme's shade labels
- ** Use this consideration: When selecting the Tailwind theme, the export will be a config file that is filled with hardcoded TW names. When Mathemathical is chosen, the output will probably be a set of CSS variables so we can have different variable names, but I understand the need to store two sets in this app as we want to swap whenever and use both sets to update the app UI itself.
- **Recommendation: Option B** — clear all before setting, so no stale variables linger

### Custom theme save scope

For the initial implementation, "Save as Custom" only survives the session (in-memory). localStorage persistence can be added later.

---

## Files to Create or Modify

| File                                              | Action     | Description                                                 |
| ------------------------------------------------- | ---------- | ----------------------------------------------------------- |
| `app/components/ThemeSelector.vue`                | **Create** | Theme selection UI with radio cards + save button           |
| `app/composables/steps/stepRegistry.ts`           | Modify     | Insert select-theme step at position 3                      |
| `app/composables/input/useLightnessAdjustment.ts` | Deferred   | Watch currentTheme, reset on switch (out of scope for now)  |
| `app/composables/utils/greySaturation.ts`         | Modify     | Accept totalSteps as parameter instead of hardcoded 13      |
| `app/composables/ui/useCssVariables.ts`           | Modify     | Dynamic shade labels from theme, clear stale vars on switch |
| `app/composables/utils/greyConstants.ts`          | Modify     | Derive shade labels from theme or keep as fallback          |
| `app/composables/themes/index.ts`                 | Modify     | Add `saveAsCustom()` function                               |
| `app/components/GeneratorInput.vue`               | Modify     | Add ThemeSelector to component map                          |

---

## Out of Scope (for later)

- **Fix useLightnessAdjustment theme reactivity** — watch `currentTheme`, reset `adjustmentConfig` on switch, preserve user edits within same theme session (dev feature, will figure out best course later)
- Theme import/export (JSON snapshot load)
- localStorage persistence for custom theme
- Theme-specific lightness adjustment presets
- Adding/removing theme step count dynamically via UI
