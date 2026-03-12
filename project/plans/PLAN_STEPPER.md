# Plan: Step Registry & Panel-Driven Architecture

## Goal

Replace the hardcoded step numbering with a **declarative step registry**. Each panel in the layout listens to the active step and renders accordingly. Steps are identified by string IDs, ordered by array position — no numbers in step logic.

---

## Current Problems

1. **Hardcoded numeric step IDs** — `currentStep === 2`, type `1 | 2 | 3 | 4 | 5`, `v-for="step in 5"`, metadata keyed by number.
2. **Step content is wired into one component** — `GeneratorInput.vue` has a chain of `v-if` blocks, one per step. Adding a step means editing this file.
3. **No concept of what a step affects** — each step could provide content for any panel (input, left, right, footer), but that relationship isn't declared anywhere.
4. **Swatches are all-or-nothing** — all three swatch rows (Primary, Grey, Neutral) are always visible regardless of step progress.
5. **`useColorSettings` keys things as `step1`, `step2`** — leaks step numbering into the data layer.

---

## Design

### Step Registry

A single source of truth: an ordered array of step definitions.

```ts
// composables/steps/stepRegistry.ts

export interface StepDefinition {
  id: string                        // 'primary-color', 'lightness-distribution', etc.
  title: string
  description: string
  inputComponent: string            // Component name for GeneratorInput
  inputLayout?: 'default' | 'bezier' // Optional layout variant
  leftPanelComponent?: string       // Component for left panel (undefined = keep persistent)
  rightPanelComponent?: string      // Component for right panel (undefined = keep persistent)
  footerComponent?: string          // Extra footer content (undefined = keep persistent)
  unlocks?: string[]                // Swatch row IDs unlocked upon visiting this step
}

export const steps: StepDefinition[] = [
  {
    id: 'primary-color',
    title: 'Primary Color',
    description: 'Set the base hue and saturation for your color palette',
    inputComponent: 'ColorInputControls',
    unlocks: ['primary']
  },
  {
    id: 'lightness-distribution',
    title: 'Lightness Distribution',
    description: 'Adjust the bezier curve to control lightness distribution',
    inputComponent: 'BezierControls',
    inputLayout: 'bezier'
  },
  {
    id: 'lightness-adjustment',
    title: 'Lightness Adjustment',
    description: 'Fine-tune individual color lightness values',
    inputComponent: 'LightnessAdjustmentPanel'
  },
  {
    id: 'hue-spectrum',
    title: 'Hue Spectrum',
    description: 'Expand your palette with additional hue variations',
    inputComponent: 'HueSpectrumControls',
    unlocks: ['grey', 'neutral']
  },
  {
    id: 'export',
    title: 'Export',
    description: 'Export your color palette configuration',
    inputComponent: 'ExportPanel',       // New: move export UI to its own input component
    footerComponent: 'ExportActions'     // Or keep export button in footer
  }
]
```

### Step State Composable

Replace `useCurrentStep()` with a registry-aware composable:

```ts
// composables/steps/useStepNavigation.ts

export function useStepNavigation() {
  const activeStepId = useState<string>('active-step', () => steps[0].id)

  const activeStep     = computed(() => steps.find(s => s.id === activeStepId.value)!)
  const activeIndex    = computed(() => steps.findIndex(s => s.id === activeStepId.value))
  const isFirst        = computed(() => activeIndex.value === 0)
  const isLast         = computed(() => activeIndex.value === steps.length - 1)

  function goTo(id: string) { activeStepId.value = id }
  function next() { if (!isLast.value) activeStepId.value = steps[activeIndex.value + 1].id }
  function prev() { if (!isFirst.value) activeStepId.value = steps[activeIndex.value - 1].id }

  return { steps, activeStep, activeStepId, activeIndex, isFirst, isLast, goTo, next, prev }
}
```

### Swatch Unlocking

Track which swatch rows have been unlocked. Visiting a step unlocks its declared rows. Going back doesn't re-lock them.

```ts
// composables/steps/useSwatchUnlock.ts

export function useSwatchUnlock() {
  const unlockedRows = useState<Set<string>>('unlocked-swatch-rows', () => new Set(['primary']))

  // Called when navigating to a step
  function visitStep(step: StepDefinition) {
    if (step.unlocks) {
      step.unlocks.forEach(row => unlockedRows.value.add(row))
    }
  }

  return { unlockedRows, visitStep }
}
```

Wire `visitStep` into `goTo` / `next` / `prev` so it triggers automatically.

---

## Panel Behavior

### Sidebar (`GeneratorSidebar`)

```
v-for="step in steps"  →  step.id, step.title
:class="{ active: activeStepId === step.id }"
@click="goTo(step.id)"
```

Remove the step number `<span>`. Use the array index + 1 only if a visual number is wanted (display concern, not logic).

### Input Panel (`GeneratorInput`)

Resolve `activeStep.inputComponent` to a dynamic component:

```vue
<component
  :is="resolveComponent(activeStep.inputComponent)"
  v-bind="stepProps"
/>
```

Apply `activeStep.inputLayout` as a CSS class for layout variants (bezier grid vs. default flex). Title and description come from `activeStep.title` / `activeStep.description` — rendered by GeneratorInput, not by each step component.

### Left Panel (`GeneratorLeftPanel`)

If `activeStep.leftPanelComponent` exists, render it. Otherwise show persistent content (empty for now, future: palette metadata/versioning).

### Right Panel (`GeneratorRightPanel`)

If `activeStep.rightPanelComponent` exists, render it. Otherwise show persistent content (empty for now, future: color preview).

### Footer (`GeneratorFooter`)

Persistent content (color sample, dev mode toggle) is always visible. If `activeStep.footerComponent` exists, render it in the middle slot. No more `v-if currentStep === 5`.

### Swatches (`GeneratorSwatches`)

Read `unlockedRows` and conditionally render each row:

```vue
<ColorSwatchRow v-if="unlockedRows.has('primary')" ... />
<ColorSwatchRow v-if="unlockedRows.has('grey')" ... />
<ColorSwatchRow v-if="unlockedRows.has('neutral')" ... />
```

Primary is always unlocked (it's in the initial set). Grey and Neutral unlock when the user reaches the hue-spectrum step.

---

## Data Layer Cleanup

### `useColorSettings`

Rename `step1` / `step2` keys to descriptive names:

```ts
// Before
return { step1: { hue, saturation }, step2: { lightness } }

// After
return { hue, saturation, lightness }
// or group by domain:
return { primary: { hue, saturation }, lightness }
```

### `useSteps` → remove or rename

The current `useSteps()` orchestrator initializes step composables by name. With the registry, each step component can initialize its own composable internally — no need for a single orchestrator that knows about all steps.

**Exception**: `stepLightnessDistribution` must initialize before `useCssVariables` reads its `useState` refs. This init-order dependency should be handled by the plugin (`initColors.client.ts`) or a top-level `useColorSystem()` composable that initializes the data pipeline once — separate from step UI concerns.

---

## File Changes Summary

| Action | File | Notes |
|--------|------|-------|
| **Create** | `composables/steps/stepRegistry.ts` | Step definitions array |
| **Create** | `composables/steps/useStepNavigation.ts` | Replaces `useCurrentStep.ts` |
| **Create** | `composables/steps/useSwatchUnlock.ts` | Tracks visited steps / unlocked rows |
| **Rewrite** | `components/GeneratorInput.vue` | Dynamic `<component :is>` instead of v-if chain |
| **Update** | `components/GeneratorSidebar.vue` | Iterate `steps` array, remove hardcoded 5 |
| **Update** | `components/GeneratorSwatches.vue` | Conditionally render rows based on `unlockedRows` |
| **Update** | `components/GeneratorFooter.vue` | Dynamic footer slot instead of `currentStep === 5` |
| **Update** | `components/GeneratorLeftPanel.vue` | Dynamic content slot |
| **Update** | `components/GeneratorRightPanel.vue` | Dynamic content slot |
| **Rename** | `composables/core/useColorSettings.ts` | Remove `step1`/`step2` keys |
| **Delete** | `composables/ui/useCurrentStep.ts` | Replaced by stepRegistry + useStepNavigation |
| **Delete** | `composables/input/stepFeatureLightnessDistribution.ts` | Unused duplicate |
| **Refactor** | `composables/input/useSteps.ts` | Either delete (each component inits its own) or convert to `useColorSystem()` for data pipeline |

---

## Migration Path

1. Create `stepRegistry.ts` and `useStepNavigation.ts` — new files, nothing breaks
2. Create `useSwatchUnlock.ts`
3. Update `GeneratorSidebar` to use registry — swap `v-for="step in 5"` → `v-for="step in steps"`
4. Update `GeneratorInput` to use dynamic `<component :is>` — biggest change
5. Update `GeneratorFooter` — replace `currentStep === 5` with `activeStep.footerComponent`
6. Update `GeneratorSwatches` — add row visibility gating
7. Wire up left/right panels for dynamic content
8. Rename `useColorSettings` keys, update consumers
9. Delete `useCurrentStep.ts`, dead files
10. Commit
