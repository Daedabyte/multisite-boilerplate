# CLAUDE.md - AI Assistant Guide

This document provides guidelines for AI assistants (Claude, GPT, etc.) working with this Astro boilerplate.

## Tools & Workflow

- **Guidelines**: Read relevant `.ai/guidelines/` files before coding
- **Dev Server**: Run `npm run dev` to start the development server
- **Build**: Run `npm run build` to create production build
- **Preview**: Run `npm run preview` to preview production build locally
- **TypeScript**: Run `npx astro check` to validate TypeScript before finalizing

## Guidelines Reference

Detailed development guidelines are organized in `.ai/guidelines/`:

| File | Contents |
|------|----------|
| `project.md` | Contributing to boilerplate, best practices, documentation |
| `site.md` | Building client sites, setup, customization, workflows |
| `components.md` | Component architecture, patterns, documentation |
| `astro.md` | Astro-specific patterns, imports, props, slots |
| `typescript.md` | TypeScript/JavaScript architecture, behaviors |
| `sass.md` | SCSS styling architecture, color system, responsive design |
| `naming.md` | BEM class naming, file naming conventions |
| `data.md` | Content data patterns, site configuration |
| `integrations.md` | External integrations (Web3Forms, analytics, etc.) |

## Quick Start for New Sites

1. **Check for `site-blueprint.json`** - If it exists, use it to drive all setup decisions
2. **Configure site data** - Update `src/data/config.ts` and `src/data/site/navigation.ts`
3. **Set brand colors** - Modify `src/styles/abstracts/_colors.scss`
4. **Update types** - Create/update type definitions in `src/types/`
5. **Create content/data** - Add site relevant/reusable data in `src/data/content/`
6. **Build pages** - Compose pages using components and generated content in `src/pages/`

## Key Principles

- **TypeScript everywhere** - All JavaScript and data files use TypeScript
- **Path aliases** - Use `@components`, `@data`, `@types`, `@assets`, `@styles`, `@scripts`
- **BEM class names** - Block__Element--Modifier pattern
- **Data attributes** - JavaScript behaviors initialized via `data-*` attributes
- **Semantic HTML** - Use appropriate elements (`<section>`, `<nav>`, `<article>`)
- **Accessibility first** - Include ARIA attributes, focus management, keyboard support

## Common Tasks

| Task | Location |
|------|----------|
| Site metadata | `src/data/config.ts` |
| Navigation | `src/data/site/navigation.ts` |
| Page content | `src/data/content/*.ts` |
| Brand colors | `src/styles/abstracts/_colors.scss` |
| Typography | `src/styles/abstracts/_typography.scss` |
| New page | `src/pages/*.astro` |
| New section | `src/components/sections/*` |
| New UI element | `src/components/ui/*` |
| New behavior | `src/scripts/behaviors/*` |
| Images | `src/assets/images/*` |

## Keeping Types in Sync

### Brand Colors

When adding or modifying brand colors in `src/styles/abstracts/_colors.scss`, **always update** the corresponding TypeScript types in `src/types/components.ts`:

| SCSS Location | TypeScript Type |
|---------------|-----------------|
| `$brand-colors` map | `BrandColor` type |
| Additional colors (neutral, light, dark, etc.) | `Color` type |

**Example workflow:**
```scss
// 1. Add to _colors.scss $brand-colors map:
$brand-colors: (
    'primary': #E8871E,
    'secondary': #008148,
    'accent': #FF6B6B,  // ← New color added
);
```

```typescript
// 2. Update src/types/components.ts BrandColor:
export type BrandColor =
  | 'primary'
  | 'secondary'
  | 'accent';  // ← Add here too
```

This ensures type safety when using color props in components.

## Summary

This boilerplate provides:
- **Variant-based components** - Multiple layouts per component type
- **Typed content data** - Structure for AI-assisted content population
- **Data-attribute behaviors** - Non-invasive JavaScript patterns
- **Token-based styling** - Consistent, themeable design system

The goal is to accelerate development while maintaining flexibility. Use what works, customize what doesn't, and prioritize the client's needs over architectural purity.

## Documentation

When told "document this", add to both:
1. `CLAUDE.md` (if Claude Code-specific)
2. `.ai/guidelines/` (appropriate file, or create new one)
- CONTEXT.MD is meant for temporary context, it can be user inputted context from an outside source such as MD content for claude code to use, errors used for debugging, simple data to incoporate, etc. It can also be used as an output by Claude code in order to communicate in a large more structured context to the user.