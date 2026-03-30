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

#### Step 4: Lightness Adjustment (Phase 12 — nearly complete)

- 12-hue chromatic swatch rows at 30° intervals
- Vertical hue range sliders with 3 handles (center, falloff-top, falloff-bottom)
- Dark adjustment panel (left): darkens warm hues (yellows/greens)
- Light adjustment panel (right): brightens cool hues (blues/purples)
- Strength, lightness falloff, and hue falloff controls
- `applyAdjustment()` wired into every swatch via ColorSwatchRow
- Default values tuned: dark 100°±80° str 15, light 240°±40° str 6
- Remaining: composable cleanup, HueRangeSlider polish, per-theme storage

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

- Replaces current Step 5 (Hue Spectrum) — removes top input/swatches
- Two sliders per hue row: left panel for dark tones, right panel for light tones
- Tapering effect: 100% at darkest/lightest swatch, 0% at middle
- Per-hue individual control (sliders form a sinusoidal pattern across hues)
- ±30° range, stored per theme with preset defaults

#### Step 6: Theme Comparison (see PLAN_THEME_BUILDER.md)

**Decision: Full Theme Builder is unlikely.** The Custom theme already lets users build their own using sane presets.

**What we will do instead:**

- Small theme toggle (unlocked once Step 6 is reached) available on ALL steps
- Users go back to any step, toggle between themes, compare results, tweak
- Explore: Tailwind as exact-HSL base with offset controls (modify slightly, or export exact copy)
- Research needed: should basic themes have save-custom / revert-to-default?
- End goal: user picks the best theme by seeing how the actual app looks with those settings

#### Step 7 Redesign: Export System (see PLAN_EXPORT_SYSTEM.md)

- **Tailwind export**: Complete `tailwind.config.ts` with all colors
- **CSS export**: Layered CSS file system (config → variables → theme → semantic → examples)
- **JSON export**: Raw color data for programmatic use

#### Developer Tools (see PLAN_DEV_TOOLS.md)

Rethought approach — most tools integrated into the app rather than separate pages:

- **Contrast Checker** — in-app toggle available from anywhere (not a separate page)
- **Color Blindness Simulator** — in-app toggle like contrast checker
- **Palette Visualizer** — the app itself acts as a mockup; add sample UI elements (card, button, panel, input) at later steps to show the palette in context
- **Variable Reference** — deferred; difficult, revisit later
- **Import & Diff** — not a feature; one-off dev task to export/import settings as config defaults
- **Quick Bookmarks** — solved via URL parameters (encode palette state in URL for sharing/bookmarking)

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
5. **Phase 12: Lightness Adjustment Redesign** ⏳ (functional, polish remaining)
6. **Phase 13: Per-Swatch Hue Adjustment** (replaces Step 5 — see PLAN_HUE_ADJUSTMENT.md)
7. **Phase 14: Theme Comparison + Toggle** (simplified from builder — see PLAN_THEME_BUILDER.md)
8. **Phase 15: Export System** (see PLAN_EXPORT_SYSTEM.md)
9. **Phase 16: Developer Tools** (integrated toggles + URL params — see PLAN_DEV_TOOLS.md)

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
