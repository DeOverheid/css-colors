# Plan: Export System (Step 7)

## Goal

Replace the current minimal export with a comprehensive export system that produces production-ready files. Three export modes depending on theme:

1. **Tailwind export** (Custom + Tailwind themes) → `tailwind.config.ts` color section
2. **CSS layered export** (Custom + Mathematical themes) → 5-file CSS system
3. **JSON export** (all themes) → raw color data

---

## Export Mode 1: Tailwind Config

### Output

A ready-to-use Tailwind v4 color config:

```typescript
// tailwind-colors.config.ts
export default {
    theme: {
        extend: {
            colors: {
                primary: {
                    50: "hsl(155, 66%, 95%)",
                    100: "hsl(155, 66%, 88%)",
                    // ... 50-950 steps
                    950: "hsl(155, 66%, 5%)",
                },
                secondary: {
                    /* ... */
                },
                tertiary: {
                    /* ... */
                },
                grey: {
                    /* ... */
                },
                neutral: {
                    /* ... */
                },
            },
        },
    },
};
```

### Features

- Maps our 11-step scale to Tailwind's 50-950 naming convention
- Includes all unlocked color rows (primary, secondary, tertiary, greys, neutral)
- HSL format with actual computed values (post-adjustment)
- Copy-paste ready for `tailwind.config.ts`
- Optional: include the config parameters as comments so user can recreate

---

## Export Mode 2: CSS Layered System

### Architecture

Five CSS files that build on each other in a clean cascade:

```
1-config.css → 2-variables.css → 3-theme.css → 4-semantic.css → 5-examples.css
```

### File 1: `1-config.css` — Design Tokens Config

Raw configuration values. The "source of truth" that feeds everything else.

```css
:root {
    /* Primary */
    --config-primary-hue: 155;
    --config-primary-saturation: 66%;

    /* Secondary */
    --config-secondary-hue: 215;
    --config-secondary-saturation: 66%;

    /* Tertiary */
    --config-tertiary-hue: 95;
    --config-tertiary-saturation: 66%;

    /* Bezier control points (documentation) */
    /* cubic-bezier(0, 0, 0.5, 0.9) */

    /* Lightness steps (pre-computed from bezier + adjustment) */
    --config-lightness-50: 95%;
    --config-lightness-100: 88%;
    /* ... */
    --config-lightness-900: 12%;
    --config-lightness-950: 5%;
}
```

### File 2: `2-variables.css` — Color Variables

Builds all HSL colors from the config. Every hue × every lightness step.

```css
:root {
    /* Primary palette */
    --color-primary-50: hsl(
        var(--config-primary-hue),
        var(--config-primary-saturation),
        var(--config-lightness-50)
    );
    --color-primary-100: hsl(
        var(--config-primary-hue),
        var(--config-primary-saturation),
        var(--config-lightness-100)
    );
    /* ... through 950 */

    /* Secondary palette */
    --color-secondary-50: hsl(
        var(--config-secondary-hue),
        var(--config-secondary-saturation),
        var(--config-lightness-50)
    );
    /* ... */

    /* Grey palette (with per-step saturation) */
    --color-grey-50: hsl(var(--config-primary-hue), 3%, 95%);
    --color-grey-100: hsl(var(--config-primary-hue), 5%, 88%);
    /* ... */

    /* Neutral palette (0 saturation) */
    --color-neutral-50: hsl(0, 0%, 95%);
    /* ... */
}
```

**Note**: Where lightness adjustment was applied, the lightness values differ per hue. So the secondary-200 might have a different lightness than primary-200 if adjustment is active. In this case, we bake the actual computed lightness into the variable file rather than referencing the config.

### File 3: `3-theme.css` — Semantic Theme Tokens

Maps color variables to semantic meanings. This is the "design language" layer.

```css
:root {
    /* Brand colors */
    --theme-primary: var(--color-primary-500);
    --theme-primary-light: var(--color-primary-300);
    --theme-primary-dark: var(--color-primary-700);

    --theme-secondary: var(--color-secondary-500);
    --theme-secondary-light: var(--color-secondary-300);
    --theme-secondary-dark: var(--color-secondary-700);

    /* Feedback colors */
    --theme-success: var(--color-primary-500); /* or map to green hue */
    --theme-warning: hsl(45, 90%, 55%); /* amber/yellow */
    --theme-danger: hsl(0, 75%, 55%); /* red */
    --theme-info: var(--color-secondary-500); /* or map to blue hue */

    /* Surface colors */
    --theme-background: var(--color-neutral-50);
    --theme-surface: var(--color-neutral-100);
    --theme-surface-raised: var(--color-neutral-200);
    --theme-border: var(--color-grey-200);
    --theme-border-strong: var(--color-grey-400);

    /* Text colors */
    --theme-text: var(--color-neutral-900);
    --theme-text-muted: var(--color-neutral-600);
    --theme-text-subtle: var(--color-neutral-400);
    --theme-text-inverse: var(--color-neutral-50);

    /* Interactive states */
    --theme-hover: var(--color-primary-100);
    --theme-active: var(--color-primary-200);
    --theme-focus-ring: var(--color-primary-400);
    --theme-disabled: var(--color-neutral-300);
}
```

### File 4: `4-semantic.css` — Component Tokens

Maps theme tokens to specific component parts. The "component API" layer.

```css
:root {
    /* Buttons */
    --button-primary-bg: var(--theme-primary);
    --button-primary-text: var(--theme-text-inverse);
    --button-primary-hover: var(--theme-primary-dark);
    --button-secondary-bg: var(--theme-surface);
    --button-secondary-text: var(--theme-text);
    --button-secondary-border: var(--theme-border);
    --button-danger-bg: var(--theme-danger);
    --button-danger-text: var(--theme-text-inverse);

    /* Inputs */
    --input-bg: var(--theme-background);
    --input-border: var(--theme-border);
    --input-border-focus: var(--theme-focus-ring);
    --input-text: var(--theme-text);
    --input-placeholder: var(--theme-text-subtle);

    /* Cards */
    --card-bg: var(--theme-surface);
    --card-border: var(--theme-border);
    --card-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);

    /* Navigation */
    --nav-bg: var(--theme-surface);
    --nav-text: var(--theme-text-muted);
    --nav-active-text: var(--theme-text);
    --nav-active-bg: var(--theme-hover);

    /* Alerts */
    --alert-success-bg: hsl(from var(--theme-success) h s 95%);
    --alert-success-border: var(--theme-success);
    --alert-warning-bg: hsl(from var(--theme-warning) h s 95%);
    --alert-warning-border: var(--theme-warning);
    --alert-danger-bg: hsl(from var(--theme-danger) h s 95%);
    --alert-danger-border: var(--theme-danger);

    /* Badges */
    --badge-primary-bg: var(--color-primary-100);
    --badge-primary-text: var(--color-primary-700);
}
```

### File 5: `5-examples.css` — Example Components

Actual CSS rules using the semantic tokens. Gives users a starting point for their components.

```css
/* === Buttons === */
.btn {
    padding: 0.5rem 1rem;
    border-radius: 0.375rem;
    font-weight: 500;
    border: 1px solid transparent;
    cursor: pointer;
    transition:
        background-color 0.15s,
        border-color 0.15s;
}

.btn-primary {
    background: var(--button-primary-bg);
    color: var(--button-primary-text);
}
.btn-primary:hover {
    background: var(--button-primary-hover);
}

.btn-secondary {
    background: var(--button-secondary-bg);
    color: var(--button-secondary-text);
    border-color: var(--button-secondary-border);
}

.btn-danger {
    background: var(--button-danger-bg);
    color: var(--button-danger-text);
}

/* === Cards === */
.card {
    background: var(--card-bg);
    border: 1px solid var(--card-border);
    border-radius: 0.5rem;
    box-shadow: var(--card-shadow);
    padding: 1.5rem;
}

/* === Inputs === */
.input {
    background: var(--input-bg);
    border: 1px solid var(--input-border);
    border-radius: 0.375rem;
    padding: 0.5rem 0.75rem;
    color: var(--input-text);
}
.input:focus {
    outline: 2px solid var(--input-border-focus);
    outline-offset: 1px;
}
.input::placeholder {
    color: var(--input-placeholder);
}

/* === Alerts === */
.alert {
    padding: 0.75rem 1rem;
    border-radius: 0.375rem;
    border: 1px solid;
}
.alert-success {
    background: var(--alert-success-bg);
    border-color: var(--alert-success-border);
}
.alert-warning {
    background: var(--alert-warning-bg);
    border-color: var(--alert-warning-border);
}
.alert-danger {
    background: var(--alert-danger-bg);
    border-color: var(--alert-danger-border);
}

/* === Badges === */
.badge {
    display: inline-flex;
    padding: 0.125rem 0.5rem;
    border-radius: 9999px;
    font-size: 0.75rem;
    font-weight: 500;
}
.badge-primary {
    background: var(--badge-primary-bg);
    color: var(--badge-primary-text);
}

/* === Navigation === */
.nav-item {
    padding: 0.5rem 0.75rem;
    border-radius: 0.375rem;
    color: var(--nav-text);
}
.nav-item:hover {
    background: var(--nav-active-bg);
}
.nav-item.active {
    color: var(--nav-active-text);
    background: var(--nav-active-bg);
}
```

---

## Export Mode 3: JSON

Raw color data for programmatic use:

```json
{
    "primary": {
        "50": { "h": 155, "s": 66, "l": 95, "hex": "#e8f8f0" },
        "100": { "h": 155, "s": 66, "l": 88, "hex": "#c5edda" },
        ...
    },
    "config": {
        "hue": 155,
        "saturation": 66,
        "bezier": [0, 0, 0.5, 0.9],
        ...
    }
}
```

---

## Implementation Phases

### Phase 1: Export UI redesign

- Tabbed interface: Tailwind | CSS | JSON
- Preview panel showing generated code
- Copy / Download buttons per file

### Phase 2: Tailwind export generator

- Composable: `generateTailwindConfig()`
- Maps 11-step scale to 50-950 naming
- Includes all unlocked color rows
- Bakes in lightness adjustment values
- Output: complete `colors` object for tailwind.config

### Phase 3: CSS config + variables generator

- Composable: `generateCSSConfig()` → File 1
- Composable: `generateCSSVariables()` → File 2
- Per-hue lightness values (post-adjustment, post-shift)
- Grey saturation distribution baked in

### Phase 4: Theme + semantic generator

- Composable: `generateCSSTheme()` → File 3
- Composable: `generateCSSSemantic()` → File 4
- Default mappings (primary=500, light=300, dark=700)
- User-customizable mapping UI (stretch)

### Phase 5: Examples generator

- Composable: `generateCSSExamples()` → File 5
- Predefined component styles using semantic tokens
- HTML preview of rendered components (stretch)

### Phase 6: Download + integration

- "Download all" → ZIP with all 5 CSS files
- "Download Tailwind" → single config file
- "Copy to clipboard" per file
- Include a README.md in the ZIP explaining the file structure

---

## Open Questions

1. Should the CSS export use `hsl()` function with variables or pre-computed hex values?
    - Variables are more flexible (change config, everything updates)
    - Hex values are simpler and don't require the config file
    - **Recommendation**: Use HSL variables for CSS mode, hex for Tailwind mode
2. How should lightness adjustment be represented in exports?
    - Pre-baked (each hue row gets its own lightness values) — simpler, no runtime cost
    - As a function (requires JS) — more flexible but complex
    - **Recommendation**: Pre-baked for v1
3. Should the semantic layer be customizable in the UI, or just export defaults?
    - Defaults for v1, customizable mapping UI in v2
4. Feedback colors (success/warning/danger/info): derive from palette or use fixed hues?
    - Fixed hues are safer (red is always red for danger)
    - But saturation/lightness should match the palette's style
5. Should the ZIP include dark mode variants?
    - Could auto-generate by inverting the lightness scale
    - Stretch goal for v2

---

## Files to Create/Modify

### New files

- `app/composables/output/generateTailwindConfig.ts`
- `app/composables/output/generateCSSConfig.ts`
- `app/composables/output/generateCSSVariables.ts`
- `app/composables/output/generateCSSTheme.ts`
- `app/composables/output/generateCSSSemantic.ts`
- `app/composables/output/generateCSSExamples.ts`
- `app/composables/output/generateJSON.ts`
- `app/components/ExportTabs.vue` — tabbed export UI
- `app/components/ExportPreview.vue` — code preview with syntax highlighting

### Modified files

- `app/components/ExportPanel.vue` — integrate new export tabs
- `app/components/ExportActions.vue` — download/copy buttons per format
- `app/composables/output/useExportConfig.ts` — refactor to use new generators
