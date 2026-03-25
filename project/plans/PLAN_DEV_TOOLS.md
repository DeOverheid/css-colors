# Plan: Developer Tools & Reference Pages

## Goal

Add standalone utility pages and tools that complement the core generator wizard. These are separate from the 7-step flow — accessible via the sidebar or top nav. They provide value to developers who already have a palette (from this tool or elsewhere) and want to inspect, validate, or adapt it.

Think of these as the "toolbox drawer" next to the main workbench.

---

## Tool 1: Contrast Checker (`/contrast`)

### What it does
Shows WCAG 2.1 contrast ratios for every foreground/background combination in the active palette. Helps developers pick accessible text/background pairs.

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

## Tool 2: Color Blindness Simulator (`/simulate`)

### What it does
Renders the full palette through 8 color vision deficiency filters so developers can verify their palette works for all users.

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

## Tool 3: Palette Visualizer (`/visualize`)

### What it does
Shows the active palette applied to realistic UI components so developers can judge how colors feel in context before exporting.

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

## Tool 4: Variable Reference (`/reference`)

### What it does
A searchable, copyable reference page listing every CSS variable the generator produces. Serves as a living style guide.

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

## Tool 5: Palette Import & Diff (`/import`)

### What it does
Import an existing palette (from CSS variables, Tailwind config, or JSON) and compare it against the generated palette. Useful for migration: "I have Tailwind's slate, how close can I get with this generator?"

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

## Tool 6: Quick Palette Bookmarks (`/bookmarks`)

### What it does
Save and recall palette snapshots without the full theme system. Like browser bookmarks but for color configurations.

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

| Priority | Tool | Effort | Value |
|----------|------|--------|-------|
| 1 | Variable Reference | Small | High — devs need this daily |
| 2 | Contrast Checker | Medium | High — accessibility is non-negotiable |
| 3 | Quick Bookmarks | Small | Medium — saves time during exploration |
| 4 | Palette Visualizer | Medium | Medium — sells the palette, catches issues |
| 5 | Color Blindness Sim | Medium | Medium — important but less frequent |
| 6 | Import & Diff | Large | Medium — great for migration but niche |

**Recommendation**: Start with Variable Reference (quick win, immediately useful) and Contrast Checker (high value, medium effort). Bookmarks are a quality-of-life feature that pays off quickly.

---

## Architecture Notes

### Routing
Each tool gets its own page under `/tools/`:
```
/tools/contrast
/tools/simulate
/tools/visualize
/tools/reference
/tools/import
/tools/bookmarks
```

Or keep flat: `/contrast`, `/simulate`, etc. (simpler routing, matches the existing `/tailwind` page pattern).

### Navigation
- Add a "Tools" section to the sidebar below the step navigation
- Each tool is a link, not a wizard step
- Tools are always accessible (don't need to complete the wizard)
- Tools page layout uses the `default` layout (not the generator `blank` layout)

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

### Pages
- `app/pages/tools/contrast.vue`
- `app/pages/tools/simulate.vue`
- `app/pages/tools/visualize.vue`
- `app/pages/tools/reference.vue`
- `app/pages/tools/import.vue`
- `app/pages/tools/bookmarks.vue`

### Components
- `app/components/ContrastMatrix.vue`
- `app/components/ContrastPairChecker.vue`
- `app/components/ColorBlindnessFilter.vue`
- `app/components/PaletteVisualizer.vue`
- `app/components/VariableReference.vue`
- `app/components/PaletteDiff.vue`
- `app/components/BookmarkCard.vue`

### Composables
- `app/composables/utils/contrastRatio.ts` — luminance + ratio calculation
- `app/composables/utils/colorBlindness.ts` — CVD simulation matrices
- `app/composables/utils/colorConvert.ts` — HSL ↔ RGB ↔ Hex ↔ Lab
- `app/composables/utils/paletteBookmarks.ts` — localStorage bookmark management
- `app/composables/utils/paletteImport.ts` — CSS/TW/JSON parser

### No new dependencies needed
- Contrast calculation: pure math
- Color blindness: feColorMatrix SVG filters
- Color conversion: pure math (no chroma.js needed)
- Storage: localStorage + JSON.stringify
