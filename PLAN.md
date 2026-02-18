# Color Palette Generator - Build Plan

A Nuxt 4 web application for creating color palettes with real-time preview. Users adjust hue and saturation via sliders, see live CSS variable updates, and export configuration.

## Tech Stack

- **Framework**: Nuxt 4 with TypeScript
- **UI Library**: Nuxt UI (latest)
- **Styling**: Tailwind CSS 4
- **Package Manager**: pnpm

## Project Structure

Organize composables by responsibility into subdirectories:

- `core/` for central state management
- `input/` for form field definitions
- `output/` for export functionality
- `ui/` for DOM/CSS synchronization

```
app/
├── app.vue                 # Root layout with header, footer, color mode toggle
├── app.config.ts           # Default color values (hue, saturation, lightness)
├── assets/css/main.css     # CSS variable definitions for color palette
├── components/             # Reusable UI components
├── composables/
│   ├── core/               # Central state management
│   ├── input/              # Form field definitions
│   ├── output/             # Export functionality
│   └── ui/                 # CSS variable synchronization
├── pages/
│   ├── index.vue           # Landing page
│   └── generator.vue       # Main generator with sliders
├── plugins/                # Client-side initialization
└── types/                  # TypeScript interfaces
```

## Features to Implement

### 1. Project Setup

Initialize a new Nuxt 4 project with Nuxt UI, Tailwind CSS 4, and ESLint. Configure the Nuxt config to enable devtools, import the main CSS file, and set up auto-imports for nested composable directories.

ESLint should be configured with these stylistic rules: semicolons required, 4-space indentation, and double quotes for strings.

### 2. App Configuration

Create an app config that stores default color values. These values serve as the initial state when the application loads. Store hue (0-360 degrees), saturation (0-100 percent), and lightness (0-100 percent, reserved for future use). Also configure the Nuxt UI neutral color.

### 3. TypeScript Interfaces

Define interfaces for dynamic form field generation. A field definition should include an id, label, input type, optional min/max/step constraints, a reactive value reference, and an optional unit string for display. Also define a step content interface that groups a title, description, and array of fields together.

### 4. CSS Variable System

The core mechanism for real-time color updates works by overriding Nuxt UI's primary color palette using CSS custom properties. In the main CSS file, import Tailwind and Nuxt UI, then define the `--ui-color-primary-*` variables (shades 50 through 950) using HSL notation.

Each shade references three CSS variables that JavaScript will update:

- `--hue-slider-value` (the hue degree, no unit)
- `--saturation-slider-value` (percentage with % unit)
- `--lightness-slider-value` (percentage with % unit)

The lightness for each shade should be hardcoded (95% for shade 50 down to 5% for shade 950), while hue and saturation come from the CSS variables. This allows all Nuxt UI components using the primary color to update instantly when sliders change.

### 5. Composables

#### 5.1 Core: Color Settings

Create a composable that serves as the single source of truth for color values. Use Nuxt's `useState` to create SSR-safe reactive state that persists across components. Initialize each value from the app config. Return the values organized by logical grouping (e.g., step1 contains hue and saturation, step2 contains lightness).

#### 5.2 Input: Step Definition

Create a composable that returns the field definitions for the generator form. It should use the color settings composable to get reactive value references, and return a computed object containing a title, description, and array of field definitions. Each field should specify its id, label, type as "range", min/max bounds appropriate for the value (0-360 for hue, 0-100 for percentages), the reactive value reference, and the display unit.

This composable should also initialize the CSS variable synchronization by calling the appropriate UI composable.

#### 5.3 UI: CSS Variable Synchronization

Create a composable that keeps the DOM CSS variables in sync with the reactive state. On mount, set the initial CSS variable values on the document root element. Then set up watchers for each color value that update the corresponding CSS variable whenever the value changes. Include a client-side check before DOM manipulation to avoid SSR issues.

#### 5.4 Output: Export Config

Create a composable that generates exportable configuration and handles clipboard copying. It should read the current values from the color settings and generate a valid `app.config.ts` string that could be pasted into a project. Provide a function that copies this generated config to the clipboard, with appropriate error handling.

### 6. Client Plugin

Create a client-only plugin that initializes the CSS variables when the app loads. This ensures colors are set correctly even on pages that don't use the generator composables. Read the default values from the app config and set them on the document root element.

### 7. Pages

#### 7.1 Landing Page

Create a landing page with a hero section containing the application title, a description of what the tool does, and a prominent call-to-action button linking to the generator page. Below the hero, display feature cards highlighting the key capabilities (mention bezier curves, hue adjustments, and export functionality as planned features).

Use Nuxt UI components throughout for consistency.

#### 7.2 Generator Page

Create the main generator page where users interact with sliders. Display a title and instructional description. Iterate over the fields from the step composable and render a Nuxt UI slider component for each one, bound to the field's reactive value. Show the current value with its unit next to each slider.

Include an export button that triggers the clipboard copy functionality, and a back button to return to the landing page.

### 8. Root Layout

Set up the root app.vue with a standard Nuxt UI application shell. Include a header with the app logo, navigation, a color mode toggle button, and a link to the GitHub repository. The main content area should render the current page. Add a separator and footer at the bottom.

Configure appropriate SEO meta tags for the application.

## Testing Checklist

- [ ] Sliders update CSS variables in real-time
- [ ] All Nuxt UI components reflect the new primary color
- [ ] Color mode toggle (light/dark) works
- [ ] Export copies valid TypeScript config to clipboard
- [ ] Initial colors load from app.config.ts
- [ ] No hydration mismatches (CSS variables set before render)
- [ ] TypeScript compiles without errors
- [ ] ESLint passes with configured rules

## Next Phase: Advanced Features

See [PLAN_EXPANSION.md](PLAN_EXPANSION.md) for the detailed plan to implement:

- Step 2: Bezier curve lightness controls
- Step 3: Hue-based lightness adjustments
- Step 4: 12-hue grid with individual offsets
- Step 5: Enhanced export with full config snapshot
- Color input parser (RGB/HEX/HSL/OKLCH)
- Palette system presets (Practical/Tailwind)

## Future Expansion Points

These areas are prepared for extension:

1. **Multiple color palettes**: Could extend to generate secondary, accent colors
2. **Export formats**: Add CSS, SCSS, JSON export options beyond app.config
3. **Color accessibility**: WCAG contrast ratio checking
4. **Visual curve editor**: Canvas-based bezier curve visualization
