# Code Cleanup Plan

Audit-based cleanup of the `app/` folder — dead code removal, deduplication, refactoring, and decomposition.

---

## Phase 1: Dead code removal

- [ ] **1.1** Delete `components/StepAccordion.vue` — unused, generator uses `useCurrentStep` instead
- [ ] **1.2** Delete `components/TemplateMenu.vue` — Nuxt starter boilerplate, unrelated to project
- [ ] **1.3** Delete `composables/ui/useStepManager.ts` — only consumer was StepAccordion
- [ ] **1.4** Remove unused exports: `applyDarkBoost` (useBezierCurve), `getHueDelta` (stepLightnessAdjustment), `getHueByName` (tailwind.ts), `getMathHueByName` (mathematical.ts), `getCustomHueByName` (custom.ts)
- [ ] **1.5** Remove unused `swatchLabels` computed in `generator.vue`
- [ ] **1.6** Fix `layouts/default.vue` — remove TemplateMenu usage, update GitHub URL to project repo
- [ ] **1.7** Fix `app.vue` — replace Nuxt starter OG image URL with project-specific or remove

## Phase 2: Dedup & consolidation

- [ ] **2.1** Single source for `AdjustmentRange` type — import from `themes/lib/types.ts` everywhere, remove duplicate definition in `stepLightnessAdjustment.ts`
- [ ] **2.2** Single source for lightness adjustment defaults — define once, reference from themes and composable
- [ ] **2.3** Merge CSS variable init — keep either `plugins/initColors.client.ts` OR `composables/ui/useCssVariables.ts`, not both
- [ ] **2.4** Single source for step metadata — `useCurrentStep.ts` and `useSteps.ts` both define step titles; consolidate to one

## Phase 3: Refactors

- [ ] **3.1** Rename `composables/core/useBezierCurve.ts` → `composables/utils/bezierCurve.ts` (pure functions, not a composable)
- [ ] **3.2** Extract inline Tailwind color data from `pages/tailwind.vue` (~370 lines) → `data/tailwindColors.ts`
- [ ] **3.3** Fix `useDevMode.ts` — singleton guard is broken (both branches return `createDevMode()`), change default `enabled` to `false`
- [ ] **3.4** Fix `app.config.ts` — `lightnessAdjustment` values are dead (never read by the composable); either wire them up or remove
- [ ] **3.5** Wire bezier state through `stepLightnessDistribution` composable instead of duplicating in `generator.vue`
- [ ] **3.6** Extract color math from `HueSpectrumRow.vue` → composable (hue calculation, lightness/saturation adjustment logic)

## Phase 4: generator.vue decomposition

- [ ] **4.1** Extract sidebar navigation → `components/GeneratorSidebar.vue`
- [ ] **4.2** Extract swatch preview section → `components/SwatchesPreview.vue`
- [ ] **4.3** Extract footer bar → `components/GeneratorFooter.vue`
- [ ] **4.4** Extract step-specific control panels → `components/Step1Controls.vue`, `Step2Controls.vue`, etc.
- [ ] **4.5** Create CSS variable for `15%` grid column width (used in 4+ grid declarations)
- [ ] **4.6** Create CSS variable for `80px` label column width (used in 4+ grid declarations)

## Phase 5: Nice-to-haves

- [ ] **5.1** Extract `LightnessAdjustmentPanel` dark/bright sections into reusable `AdjustmentRangeControls.vue` sub-component
- [ ] **5.2** Create shared base slider component for `HueSlider` + `SaturationSlider` (nearly identical structure)
- [ ] **5.3** Fix `main.css` primary color scale — uses hardcoded lightness (5–95%) instead of bezier-computed values
- [ ] **5.4** Replace `alert()`/`prompt()` in `useExportConfig.ts` with toast notifications

---

## File inventory (for reference)

### Components (13 → 11 after Phase 1)

| File | Lines | Verdict |
|------|-------|---------|
| AppLogo.vue | 48 | Keep |
| BezierCurveEditor.vue | 197 | Keep |
| ClickToCopy.vue | 65 | Keep |
| ColorSlider.vue | 50 | Keep |
| ColorSwatch.vue | 27 | Keep |
| ColorSwatchRow.vue | 55 | Keep |
| HueSlider.vue | 103 | Keep (Phase 5 merge candidate) |
| HueSpectrumRow.vue | 211 | Keep (Phase 3 refactor) |
| LightnessAdjustmentPanel.vue | 317 | Keep (Phase 5 refactor) |
| LightnessLabels.vue | 38 | Keep |
| SaturationSlider.vue | 101 | Keep (Phase 5 merge candidate) |
| ~~StepAccordion.vue~~ | 121 | **Delete (1.1)** |
| ~~TemplateMenu.vue~~ | 48 | **Delete (1.2)** |

### Composables (16 files)

| File | Lines | Verdict |
|------|-------|---------|
| core/baseConfig.ts | 21 | Keep |
| core/useBezierCurve.ts | 83 | Rename → utils/ (3.1) |
| core/useColorSettings.ts | 30 | Keep |
| input/stepBaseColor.ts | 38 | Keep |
| input/stepHueSpectrum.ts | 148 | Keep |
| input/stepLightnessAdjustment.ts | 226 | Refactor (2.1, 2.2, 3.4) |
| input/stepLightnessDistribution.ts | 61 | Refactor (3.5) |
| input/useSteps.ts | 65 | Keep (2.4) |
| output/useExportConfig.ts | 338 | Keep (5.4) |
| themes/index.ts | 51 | Keep |
| themes/lib/custom.ts | 111 | Keep (1.4) |
| themes/lib/mathematical.ts | 104 | Keep (1.4) |
| themes/lib/tailwind.ts | 112 | Keep (1.4) |
| themes/lib/types.ts | 55 | Keep (canonical types) |
| ui/useClickToCopy.ts | 37 | Keep |
| ui/useCssVariables.ts | 41 | Refactor (2.3) |
| ui/useCurrentStep.ts | 48 | Keep (2.4) |
| ui/useDevMode.ts | 119 | Fix (3.3) |
| ~~ui/useStepManager.ts~~ | 108 | **Delete (1.3)** |
| utils/parseColor.ts | 64 | Keep |

### Pages & Other

| File | Lines | Verdict |
|------|-------|---------|
| pages/generator.vue | 853 | Decompose (Phase 4) |
| pages/index.vue | 167 | Keep |
| pages/tailwind.vue | 519 | Refactor (3.2) |
| layouts/blank.vue | 7 | Keep |
| layouts/default.vue | 49 | Fix (1.6) |
| plugins/initColors.client.ts | 13 | Review (2.3) |
| types/fields.ts | 31 | Keep |
| app.config.ts | 39 | Fix (3.4) |
| app.vue | 32 | Fix (1.7) |
| assets/css/main.css | 96 | Fix (5.3) |
