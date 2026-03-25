# Plan: Theme Builder Redesign (Step 6)

## Goal

Transform the current "Compare Presets" step into an interactive Theme Builder where users can pick, mix, and customize settings from any preset theme. Instead of just switching between Tailwind/Mathematical/Custom wholesale, users cherry-pick individual settings.

---

## Current State

Step 6 currently offers a simple radio selector between three themes:

- **Custom** — user-configured everything
- **Tailwind** — Tailwind CSS v4 color matching
- **Mathematical** — mathematically derived palette

Switching themes swaps ALL settings at once. No mixing.

Per-theme state is already preserved for: bezier curves, shifts, saturation, hue spectrum, UI tone.

---

## Design

### Theme Builder UI

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

---

## Implementation Phases

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
2. How many settings are independently selectable? Full list vs. grouped categories?
3. Should saved presets be exportable/importable (JSON)?
4. Does comparison mode need side-by-side or overlay?

---

## Files to Create/Modify

### New files

- `app/composables/themes/useThemeMix.ts` — per-setting source resolution
- `app/components/ThemeBuilderGrid.vue` — settings comparison grid

### Modified files

- `app/components/ThemeSelector.vue` — replace or extend with builder grid
- `app/composables/themes/index.ts` — integrate ThemeMix resolution
- `app/composables/steps/stepRegistry.ts` — update step 6 title/description
