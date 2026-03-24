# Feature History — CSS Colors Generator

Chronological record of features and refactors. Grouped by phase/branch. Use this to understand what was built, in what order, and why.

---

## Phase 1: Foundation (initial commits)

**Commits:** `5ff385f` → `a58bf65`

- Project setup (Nuxt 4, TypeScript, Nuxt UI)
- Core composables: `useColorSettings`, `baseConfig`
- Color parsing utilities (`parseColor`)
- Step 1: Base Color — hue/saturation/lightness sliders
- Color swatch components
- Theme system skeleton
- Step 2: Lightness Distribution — bezier curve for lightness mapping
- Step 3: Hue Spectrum — expand palette with additional hue rows
- Export configuration composable
- Pages and routing (`/`, `/generator`)
- Basic app layout

---

## Phase 2: Feature Build-out

**Commits:** `0d09e46` → `90b0512`

- Step accordion and hue spectrum composable
- Migration plan from legacy JS
- HSL Lightness Adjustment panel (hue-based perceptual compensation)
- Dev mode toggle (show/hide developer info)
- Separate bezier curves for grayscale and color hues (later removed)
- Tailwind colors reference page (`/tailwind`)
- Better Tailwind lightness range matching
- Closer Tailwind hue offset matching

---

## Phase 3: Export & Deployment

**Commits:** `f2c1ba0` → `b814ed8`

- Export functionality: dev export (TS config) and user export (CSS/JS/JSON)
- Custom user theme support
- FTP deployment script (`project/scripts/deploy.mjs`)
- Static site generation configured for Apache hosting
- Dependency updates

---

## Phase 4: UI Overhaul

**Commits:** `b13480f` → `340d00a`

- Wizard-style generator layout (sidebar nav + content area + swatches)
- Grid alignment and slider full-width
- Step 2 layout improvements
- Generator layout refinements

---

## Phase 5: Code Cleanup

**Commits:** `ef21e4a` → `15f6676`

- Audit-based cleanup across 5 phases
- Removed dead code (StepAccordion, TemplateMenu)
- Dedup & consolidation
- Extracted shared components
- Bezier-driven primary scale
- Decomposed generator.vue into focused components (sidebar, swatches, footer, panels)
- Step registry & panel-driven architecture
- Extracted RadioSelector component

---

## Phase 6: Complementary Colors & Grey System

**Commits:** `e834222` → `ca0064f`

- Complementary colors step: secondary/tertiary hues via offset slider
- Tailwind v4 colors data update
- Hover popup directive for rich swatch tooltips
- Grey companion rows below chromatic rows
- Per-swatch grey saturation following TW distribution
- Linear → bezier-curved grey saturation distribution
- Grey saturation capping and opacity fixes
- Stacked color preview swatches replacing hue indicator dots
- Horizontal color preview layout with centered swatches
- Signed offset slider (-180° to +180°) with centered primary

---

## Phase 7: Live Grey Theme

**Commits:** `f09a810` → `0607515`

- Plan: override Nuxt UI neutrals with generated grey palette
- CSS variable chain approach (JS sets saturation, CSS handles composition)
- Implementation: live grey theme dynamically overrides Nuxt UI neutral colors

---

## Phase 8: Select Theme

**Branch:** `select-theme` → merged to `master`
**Commits:** `2f87dc7` → `8c4cb39`

- Plan for Select Theme step
- Theme step with radio selector (Tailwind / Mathematical / Custom)
- Per-theme bezier state preservation
- Extracted RadioSelector component
- UI tone picker (neutral, primary, secondary, tertiary)
- Simplified step panels, moved Save Custom to footer
- Minor formatting tweaks

---

## Phase 9: Lightness Shifts

**Branch:** `lightness` → merged to `master`
**Commits:** `618bbcc` → `72f0cf2`

- Deduplicated bezier solver (single `getBezierY`)
- Uniform dark/light lightness offset sliders
- **X-axis bezier squeeze** replaces Y-axis lightness offset — narrowing sampled range instead of shifting output
- Renamed "offset" → "shift"
- Slider UX improvements, persistent unlock state
- Shift sliders in left/right panels, hover popup fix, UI color sync
- **Move theme step to step 6** (before export) — user builds in Custom, compares presets at end
- Default theme → Custom
- Per-theme shift state (`per-theme-shifts` map)
- Per-theme hue spectrum state for Custom
- Removed Save Custom button (Custom is always live)
- Removed grayscale bezier — greys follow rainbow bezier with own shifts
- **Weighted squeeze** — dark slider affects dark side more, light slider affects light side more
- Custom theme default bezier: `cubic-bezier(0, 0, 0.5, 0.9)`
- Per-theme UI tone (`defaultUiTone` in ThemeConfig)
- Per-theme saturation (Custom/Math: 66, Tailwind: 86)
- TW defaults: rainbow dark 65, grey dark 38

---

## Current Session (March 23, 2026) — Uncommitted

- Color input parser fix: proper hex parsing (#ff0000, f00, ff0000 all work)
- Replaced live @input parsing with explicit "Update" button + Enter key
- Custom button styling (grey border, fit-content)
- Input content grid: `auto` → `1fr` for proper 15% padding layout
- Skillset profile side-project (PLAN_SKILLSET.md)
