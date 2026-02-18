# Color Generator - Session Notes

## Project Overview

Rebuilding JavaScript color generator in Nuxt 4 + TypeScript with modular architecture.

## Current Status

### Completed Features

#### 1. Project Architecture

- **Composables Structure:**
  - `composables/core/` - useColorSettings.ts (state management)
  - `composables/input/` - Step content composables (useStep1BaseColor, useStep2LightnessRange, useStep3AdditionalSettings)
  - `composables/output/` - useExportConfig.ts (config export functionality)
  - `composables/ui/` - useCssVariables.ts (CSS variable updates)

#### 2. Configuration System

- **app.config.ts** - Central config with color defaults:
  ```typescript
  colors: {
    hue: 155,
    saturation: 100,
    lightness: 50,
  }
  ```
- **plugins/initColors.client.ts** - Initializes CSS variables globally on app load
- Config values are read on startup and used as slider defaults

#### 3. Step 1: Base Color Input

Three sliders for HSL control:

- **Hue** (0-360°) - unitless in CSS
- **Saturation** (0-100%) - includes % in CSS
- **Lightness** (0-100%) - includes % in CSS

All three sliders:

- Update state in real-time
- Set CSS variables (`--hue-slider-value`, `--saturation-slider-value`, `--lightness-slider-value`)
- Export to config format

#### 4. CSS Variable System

**main.css** - Primary colors use dynamic variables:

```css
--ui-color-primary-400: hsl(
  var(--hue-slider-value) var(--saturation-slider-value)
    var(--lightness-slider-value)
);
```

- Only primary-400 uses all three variables (it's the primary color)
- Other shades (50, 100, 200, etc.) use hue/saturation with hardcoded lightness
- Lightness curve system will be implemented later to calculate all 11 steps

#### 5. Export Functionality

- Button on Step 3 (last step)
- Copies app.config.ts format to clipboard with current HSL values
- Users can paste into their own config
- Separates export from live CSS updates (modular design)

#### 6. UI Structure

- File-based routing: `/` (home), `/generator`
- UAccordion with 3 steps
- Each step loads content from composables
- Fields rendered dynamically with v-for
- Uses v-model.number for numeric slider values

### Code Quality

- No console.log statements
- No unused files (removed accordion test page, empty folders)
- Auto-imports configured for nested composables
- System font stack (no custom fonts)
- 4-space indentation via VSCode settings

### Key Technical Decisions

1. **CSS Variables Approach:**
   - HSL format: `hsl(155 100% 50%)` (space-separated, modern syntax)
   - Hue is unitless, saturation/lightness have %
   - Cascades from 3 base values to 200+ color variables

2. **State Management:**
   - useState for reactive global state
   - useState keys: "color-hue", "color-saturation", "color-lightness"
   - Values initialize from app.config.ts

3. **Separation of Concerns:**
   - input/ composables = UI content only
   - ui/ composables = CSS variable updates
   - output/ composables = Export functionality
   - core/ composables = State management

4. **Lightness Strategy:**
   - Base lightness slider exists but only affects primary-400 for now
   - Future: Lightness curve will calculate all 11 Tailwind steps (50-950)
   - Base slider value will be input to curve mathematics

## Next Steps (Not Yet Implemented)

1. **Color Input Field:**
   - Text input for hex, hsl, rgb, or okLAB colors
   - Convert to HSL and update sliders
   - Consider using color conversion API or create core scripts

2. **Color Preview:**
   - Small rectangle showing current color from sliders

3. **Lightness Curve System:**
   - Algorithm to generate 11 distinct lightness steps
   - Map base lightness (50) to appropriate values for each shade
   - Different curves per hue for optimal results

4. **Additional Features:**
   - Sample swatch rendering
   - Hue grid (12 color rows)
   - Step 2 and 3 functionality

## File Locations

### Key Files

- `/app/app.config.ts` - Color configuration
- `/app/assets/css/main.css` - CSS variable definitions
- `/app/plugins/initColors.client.ts` - Global initialization
- `/app/pages/generator.vue` - Main generator page
- `/app/composables/ui/useCssVariables.ts` - CSS updates
- `/app/composables/output/useExportConfig.ts` - Export function
- `/app/composables/core/useColorSettings.ts` - State management

### Dependencies

- Nuxt 4.3.0
- Nuxt UI 4.4.0
- TypeScript 5.9.3
- Tailwind CSS 4.1.18

## Important Notes

- **Do not hardcode values in CSS** - Always use config or sliders
- **Lightness system pending** - Current 11 steps will be replaced by curve
- **Export button always on last step** - Regardless of how many steps exist
- **Modular export** - Users can use export without live CSS updates
- **Auto-imports** - `imports.dirs: ['composables/**']` in nuxt.config.ts

## Current Working State

All three sliders (H, S, L) are functional:

- ✅ Update state
- ✅ Update CSS variables
- ✅ Export to config
- ✅ Initialize from app.config.ts
- ✅ Primary-400 color changes in real-time
