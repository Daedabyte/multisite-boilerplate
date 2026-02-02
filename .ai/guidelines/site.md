# Site Building Guidelines

Guidelines for using this boilerplate to build client websites.

## Site Blueprint

**Before starting any new site, check for a `site-blueprint.json` file in the project root.** This file contains comprehensive project specifications that should drive all scaffolding and design decisions.

### Using the Site Blueprint

If `site-blueprint.json` exists:

1. Read the entire blueprint file first
2. Use `branding.colors` to update `src/styles/abstracts/_colors.scss`
3. Use `branding.fonts` to configure `src/styles/abstracts/_typography.scss`
4. Use `site` and `company` info to populate `src/data/config.ts`
5. Use `navigation` structure to set up `src/data/site/navigation.ts`
6. Create pages based on the `pages` array using specified sections and variants
7. Apply `theme` preferences (style, animations, border radius) throughout
8. Follow brand voice guidelines from `branding.md` when writing copy (if exists)

If no blueprint exists, copy `site-blueprint.example.json` to `site-blueprint.json` and ask the user to fill it out, or proceed with manual configuration.

## Initial Setup

### 1. Configure the Site

Update `src/data/config.ts`:

```typescript
export const config: SiteConfig = {
  siteName: 'Client Site Name',
  siteDescription: 'Site description for SEO',
  siteUrl: 'https://clientsite.com',

  logo: {
    src: '/images/logo.png',
    alt: 'Client Logo',
  },

  company: {
    name: 'Client Company',
    email: 'hello@client.com',
    phone: '555-123-4567',
  },

  components: {
    header: 'standard',
    footer: 'standard',
  },
};
```

### 2. Set Up Navigation

Update `src/data/site/navigation.ts`:

```typescript
export const navigation: Record<string, NavItem | NavLink> = {
  home: { label: 'Home', url: '/', showIn: 'header' },
  about: { label: 'About', url: '/about', showIn: 'both' },
  services: {
    label: 'Services',
    url: '/services',
    showIn: 'both',
    children: {
      consulting: { label: 'Consulting', url: '/services/consulting' },
      development: { label: 'Development', url: '/services/development' },
    },
  },
  contact: { label: 'Contact', url: '/contact', showIn: 'both' },
};
```

### 3. Update Brand Colors

Modify `src/styles/abstracts/_colors.scss`:

```scss
$brand-colors: (
  'primary': #CLIENT_PRIMARY,
  'secondary': #CLIENT_SECONDARY,
  'tertiary': #CLIENT_ACCENT,
);
```

### 4. Configure Typography

Update `src/styles/abstracts/_typography.scss`:

```scss
$font-family-base: 'Client Sans', system-ui, sans-serif;
$font-family-heading: 'Client Serif', Georgia, serif;
```

For web fonts, add the import in the layout or use a font service integration.

### 5. Replace Placeholder Images

Add client images to `src/assets/images/`.

## Using Components

### When to Use Pre-Built Components

Use existing components when:
- The design closely matches an available variant
- You only need styling tweaks (colors, spacing, typography)
- The component structure fits your content

### When to Create New Components

Create new components when:
- No existing variant matches the required layout
- Significant structural changes are needed
- The section type doesn't exist (e.g., pricing, portfolio gallery)

## Modifying Components

### Option 1: Override with Props and Slots

Best for minor customizations:

```astro
<HeroStandard
  title={content.title}
  classList="hero--custom-client"
>
  <Fragment slot="badge">
    <span class="custom-badge">New</span>
  </Fragment>
</HeroStandard>
```

### Option 2: Copy and Modify

For significant changes, copy the component:

```
src/components/sections/heroes/HeroClient.astro
```

### Option 3: Extend Styles Only

Add client-specific overrides in the page or a global stylesheet:

```scss
// In page <style> block or global styles
.hero--standard {
  background: linear-gradient(...);

  .hero__title {
    font-family: 'Client Font', sans-serif;
  }
}
```

## Adding Custom JavaScript

### Simple Scripts

Add to the page or component's `<script>` block:

```astro
<script>
  function initClientFeature() {
    // Client-specific logic
  }

  initClientFeature();
  document.addEventListener('astro:page-load', initClientFeature);
</script>
```

### Reusable Behaviors

Create a new module in `src/scripts/behaviors/`:

```typescript
// src/scripts/behaviors/client-feature.ts
export function init(): void {
  const elements = document.querySelectorAll('[data-client-feature]');
  // Implementation
}
```

## Asset Management

### Images

Import images through the asset system for optimization:

```astro
---
import heroImage from '@assets/images/hero.jpg';
---

<img src={heroImage.src} alt="Hero" />
```

### Static Files

Place files that shouldn't be processed in `public/`:
- Favicons
- robots.txt
- Files requiring exact URLs

## Page Management

### Adding Pages

1. Create the page file in `src/pages/` (e.g., `pricing.astro`)
2. Add navigation entry in `src/data/site/navigation.ts`
3. Add any related content data in `src/data/content/`

### Removing Pages

When removing a page, follow these steps to ensure no broken links:

1. **Delete the page file** from `src/pages/`
2. **Remove from navigation** - Delete the entry in `src/data/site/navigation.ts`
3. **Search for references** - Use grep to find all links to the removed page:
   ```bash
   grep -r "/page-url" src/
   ```
4. **Update CTAs and links** - Replace or remove any buttons/links pointing to the deleted page
5. **Check content data** - Remove any related entries in `src/data/content/`

**Common places to check for links:**
- CTA sections in page files (`cta.actions[].href`)
- Navigation children in `navigation.ts`
- Button components throughout pages
- Footer link groups

## Development Workflow

1. **Start with content** - Define content structure in `src/data/content/` before building pages
2. **Use existing variants first** - Try pre-built components before creating custom ones
3. **Maintain type safety** - Extend existing types rather than using `any`
4. **Test responsive behavior** - Verify layouts work across breakpoints
5. **Document customizations** - Add comments explaining client-specific code
6. **Use the asset system** - Import images through `@assets/images/` for optimization

## Quick Reference

| Task | Location |
|------|----------|
| **Site blueprint** | `site-blueprint.json` (check first!) |
| Site metadata | `src/data/config.ts` |
| Navigation | `src/data/site/navigation.ts` |
| Page content | `src/data/content/*.ts` |
| Brand colors | `src/styles/abstracts/_colors.scss` |
| Typography | `src/styles/abstracts/_typography.scss` |
| Add/remove page | `src/pages/*.astro` + `navigation.ts` + check CTAs |
| Images | `src/assets/images/*` |
| Static files | `public/*` |
