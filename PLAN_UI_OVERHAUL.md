# UI Overhaul Plan

## Overview

Restructure the CSS color generator UI from accordion-based single-column layout to wizard-style layout with persistent preview areas and step-contextual controls.

## Design References

- `/ui-designs/Step 1 - areas.svg` - Layout grid with persistent and contextual areas
- `/ui-designs/Step 1 - color input.svg` - Step 1 content and sidebar navigation

### Area Types

- **Persistent (dark #46706D)**: Always visible - Swatches preview
- **Contextual (cyan #B4D3D1)**: Changes per step - Header, primary/secondary controls, right panel

## Target Layout

```
┌─────────────────────────────────────────────────────────────┐
│ .layout (flex-row, gap: 10px, height: 100vh)                │
├──────────────┬──────────────────────────────────────────────┤
│ .left-sidebar│ .right-content                               │
│ (20%)        │ (flex: 1)                                    │
│              │                                              │
│ grid-rows:   │ grid: 20% auto 20% (cols)                    │
│ 1fr 3fr      │       4fr 2fr auto 2fr (rows)                │
│ auto         │                                              │
│ 3fr 1fr      │ ┌─────────┬─────────────────┬──────────┐     │
│              │ │         │ Step Header     │          │     │
│ ┌──────────┐ │ │         │ (4fr row)       │          │     │
│ │ Logo     │ │ ├─────────┼─────────────────┼──────────┤     │
│ │ (1fr)    │ │ │         │ Primary Ctrl    │          │     │
│ ├──────────┤ │ │         │ (2fr row)       │          │     │
│ │ Step Nav │ │ ├─────────┼─────────────────┼──────────┤     │
│ │ (3fr)    │ │ │ Left    │ SWATCHES        │ Right    │     │
│ ├──────────┤ │ │ (20%)   │ (PERSISTENT)    │ Panel    │     │
│ │ Theme    │ │ │         │ (auto row)      │ (20%)    │     │
│ │ (auto)   │ │ ├─────────┼─────────────────┼──────────┤     │
│ ├──────────┤ │ │         │ Secondary Ctrl  │          │     │
│ │ (3fr)    │ │ │         │ (2fr row)       │          │     │
│ ├──────────┤ │ └─────────┴─────────────────┴──────────┘     │
│ │ Export   │ │                                              │
│ │ (1fr)    │ │                                              │
│ └──────────┘ │                                              │
└──────────────┴──────────────────────────────────────────────┘
```

## CSS Layout Code

```css
.layout {
  display: flex;
  flex-direction: row;
  gap: 10px;
  height: 100vh;
  padding: 10px;
}

.left-sidebar {
  width: 20%;
  display: grid;
  grid-template-rows: 1fr 3fr auto 3fr 1fr;
  gap: 10px;
}

.right-content {
  flex: 1;
  display: grid;
  grid-template-columns: 20% auto 20%;
  grid-template-rows: 4fr 2fr auto 2fr;
  gap: 10px;
}

/* Grid area assignments */
.step-header {
  grid-column: 2;
  grid-row: 1;
}
.primary-controls {
  grid-column: 2;
  grid-row: 2;
}
.swatches-preview {
  grid-column: 2;
  grid-row: 3;
}
.secondary-controls {
  grid-column: 2;
  grid-row: 4;
}
.right-panel {
  grid-column: 3;
  grid-row: 2 / 5;
}
```

## New Architecture

### Current Structure (to be replaced)

```
app/
├── pages/
│   └── generator.vue          # 475 lines, 4 StepAccordion inline templates
├── components/
│   └── StepAccordion.vue      # Accordion wrapper (will be removed)
└── composables/
    └── input/
        ├── useSteps.ts        # Step orchestration
        ├── stepBaseColor.ts
        ├── stepLightnessDistribution.ts
        ├── stepLightnessAdjustment.ts
        └── stepHueSpectrum.ts
```

### New Structure

```
app/
├── pages/
│   └── generator.vue          # Slim layout shell with dynamic components
├── components/
│   ├── layout/
│   │   ├── LeftSidebar.vue
│   │   ├── StepNavigation.vue
│   │   ├── ThemeSelector.vue
│   │   └── ExportButton.vue
│   ├── output/
│   │   └── SwatchesPreview.vue    # PERSISTENT - always visible
│   └── steps/
│       ├── StepHeader.vue         # Dynamic per step
│       ├── step1/
│       │   ├── Step1Primary.vue   # Color input, hue/sat sliders
│       │   ├── Step1Secondary.vue # Additional controls
│       │   └── Step1RightPanel.vue
│       ├── step2/
│       │   ├── Step2Primary.vue   # Bezier editor
│       │   ├── Step2Secondary.vue
│       │   └── Step2RightPanel.vue
│       ├── step3/
│       │   └── ...
│       └── step4/
│           └── ...
└── composables/
    └── ui/
        └── useCurrentStep.ts      # NEW: step state & component mapping
```

## New Composable: useCurrentStep

```typescript
// app/composables/ui/useCurrentStep.ts
export function useCurrentStep() {
  const currentStep = ref<1 | 2 | 3 | 4>(1);

  const stepComponents = {
    1: {
      header: "Step1Header",
      primary: "Step1Primary",
      secondary: "Step1Secondary",
      rightPanel: "Step1RightPanel",
    },
    2: {
      /* ... */
    },
    3: {
      /* ... */
    },
    4: {
      /* ... */
    },
  };

  const currentComponents = computed(() => stepComponents[currentStep.value]);

  function goToStep(step: 1 | 2 | 3 | 4) {
    currentStep.value = step;
  }

  function nextStep() {
    if (currentStep.value < 4) currentStep.value++;
  }

  function prevStep() {
    if (currentStep.value > 1) currentStep.value--;
  }

  return {
    currentStep,
    currentComponents,
    goToStep,
    nextStep,
    prevStep,
  };
}
```

## Implementation Tasks

### Phase 1: Step 1 Implementation

- [ ] **Task 1.1**: Create `useCurrentStep` composable
- [ ] **Task 1.2**: Create layout components
  - [ ] `LeftSidebar.vue`
  - [ ] `StepNavigation.vue`
  - [ ] `ThemeSelector.vue` (extract from generator.vue)
  - [ ] `ExportButton.vue`
- [ ] **Task 1.3**: Create `SwatchesPreview.vue` (persistent)
  - Extract swatch rendering from current generator.vue
- [ ] **Task 1.4**: Create Step 1 components
  - [ ] `Step1Primary.vue` - Color input field, hue slider, saturation slider
  - [ ] `Step1Secondary.vue` - Additional Step 1 controls
  - [ ] `Step1RightPanel.vue` - Step 1 right panel content
- [ ] **Task 1.5**: Refactor `generator.vue` to new grid layout
- [ ] **Task 1.6**: Remove `StepAccordion.vue` dependency
- [ ] **Task 1.7**: Test Step 1 functionality

### Phase 2: Remaining Steps

- [ ] **Task 2.1**: Create New steps
- [ ] **Task 2.2**: Full integration testing

## Data Flow

```
┌─────────────────────────────────────────────────────────────┐
│                    generator.vue                            │
│  ┌─────────────────────────────────────────────────────┐   │
│  │              useCurrentStep()                        │   │
│  │  currentStep, goToStep(), currentComponents          │   │
│  └───────────────────────┬─────────────────────────────┘   │
│                          │                                  │
│  ┌───────────────────────▼─────────────────────────────┐   │
│  │              useSteps() (existing)                   │   │
│  │  Provides step-specific composables                  │   │
│  └───────────────────────┬─────────────────────────────┘   │
│                          │                                  │
│  ┌───────────────────────▼─────────────────────────────┐   │
│  │         Step-specific composables                    │   │
│  │  stepBaseColor, stepLightnessDistribution, etc.      │   │
│  └───────────────────────┬─────────────────────────────┘   │
│                          │                                  │
│                          ▼                                  │
│  ┌─────────────────────────────────────────────────────┐   │
│  │              Dynamic Components                      │   │
│  │  <component :is="currentComponents.primary" />       │   │
│  └─────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
```

## Step Content Mapping

| Step | Header                   | Primary Controls             | Secondary Controls        | Right Panel   |
| ---- | ------------------------ | ---------------------------- | ------------------------- | ------------- |
| 1    | "Primary Color"          | Color input, Hue/Sat sliders | -                         | Color info    |
| 2    | "Lightness Distribution" | Bezier curve editor          | Swatch rows preview       | Curve presets |
| 3    | "Lightness Adjustment"   | HSL adjustment sliders       | Per-swatch overrides      | -             |
| 4    | "Hue Spectrum"           | Hue spectrum controls        | HueSpectrumRow components | -             |

## Notes

Persistent areas:

- The entire left bar with logo, title, stepper and the primary swatch
- The central areas showing the results of the user input, the swatches
  Dynamic areas
- All other dynamic areas update when `currentStep` changes
- step title and the 4 step input zones: top, left, right and bottom. Every zone can be empty
- Existing composables (`stepBaseColor`, etc.) remain unchanged
- Only the UI layer is restructured
