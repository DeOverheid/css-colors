# Plan: Compare Themes (Step 6)

## Goal

Step 6 becomes a **comparison workbench** where the user can switch between themes, view differences, and optionally tweak each theme's settings. All edits are stored per-theme so nothing is lost when switching.

## Current State

| Aspect                   | Status                                                  |
| ------------------------ | ------------------------------------------------------- |
| Theme switching          | Works — `useThemes().setTheme()`                        |
| Per-theme bezier         | ✅ `per-theme-bezier` in `stepLightnessDistribution`    |
| Per-theme shifts         | ✅ `per-theme-shifts` in `stepUniformLightnessShift`    |
| Per-theme saturation     | ✅ `per-theme-saturation` in `useColorSettings`         |
| Per-theme UI tone        | ✅ `per-theme-ui-tone` in `useComplementaryColors`      |
| Per-theme hue spectrum   | ⚠️ Separate `useState` per theme (not unified `Record`) |
| Per-theme lightness adj. | ❌ Single `ref`, not per-theme                          |
| Per-theme hue shift      | ❌ Single state, re-seeded on theme change via watcher  |
| Default/custom toggle    | ❌ Does not exist                                       |
| Step 6 UI                | Minimal — just a radio selector                         |

## Architecture

### A. Per-Theme, Per-Step Settings Store

A new composable `useThemeOverrides` manages a single state map:

```
Record<themeId, Record<stepId, { mode: 'default' | 'custom', values: StepValues }>>
```

- **`mode: 'default'`** → step uses theme's built-in defaults (what ships with the theme definition)
- **`mode: 'custom'`** → step uses the user-edited values stored in `values`
- When a user first edits any setting on a step for a theme, `values` gets populated (copy-on-write from current state)
- Toggling back to `default` does **not** erase `values` — the custom edits stay in memory for the session

### B. Steps That Need Per-Theme Storage

| Step                       | State Key(s)           | What to store                       |
| -------------------------- | ---------------------- | ----------------------------------- |
| 2 — Lightness Distribution | `per-theme-bezier`     | Already per-theme ✅                |
| 2 — Uniform Shift          | `per-theme-shifts`     | Already per-theme ✅                |
| 3 — Lightness Adjustment   | `settings` ref         | Darkening/brightening range configs |
| 4 — Hue Adjustment         | `stepHueShift` state   | Per-entry dark/light shift values   |
| 1 — Complementary Colors   | `per-theme-ui-tone`    | Already per-theme ✅                |
| 0 — Primary Color          | `per-theme-saturation` | Already per-theme ✅                |

**Work needed**: Steps 3 and 4 need to be converted to the per-theme pattern.

### C. Default/Custom Toggle Per Step

Steps 2–5 each get an inline toggle on their input panel (next to the Next step / Copy values button).
Step 6 has only the theme switcher — no toggle needed there.

```
[ Default ○ | ● Custom ]
```

- **Default**: slider values are locked to theme definition, UI shows them read-only or dimmed
- **Custom**: sliders are editable, values stored in session
- Toggle appears after the user makes any edit (copy-on-write creates the custom slot)
- Toggle state is part of `useThemeOverrides`

### D. Export Data Path

The export step (step 7) reads the **resolved settings** for each step:

```
for each step:
  if mode === 'custom' → use stored custom values
  if mode === 'default' → use theme definition defaults
```

This becomes the single source of truth for the export composable. Implementation deferred to a separate branch.

---

## Implementation Steps

### Phase 1: State Infrastructure

1. **Create `useThemeOverrides` composable**
    - `Record<themeId, Record<stepId, { mode, values }>>` via `useState`
    - `getMode(themeId, stepId)` → `'default' | 'custom'`
    - `setMode(themeId, stepId, mode)` → toggle
    - `getCustomValues(themeId, stepId)` → stored user values or null
    - `saveCustomValues(themeId, stepId, values)` → store snapshot
    - `getResolvedValues(themeId, stepId)` → returns custom or theme default based on mode

2. **Convert `stepLightnessAdjustment` to per-theme storage**
    - Replace single `ref<LightnessAdjustmentConfig>` with `Record<themeId, LightnessAdjustmentConfig>`
    - Seed each theme's entry from its `theme.lightnessAdjustment` or `DEFAULT_LIGHTNESS_ADJUSTMENT`
    - Current-theme computed stays the same shape for consumers

3. **Convert `stepHueShift` to per-theme storage**
    - Replace single state + theme-change watcher with `Record<themeId, HueShiftState>`
    - Seed from each theme's `hueShift` config

### Phase 2: Step 6 UI

4. **Redesign `select-theme/InputTop.vue`**
    - Theme switcher: horizontal button group (Tailwind / Mathematical / Custom) — same rounded-group pattern
    - Description area: brief text explaining what step 6 does
    - No per-step toggles here — those live inline on steps 2–5

5. **Create step-override toggle component**
    - Small 2-button toggle: `Default | Custom`
    - Placed inline on steps 2–5 input panels (next to Next/Copy button)
    - When switching to `custom` for the first time, snapshot current (default) values into custom slot
    - When switching to `default`, keep custom values in memory but apply theme defaults
    - Visual feedback: `primary` color on active, `neutral` on inactive
    - Button design will be improved later, make it quick and consistent for now

### Phase 3: Wire Toggle to Existing Steps

6. **Wire the toggle into step composables**
    - Each step composable gains: `if (mode === 'default') return themeDefaults else return customValues`
    - Steps 2 and uniform-shift already per-theme — just needs the mode gate
    - Steps 3 and 4 — use new per-theme state from phase 1

7. **Lock/unlock step inputs based on mode**
    - When `mode === 'default'`, step input components receive a `readonly` or `disabled` prop
    - Sliders still render (for visual reference) but don't accept interaction
    - Visual dimming via CSS opacity or muted colors

### Phase 4: Polish

8. **Step 6 swatch panel**
    - At step 6, all rainbow swatches should be unlocked.
    - Same for neutral and primary OR complementary swatch
    - Show current theme's full palette in the swatch area (already works via theme switching)
    - Optionally: side-by-side mini comparison of 2 themes (future enhancement, not in scope)

9. **Verify all theme switches preserve state**
    - Switch Custom → Tailwind → Custom: custom bezier, shifts, adjustments restored
    - Toggle default → custom → default: custom values preserved in memory
    - Export step reads resolved values correctly (prepare interface, defer implementation)

---

## Out of Scope (Deferred)

- Export step implementation (separate branch)
- Side-by-side theme comparison view
- Persist settings to localStorage
- "Save as Custom" from modified Tailwind/Mathematical
