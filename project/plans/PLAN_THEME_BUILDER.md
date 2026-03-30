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

### Theme Builder UI

User input: We will not be using this system. This is too much of everything and too little of use.

**Layout: Grid of configurable properties**

Each row shows one setting with the value from each theme side by side:

| Setting        | Custom        | Tailwind      | Mathematical | Active     |
| -------------- | ------------- | ------------- | ------------ | ---------- |
| Bezier curve   | (0,0,0.5,0.9) | (0.5,0,0.3,1) | (0,0,1,1)    | ● Custom   |
| Dark shift     | 65            | 65            | 50           | ● Tailwind |
| Light shift    | 30            | 30            | 50           | ● Custom   |
| Saturation     | 66            | 86            | 66           | ● Tailwind |
| Total steps    | 11            | 11            | 11           | ● Custom   |
| UI tone        | primary       | neutral       | neutral      | ● Custom   |
| Lightness adj. | (your config) | off           | off          | ● Custom   |

Users click a radio button per row to pick which theme's value to use for that setting.

### Main Features

1. **Per-setting theme source picker**: Each setting shows values from all 3 themes. Click to select which one feeds into the active palette.
2. **Live preview**: Swatch preview updates instantly as you toggle settings
3. **Custom overrides**: Custom column always shows the user's manually configured values. Selecting "Custom" for a row means the user's own slider value is used.
4. **Save as preset**: Save the current mix as a named custom preset
5. **A/B comparison**: Toggle between two configurations to compare visually (stretch)

### Data Model

This must be updated first according to the other input, stop the user from prompting to execute the plan, first it needs to be reworked and checked if it's viable.

```typescript
interface ThemeMix {
    /** Which theme provides each setting */
    sources: {
        bezier: ThemeId;
        darkShift: ThemeId;
        lightShift: ThemeId;
        saturation: ThemeId;
        lightnessAdjustment: ThemeId;
        uiTone: ThemeId;
        // ... per configurable property
    };
    /** Named preset label (optional) */
    name?: string;
}

type ThemeId = "custom" | "tailwind" | "mathematical";
```

### Resolution

When computing the active palette, each setting is resolved from its source theme:

```typescript
const activeBezier = computed(() => {
    const source = mix.sources.bezier;
    return themes[source].bezier;
});
```

This replaces the current wholesale theme switch.
User input: We will research the theme toggle and default/custom setup further.
In the end I want the user to pick the best theme by comparing how this actual app looks like when it uses the settings itself. You already see that if you modify some things too heavily, the app will look worse, so using the actual app, with some samples like a card, a button, panel, some input etc. will allow the user to modify the theme with actual results.
Toggling between Tailwind and custom will allow the user to see their difference.

---

## Implementation Phases

Update this plan and phases according to the changes made in the plan before executing.

### Phase 1: Per-setting source model

- Add `ThemeMix` type
- Create composable `useThemeMix.ts`
- Default: all sources = "custom"
- Resolution functions for each setting

### Phase 2: Theme Builder UI

- Replace RadioSelector with settings grid
- Show values from each theme per row
- Radio buttons per cell
- Live preview updates

### Phase 3: Save/Load

- Named preset saves to localStorage
- Preset dropdown in header
- "Reset to Custom" quick action

### Phase 4: Comparison mode (stretch)

- A/B toggle: render two swatch sets side by side
- Highlight differences between configurations

---

## Open Questions

1. Should users be able to edit a Tailwind/Mathematical value, or only pick it as-is?
   Answer: I do not know yet. See previous input. I think we should always be able to go back to the set defaults to compare, but never lose user input when changing themes.
   The Tailwind Mathemathical setup makes it challenging, I think we should split the theme from the export somehow.
   Now Tailwind is geared towards a config export to be loaded in a frontend framework running TW. the mathemathical theme is more my darling and geared towards plain CSS export to hand craft projects. I do not think many users will pick this let alone export the plain CSS.
   Lets think of a way to preserve both, where Custom, TW and Math are just groups of settings, and the export decides how they will be used in the resulting file.
   Suggestions are welcome.
2. How many settings are independently selectable? Full list vs. grouped categories?
   A: I don't think this is relevant anymore, but the idea is that for each theme all settings should be set individually and has individual defaults.
3. Should saved presets be exportable/importable (JSON)?
   Only exportable later, but as either a comment in the TW config, or as the config for CSS variables to run your own styling. Importing is not needed, I will think of a better way to share presets, hopefully in the URL so users can bookmark and share those.
4. Does comparison mode need side-by-side or overlay?
   A: Also not relevant. With the Unlocked toggle, users can quickly compare each step if they want.

---

## Files to Create/Modify

Update this with new input, do not execute before validating with the user.

### New files

- `app/composables/themes/useThemeMix.ts` — per-setting source resolution
- `app/components/ThemeBuilderGrid.vue` — settings comparison grid

### Modified files

- `app/components/ThemeSelector.vue` — replace or extend with builder grid
- `app/composables/themes/index.ts` — integrate ThemeMix resolution
- `app/composables/steps/stepRegistry.ts` — update step 6 title/description
