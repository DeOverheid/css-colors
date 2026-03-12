# CSS Colors Nuxt Migration Plan

## Executive Summary

This document outlines missing features from the original JS implementation that need to be ported to the Nuxt/TypeScript version, plus new enhancements requested for the preview panel and export system.

---

## Part 1: Feature Gap Analysis

### ✅ Already Implemented in Nuxt

| Feature                           | Location                                        |
| --------------------------------- | ----------------------------------------------- |
| Color input (hex/rgb/hsl parsing) | `parseColor.ts`, `generator.vue`                |
| Hue slider                        | `HueSlider.vue`                                 |
| Saturation slider                 | `SaturationSlider.vue`                          |
| Bezier curve editor               | `BezierCurveEditor.vue`                         |
| Lightness step labels             | `LightnessLabels.vue`                           |
| Color swatch display              | `ColorSwatch.vue`, `ColorSwatchRow.vue`         |
| Tailwind theme (17 colors)        | `tailwind.ts`                                   |
| Mathematical theme (12 colors)    | `mathematical.ts`                               |
| Theme switching                   | `useThemes()`                                   |
| Hue spectrum with offsets         | `HueSpectrumRow.vue`                            |
| Per-color lightness offsets       | `tailwindHues[]`                                |
| Per-color saturation offsets      | `saturationLightOffset`, `saturationDarkOffset` |
| Basic config export               | `useExportConfig.ts`                            |

### ❌ Missing Features from JS Version

#### 1. **Lightness Range Sliders** (Priority: HIGH)

- **JS Location**: `input/lightness-sliders.js`, `index.html` Step 2
- **Description**: Two sliders controlling the overall lightness range:
  - "Light Slider" - controls the maximum lightness (lightest shade)
  - "Dark Slider" - controls the minimum lightness (darkest shade)
- **Current Gap**: Nuxt version has no range sliders, only bezier curve
- **Purpose**: Allows clamping the lightness output (e.g., prevent pure white/black)

#### 2. ~~**HSL Lightness Adjustments Panel**~~ ✅ IMPLEMENTED (Priority: HIGH)

- **Status**: First draft implemented
- **Nuxt Location**: `stepLightnessAdjustment.ts`, `LightnessAdjustmentPanel.vue`
- **JS Location**: `core/lightness-adjustment.js`, `index.html` Step 3
- **Description**: Hue-based lightness compensation with:
  - Toggle to enable/disable
  - **Darkening controls** (for warm hues ~30-210°):
    - Light falloff (0-1)
    - Amplitude (0-30)
    - Dark falloff (0-1)
  - **Brightening controls** (for cool hues ~210-300°):
    - Light falloff (0-1)
    - Amplitude (0-30)
    - Dark falloff (0-1)
- ~~**Current Gap**: Not implemented at all. This creates perceptual uniformity across hues.~~
- **Purpose**: Yellow appears brighter than blue at same HSL lightness; this compensates.

#### 3. **Swatch Popover/Tooltip** (Priority: MEDIUM)

- **JS Location**: `output/swatch-popover.js`
- **Description**: Hover/focus on any swatch shows:
  - Color name + shade number
  - Base hue and offset applied
  - HSL values
  - Copy-to-clipboard functionality
- **Current Gap**: No hover info on swatches

#### 4. **Grey/Neutral Presets** (Priority: MEDIUM)

- **JS Location**: `config/tailwind.js` - `TAILWIND_GREY_PRESET`
- **Description**: Predefined grey palettes (slate, gray, zinc, neutral, stone) with specific hue tints
- **Current Gap**: Only showing generic greyscale rows

#### 5. **Sample Variants System** (Priority: LOW)

- **JS Location**: `config/practical.js` - `SAMPLE_VARIANT_OPTIONS`
- **Description**: Different color sample modes:
  - Primary (full saturation)
  - Primary-scale (reduced saturation)
  - Neutral (zero saturation)
  - Fixed (custom hue/saturation)
- **Current Gap**: Hardcoded sample rows instead of configurable variants

#### 6. **Lightness Floor Setting** (Priority: LOW)

- **JS Location**: `config/tailwind.js` - `range.floor`
- **Description**: Prevents lightness going below a threshold
- **Current Gap**: Not configurable

#### 7. **Highlight Mode / Match Indicator** (Priority: LOW)

- **JS Location**: `core/state.js`, `output/render.js`
- **Description**: Highlights swatches closest to input color
- **Current Gap**: Marker exists but limited to one row

---

## Part 2: New Features Requested

### 1. **Floating Preview Panel** (Priority: HIGH)

A persistent mini-preview that shows all hue swatches at once, visible while working in any step.

#### Specification:

- **Position**: Fixed/floating on the right side of viewport
- **Size**: Compact (~200-300px wide)
- **Content**:
  - All theme hue rows in condensed form
  - Each row shows color name + swatches at reduced size
  - Reflects real-time changes from any step
- **Behavior**:
  - Stays visible across all steps
  - Collapsible/minimizable
  - Draggable (optional)
- **Implementation**: New component `FloatingPreview.vue`

### 2. **Enhanced Export System** (Priority: HIGH)

#### Current State:

Basic `app.config.ts` format with hue, saturation, bezier values.

#### Required Exports:

##### A. Tailwind Config Export

Generate complete Tailwind CSS config format:

```javascript
// tailwind.config.js colors section
module.exports = {
  theme: {
    extend: {
      colors: {
        red: {
          50: "#fef2f2",
          100: "#fee2e2",
          // ... all shades with actual hex values
          950: "#450a0a",
        },
        // ... all 17 colors
      },
    },
  },
};
```

##### B. CSS Custom Properties Export

```css
:root {
  --color-red-50: #fef2f2;
  --color-red-100: #fee2e2;
  /* ... */
}
```

##### C. JSON Export (Full Configuration Snapshot)

Complete export matching JS version's format:

```json
{
  "version": 1,
  "generatedAt": "2026-02-20T...",
  "palette": "tailwind",
  "sampleCount": 13,
  "primary": { "hue": 217, "saturation": 91 },
  "lightness": {
    "controls": { "light": 0.67, "dark": 0 },
    "curve": { "x1": 0.3, "y1": 0.1, "x2": 0.68, "y2": 0.98 },
    "steps": [0, 5.2, 11.1, ...]
  },
  "hueOffsets": {
    "red": { "light": 0, "dark": 2 },
    // ...
  },
  "adjustments": {
    "enabled": true,
    "ranges": { ... }
  },
  "hueSwatches": [
    {
      "name": "red",
      "baseHue": 0,
      "shades": [
        { "label": "50", "hue": 0, "saturation": 91, "lightness": 97, "hsl": "hsl(...)" },
        // ...
      ]
    }
  ]
}
```

##### D. Import/Restore Configuration

- Load previously exported JSON to restore all settings
- Useful for iterations and tweaking saved configs

---

## Part 3: Implementation Roadmap

### Phase 1: Core Missing Features (Week 1)

#### Task 1.1: Lightness Range Controls

- [ ] Create `stepLightnessRange.ts` composable
- [ ] Add light/dark range sliders to Step 2
- [ ] Update `useBezierCurve.ts` to respect range limits
- [ ] Wire to export config

#### Task 1.2: Hue-Based Lightness Adjustment ✅ (First Draft)

- [x] Create `stepLightnessAdjustment.ts` composable
- [x] Create `LightnessAdjustmentPanel.vue` component
- [x] Port adjustment algorithm from `lightness-adjustment.js`
- [x] Add Step 3.5 or integrate into Step 3
- [x] Apply adjustments in `HueSpectrumRow.vue`

### Phase 2: Floating Preview Panel (Week 1-2)

#### Task 2.1: Preview Component

- [ ] Create `FloatingPreview.vue`
- [ ] Create mini swatch row component
- [ ] Add collapse/expand toggle
- [ ] Position fixed on right side
- [ ] Wire to reactive color state

#### Task 2.2: Integration

- [ ] Add to `generator.vue` layout
- [ ] Ensure updates on any control change
- [ ] Mobile responsive behavior (hide or bottom sheet)

### Phase 3: Export System Overhaul (Week 2)

#### Task 3.1: Refactor Export Architecture

- [ ] Create `exporters/` directory structure:
  ```
  composables/output/
    exporters/
      base.ts          # Common utilities
      tailwindConfig.ts
      cssVariables.ts
      jsonSnapshot.ts
      appConfig.ts     # Current implementation
  ```

#### Task 3.2: Tailwind Config Exporter

- [ ] Generate proper Tailwind color config
- [ ] Include all 17 hue rows with all shades
- [ ] Output as copy-able JavaScript object
- [ ] HSL to Hex conversion utility

#### Task 3.3: CSS Variables Exporter

- [ ] Generate `:root { }` block
- [ ] Naming convention: `--color-{name}-{shade}`
- [ ] Format options: HSL or Hex

#### Task 3.4: JSON Snapshot Exporter

- [ ] Full state capture matching JS format
- [ ] Include all hue offsets and adjustments
- [ ] Include computed swatch values

#### Task 3.5: Import Configuration

- [ ] JSON file upload/paste
- [ ] Validate and restore state
- [ ] Error handling for invalid configs

### Phase 4: Polish & Enhancements (Week 2-3)

#### Task 4.1: Swatch Popover

- [ ] Create `SwatchPopover.vue`
- [ ] Show on hover/focus
- [ ] Display HSL, Hex, color name
- [ ] Copy button for values

#### Task 4.2: Grey Presets

- [ ] Add grey preset data to themes
- [ ] Option to include/exclude in export
- [ ] Toggle in UI

#### Task 4.3: UI/UX Refinements

- [ ] Export format selector (tabs or dropdown)
- [ ] Preview of export before copying
- [ ] Success/error toast notifications
- [ ] Keyboard shortcuts

---

## Part 4: Data Structure Reference

### Tailwind Export Target Format

```typescript
interface TailwindExport {
  theme: {
    extend: {
      colors: {
        [colorName: string]: {
          [shade: string]: string; // hex color
        };
      };
    };
  };
}
```

### JSON Snapshot Format

```typescript
interface ConfigSnapshot {
  version: number;
  generatedAt: string;
  palette: string;
  primary: {
    hue: number;
    saturation: number;
  };
  lightness: {
    controls: { light: number; dark: number };
    curve: { x1: number; y1: number; x2: number; y2: number };
    range: { min: number; max: number; floor: number };
    steps: number[];
  };
  hueOffsets: {
    [colorName: string]: { light: number; dark: number };
  };
  adjustments: {
    enabled: boolean;
    ranges: {
      darkening: AdjustmentRange;
      brightening: AdjustmentRange;
    };
  };
  hueSwatches: HueSwatchGroup[];
}

interface AdjustmentRange {
  enabled: boolean;
  start: number;
  end: number;
  hueFalloff: number;
  lightnessFalloffLight: number;
  lightnessAmplitude: number;
  lightnessFalloffDark: number;
}

interface HueSwatchGroup {
  name: string;
  baseHue: number;
  shades: SwatchRecord[];
}

interface SwatchRecord {
  label: string;
  index: number;
  hue: number;
  saturation: number;
  lightness: number;
  offset: number;
  hsl: string;
  hex?: string;
}
```

---

## Part 5: File Structure After Implementation

```
app/
  components/
    FloatingPreview.vue          # NEW
    PreviewSwatchRow.vue         # NEW (mini swatch row)
    SwatchPopover.vue            # NEW
    LightnessAdjustmentPanel.vue # NEW
    LightnessRangeSlider.vue     # NEW

  composables/
    input/
      stepLightnessRange.ts      # NEW
      stepLightnessAdjustment.ts # NEW

    output/
      useExportConfig.ts         # REFACTOR (keep for backward compat)
      exporters/
        base.ts                  # NEW
        tailwindConfig.ts        # NEW
        cssVariables.ts          # NEW
        jsonSnapshot.ts          # NEW
        appConfig.ts             # EXTRACT from useExportConfig

    utils/
      hslToHex.ts                # NEW
      colorConversion.ts         # NEW (expand parseColor)
```

---

## Immediate Next Steps

1. **Start with Floating Preview Panel** - High visibility improvement
2. **Add Lightness Range Sliders** - Missing core feature
3. **Implement Tailwind Config Export** - Most requested export format
4. **Add Lightness Adjustment Panel** - Complex but important for accuracy

---

## Notes

- Mathematical theme export will be different (as mentioned) - defer until Tailwind export is complete
- Consider adding "presets" dropdown to quickly load common configurations
- The JS version has a "Practical" palette with 12 colors at 30° intervals - this maps to our "Mathematical" theme
- Grey presets in Tailwind are sophisticated (each has different hue tint) - evaluate if needed
