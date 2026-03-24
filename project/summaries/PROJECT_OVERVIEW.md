# CSS Colors Generator — Project Summary

## What This Is

A Nuxt 4 + TypeScript web app that generates CSS color palettes. Users configure hue, saturation, lightness distribution via bezier curves, and shift sliders — the app renders live swatches and exports theme configs. Rebuilt from a vanilla JS prototype.

**Stack:** Nuxt 4, Vue 3, TypeScript, Nuxt UI, Tailwind CSS 4
**Hosted:** Static site on Apache via FTP (`ftp.geenkaas.nl`, path `/public_html/css-colors`)
**Repo:** GitHub (`DeOverheid/css-colors`), branch `master`

---

## Architecture

```
app/
  composables/
    core/         → useColorSettings (hue, saturation — per-theme), baseConfig
    input/        → Step composables (baseColor, complementary, lightnessDistribution,
                    lightnessAdjustment, hueSpectrum, uniformLightnessShift)
                    + useWheelInteraction (polar/cartesian drag math for hue wheel)
    output/       → useExportConfig (dev export, user export, URL params)
    steps/        → stepRegistry (declarative step definitions), useStepNavigation, useSwatchUnlock
    themes/       → useThemes, theme configs (tailwind, mathematical, custom)
    ui/           → useCssVariables (200+ CSS vars), useDevMode, useHoverPopup
    utils/        → bezierCurve, lightnessOffset (squeeze), parseColor, greySaturation, etc.
  components/     → Generator panels, sliders, swatches, selectors, HueSaturationWheel
  pages/          → index, generator, tailwind (reference)
  data/           → tailwindColors.ts (TW v4 reference values)
project/
  plans/          → Living plan documents (per feature)
  memory/         → Session memory notes
  summaries/      → Project overview, feature history, decisions log
  notes/          → SESSION_NOTES.md (early session notes, partially outdated)
  scripts/        → deploy.mjs (FTP deploy)
  legacy-js/      → Original vanilla JS implementation
```

---

## Wizard Steps (current order)

| #   | Step ID                | Component                | Purpose                                                     |
| --- | ---------------------- | ------------------------ | ----------------------------------------------------------- |
| 1   | primary-color          | ColorInputControls       | Set base hue + saturation (hex/rgb/hsl input + sliders)     |
| 2   | complementary-colors   | ComplementaryColorPicker | Hue-saturation wheel for secondary/tertiary, UI tone picker |
| 3   | lightness-distribution | BezierControls           | Bezier curve editor for lightness mapping                   |
| 4   | lightness-adjustment   | LightnessAdjustmentPanel | Hue-based perceptual compensation                           |
| 5   | hue-spectrum           | HueSpectrumControls      | Expand palette with additional hue rows + offsets           |
| 6   | select-theme           | ThemeSelector            | Compare Custom vs Tailwind vs Mathematical presets          |
| 7   | export                 | ExportPanel              | Review and export palette config                            |

---

## Theme System

Three themes: **Custom** (default), **Tailwind**, **Mathematical**.

Per-theme state (all persist when switching):

- Bezier curve (`per-theme-bezier`)
- Shift sliders — dark/light for rainbow and grey (`per-theme-shifts`)
- Hue spectrum row offsets (`custom-hue-row-states`, `tailwind-hue-row-states`, `mathematical-hue-row-states`)
- UI tone selection (`per-theme-ui-tone`)
- Saturation (`per-theme-saturation`)

Custom starts with `cubic-bezier(0, 0, 0.5, 0.9)`, all shifts at 0, saturation 66.
Tailwind starts with its own bezier, rainbow dark shift 65, grey dark shift 38, saturation 86.

---

## Key Technical Patterns

- **CSS Variables:** 200+ vars computed from 3 base HSL values + bezier curves. Cascade from composables → `useCssVariables` → `document.documentElement.style`.
- **Per-theme state maps:** `useState<Record<string, T>>` keyed by theme ID. Writable computeds expose current theme's value.
- **Bezier lightness:** `generateLightnessSteps()` samples a cubic bezier curve at evenly-spaced X points, with X-axis squeeze (shift sliders narrow the sampled range).
- **Weighted squeeze:** Dark slider affects dark swatches more than light, and vice versa. Uses position-based linear weights.
- **Greys follow rainbow bezier** — same curve, different shift sliders.
- **Hue-saturation wheel:** Interactive CSS conic-gradient + SVG overlay with 3 draggable handles. Coordinate system: 0°=top, clockwise. Saturation ratio model keeps complementary saturation proportional to primary.
- **Unlock system:** Each step visit unlocks swatch row groups (e.g., visiting complementary colors unlocks secondary/tertiary rows).

---

## Conventions & Preferences

- 4-space indentation
- No console.log in production code
- No unnecessary abstractions — modular enough to swap, not abstract for its own sake
- Plans live in `project/plans/` as living documents
- Commits are descriptive, feature-focused
- UI styling: Nuxt UI components + custom CSS, system font stack
- The user prefers explicit controls (buttons > auto-parsing, manual confirms > live updates)
- Changes are tested visually in browser, values adjusted by feel
