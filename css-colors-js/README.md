# CSS Color System

A comprehensive, mathematical color system built with native CSS custom properties, featuring 12 semantic color palettes with 108+ color variations.

## Architecture

```
tokens.css     → Global configuration (hue modifier)
  ↓
lists.css      → Mathematical foundations (hue, saturation, lightness, alpha)
  ↓
colors.css     → 12 semantic color palettes (108 colors)
greys.css      → Neutrals and alpha variations
  ↓
demo.css       → BEM styling patterns
  ↓
demo.html      → Interactive demonstration
```

## Features

- **Mathematical Foundation**: Logarithmic lightness curve for perceptually balanced color steps
- **Semantic Naming**: 12 intuitive color names (crimson, flame, wheat, lime, etc.)
- **Global Control**: Single hue modifier affects entire system uniformly
- **Alpha Variations**: Complete transparency ranges for black and white
- **No Preprocessing**: Pure CSS custom properties, no SASS/LESS required
- **Modular Design**: Import only what you need

## Color Palettes

| Hue | Name | Angle | Personality |
|-----|------|-------|-------------|
| Crimson | Primary Brand | 0° | Bold, energetic red |
| Flame | Orange Energy | 30° | Warm, dynamic orange |
| Wheat | Golden Warmth | 60° | Friendly, approachable yellow |
| Lime | Fresh Growth | 90° | Vibrant, natural yellow-green |
| Grass | Natural Green | 120° | Trustworthy, stable green |
| Sea | Ocean Depths | 150° | Calming blue-green |
| Sky | Clear Cyan | 180° | Open, airy blue |
| Corn | Deep Blue | 210° | Professional, reliable |
| Dusk | Royal Purple | 240° | Sophisticated purple-blue |
| Plum | Rich Purple | 270° | Luxurious, creative |
| Candy | Vibrant Magenta | 300° | Playful, energetic |
| Salmon | Soft Pink | 330° | Gentle, warm pink |

## Usage

```css
/* Import the complete system */
@import url("colors.css");
@import url("greys.css");

/* Use semantic color variables */
.button {
  background: var(--crimson-medium);
  color: var(--white);
  border: 1px solid var(--crimson-dark);
}

.overlay {
  background: var(--black-50); /* 50% transparent black */
}
```

## Customization

### Global Hue Shift
```css
/* In tokens.css */
--hue-modifier: 15; /* Shift all colors +15 degrees */
```

### Saturation Adjustment
```css
/* Change saturation level for any palette */
--crimson-medium: hsl(var(--hue-crimson) var(--saturation-muted) var(--lightness-medium));
```

### Add New Palette
```css
/* In lists.css, add new hue */
--hue-custom: calc(45deg + var(--hue-modifier));

/* In colors.css, create palette */
--custom-medium: hsl(var(--hue-custom) var(--saturation-medium) var(--lightness-medium));
```

## Development

Open `css-colors.code-workspace` in VS Code for optimized development experience with:
- CSS IntelliSense and validation
- Color highlighting and previews
- File nesting organization
- Built-in tasks for testing
- Recommended extensions

## Files

- `tokens.css` - Global configuration tokens
- `lists.css` - Mathematical color value foundations
- `colors.css` - 12 semantic color palettes (108 colors)
- `greys.css` - Grayscale and alpha transparency variations
- `demo.css` - BEM methodology styling examples
- `color-system-demo.html` - Interactive color demonstration
- `css-colors.code-workspace` - VS Code workspace configuration

## Mathematical Foundation

Lightness values use a logarithmic curve for perceptually even steps:
```
f(x) = 98 - 80 * (log(x) / log(100))^0.7
```

This creates more contrast in mid-tones where the human eye is most sensitive to differences.

## Browser Support

- Modern browsers supporting CSS custom properties
- IE 11+ with PostCSS custom properties plugin
- No JavaScript required