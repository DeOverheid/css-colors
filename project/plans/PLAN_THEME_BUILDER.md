# Plan: Theme Builder Redesign (Step 6)

## Goal

Transform the current "Chose Presets" step into an interactive Theme Builder where users can pick, mix, and customize settings from any preset theme. Instead of just switching between Tailwind/Mathematical/Custom wholesale, users compare and adjust individual settings.

---

## Current State

Step 6 currently offers a simple radio selector between three themes:

- **Custom** — user-configured everything, result of previous steps
- **Tailwind** — Tailwind CSS v4 color matching
- **Mathematical** — mathematically derived palette

Switching themes swaps ALL settings at once. No mixing.

Per-theme state is already preserved for: bezier curves, shifts, saturation, hue spectrum, UI tone.

New update:
When a user arrives at this step, there will be a toggle available (unlocked) to quickly switch between themes. This toggle will be small and will be available on all steps.
A user can go back to any step, compare those settings and results quickly for each theme with the toggle and adjust any setting, custom or basic theme.
Undecided: will the basic themes be stuck in their own settings, or have a save custom and revert to default button.
There is also a new idea to load the Tailwind color swatches with the exact HSL values of tailwind itself and modify all controls to cpply an offset to those values, or, if retained at their default, export an exact copy of the tailwind colors, this would allow users to use the exact tailwind as a base and only slightly modify one or more properties.

---

## Design

### Decision: Full Theme Builder is NOT planned

The grid-based per-setting mixer described originally is over-engineered and unlikely to be useful. The Custom theme already lets users build their own palette using sane presets.

### What we WILL do: Theme Toggle + Comparison

**Theme toggle (small, always available):**

- Unlocked once the user reaches Step 6
- Available on ALL steps — user can go back to any step, toggle themes, compare results
- Small UI toggle, does not interfere with step content

**Comparison workflow:**

- User works through steps with Custom theme
- Toggles to Tailwind to compare how the same step looks with Tailwind settings
- Can tweak Custom settings while seeing what Tailwind does differently
- The app itself IS the comparison tool — seeing your palette applied to the actual UI

**Tailwind as a modifiable base (research needed):**

- Load exact HSL values of actual Tailwind colors into the Tailwind theme
- All controls apply offsets from those exact values
- If user keeps defaults → exports an exact copy of Tailwind colors
- Allows subtle modifications: "Tailwind but with 5% more saturation" or "Tailwind with my custom primary hue"

**Open: save/revert behavior:**

- Should basic themes (TW, Math) be modifiable?
- Or should they be read-only with a "duplicate to Custom" action?
- Need save-custom / revert-to-default buttons?

**End goal:** User picks the best theme by seeing how the actual app looks — not by comparing numbers in a grid. Real UI elements (cards, buttons, panels, inputs) using the palette provide visceral feedback.

### Data Model

Research needed. The theme toggle and Tailwind-as-base concepts need prototyping before finalizing the data model.

Key considerations:

- Theme = a named group of settings (bezier, shifts, saturation, adjustment, hue shift)
- Each theme has its own defaults
- Export decides how the values are used (TW config format vs CSS variables format)
- Theme and export mode should be decoupled: any theme can be exported in any format

```typescript
// Possible direction — needs validation
interface ThemeState {
    id: ThemeId;
    label: string;
    settings: GeneratorSettings; // all configurable state
    isReadOnly: boolean; // TW/Math are read-only unless duplicated
}
```

### Resolution

When the user toggles themes, ALL generator state switches to the selected theme's settings. No per-property mixing — the toggle is wholesale.

The app re-renders with the new theme's colors, showing the user what that theme looks like applied to every element.

User input: We will research the theme toggle and default/custom setup further.
In the end I want the user to pick the best theme by comparing how this actual app looks like when it uses the settings itself. You already see that if you modify some things too heavily, the app will look worse, so using the actual app, with some samples like a card, a button, panel, some input etc. will allow the user to modify the theme with actual results.
Toggling between Tailwind and custom will allow the user to see their difference.

---

## Implementation Phases

Phases revised to match the simplified approach. Do not execute before validating with the user.

### Phase 1: Theme toggle component

- Small toggle button showing current theme name
- Unlocked after reaching Step 6
- Visible on all steps once unlocked
- Switches all generator state to the selected theme wholesale

### Phase 2: Tailwind exact-HSL base (research)

- Load actual Tailwind v4 HSL values into the Tailwind theme
- Controls display offsets from these base values
- Default offsets = 0 → exports exact Tailwind colors
- Prototype and validate this approach before full implementation

### Phase 3: UI sample elements

- Add sample UI cards, buttons, panels, inputs that use the palette
- Visible on later steps (Step 6+) to show palette in context
- These serve as the "visualizer" — no separate page needed

### Phase 4: Save/revert behavior (if needed)

- Determine if basic themes should be modifiable or read-only
- If modifiable: add save-custom / revert-to-default buttons
- If read-only: add "duplicate to Custom" action

---

## Open Questions

1. Should users be able to edit a Tailwind/Mathematical value, or only pick it as-is?
   **Status**: Unresolved. User wants to preserve both themes as groups of settings, but also never lose user input when switching. Possible solution: themes are read-only presets, user always works in Custom but can "import from" a preset to override individual settings.
2. How to decouple theme from export format?
   **Insight**: Custom/TW/Math are just groups of settings. The export format (TW config vs CSS variables) is a separate choice. A Mathematical theme could be exported as Tailwind config, and vice versa. Need to design this separation cleanly.
3. Should saved presets be exportable/importable?
   **Answer**: Export as a comment in TW config or as CSS variable config. Import not needed — sharing via URL parameters instead (see bookmarks).
4. Does comparison mode need side-by-side or overlay?
   **Answer**: Not relevant. The theme toggle provides quick A/B comparison at any step.

---

## Files to Create/Modify

Revised for the simplified approach. Do not execute before validating with the user.

### New files

- `app/components/ThemeToggle.vue` — small toggle button for theme switching
- `app/components/UISamplePanel.vue` — sample UI elements (cards, buttons, etc.) using palette

### Modified files

- `app/components/GeneratorSidebar.vue` or layout — place theme toggle
- `app/composables/themes/` — ensure wholesale theme switching works cleanly
- `app/composables/steps/stepRegistry.ts` — update step 6 title/description
