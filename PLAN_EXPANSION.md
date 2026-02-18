# Color Generator Expansion - Steps 2-5

Extension plan for implementing lightness curves, hue adjustments, multi-hue grid, and comprehensive export from the JavaScript color generator.

## Plan: Expand Color Generator with Lightness Curves and Hue Adjustments

Extend the existing Nuxt color generator to include bezier curve controls for lightness distribution, hue-based compensation, multi-hue grid display, and comprehensive config export matching the JavaScript implementation.

### Steps

1. **Implement color input parser** — Add text input field to [pages/generator.vue](app/pages/generator.vue) accepting RGB, HEX, HSL, and OKLCH formats, create `useColorParser` in [composables/input/](app/composables/input/) to convert all formats to HSL, update `useColorSettings` to sync with sliders.

2. **Build bezier curve lightness system** — Create `useStep2LightnessRange` composable with two sliders (light/dark control points), implement bezier calculation function in [composables/core/](app/composables/core/), generate 11 lightness steps dynamically, display color sample swatches in [pages/generator.vue](app/pages/generator.vue), update [assets/css/main.css](app/assets/css/main.css) to use computed lightness values instead of hardcoded.

3. **Add HSL lightness adjustment controls** — Create `useStep3LightnessAdjustment` composable with toggle and six sliders (darkening: light falloff/amplitude/dark falloff, brightening: same three), implement adjustment algorithm that modifies lightness based on hue position (darken cyans 30°-210°, brighten purples 210°-300°), apply falloff curves for smooth transitions, integrate into sample swatch calculations.

4. **Create 12-hue grid display** — Define 12 hue definitions (crimson, flame, wheat, lime, grass, sea, sky, corn, dusk, plum, candy, salmon) in `useStep4HueGrid` composable, render grid with 12 rows showing full lightness scale per hue, add light/dark offset sliders (-45° to +45°) for each row, include 4 grey variant rows (primary, muted 50%, gray 10%, neutral 0% saturation), generate complete color system preview.

5. **Expand export functionality** — Update `useExportConfig` in [composables/output/useExportConfig.ts](app/composables/output/useExportConfig.ts) to capture bezier curve settings, adjustment parameters, hue offsets, and palette system choice, generate complete JSON snapshot with computed swatch values, add import functionality to restore all settings from pasted config, include version field and timestamp in export format.

6. **Add palette system toggle** — Create radio buttons in [pages/generator.vue](app/pages/generator.vue) for "Practical" vs "Tailwind" presets, define preset configs with different hue definitions and defaults, switch between 11-shade and alternative systems, update all steps to respect active palette.

### Further Considerations

1. **Bezier curve visualization** — Should we add a visual curve editor like the canvas-based one in the original, or keep it slider-only for simplicity?

2. **Import UI placement** — Where should the import functionality live? Option A: Add "Import config" button on Step 1 / Option B: Create dedicated import section on Step 5 / Option C: Add paste detection to any config textarea

3. **Color preview integration** — Should sample swatches appear inline with each step, or in a dedicated preview panel that updates globally? The original shows samples in Step 2 only.
