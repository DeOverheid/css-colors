# Color Palette Generator

[![Nuxt UI](https://img.shields.io/badge/Made%20with-Nuxt%20UI-00DC82?logo=nuxt&labelColor=020420)](https://ui.nuxt.com)

A web application for creating beautiful, accessible color palettes with mathematical precision. Generate full color systems with lightness curves and hue adjustments.

## Features

- **Bezier Curves** - Control lightness distribution with precision using cubic bezier curves
- **Hue Adjustments** - Fine-tune individual hues with light and dark offset controls
- **Export Ready** - Export your palette configurations in multiple formats

## Getting Started

### Prerequisites

- Node.js 18+
- pnpm 10.28.2+ (specified in `packageManager`)

### Installation

```bash
pnpm install
```

### Development

Start the development server on `http://localhost:3000`:

```bash
pnpm dev
```

### Build for Production

```bash
pnpm build
```

Locally preview production build:

```bash
pnpm preview
```

### Linting & Type Checking

```bash
pnpm lint        # Run ESLint
pnpm typecheck   # Run TypeScript type checking
```

### Generate Static Site

Generate a fully static version for deployment:

```bash
pnpm generate
```

Output will be in `.output/public/`.

### Deploy to FTP

Deploy the static site to an FTP server:

```bash
pnpm ftp
```

**First-time setup:**

1. Copy `scripts/deploy.template.mjs` to `scripts/deploy.mjs`
2. Edit `deploy.mjs` and fill in your FTP host, user, and remote path
3. The `deploy.mjs` file is gitignored (credentials stay local)

This will:

1. Generate the static site
2. Prompt for FTP password only
3. Upload and sync files to your server

## Project Structure

```
app/
├── components/     # Reusable Vue components
├── composables/    # Vue composables organized by function
│   ├── core/       # Core color settings and state management
│   ├── input/      # Step-based input handling (base color, lightness, settings)
│   ├── output/     # Export functionality
│   └── ui/         # CSS variable generation
├── pages/          # Route pages (index, generator)
├── assets/         # CSS and static assets
└── app.config.ts   # Default color configuration
```

## Configuration

Default color values can be modified in `app/app.config.ts`:

```typescript
export default defineAppConfig({
  colors: {
    hue: 186,
    saturation: 50,
    lightness: 66,
  },
});
```

## Tech Stack

- [Nuxt 4](https://nuxt.com/) - Vue.js framework
- [Nuxt UI](https://ui.nuxt.com/) - UI component library
- [Tailwind CSS 4](https://tailwindcss.com/) - Utility-first CSS
- [TypeScript](https://www.typescriptlang.org/) - Type safety
