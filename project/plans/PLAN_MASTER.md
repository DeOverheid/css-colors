# Master Plan — CSS Color System Generator

## Vision

A complete CSS color palette generator that takes you from picking a base hue to shipping production-ready CSS/Tailwind files. The generator walks through a 7+ step wizard, each step building on the previous, producing a full color system with chromatic colors, greys, neutrals, and semantic tokens.

---

## Steps Overview (Current + Planned)

### Completed Steps

#### Step 1: Primary Color

- Pick base hue and saturation
- HSL color input with hex/named color parsing
- Sets the foundation for all derived colors

#### Step 2: Complementary Colors

- Interactive hue-saturation wheel
- Secondary and tertiary hues via offset
- UI tone picker (neutral/primary/secondary/tertiary background)
- Grey companion rows derived from chromatic hues

#### Step 3: Lightness Distribution

- Bezier curve editor for lightness mapping
- Dark/light squeeze sliders (shift slider panels)
- Generates 11-step lightness scale from black to white
- Separate grey lightness distribution

#### Step 4: Lightness Adjustment (Phase 12 — in progress)

- 12-hue chromatic swatch rows at 30° intervals
- Vertical hue range sliders with 3 handles (center, falloff-top, falloff-bottom)
- Dark adjustment panel (left): brightens blues/violets
- Light adjustment panel (right): darkens greens/yellows
- Strength, lightness falloff, and hue falloff controls
- `applyAdjustment()` wired into every swatch via ColorSwatchRow

#### Step 5: Hue Spectrum

- Per-hue configuration
- Adjust the hue offset for the dark side and the light side to shift results

#### Step 6: Compare Presets

- Radio selector: Custom / Tailwind / Mathematical
- Per-theme state preservation (bezier, shifts, saturation)
- toggling themes allows comparison of palette output
- Individual theme settings for amount of hues and swatches

#### Step 7: Export

- Current: app.config.ts format export
- **Planned**: Full CSS/Tailwind export system (see PLAN_EXPORT_SYSTEM.md)

---

### Planned Additions

#### Step 5 replacement: Per-Swatch Hue Adjustment (see PLAN_HUE_ADJUSTMENT.md)

- Individual hue tweaks per swatch position (per lightness step)
- Fine-tune specific swatches without affecting the whole row
- Visual hue-shift indicators on affected swatches

#### Step 6 Redesign: Theme Builder (see PLAN_THEME_BUILDER.md)

I don't think we will do this, the custom theme allows a user to build their own using sane presets.

- Replace simple "Compare Presets" with interactive theme builder
- Pick and choose settings from any preset
- Mix Tailwind lightness with Custom hues, or Mathematical bezier with Custom saturation
- Save/load named custom themes
- A/B comparison mode: overlay two themes

#### Step 7 Redesign: Export System (see PLAN_EXPORT_SYSTEM.md)

- **Tailwind export**: Complete `tailwind.config.ts` with all colors
- **CSS export**: Layered CSS file system (config → variables → theme → semantic → examples)
- **JSON export**: Raw color data for programmatic use

#### Developer Tools (see PLAN_DEV_TOOLS.md)

Standalone utility pages outside the wizard, accessible anytime:

- **Contrast Checker** (`/contrast`) — WCAG ratio matrix for all palette combinations
- **Color Blindness Simulator** (`/simulate`) — 8 CVD filters on the full palette
- **Palette Visualizer** (`/visualize`) — realistic UI mockups using the active palette
- **Variable Reference** (`/reference`) — searchable, copyable list of all CSS variables
- **Import & Diff** (`/import`) — paste an existing palette, compare ΔE per swatch
- **Quick Bookmarks** (`/bookmarks`) — save/recall palette snapshots, shareable URLs

---

## Architecture

### Composable Layer

- `core/` — shared state (hue, saturation, lightness)
- `input/` — step-specific logic (bezier, adjustment, spectrum)
- `output/` — export generators
- `steps/` — navigation, registry, unlock tracking
- `themes/` — theme definitions and per-theme state
- `ui/` — CSS variable management
- `utils/` — math, color conversion, bezier solver

### Component Layer

- `Generator*.vue` — layout panels (Input, Swatches, Left/Right, Footer, Sidebar)
- Step-specific components (BezierControls, HueSaturationWheel, HueRangeSlider, etc.)
- Shared UI (ColorSwatch, ColorSwatchRow, BaseSlider, RadioSelector)

### Data Flow

```
User Input → Composable State → Computed Lightness Steps → applyAdjustment() → ColorSwatchRow → ColorSwatch → HSL render
                                                                                       ↓
                                                                              CSS Variables (200+)
                                                                                       ↓
                                                                              Export (TW/CSS/JSON)
```

---

## Implementation Order

1. ~~Phase 1-3: Foundation, Feature Build-out, Export~~ ✅
2. ~~Phase 4-9: UI Overhaul, Cleanup, Complementary, Grey Theme, Select Theme, Shifts~~ ✅
3. ~~Phase 10: Hue-Saturation Wheel~~ ✅
4. ~~Phase 11: Bezier Fix & UI Polish~~ ✅
5. **Phase 12: Lightness Adjustment Redesign** ⏳ (wiring done, polish remaining)
6. **Phase 13: Per-Swatch Hue Adjustment** (see PLAN_HUE_ADJUSTMENT.md)
7. **Phase 14: Theme Builder Redesign** (see PLAN_THEME_BUILDER.md)
8. **Phase 15: Export System** (see PLAN_EXPORT_SYSTEM.md)
9. **Phase 16: Developer Tools** (see PLAN_DEV_TOOLS.md) — can be built in parallel with anything

---

## File References

| Plan                      | File                               |
| ------------------------- | ---------------------------------- |
| Lightness Adjustment      | `PLAN_LIGHTNESS_ADJUSTMENT.md`     |
| Per-Swatch Hue Adjustment | `PLAN_HUE_ADJUSTMENT.md`           |
| Theme Builder             | `PLAN_THEME_BUILDER.md`            |
| Export System             | `PLAN_EXPORT_SYSTEM.md`            |
| Developer Tools           | `PLAN_DEV_TOOLS.md`                |
| Feature History           | `../summaries/FEATURE_HISTORY.md`  |
| Project Overview          | `../summaries/PROJECT_OVERVIEW.md` |
