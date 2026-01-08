# Project Guidelines

Guidelines for contributing to and enhancing the boilerplate itself.

## Project Structure

```
src/
├── assets/           # Static assets (images, fonts)
│   └── images/
├── components/       # Astro components
│   ├── layout/       # Structural components (Section, Container, Header, Footer, Hero, SideNav)
│   ├── ui/           # Visual elements (Button, Card, Form fields, Icons, Page Loaders)
│   ├── sections/     # Content formatting (CTAs, FAQs, Features)
│   └── common/       # Reusable components (Gallery, Product Carousel)
├── data/             # Configuration and content data
│   ├── content/      # Page content
│   └── site/         # Site-wide data (navigation, etc.)
├── layouts/          # Page layouts (BaseLayout, DefaultLayout)
├── pages/            # Astro pages and routes
│   └── docs/         # Documentation pages
├── scripts/          # Client-side JavaScript
│   ├── core/         # DOM utilities
│   ├── behaviors/    # Interactive features
│   ├── animations/   # Animation modules
│   └── utils/        # Utility functions
├── styles/           # Global SCSS
│   ├── abstracts/    # Variables, mixins, functions
│   ├── base/         # Reset, base styles
│   └── components/   # Global component styles
└── types/            # TypeScript type definitions
```

## Best Practices

### Semantic HTML

Use appropriate elements for content structure:

```html
<section>   <!-- Thematic grouping of content -->
<nav>       <!-- Navigation links -->
<article>   <!-- Self-contained content -->
<aside>     <!-- Tangentially related content -->
<header>    <!-- Introductory content -->
<footer>    <!-- Footer content -->
<main>      <!-- Main content of the page -->
```

### Accessibility

- Include ARIA attributes where needed
- Ensure keyboard navigation works
- Provide focus management for interactive elements
- Use semantic HTML elements
- Add `alt` text to images
- Ensure sufficient color contrast

```html
<button data-modal-trigger="contact" aria-haspopup="dialog">
  Open Contact Form
</button>

<dialog data-modal="contact" aria-labelledby="contact-title">
  <h2 id="contact-title">Contact Us</h2>
  <!-- Modal content -->
</dialog>
```

### Documentation Comments

Add JSDoc-style comments to components:

```typescript
/**
 * ComponentName
 *
 * Brief description of what this component does.
 *
 * @variant variantName
 * @since 1.0.0
 *
 * Best for: Use cases where this component excels
 * Avoid when: Situations where another component is better
 */
```

## Contributing New Components

### 1. Create the Component

Follow the established patterns in `components.md`:
- Define types in a `types.ts` file
- Use the standard component template
- Support `classList` and `...attrs` spreading

### 2. Add Styles

- Use BEM naming conventions
- Leverage existing SCSS variables and mixins
- Support responsive breakpoints

### 3. Update Documentation

Add component examples to `src/pages/docs/components.astro`:

```astro
<Section id="pricing" container={{ size: "large" }}>
  <h2>Pricing</h2>
  <p>Display pricing tiers with the PricingCards component.</p>

  <h3>Cards Variant</h3>
  <PricingCards
    heading="Choose Your Plan"
    tiers={[
      { name: 'Basic', price: '$9', features: ['Feature 1', 'Feature 2'] },
      { name: 'Pro', price: '$29', features: ['All Basic', 'Feature 3'], highlighted: true },
    ]}
  />

  <CodeBlock code={`<PricingCards heading="..." tiers={[...]} />`} />
</Section>
```

## Contributing New Behaviors

### 1. Create the Module

Follow the pattern in `typescript.md`:

```typescript
// src/scripts/behaviors/my-feature.ts
export function init(options = {}): void {
  const elements = document.querySelectorAll('[data-my-feature]');
  // Implementation
}
```

### 2. Register in init.ts

```typescript
import * as myFeature from './behaviors/my-feature';

if (document.querySelector('[data-my-feature]')) {
  myFeature.init();
}
```

### 3. Update Documentation

Add to `src/pages/docs/behaviors.astro` with usage examples.

## Development Workflow

1. **Maintain type safety** - Extend existing types rather than using `any`
2. **Preserve accessibility** - Don't remove ARIA attributes or keyboard support
3. **Test responsive behavior** - Verify layouts work across breakpoints
4. **Document changes** - Update docs pages and add JSDoc comments
5. **Follow conventions** - Use established patterns for consistency

## Quick Reference

| Task | Location |
|------|----------|
| Add UI component | `src/components/ui/*` |
| Add section component | `src/components/sections/*` |
| Add behavior | `src/scripts/behaviors/*` |
| Add type definitions | `src/types/*` |
| Add SCSS variables | `src/styles/abstracts/*` |
| Component docs | `src/pages/docs/components.astro` |
| Styling docs | `src/pages/docs/styling.astro` |
| Behavior docs | `src/pages/docs/behaviors.astro` |
