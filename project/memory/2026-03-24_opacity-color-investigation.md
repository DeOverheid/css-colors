# 2026-03-24 — Opacity & Color Investigation

## Issue

Colors appear washed out across the app. Entering `f00` (full saturated red) makes buttons and controls look pink. Panels show halfway greys instead of near-black/white.

## Key Findings

### 1. Opacity properties reducing visibility

- GeneratorLeftPanel.vue: opacity 0.7 (line 95), opacity 0.6 (line 138)
- GeneratorRightPanel.vue: opacity 0.7 (line 95), opacity 0.6 (line 142)
- GeneratorSidebar.vue: opacity 0.6 (line 154)
- HueSpectrumRow.vue: opacity 0.7 (line 117)
- AdjustmentRangeControls.vue: opacity 0.7 (line 143)
- ColorInputControls.vue: opacity 0.4 (disabled button - line 108)
- BezierCurveEditor.vue: opacity 0.1, 0.3, 0.5 for SVG elements
- RadioSelector.vue: opacity 0 (hidden input - line 83)

### 2. RGBA with transparency

- GeneratorSidebar.vue: rgba(255, 255, 255, 0.2) (line 118)
- GeneratorLeftPanel.vue: var(--ui-border-muted, rgba(0, 0, 0, 0.1)) fallback (line 144)
- GeneratorRightPanel.vue: var(--ui-border-muted, rgba(0, 0, 0, 0.1)) fallback (line 148)
- ColorSwatch.vue: rgba(0, 0, 0, 0.7) for tooltip background (line 60)
- ComplementaryColorPicker.vue: rgba(255, 255, 255, 0.15) for borders (line 182)
- RadioSelector.vue: rgba(255, 255, 255, 0.1) for swatch borders (line 125)
- useHoverPopup.ts: rgba(0,0,0,0.25) for box-shadow (line 59)

### 3. CSS Variables

- app.config.ts: mutedSaturationMultiplier: 0.1 — reduces color saturation to 10%
- --ui-border-muted uses rgba(0,0,0,0.1) as fallback
- No alpha/opacity CSS variables in main.css — uses pure HSL

### 4. Labels with opacity

- GeneratorLeftPanel.vue: .shift-label opacity 0.7
- GeneratorRightPanel.vue: .shift-label opacity 0.7
- HueSpectrumRow.vue: .slider-column label opacity 0.7
- AdjustmentRangeControls.vue: .section-description opacity 0.7
- GeneratorSidebar.vue: .nuxt-logo opacity 0.6

### 5. No issues found in

- No backdrop-filter in app components (only legacy code)
- No mix-blend-mode in app components
- No filter properties affecting colors
- app.vue is minimal, no global opacity overrides

## Root Cause Analysis

The washed-out appearance likely comes from:

1. Multiple opacity values (0.6–0.7) on UI control labels and text
2. mutedSaturationMultiplier (0.1) reducing saturation of muted colors
3. rgba fallbacks with very low alpha (0.1) for borders
4. Cumulative effect of semi-transparent SVG elements in BezierCurveEditor

## Status

Under investigation — not yet resolved.
