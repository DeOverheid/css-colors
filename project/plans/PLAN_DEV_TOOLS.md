# Plan: Developer Tools & Integrated Features

## Goal

Provide developer-facing tools that complement the core generator wizard. **Key decision**: most tools will be integrated into the app as toggles or UI elements rather than separate standalone pages. This keeps the experience cohesive and avoids building features nobody navigates to.

### Approach Summary

| Tool                      | Approach                                                   | Status             |
| ------------------------- | ---------------------------------------------------------- | ------------------ |
| Contrast Checker          | **In-app toggle** available from anywhere                  | Planned            |
| Color Blindness Simulator | **In-app toggle** available from anywhere                  | Planned            |
| Palette Visualizer        | **Built into the app** — sample UI elements at later steps | Planned            |
| Variable Reference        | **Deferred** — difficult, revisit later                    | On hold            |
| Import & Diff             | **Not a feature** — one-off dev task for config defaults   | Dropped as feature |
| Quick Bookmarks           | **URL parameters** — encode state in URL for sharing       | Planned            |

---

## Tool 1: Contrast Checker (in-app toggle)

### What it does

Shows WCAG 2.1 contrast ratios for the active palette. **Integrated as a toggle overlay** available from any step — not a separate page.

### Layout

- **Matrix view**: Grid where rows = foreground colors, columns = background colors. Each cell shows the contrast ratio and a pass/fail badge (AA, AAA, or fail).
- **Quick check mode**: Pick any two colors from the palette → see ratio, WCAG level, and a live text preview
- **Auto-suggestions**: For a chosen background, highlight which palette colors pass AA (4.5:1) and AAA (7:1) for normal text and large text (3:1)

### Key details

- Uses relative luminance formula: `L = 0.2126*R + 0.7152*G + 0.0722*B`
- Contrast ratio: `(L1 + 0.05) / (L2 + 0.05)`
- Matrix is filterable: show only primary row, only greys, etc.
- Color cells are clickable → copies the CSS variable name
- Badge colors: green (AAA), yellow (AA), red (fail)

### Data source

Reads directly from the active palette state (same composables as the generator). Changes in the wizard are reflected live.

---

## Tool 2: Color Blindness Simulator (in-app toggle)

### What it does

Renders the full palette through color vision deficiency filters. **Integrated as a toggle overlay** like the contrast checker — not a separate page.

### Simulations

1. **Protanopia** (no red cones, ~1% of males)
2. **Deuteranopia** (no green cones, ~6% of males)
3. **Tritanopia** (no blue cones, rare)
4. **Protanomaly** (weak red)
5. **Deuteranomaly** (weak green, most common)
6. **Tritanomaly** (weak blue)
7. **Achromatopsia** (total color blindness)
8. **Normal vision** (reference)

### Layout

- 2×4 grid showing the full swatch palette under each simulation
- Toggle to show the palette as it would appear in a simple UI mockup (buttons, cards, alerts)
- SVG filter approach using `feColorMatrix` for accurate simulation
- Side-by-side: original vs. simulated (for any single filter)

### Implementation

- Use Brettel/Viénot/Machado color blindness matrices
- Apply via CSS `filter: url(#protanopia-filter)` on SVG `<feColorMatrix>`
- Lightweight — no external dependencies, pure math

---

## Tool 3: Palette Visualizer (built into app)

### What it does

Shows the active palette applied to realistic UI components. **Not a separate page** — the app itself acts as the visualization. Sample UI elements (cards, buttons, panels, inputs) are added at later steps (Step 6+) to let users see their palette in context.

### Sections

**Dashboard mockup**: A mini dashboard with:

- Navigation sidebar using grey/neutral tones
- Cards with primary/secondary accents
- A simple bar chart using the chromatic palette
- Alert banners (success/warning/danger)
- Form with inputs, buttons, badges

**Data visualization**:

- Pie chart, bar chart, and line chart using the 12 hue rows
- Shows whether hues are distinguishable in data contexts
- Optional: simulate the charts under color blindness filters

**Typography specimen**:

- Text at various sizes on different background colors
- Shows readability at a glance

**Dark mode preview**:

- Same mockups with inverted lightness scale (950→50)
- Automatic: flip the lightness mapping, keep hues and saturation

### Implementation

- Pure CSS + HTML mockups (no framework components)
- Reads palette CSS variables → applied via inline styles or scoped variables
- Responsive grid layout

---

## Tool 4: Variable Reference (deferred)

### What it does

A searchable, copyable reference page listing every CSS variable the generator produces.

**Status: ON HOLD** — this is difficult and needs more thought. Revisit after the export system is built, as the variable names will be defined there.

### Features

- **Search/filter**: Type "primary-3" or "grey" to filter the list
- **Group by**: row (primary, secondary, grey...) or by lightness level (all 500s together)
- **Copy on click**: Click any variable → copies `var(--color-primary-500)` to clipboard
- **Swatch preview**: Small color square next to each variable
- **Value display**: Shows HSL, hex, and RGB values for each
- **Code snippets**: Toggle between CSS custom property, Tailwind class, and SCSS variable format

### Data source

Computed from the active palette state. Includes:

- All chromatic colors (primary, secondary, tertiary × 11 steps)
- All grey colors (primary-grey, secondary-grey, tertiary-grey × 11 steps)
- Neutral colors (11 steps)
- Theme tokens (if semantic layer is exported)

---

## Tool 5: Palette Import & Diff (dropped as feature)

### What it does

~~Import an existing palette and compare it against the generated palette.~~

**Status: DROPPED as a user-facing feature.** Instead, this will be a one-off developer task: export all current settings as a config/theme JSON, and import it back to set defaults. No UI needed — it's a dev workflow, not a user feature.

### Features

- **Import formats**: Paste CSS `:root { --color-xxx: hsl(...) }`, Tailwind colors object, or JSON
- **Side-by-side diff**: Imported palette vs. generated palette, row by row
- **Delta display**: Show the ΔE (perceptual color difference) for each swatch pair
- **Match score**: Overall percentage match between imported and generated
- **Suggestion mode**: "To get closer to your imported palette, try: increase saturation to 72, shift dark squeeze to 40..."

### Implementation

- CSS parser: regex-based extraction of HSL/hex values from pasted text
- Tailwind parser: JSON.parse the colors object
- ΔE calculation: Convert HSL → Lab → compute CIEDE2000 (or simpler Euclidean in Lab)
- Suggestion engine: brute-force a few parameter combinations to minimize total ΔE (stretch)

---

## Tool 6: Quick Palette Bookmarks (URL parameters)

### What it does

~~Save and recall palette snapshots.~~

**Status: Solved via URL parameters.** Palette state will be encoded in the URL hash so users can bookmark and share configurations. No separate bookmarks page needed.

### Features

- **Save current**: One-click save of current generator state with auto-generated name (e.g., "Ocean Blue · Mar 25")
- **Thumbnail**: Small swatch strip showing the primary row
- **Recall**: Click a bookmark → loads all settings back into the generator
- **Compare**: Select two bookmarks → side-by-side swatch comparison
- **Share**: Generate a URL with palette parameters encoded (no server needed — base64 in URL hash)
- **Storage**: localStorage with optional JSON export/import

### Data model

```typescript
interface PaletteBookmark {
    id: string;
    name: string;
    timestamp: number;
    thumbnail: string[]; // hex values for primary row
    state: {
        hue: number;
        saturation: number;
        bezier: BezierCurve;
        darkShift: number;
        lightShift: number;
        complementaryOffset: number;
        lightnessAdjustment: LightnessAdjustmentConfig;
        // ... all generator state
    };
}
```

---

## Implementation Priority

| Priority | Tool                | Approach       | Effort | Notes                                   |
| -------- | ------------------- | -------------- | ------ | --------------------------------------- |
| 1        | Contrast Checker    | In-app toggle  | Medium | Accessibility is non-negotiable         |
| 2        | Color Blindness Sim | In-app toggle  | Medium | Can share toggle infrastructure with #1 |
| 3        | URL Bookmarks       | URL params     | Small  | Encode state in hash, no UI page needed |
| 4        | Palette Visualizer  | Built into app | Medium | Sample UI elements at Step 6+           |
| 5        | Variable Reference  | Deferred       | -      | Revisit after export system is built    |
| -        | Import & Diff       | Dropped        | -      | One-off dev task, not a user feature    |

**Recommendation**: Start with Contrast Checker + CVD Simulator together (shared toggle infrastructure). URL bookmarks is a quick win. Palette visualizer ties into the Theme Builder sample elements.

---

## Architecture Notes

### No separate routing needed

Since the main tools are now in-app toggles rather than separate pages, no new routes are needed. The contrast checker and CVD simulator are overlay components toggled via a button in the sidebar or toolbar.

### Toggle infrastructure

Both the contrast checker and CVD simulator share the same pattern:

- Toggle button in sidebar/toolbar
- Overlay or panel that renders on top of / alongside the existing content
- Reads from the same composable singletons as the generator
- Changes in the wizard are reflected live

### Shared state

All tools read from the same composable singletons as the generator:

- `useColorSettings()` — hue, saturation
- `useLightnessAdjustment()` — adjustment settings
- `stepLightnessDistribution()` — bezier-computed lightness steps
- `useComplementaryColors()` — secondary/tertiary hues
- `stepUniformLightnessShift()` — dark/light shifts

Changes in the generator are reflected live in any open tool page.

---

## Files to Create

### Components

- `app/components/ContrastCheckerOverlay.vue` — toggle overlay showing contrast matrix
- `app/components/ContrastPairChecker.vue` — quick two-color checker
- `app/components/ColorBlindnessOverlay.vue` — toggle overlay with CVD filters
- `app/components/UISampleElements.vue` — sample cards, buttons, inputs using palette

### Composables

- `app/composables/utils/contrastRatio.ts` — luminance + ratio calculation
- `app/composables/utils/colorBlindness.ts` — CVD simulation matrices (SVG feColorMatrix)
- `app/composables/utils/colorConvert.ts` — HSL ↔ RGB ↔ Hex (if not already existing)
- `app/composables/utils/urlState.ts` — encode/decode generator state in URL hash

### No new dependencies needed

- Contrast calculation: pure math
- Color blindness: feColorMatrix SVG filters
- Color conversion: pure math
- URL state: native URL API + base64
