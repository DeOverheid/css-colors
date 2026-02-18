# Derived Colors Feature - Build Plan

Add secondary and tertiary color generation based on color theory harmonies, with an interactive hue-drift slider for fine-tuning.

## Overview

Extend the generator with a new section that:
1. Displays the primary color as reference
2. Allows selection of color harmony schemes
3. Provides a hue-drift slider for fine-tuning derived colors
4. Shows primary, secondary, and tertiary colors side-by-side
5. Adds semantic color samples (success, warning, error, info)

## Color Harmony Schemes

### Supported Harmonies

| Harmony | Secondary Hue Offset | Tertiary Hue Offset | Description |
|---------|---------------------|---------------------|-------------|
| **Complementary** | +180° | +180° | Opposite on color wheel; secondary and tertiary are the same |
| **Split Complementary** | +150° | +210° | Two colors adjacent to the complement |
| **Triadic** | +120° | +240° | Three evenly spaced colors |
| **Analogous** | +30° | +60° | Adjacent colors on the wheel |
| **Tetradic (Square)** | +90° | +180° | Four evenly spaced colors |
| **Monochromatic** | 0° | 0° | Same hue with varied saturation/lightness |

### Hue Drift Slider Behavior

The drift slider modifies the offset angles for secondary and tertiary colors:

- **Default (center, value 0)**: Standard harmony offsets
- **Drag left (negative)**: Colors converge toward complement (closer together)
- **Drag right (positive)**: Colors diverge (spread further apart)

**Mathematical formula:**
```
adjustedOffset = baseOffset + (driftValue * driftMultiplier)
```

Where:
- `driftValue`: -50 to +50 (slider range)
- `driftMultiplier`: Varies by harmony (e.g., 0.6 for split complementary)

**Split Complementary Example:**
- Left drift (-50): 150° → 165°, 210° → 195° (converge toward 180°)
- Center (0): 150°, 210° (standard split)
- Right drift (+50): 150° → 120°, 210° → 240° (approach triadic)

## Technical Implementation

### 1. New Composable: `composables/core/useColorHarmony.ts`

```typescript
export interface ColorHarmony {
    id: string;
    name: string;
    description: string;
    /** Base offset for secondary color (degrees) */
    secondaryOffset: number;
    /** Base offset for tertiary color (degrees) */
    tertiaryOffset: number;
    /** How much drift affects offsets (multiplier) */
    driftSensitivity: number;
    /** Whether monochromatic (uses saturation/lightness variation) */
    isMonochromatic?: boolean;
}

export interface DerivedColor {
    hue: number;
    saturation: number;
    lightness: number;
    label: string;
}
```

**Responsibilities:**
- Define available harmony schemes
- Calculate derived hues based on primary + harmony + drift
- Provide reactive state for selected harmony and drift value
- Export computed secondary/tertiary colors

### 2. New Composable: `composables/core/useSemanticColors.ts`

```typescript
export interface SemanticColor {
    id: string;
    name: string;
    hue: number;
    saturation: number;
    lightness: number;
    description: string;
}

export const semanticColors: SemanticColor[] = [
    { id: 'success', name: 'Success', hue: 142, saturation: 76, lightness: 36, description: 'Confirmations, completed actions' },
    { id: 'warning', name: 'Warning', hue: 38, saturation: 92, lightness: 50, description: 'Alerts, caution states' },
    { id: 'error', name: 'Error', hue: 0, saturation: 84, lightness: 60, description: 'Errors, destructive actions' },
    { id: 'info', name: 'Information', hue: 217, saturation: 91, lightness: 60, description: 'Informational messages' }
];
```

### 3. New Component: `components/ColorHarmonySelector.vue`

**Props:**
- `primaryHue: number`
- `primarySaturation: number`
- `primaryLightness: number`

**Emits:**
- `update:harmony` - selected harmony ID
- `update:drift` - drift slider value

**Template structure:**
```
┌─────────────────────────────────────────────────────────────┐
│ Derived Colors                                              │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  Primary (reference)    Secondary          Tertiary         │
│  ┌──────────────┐       ┌──────────────┐   ┌──────────────┐│
│  │              │       │              │   │              ││
│  │   Primary    │       │  Secondary   │   │   Tertiary   ││
│  │   Sample     │       │   Sample     │   │   Sample     ││
│  │              │       │              │   │              ││
│  └──────────────┘       └──────────────┘   └──────────────┘│
│  HSL: 220°, 70%, 50%    HSL: 10°, 70%, 50%  HSL: 70°, ...  │
│                                                             │
├─────────────────────────────────────────────────────────────┤
│ Color Harmony                                               │
│                                                             │
│  ○ Complementary     ○ Split Complementary   ○ Triadic     │
│  ○ Analogous         ○ Square                ○ Monochrome  │
│                                                             │
│ Hue Drift                                                   │
│  Converge ◄━━━━━━━━━━━━●━━━━━━━━━━━━► Diverge              │
│                     [0]                                     │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

### 4. New Component: `components/SemanticColorSamples.vue`

**Template structure:**
```
┌─────────────────────────────────────────────────────────────┐
│ Semantic Colors                                             │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  ┌─────────┐  ┌─────────┐  ┌─────────┐  ┌─────────┐       │
│  │ Success │  │ Warning │  │  Error  │  │  Info   │       │
│  │  Green  │  │ Orange  │  │   Red   │  │  Blue   │       │
│  └─────────┘  └─────────┘  └─────────┘  └─────────┘       │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

### 5. Update `pages/generator.vue`

Add new section after the bezier curve section:

```vue
<!-- Derived Colors Section -->
<div class="derived-colors-section">
    <h4>Derived Colors</h4>
    <p class="description">
        Select a color harmony to generate secondary and tertiary colors.
        Use the drift slider to fine-tune the hue relationships.
    </p>
    
    <ColorHarmonySelector
        :primary-hue="colorSettings.step1.hue.value"
        :primary-saturation="colorSettings.step1.saturation.value"
        :primary-lightness="markedSampleLightness"
    />
</div>

<!-- Semantic Colors Section -->
<div class="semantic-colors-section">
    <h4>Semantic Colors</h4>
    <p class="description">
        Standard UI feedback colors for your design system.
    </p>
    
    <SemanticColorSamples />
</div>
```

### 6. Update Color Settings

Extend `composables/core/useColorSettings.ts`:

```typescript
export function useColorSettings() {
    // ... existing code ...
    
    // Step 3: Derived Colors
    const selectedHarmony = useState("color-harmony", () => "split-complementary");
    const hueDrift = useState("hue-drift", () => 0);
    
    return {
        step1: { hue, saturation },
        step2: { lightness },
        step3: { selectedHarmony, hueDrift }
    };
}
```

## UI/UX Details

### Color Swatch Display

Each derived color swatch should show:
- Large color sample (same size as primary in current UI)
- Label (Primary, Secondary, Tertiary)
- HSL values below the sample
- Optional: hex value on hover/click

### Harmony Selection

- Radio button group (styled similar to existing theme selector)
- Each option shows harmony name
- Tooltip with description on hover

### Drift Slider

- Range input: -50 to +50
- Default: 0 (center)
- Labels at edges: "Converge" (left) / "Diverge" (right)
- Current value displayed below slider
- Instant preview of color changes

### Semantic Colors

- Four fixed swatches in a row
- Labels below each: Success, Warning, Error, Info
- Standard hue values (not affected by drift slider)
- Consistent lightness/saturation for accessibility

## Hue Calculation Logic

```typescript
function calculateDerivedHues(
    primaryHue: number,
    harmony: ColorHarmony,
    drift: number
): { secondary: number; tertiary: number } {
    const driftFactor = drift / 50; // Normalize to -1 to 1
    
    if (harmony.isMonochromatic) {
        return { secondary: primaryHue, tertiary: primaryHue };
    }
    
    // Apply drift to offsets
    const secondaryAdjustment = driftFactor * harmony.driftSensitivity * 30;
    const tertiaryAdjustment = driftFactor * harmony.driftSensitivity * 30 * -1;
    
    const secondaryHue = normalizeHue(
        primaryHue + harmony.secondaryOffset + secondaryAdjustment
    );
    const tertiaryHue = normalizeHue(
        primaryHue + harmony.tertiaryOffset + tertiaryAdjustment
    );
    
    return { secondary: secondaryHue, tertiary: tertiaryHue };
}

function normalizeHue(hue: number): number {
    return ((hue % 360) + 360) % 360;
}
```

## Export Updates

The export config should include the derived color information:

```typescript
export default {
    colors: {
        primary: { hue: 220, saturation: 70 },
        secondary: { hue: 10, saturation: 70 },
        tertiary: { hue: 70, saturation: 70 },
        harmony: 'split-complementary',
        hueDrift: 0
    },
    semantic: {
        success: { hue: 142, saturation: 76, lightness: 36 },
        warning: { hue: 38, saturation: 92, lightness: 50 },
        error: { hue: 0, saturation: 84, lightness: 60 },
        info: { hue: 217, saturation: 91, lightness: 60 }
    }
}
```

## Implementation Order

1. **Phase 1: Core Logic**
   - [ ] Create `useColorHarmony.ts` composable with harmony definitions
   - [ ] Add hue calculation functions
   - [ ] Update `useColorSettings.ts` with step3 values

2. **Phase 2: Components**
   - [ ] Create `ColorHarmonySelector.vue` with radio buttons and slider
   - [ ] Create `DerivedColorSwatch.vue` for displaying single derived color
   - [ ] Create `SemanticColorSamples.vue` for the four semantic colors

3. **Phase 3: Integration**
   - [ ] Add new sections to `generator.vue`
   - [ ] Style the new components to match existing UI
   - [ ] Add CSS variables for derived colors

4. **Phase 4: Export**
   - [ ] Update `useExportConfig.ts` to include derived colors
   - [ ] Update CSS variable output

## Future Enhancements

- **Accessibility checker**: Show contrast ratios between colors
- **Custom offset entry**: Allow manual degree input for advanced users
- **Preset palettes**: Save/load favorite harmony configurations
- **Color blindness simulation**: Preview how colors appear to different color vision types
- **Semantic color customization**: Allow users to override default semantic colors
