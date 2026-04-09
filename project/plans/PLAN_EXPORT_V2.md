# Export System Plan v2

## Goal

Generate a ready-to-use color palette config that a developer can drop into their project. The app computes every shade via bezier curves, lightness adjustments, and hue shifts — so even the Tailwind preset produces derived values that need explicit declaration.

---

## What Gets Exported

Every visible swatch maps to a named color + numbered shade:

```
cyan-50, cyan-100, cyan-200, ..., cyan-900, cyan-950
sky-50, sky-100, ...
blue-50, ...
(... all chromatic rows ...)
gray-50, gray-100, ...
slate-50, ...
(... all grey rows ...)
```

Each shade is an **HSL value** (the exact value shown in the swatch tooltip). Export converts to the target format (hex, HSL, OKLCH, etc.).

---

## Export Formats (v1 Scope)

### Format 1: Tailwind v4 CSS theme (default)

The primary target. Tailwind v4 uses `@theme` blocks with CSS custom properties.

```css
@theme {
    --color-cyan-50: hsl(183, 96%, 96%);
    --color-cyan-100: hsl(183, 89%, 89%);
    /* ... */
    --color-cyan-900: hsl(183, 55%, 20%);
    --color-cyan-950: hsl(183, 65%, 10%);

    --color-sky-50: hsl(198, 93%, 96%);
    /* ... all rows ... */
}
```

### Format 2: CSS custom properties (framework-agnostic)

Plain `:root` block for non-Tailwind projects.

```css
:root {
    --cyan-50: hsl(183, 96%, 96%);
    --cyan-100: hsl(183, 89%, 89%);
    /* ... */
}
```

### Future formats (not in v1)

- **Tailwind v3 JS config** — `module.exports = { theme: { colors: { ... } } }`
- **Design Tokens JSON (W3C DTCG)** — NL Design System compatible, `{ "color": { "cyan": { "50": { "value": "..." } } } }`

---

## Color Value Formats (v1 Scope)

Two notation options:

| Notation | Example              | Notes                        |
| -------- | -------------------- | ---------------------------- |
| **HSL**  | `hsl(183, 96%, 96%)` | Default, matches app         |
| **Hex**  | `#ecfeff`            | Alternative, most compatible |

---

## Shade Scale Mapping

The app's shade count depends on the theme's `totalSteps`:

| Theme        | totalSteps | Shades (excl. black/white) |
| ------------ | ---------- | -------------------------- |
| Tailwind     | 13         | 13                         |
| Mathematical | 9          | 9                          |
| Custom       | 13         | 13                         |

Tailwind's standard scale: `50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950` (11 steps).

When the app's shade count ≠ 11, we need a mapping strategy.

---

## Row Naming

Each chromatic row and grey row needs a name in the export. The app already has names per row via the theme's `HueEntry.name` field (e.g. "cyan", "sky", "blue") and grey names from `closestGreyName()`.

---

## Export UI (Step 7)

The export step replaces the swatch grid with the export panel:

1. **Format selector** — radio: TW v4 CSS / CSS custom properties
2. **Color notation selector** — toggle: HSL (default) / Hex
3. **Code preview** — scrollable `<pre><code>` block replacing the swatch area
4. **Copy button** — floating top-right of code block, copy icon, with feedback
5. **Download button** — next to copy, download icon, saves as `{theme}-{format}-palette.{ext}`

---

## Implementation Steps

### Step 1: Color conversion utility

- `hslToHex(h, s, l)` → `#rrggbb`
- Place in `composables/utils/colorConversion.ts`

### Step 2: Palette collector

- Composable that gathers all visible swatch data into a flat structure
- `{ name: string, shades: { label: string, hue: number, saturation: number, lightness: number }[] }[]`
- Reads from the same pipeline that feeds `GeneratorSwatches`
- Excludes black (index 0) and white (last index)

### Step 3: Shade scale mapper

- Maps N app shades → Tailwind's 50–950 scale labels
- Theme config provides `shadeLabels` array (e.g. `["50", "100", "200", ..., "950"]`)
- Tailwind and Custom themes share the same 13→label mapping

### Step 4: Format serializers

- `toTailwindV4Css(palette, notation)` → `@theme { ... }` string
- `toCssVars(palette, notation)` → `:root { ... }` string
- Each applies late rounding: `toFixed(1)` for HSL, integer RGB for hex

### Step 5: Export UI

- Build out `steps/export/InputTop.vue`
- Format selector (TW v4 / CSS vars) + notation toggle (HSL / Hex)
- Code preview replaces swatch area
- Floating copy + download buttons

### Step 6: Dev export cleanup

- Current `useExportConfig.ts` stays as dev-only tool
- New user export is fully separate

---

## File Structure (v1)

```
composables/
├── output/
│   ├── useExportConfig.ts        # Existing dev export (keep)
│   ├── useUserExport.ts          # New: orchestrates user export
│   ├── usePaletteCollector.ts    # New: gathers all swatch data
│   └── formatters/
│       ├── tailwindV4Css.ts      # @theme { --color-*: ... }
│       └── cssVariables.ts       # :root { --*: ... }
├── utils/
│   └── colorConversion.ts        # hslToHex()
```

---

## Open Questions

### Architecture

**Q1. Extend vs replace?**
Should the new user export extend `useExportConfig.ts`, or be a completely separate composable? Current `useExportConfig` is dev-focused (copies TS theme objects). User export is fundamentally different (copies color values). Leaning toward **separate**.

A: Keep the Dev mode as a Copy Settings options to feed back to the LLM to update the add defaults, create a new, fully working export as a separate fucntion.

> Agreed — `useExportConfig.ts` stays as the dev copy tool. New user export lives in `useUserExport.ts` with zero coupling to the dev exporter.

**Q2. Shade scale mapping — when totalSteps ≠ 11?**
Options:
A: For now, only export TW and Custome themes where the steps are 11, but make sure that there is a function or a theme config that listat the number of steps and the names of the steps, but for these two they are the same. For Mathemathical we will create an entirely different export.

> Makes sense. Both Tailwind and Custom themes have `totalSteps: 13` which gives 13 inner shades. Tailwind's standard scale has 11 labels (50–950). We'll need a mapping from 13 shades → 11 labels, or we define 13 labels for these themes (e.g. adding 25 and 975, or using a different numbering). This is a detail to resolve during implementation — the important thing is that Mathematical gets its own path later.

**Q3. Include black and white?**
The app generates full lightness steps including 0 (black) and 100 (white). Should these be included in export as `black` / `white`? Or excluded since Tailwind already has them?
A: Exclude them, start and end at 50 and 950 for each swatch.

> Clean — the `fullLightnessSteps` array includes index 0 (black) and last (white), so we'll slice those off before export.

### Naming

**Q4. Grey row names — use Tailwind names or role names?**
Grey rows currently show closest Tailwind grey name (e.g. "slate", "zinc") for Tailwind/Mathematical themes, and role names ("Primary", "Secondary") for Custom theme. For export:

- **(a)** Always use Tailwind grey names for TW theme
- **(b)** Use role names for custom theme, include grey-neutral, grey-primary, grey-secondary and grey-tertiary in the export.

> Good split. TW theme exports `slate`, `zinc`, etc. Custom theme exports `grey-neutral`, `grey-primary`, `grey-secondary`, `grey-tertiary`. The palette collector will read the naming source from the theme context.

**Q5. Chromatic row names — source?**
Each `HueEntry` has a `.name` field. For Tailwind theme these match Tailwind names. For Custom/Mathematical they may differ. Should export always use the theme's row names, or let the user edit them?

A: Use the row names, if the user wants to rename them, let him do so in the config file.

> Straightforward — names come from `HueEntry.name` as-is. No rename UI needed.

### Color Notation

**Q6. Default color notation?**
Hex is most universal, but HSL matches the app. OKLCH is forward-looking. Which should be the default?
A: HSL is the default but users could pick hex as the alternative. No OKLCH.

> HSL default makes sense since the app thinks in HSL natively. We'll need `hslToHex()` for the hex option. Two notations keeps the UI simple — just a toggle.

**Q7. Support mixed notation?**
Should users be able to mix (e.g. hex for most, HSL for greys)? Or always one notation for the whole export?
A: One format only

> Keeps things simple — one notation selector for the entire export.

### Format

**Q8. Tailwind v3 vs v4 — which is primary?**
v4 uses CSS `@theme` blocks. v3 uses JS config. Which should be the default/emphasized format?
A: Use V4 as the default, I will have a look at V3 later. do not include it now.

> v4 only for now. Removes `tailwindV3Js.ts` from the file structure. The format selector starts with just TW v4 CSS and CSS custom properties.

**Q9. JSON structure — flat or nested?**

- **Flat**: `{ "cyan-50": "#ecfeff", "cyan-100": "#cffafe" }`
- **Nested**: `{ "cyan": { "50": "#ecfeff", "100": "#cffafe" } }`
  A: check what this site has to say about it, I would like out app to create a token setup as they are proposing so we can work together, it may be a later addition but use the format they propose it if fits: https://nldesignsystem.nl/handboek/developer/thema-maken/

> The NL Design System uses the **W3C Design Tokens Format (DTCG)** — a nested JSON structure where each value is wrapped in a `{ "value": "..." }` object. This is compatible with [Style Dictionary](https://styledictionary.com/) for generating CSS custom properties automatically.
>
> Their format looks like:
>
> ```json
> {
>     "color": {
>         "cyan": {
>             "50": { "value": "hsl(183, 96%, 96%)" },
>             "100": { "value": "hsl(183, 89%, 89%)" }
>         }
>     }
> }
> ```
>
> This is a superset of plain nested JSON — adding `{ "value": ... }` wrappers. It enables cross-references between tokens (e.g. a component token referencing `{color.cyan.50}`).
>
> **Plan:** We'll add Design Tokens JSON as a future format option. For v1, we ship TW v4 CSS and CSS custom properties. The palette collector's data structure will already be compatible so adding the DTCG formatter later is just a serializer.
>
> Updated file structure removes `json.ts` and `tailwindV3Js.ts` from v1 scope.

**Q10. Include `extend` wrapper in TW v3 output?**
Full replacement (`theme.colors`) or additive (`theme.extend.colors`)? Extend preserves Tailwind defaults; full replacement means only your colors exist.
A: No v3 for now

> Skipped — no v3 in v1 scope.

### UI

**Q11. Preview panel in step 7 — where?**
The step 7 layout currently shows the swatch grid. Should the code preview:
A: - **(a)** Replace the swatch grid

> The export step replaces the swatch area with a scrollable code block. We'll use a `<pre><code>` with syntax highlighting if possible, or plain monospace at minimum.

**Q12. Download file naming?**
Suggestions: `colors.css`, `tailwind-colors.js`, `palette.json` — or include theme name like `tailwind-palette.css`?
A: Include theme-format-palette.extension

> Pattern: `{theme}-{format}-palette.{ext}`. Examples: `tailwind-tw4-palette.css`, `custom-cssvars-palette.css`, `tailwind-tokens-palette.json`.

### Scope

**Q13. URL params — keep in this plan or separate?**
URL parameter encoding (shareable links) was in the original plan but is a distinct feature. Should it be part of this export effort or a follow-up?
A: we will create it later

> Deferred — separate plan/branch when needed.

**Q14. Copy individual row?**
Should users be able to click a swatch row and copy just that one color's scale? (e.g. just the "cyan" row)
A: No

> Full export only. Keeps the UI focused.

**Q15. Lightness value precision?**
Export HSL values — round to integer, 1 decimal, or 2 decimals? For hex the question is moot (hex is always integer RGB). We already show max 1 decimal in tooltips.
A: Round to one decimal at the very end of all calculation, not in between so we get compound franctions.

> Important — rounding happens only in the final serialization step, never in intermediate computations. The `fmt()` helper (or a dedicated export formatter) applies `toFixed(1)` as the very last operation before writing the string.
