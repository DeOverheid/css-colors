# Export System Plan

## Overview

Three distinct export types serving different purposes:

| Export Type     | Purpose                 | Format                   | Audience  |
| --------------- | ----------------------- | ------------------------ | --------- |
| **Dev Export**  | Update theme defaults   | TypeScript config object | Developer |
| **User Export** | Use in Tailwind project | Tailwind CSS config      | End user  |
| **URL Params**  | Bookmark/share settings | Query string             | End user  |

---

## 1. Dev Export (Internal)

**Purpose**: Export current settings to update theme defaults in codebase.

**Contains**:

- Bezier curve values
- Lightness adjustment settings (darkening/brightening ranges)
- Hue offsets per color (if modified from theme defaults)
- Any theme-specific overrides

**Format**: TypeScript object matching theme structure

```typescript
// Dev Export for Tailwind theme
export const tailwindTheme: ThemeConfig = {
    id: "tailwind",
    name: "Tailwind",
    bezier: { x1: 0.08, y1: 0.21, x2: 0.45, y2: 0.72 },
    lightnessAdjustment: {
        enabled: true,
        darkening: { ... },
        brightening: { ... }
    },
    // ... full theme config
}
```

**UI**: Button in dev mode only, copies to clipboard

---

## 2. User Export (Tailwind Config)

**Purpose**: Generate ready-to-use Tailwind CSS color config.

**Contains**:

- All color scales with computed hex values
- Proper Tailwind structure
- Only the colors (no internal settings)

**Format**: Tailwind `colors` config

```javascript
// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      colors: {
        red: {
          50: '#fef2f2',
          100: '#fee2e2',
          // ... all 11 shades
          950: '#450a0a'
        },
        orange: { ... },
        // ... all 17 colors
      }
    }
  }
}
```

**Variations**:

- JavaScript object (default)
- CSS custom properties (`--color-red-50: #fef2f2;`)
- JSON (for non-JS tooling)

**UI**: Export button with format selector dropdown

---

## 3. URL Parameters (Shareable Link)

**Purpose**: Bookmark settings, share with others, restore previous work.

**Contains** (encoded in URL):

- Theme ID
- Primary hue & saturation
- Bezier points (if different from theme default)
- Lightness adjustment overrides (if modified)
- Hue offsets (only if modified from defaults)

**Format**: Query string with compressed values

```
/generator?t=tailwind&h=217&s=91&b=0.08,0.21,0.45,0.72&la=1,1,30,210,15,0.48,9.5,0.44,1,210,300,15,1,12,0.2
```

**Encoding Strategy**:

- `t` = theme ID
- `h` = hue (0-360)
- `s` = saturation (0-100)
- `b` = bezier (x1,y1,x2,y2)
- `la` = lightness adjustment (comma-separated values)
- `ho` = hue offsets (only if modified, base64 or delta encoding)

**UI**:

- "Copy Link" button generates shareable URL
- Settings auto-load from URL on page visit
- Toast notification: "Settings loaded from URL"

---

## Implementation Roadmap

### Phase 1: Refactor Export Architecture

```
composables/output/
├── useExportConfig.ts      # Orchestrator
├── exporters/
│   ├── types.ts            # Shared interfaces
│   ├── devExport.ts        # Dev config export
│   ├── tailwindExport.ts   # User Tailwind config
│   ├── cssVariables.ts     # CSS custom properties
│   └── urlParams.ts        # URL encode/decode
```

### Phase 2: Dev Export

- [ ] Create `devExport.ts`
- [ ] Export full theme config structure
- [ ] Add "Dev Export" button (visible in dev mode only)
- [ ] Include lightness adjustment settings

### Phase 3: User Export (Tailwind)

- [ ] Create `tailwindExport.ts`
- [ ] HSL to Hex conversion utility
- [ ] Generate all color scales with computed values
- [ ] Format selector (JS/CSS/JSON)
- [ ] Add export UI in generator

### Phase 4: URL Parameters

- [ ] Create `urlParams.ts` with encode/decode functions
- [ ] Integrate with Vue Router (watch for query changes)
- [ ] "Copy Link" button
- [ ] Auto-restore on page load
- [ ] Handle missing/invalid params gracefully

### Phase 5: Polish

- [ ] Toast notifications for copy actions
- [ ] Preview modal before export
- [ ] Keyboard shortcuts (Cmd+Shift+E for export)

---

## Questions to Consider

1. **URL length limits**: Should we use localStorage + short ID for complex configs?
2. **Hue offsets**: Include all 17 in URL, or only modified ones?
3. **Version handling**: What if URL params format changes in future?
4. **Theme-specific URLs**: Should URL include theme, or work across themes?

---

## File Structure After Implementation

```
composables/output/
├── useExportConfig.ts      # Main orchestrator (refactored)
├── exporters/
│   ├── types.ts            # ExportFormat, ExportOptions interfaces
│   ├── devExport.ts        # generateDevExport()
│   ├── tailwindExport.ts   # generateTailwindConfig()
│   ├── cssVariables.ts     # generateCssVariables()
│   └── urlParams.ts        # encodeToUrl(), decodeFromUrl()

utils/
├── colorConversion.ts      # hslToHex(), hslToRgb()
```
