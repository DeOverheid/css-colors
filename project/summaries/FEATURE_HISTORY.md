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

---

## Phase 10: UI Polish & Hue-Saturation Wheel

**Branch:** `color-wheel` → merged to `master`
**Commits:** `da517e4` → `9a79b80`

### UI Polish (commit `a573990`)

- Sidebar title centered with HR divider below
- Step nav: compact buttons (10px padding, 0 gap, 13px font)
- Step numbers left-aligned with 1em width, 10px gap to text
- Active step uses `var(--color-neutral-900)` instead of white
- `.rounded-group` CSS utility in main.css with `--vertical` and `--horizontal` variants
- Applied rounded-group to nav (vertical) and swatch preview (horizontal)
- Removed `margin-bottom: 1rem` from BaseSlider

### Interactive Hue-Saturation Wheel (commit `5bac71d`)

- **HueSaturationWheel.vue**: CSS conic-gradient wheel + SVG overlay
    - Three draggable handles (primary, secondary, tertiary) with pointer capture
    - Three reference rings: step 1 snapshot (fixed), live primary saturation, complementary saturation (dashed)
    - Outer marker fixed at step 1 hue with snap-back click
    - Red at top (0°), clockwise rotation matching coordinate math
    - Radial grey center fading from 10% to transparent at 70%
    - Secondary/tertiary handles at 80% opacity
- **useWheelInteraction.ts**: Polar↔cartesian coordinate conversion, drag handling
    - Step 1 hue/saturation snapshots for reference ring + outer marker
    - Handle types: primary (hue+sat), secondary/tertiary (offset+compSat)
- **Saturation ratio model** in useComplementaryColors: `satRatio = compSat / primarySat`
    - Proportional behavior: changing primary saturation scales complementary proportionally
    - Edge case: P=0 preserves last absolute complementary value
- Removed offset slider from ComplementaryColorPicker — wheel is sole input
- Redesigned preview swatches as 3x3 grid (labels/swatches/degrees in rows)
- RadioSelector: added `background` property for option buttons (used by tone selector)
- `stepRegistry.ts`: added `"hue-wheel"` inputLayout type
- `GeneratorInput.vue`: grid layout for hue-wheel steps

### Smaller Tweaks (commit `9a79b80`)

- Grey shift label rename: "Grey dark"/"Grey light" → "Grey shift" in both side panels
- Removed `padding-left: 15%` from ComplementaryColorPicker step controls
- Color input parser fix and Update button committed
- Project summaries and memory files added

---

## Phase 11: Bezier Fix & UI Polish

**Branch:** `master`
**Commits:** `2543a38`

- **Bezier solver fix**: Corrected Newton-Raphson derivative in `solveBezierX`, added 20-iteration binary search fallback when slope ≈ 0
- Bezier editor: expanded viewBox (`-5 -5 110 110`), white opaque background, smaller handles (r=4)
- Shift slider thumb colors: pick up track color at thumb position via `--thumb-color` CSS variable
- Light slider direction fix: removed RTL hack, inverted display mapping (`100 - shift`)
- Grey slider thumb saturation parameter (grey sliders pass `10`)
- Wheel layout fix: `height: 100%` + `aspect-ratio: 1/1` + `max-width: 100%`, right-aligned

---

## Phase 12: Lightness Adjustment Redesign

**Branch:** `lightness-adjustment`
**Commits:** `63b5726` (Phase 1), `3c9712f` (Phase 2-3), in-progress...

### Phase 1: 12-Hue Swatch Rows (commit `63b5726`)

- **GeneratorSwatches.vue**: Conditional `v-if/v-else` showing 12 hue rows at 30° intervals when on step 4 (lightness-adjustment), normal P/S/T view otherwise
- Hue rows: `(primaryHue % 30) + N×30` for N=0..11, sorted ascending from red band
- Primary row highlighted with bold label + hue name (Red, Orange, Yellow, etc.)
- **GeneratorInput.vue**: `lightness-adjustment` layout class, no side padding
- **stepRegistry.ts**: Extended `inputLayout` type with `"lightness-adjustment"`

### Phase 2-3: Vertical Hue Range Slider + Side Panel Controls (commit `3c9712f`)

- **New `HueRangeSlider.vue`**: Vertical 3-handle slider component
    - Center handle (large, hue-colored): marks peak effect hue
    - Falloff handles (smaller, semi-transparent): mark zero-boundary above/below center
    - Mirror handle auto-mirrors opposite side of center
    - Active zone highlighted between falloff handles
    - Pointer capture drag with hue↔pixel conversion
- **GeneratorLeftPanel.vue**: Dark adjustment mode on step 4
    - HueRangeSlider for darkening range
    - Strength slider (0–30, `lightnessAmplitude`)
    - Light falloff slider (0–100%, `lightnessFalloffLight`)
    - Hue falloff slider (0–90°, `hueFalloff`)
    - "Dark adjustment" label at top
- **GeneratorRightPanel.vue**: Light adjustment mode on step 4
    - HueRangeSlider for brightening range
    - Strength slider (0–30, `lightnessAmplitude`)
    - Dark falloff slider (0–100%, `lightnessFalloffDark`)
    - Hue falloff slider (0–90°, `hueFalloff`)
    - "Light adjustment" label at top
- **LightnessAdjustmentPanel.vue**: Simplified to description text
- **`sidePanels`** property on `StepDefinition` for per-step panel visibility
- **`showSidePanels`** computed exported from `useStepNavigation`
- Adjustment always enabled (no toggle) — set strength to 0 to disable

### Wiring & Defaults (in progress)

- **ColorSwatchRow.vue**: `applyAdjustment(baseLightness, hue, index, count)` called for every swatch — adjustment is now live and reactive
- **Black/white exempt**: Black (index 0) and white (last index) are fixed endpoints and are never modified by adjustment — only swatches 50–950 are affected
- **Strength model**: Strength interpolates lightness toward 0 (darkening) or 100 (brightening), applied uniformly across all swatches in the hue range
- **New defaults**: Dark: center 100° ± 80°, str 15. Light: center 240° ± 40°, str 6
