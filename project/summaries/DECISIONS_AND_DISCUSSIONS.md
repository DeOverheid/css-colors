# Chat & Decision Log

Key discussions, decisions, and reasoning from AI pair-programming sessions. Organized by topic for quick reference.

---

## Architecture Decisions

### CSS Variables over JS-driven styling

- All 200+ color variables are set via `document.documentElement.style` from `useCssVariables`
- Chosen because CSS cascade handles the rest — one composable feeds the entire UI
- HSL format with modern space-separated syntax: `hsl(155 100% 50%)`

### Per-theme state pattern

- Early: single global state for bezier, shifts, etc.
- Problem: switching themes lost user edits
- Solution: `useState<Record<string, T>>` maps keyed by theme ID
- Applied to: bezier curves, shift sliders, hue spectrum offsets, UI tone, saturation
- Writable computeds expose current theme's value, reads/writes route through the map

### Greys follow rainbow bezier

- Originally: separate `grayscaleBezier` per theme
- Decision: remove it, greys use the same bezier as rainbow colors
- Reasoning: simpler mental model, fewer knobs, greys still differ via shift sliders
- All `grayscaleBezier` references removed from types, themes, composables, and export

### Weighted squeeze (X-axis)

- Original: uniform linear remap of X-axis (`squeezeX`)
- Problem: dark slider moved light swatches too much
- Solution: position-based weights — `darkWeight = 1 - x`, `lightWeight = x`
- Effect: each slider mostly affects its own side, fades toward the opposite
- Kept simple: no power curves, just linear weights

### Theme step moved to end

- Original order: Primary → Complementary → **Theme** → Lightness → Adjustment → Hue Spectrum → Export
- New order: Primary → Complementary → Lightness → Adjustment → Hue Spectrum → **Theme** → Export
- Reasoning: user builds custom palette through steps 1-5, then compares with presets at step 6
- Custom is now the default theme — all edits land there automatically
- "Save Custom" button removed — no longer needed since Custom is always live
- Theme step renamed "Compare Presets"

### Color input: button over live parsing

- Originally: `@input` handler parsed on every keystroke
- Problem: partial input (e.g., `#f`) triggered misparses; `#` symbol caused issues
- Solution: removed live parsing, added explicit "Update" button + Enter key
- Matches user preference: explicit control over magic behavior

### Hue-saturation wheel replaces offset slider

- Step 2 (complementary colors) replaced the hue offset slider with an interactive wheel
- CSS conic-gradient for color display, SVG overlay for handles and rings
- Coordinate system: 0° = top (red), clockwise rotation. `from 0deg` in conic-gradient aligns with polar math `(hue-90)°`
- Three handles: Primary (hue + saturation), Secondary/Tertiary (offset + complementary saturation)
- Saturation ratio model: `satRatio = complementarySaturation / primarySaturation`. Dragging secondary/tertiary updates the ratio; changing primary scales complementary proportionally
- Step 1 snapshot: outer marker and reference ring remember hue/saturation from step 1 so they stay fixed during wheel interaction
- Three concentric reference rings: step 1 snapshot (25% opacity), live primary (50%), complementary (35%, dashed)

### `.rounded-group` CSS utility

- Created in main.css with `--vertical` and `--horizontal` modifier classes
- Strips inner border-radius, applies 5px radius only on outer corners
- Applied to sidebar nav (vertical) and swatch previews (horizontal)

---

## UI & Styling Decisions

### Generator layout

- Sidebar (navigation) + main content area
- Main content: 3-column grid with `15% | 1fr | 15%` for controls
- Bezier step uses special 4-column layout with curve editor
- Left/right panels show shift sliders (unlocked at lightness distribution step)
- Footer: persistent color sample + dev mode toggle

### Button styling

- Avoid UButton when custom styling is needed — native `<button>` with scoped CSS
- Color input "Update" button: grey text, 1px grey border, transparent background, `width: fit-content`

### Swatch system

- Per-step unlock: visiting a step unlocks its swatch groups
- Grey companions sit below their chromatic parent rows
- Hover popups show detailed color info

---

## Theme Defaults (as of March 2026)

| Setting             | Custom         | Tailwind               | Mathematical     |
| ------------------- | -------------- | ---------------------- | ---------------- |
| Bezier              | 0, 0, 0.5, 0.9 | 0.46, 0.13, 0.72, 0.92 | 0, 0, 0.54, 0.94 |
| Rainbow dark shift  | 0              | 65                     | 0                |
| Rainbow light shift | 0              | 0                      | 0                |
| Grey dark shift     | 0              | 38                     | 0                |
| Grey light shift    | 0              | 0                      | 0                |
| Saturation          | 66             | 86                     | 66               |
| UI tone             | neutral        | neutral                | neutral          |
| Total steps         | 13             | 13                     | 9                |

---

## Open / Pending

- FTP deploy times out (March 20-23) — server issue at `ftp.geenkaas.nl`
- Skillset profile side-project (PLAN_SKILLSET.md) — not project-related, lives in plans/
- Various plans exist for future work: derived colors, expansion, export improvements, stepper refactor
- `saveAsCustom` function still exists in `themes/index.ts` but the button was removed — could be cleaned up
- RadioSelector tone button restyle partially done (background property added, visual polish pending)
- Hue wheel: step 1 snapshot update mechanism needs to be triggered from step 1 slider changes
