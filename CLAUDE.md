# CLAUDE.md - Boilerplate Development Guide

This document provides guidelines for AI assistants working with this Astro boilerplate. It's divided into two parts: development patterns for maintaining the boilerplate, and usage patterns for creating new sites.

---

## Part 1: Development Patterns

### Component Architecture

#### Directory Structure

Components are organized by purpose:

```
src/components/
├── ui/              # Atomic UI elements (Button, Container, Section, Card, Form fields)
├── sections/        # Page sections (heroes, features, cta, testimonials, etc.)
├── common/          # Shared layout components (headers, footers)
└── layout/          # Layout wrappers (reserved for future use)
```

**Placement Rules:**
- **ui/** - Small, reusable elements used across many components. No business logic.
- **sections/** - Full-width page sections with specific content purposes. Each category (heroes, features, cta) gets its own subdirectory with multiple variants.
- **common/** - Site-wide components that appear on every page (headers, footers, navigation).
- **layout/** - Page-level layout structures.

#### Creating New Components

1. **Start with types** - Define the interface in a `types.ts` file within the component directory:

```typescript
// src/components/sections/pricing/types.ts
import type { BaseProps, CTAAction, ContainerProps } from '@types';

export type PricingVariant = 'cards' | 'table' | 'comparison';

export interface PricingTier {
  name: string;
  price: string;
  period?: string;
  description?: string;
  features: string[];
  cta?: CTAAction;
  highlighted?: boolean;
}

export interface PricingCardsProps extends BaseProps {
  variant?: 'cards';
  heading?: string;
  subheading?: string;
  tiers: PricingTier[];
  container?: ContainerProps;
}
```

2. **Create the component** - Follow the established pattern:

```astro
---
/**
 * PricingCards
 *
 * Card-based pricing display with highlighted tier support.
 *
 * @variant cards
 * @since 1.0.0
 *
 * Best for: SaaS products, subscription services
 * Avoid when: Complex feature comparisons needed
 */

import type { PricingCardsProps } from './types';
import Container from '@components/ui/Container.astro';

interface Props extends PricingCardsProps {}

const {
  heading,
  subheading,
  tiers,
  container,
  class: className,
  classList,
  id = 'pricing',
  ...attrs
} = Astro.props;
---

<section id={id} class={`pricing pricing--cards ${className ?? ''}`} {...attrs}>
  <Container {...container}>
    <!-- Component markup -->
  </Container>
</section>

<style lang="scss">
  @use './pricing.scss';
</style>
```

3. **Create an index.ts** - Export types only (Astro components must be imported directly):

```typescript
// src/components/sections/pricing/index.ts
export * from './types';
// Note: Import .astro files directly, not through barrel exports
```

4. **Add to documentation** - Update `src/pages/docs/components.astro` with component examples:

```astro
<!-- In the appropriate section of docs/components.astro -->
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

#### Component Patterns

- **Extend BaseProps** - All components should extend `BaseProps` for consistent `class`, `classList`, and `id` support.
- **Default IDs** - Provide sensible default IDs (e.g., `id = 'hero'`) for anchor linking.
- **Spread remaining attrs** - Use `{...attrs}` to pass through additional HTML attributes.
- **Accept container props** - All section components using `Container` must accept a `container?: ContainerProps` prop and spread it: `<Container {...container}>`. This allows consumers to configure size, padding, and other container options.
- **Accept section props** - Components using `Section` should pass through section configuration (background, spacing) via props.
- **Use slots** - Provide `<slot />` and named slots for content customization.

#### Container Configuration

The `ContainerProps` interface supports:
- `size` - Container max-width: `'small' | 'medium' | 'large' | 'xl' | 'full'`
- `padding` - Enable/disable horizontal padding (default: `true`)
- `as` - Polymorphic element type

Example implementation:
```astro
const { container, ...attrs } = Astro.props;
---
<section {...attrs}>
  <Container {...container}>
    <slot />
  </Container>
</section>
```

Usage:
```astro
<FeaturesGrid container={{ size: 'xl', padding: false }} ... />
```

#### Documentation Requirements

When creating new components, you must also add them to the project documentation:

1. **Add to docs page** - Update `src/pages/docs/components.astro` with examples of the new component and its variants.

2. **Include all variants** - Show each variant with realistic content and explain when to use each.

3. **Document props** - List available props with their types and defaults.

4. **Show code examples** - Provide copy-paste ready usage examples.

---

### JavaScript Architecture

#### Directory Structure

```
src/scripts/
├── core/           # DOM utilities, events, observers, scroll helpers
├── behaviors/      # Interactive features (modal, accordion, tabs, dropdown)
├── animations/     # Animation modules (scroll-reveal, counter, stagger)
├── utils/          # Pure utility functions (debounce, throttle)
└── init.ts         # Auto-initialization based on DOM presence
```

#### Data-Attribute Pattern

All JavaScript behaviors are initialized via data attributes. This keeps HTML declarative and JavaScript non-invasive.

```html
<!-- Accordion -->
<div data-accordion data-accordion-multiple="false">
  <div data-accordion-item>
    <button data-accordion-trigger aria-expanded="false">Question</button>
    <div data-accordion-content>Answer</div>
  </div>
</div>

<!-- Modal -->
<button data-modal-trigger="my-modal">Open</button>
<dialog data-modal="my-modal" data-modal-close-on-overlay="true">
  <button data-modal-close>Close</button>
  <div>Content</div>
</dialog>

<!-- Counter Animation -->
<span data-counter data-counter-target="100" data-counter-suffix="+">0</span>

<!-- Scroll Reveal -->
<div data-reveal="fade-up" data-reveal-delay="200">Content</div>
```

#### Creating New Behaviors

Follow the established module pattern:

```typescript
// src/scripts/behaviors/my-feature.ts
import { $, $$, getData, getDataBool } from '../core/dom';

export interface MyFeatureOptions {
  onOpen?: (element: HTMLElement) => void;
  onClose?: (element: HTMLElement) => void;
}

const instances = new Map<string, { element: HTMLElement; options: MyFeatureOptions }>();

export function init(options: MyFeatureOptions = {}): void {
  const elements = $$('[data-my-feature]');

  elements.forEach((element) => {
    const id = getData(element, 'my-feature');
    if (!id || instances.has(id)) return;

    createInstance(element, id, options);
  });
}

export function createInstance(
  element: HTMLElement,
  id: string,
  options: MyFeatureOptions = {}
): void {
  // Setup logic
  instances.set(id, { element, options });
}

export function destroy(id: string): void {
  const instance = instances.get(id);
  if (!instance) return;

  // Cleanup logic
  instances.delete(id);
}

export function open(id: string): void { /* ... */ }
export function close(id: string): void { /* ... */ }
export function toggle(id: string): void { /* ... */ }
```

Register in `init.ts`:

```typescript
// src/scripts/init.ts
import * as myFeature from './behaviors/my-feature';

function initAll(): void {
  // ... existing initializations

  if (document.querySelector('[data-my-feature]')) {
    myFeature.init();
  }
}
```

#### Core Utilities

Use the provided DOM utilities instead of raw DOM methods:

```typescript
import { $, $$, byId, addClass, removeClass, toggleClass, getData } from '../core/dom';

// Type-safe selectors
const modal = $<HTMLDialogElement>('[data-modal="contact"]');
const items = $$<HTMLElement>('[data-item]');
const form = byId<HTMLFormElement>('contact-form');

// Class manipulation
addClass(element, 'active', 'visible');
removeClass(element, 'hidden');
toggleClass(element, 'open');

// Data attributes
const value = getData(element, 'value');
const count = getDataNumber(element, 'count', 0);
const enabled = getDataBool(element, 'enabled', true);
```

---

### Styling Architecture

#### File Organization (ITCSS-inspired)

```
src/styles/
├── main.scss                 # Entry point - imports in specificity order
├── _abstracts.scss           # Re-exports all abstracts for component use
├── abstracts/
│   ├── _colors.scss         # Color system with palette generation
│   ├── _typography.scss     # Font scales and families
│   ├── _breakpoints.scss    # Media query mixins
│   ├── _mixins.scss         # Utility mixins
│   ├── _utilities.scss      # Spacing, sizing functions
│   └── _animations.scss     # Keyframes and animation utilities
├── base/
│   ├── _reset.scss          # CSS reset
│   ├── _base.scss           # Base element styles
│   └── _utilities.scss      # Utility classes
└── components/
    └── *.scss               # Global component styles (modal, accordion, etc.)
```

#### When to Extend Abstracts vs Component Styles

**Extend Abstracts (`src/styles/abstracts/`) when:**
- Adding new design tokens (colors, spacing values, font sizes)
- Creating reusable mixins used by multiple components
- Defining new breakpoints or animation keyframes
- Adding utility functions (color manipulation, unit conversion)

**Create Component Styles when:**
- Styling a specific component variant
- The styles are only used by one component
- The styles involve component-specific class names

**Use Global Component Styles (`src/styles/components/`) when:**
- The component uses JavaScript behaviors (modal, accordion, tabs)
- Styles need to be available before component hydration
- Multiple pages use the same behavioral component

#### Writing Component Styles

Component styles live alongside the component and use `@use` to import abstracts:

```scss
// src/components/sections/pricing/pricing.scss
@use '../../../styles/abstracts' as *;

.pricing {
  padding-block: var(--space-16);

  &--cards {
    .pricing__grid {
      display: grid;
      gap: var(--space-6);

      @include media-up('md') {
        grid-template-columns: repeat(2, 1fr);
      }

      @include media-up('lg') {
        grid-template-columns: repeat(3, 1fr);
      }
    }
  }

  &__card {
    background: var(--color-white);
    border-radius: var(--border-radius-lg);
    padding: var(--space-6);

    &--highlighted {
      border: 2px solid var(--color-primary);
      box-shadow: var(--shadow-lg);
    }
  }
}
```

In the Astro component:

```astro
<style lang="scss">
  @use './pricing.scss';
</style>
```

Use `is:global` when styles need to affect child components or dynamically inserted content:

```astro
<style lang="scss" is:global>
  @use './pricing.scss';
</style>
```

#### Color System

Colors are generated from base values using the `generate-color-system` function:

```scss
// Define brand colors
$brand-colors: (
  'primary': #E8871E,
  'secondary': #008148,
  'tertiary': #339966,
  'success': #28a745,
  'danger': #dc3545,
  'warning': #ffc107,
  'info': #17a2b8,
);

// Generate full palettes (50-900 weights)
$colors: generate-color-system($brand-colors, 'scale');
```

**Usage:**
```scss
// SCSS function
background: color('primary', 600);

// CSS custom properties
background: var(--color-primary-600);
background: var(--color-primary); // defaults to 500
```

#### Responsive Design

Use the provided breakpoint mixins:

```scss
// Mobile-first (min-width)
@include media-up('sm') { }  // 640px+
@include media-up('md') { }  // 768px+
@include media-up('lg') { }  // 1024px+
@include media-up('xl') { }  // 1280px+

// Desktop-first (max-width)
@include media-down('lg') { }  // below 1024px
@include media-down('md') { }  // below 768px
```

#### Spacing System

Use CSS custom properties for consistent spacing:

```scss
margin-bottom: var(--space-4);   // 1rem
padding: var(--space-6);          // 1.5rem
gap: var(--space-8);              // 2rem
```

---

### General Rules and Preferences

1. **TypeScript everywhere** - All JavaScript and data files use TypeScript.

2. **Path aliases** - Always use path aliases for imports:
   ```typescript
   import { CTAAction } from '@types';
   import Button from '@components/ui/Button.astro';
   import { config } from '@data/config';
   ```

3. **Astro component imports** - Import `.astro` files directly, not through barrel exports:
   ```typescript
   // Correct
   import HeroStandard from '@components/sections/heroes/HeroStandard.astro';

   // Incorrect - barrel exports don't work for Astro components
   import { HeroStandard } from '@components/sections/heroes';
   ```

4. **Props destructuring** - Always destructure props with defaults:
   ```typescript
   const {
     variant = 'default',
     size = 'medium',
     class: className,
     classList,
     ...attrs
   } = Astro.props;
   ```

5. **BEM-style class names** - Use Block__Element--Modifier pattern:
   ```html
   <div class="card card--featured">
     <h3 class="card__title">Title</h3>
     <p class="card__description">Description</p>
   </div>
   ```

6. **Semantic HTML** - Use appropriate elements (`<section>`, `<nav>`, `<article>`, `<aside>`).

7. **Accessibility** - Include ARIA attributes, focus management, and keyboard support.

8. **Documentation comments** - Add JSDoc-style comments to components:
   ```typescript
   /**
    * ComponentName
    *
    * Brief description of what this component does.
    *
    * @variant variantName
    * @since 1.0.0
    *
    * Best for: Use cases
    * Avoid when: Anti-patterns
    */
   ```

---

## Part 2: Using the Boilerplate for New Sites

### Getting Started

This boilerplate is designed to accelerate website development while remaining flexible. The pre-built components, JavaScript behaviors, and styling system are meant to be **adapted, not treated as immutable**.

#### Using the Site Blueprint

**Before starting any new site, check for a `site-blueprint.json` file in the project root.** This file contains comprehensive project specifications that should drive all scaffolding and design decisions.

If `site-blueprint.json` exists:
1. Read the entire blueprint file first
2. Use the `branding.colors` values to update `src/styles/abstracts/_colors.scss`
3. Use the `branding.fonts` to configure typography in `src/styles/abstracts/_typography.scss`
4. Use the `site` and `company` info to populate `src/data/config.ts`
5. Use the `navigation` structure to set up `src/data/site/navigation.ts`
6. Create pages based on the `pages` array, using the specified sections and variants
7. Apply the `theme` preferences (style, animations, border radius) throughout
8. Follow the `content.tone` guidelines when writing any copy

If no blueprint exists, copy `site-blueprint.example.json` to `site-blueprint.json` and ask the user to fill it out, or proceed with manual configuration below.

#### Initial Setup (Manual)

1. **Configure the site** - Update `src/data/config.ts`:
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
       header: 'standard',  // 'standard' | 'centered' | 'minimal'
       footer: 'standard',  // 'standard' | 'simple' | 'centered'
     },
   };
   ```

2. **Set up navigation** - Update `src/data/site/navigation.ts`:
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

3. **Update brand colors** - Modify `src/styles/abstracts/_colors.scss`:
   ```scss
   $brand-colors: (
     'primary': #CLIENT_PRIMARY,
     'secondary': #CLIENT_SECONDARY,
     'tertiary': #CLIENT_ACCENT,
     // Keep semantic colors or customize
   );
   ```

4. **Replace placeholder images** - Add client images to `src/assets/images/`.

### Content-First Development

#### Using Content Data

Page content lives in `src/data/content/`. Create typed content files for each page:

```typescript
// src/data/content/services.ts
import type { ServicesPageContent } from './types';

export const services: ServicesPageContent = {
  hero: {
    variant: 'minimal',
    title: 'Our Services',
    subtitle: 'How we can help your business grow',
  },

  services: {
    heading: 'What We Offer',
    items: [
      {
        title: 'Web Development',
        description: 'Custom websites built with modern technology.',
        icon: 'fa-solid fa-code',
        href: '/services/web-development',
      },
      // ... more services
    ],
  },
};
```

Use in pages:

```astro
---
import { services } from '@data/content';
import HeroMinimal from '@components/sections/heroes/HeroMinimal.astro';
import FeaturesGrid from '@components/sections/features/FeaturesGrid.astro';
---

<HeroMinimal {...services.hero} />
<FeaturesGrid
  heading={services.services.heading}
  features={services.services.items}
/>
```

#### Creating New Pages

1. Create the page file in `src/pages/`
2. Create corresponding content data in `src/data/content/`
3. Import and compose section components
4. Add page-specific styles if needed

### Customizing Components

#### When to Use Pre-Built Components

Use existing components when:
- The design closely matches an available variant
- You only need styling tweaks (colors, spacing, typography)
- The component structure fits your content

#### When to Create New Components

Create new components when:
- No existing variant matches the required layout
- Significant structural changes are needed
- The section type doesn't exist (e.g., pricing, portfolio gallery)

#### Modifying Existing Components

**Option 1: Override with props and slots**
```astro
<HeroStandard
  title={content.title}
  class="hero--custom-client"
>
  <Fragment slot="badge">
    <span class="custom-badge">New</span>
  </Fragment>
</HeroStandard>
```

**Option 2: Copy and modify**
For significant changes, copy the component and modify:
```
src/components/sections/heroes/HeroClient.astro
```

**Option 3: Extend styles only**
Add client-specific overrides in the page or a global stylesheet:
```scss
// In page <style> block
.hero--standard {
  // Client-specific overrides
  background: linear-gradient(...);

  .hero__title {
    font-family: 'Client Font', sans-serif;
  }
}
```

### Customizing JavaScript

#### Using Built-In Behaviors

The boilerplate includes ready-to-use behaviors:

| Behavior | Data Attributes | Use Case |
|----------|----------------|----------|
| Modal | `data-modal`, `data-modal-trigger` | Dialogs, lightboxes |
| Accordion | `data-accordion`, `data-accordion-item` | FAQs, collapsible content |
| Tabs | `data-tabs`, `data-tab` | Tabbed interfaces |
| Dropdown | `data-dropdown`, `data-dropdown-trigger` | Navigation menus |
| Counter | `data-counter`, `data-counter-target` | Animated statistics |
| Scroll Reveal | `data-reveal` | Entrance animations |
| Stagger | `data-stagger` | Sequential animations |

#### Adding Custom JavaScript

For client-specific functionality:

1. **Simple scripts** - Add to the page's `<script>` block:
   ```astro
   <script>
     function initClientFeature() {
       // Client-specific logic
     }

     initClientFeature();
     document.addEventListener('astro:page-load', initClientFeature);
   </script>
   ```

2. **Reusable behaviors** - Create a new module:
   ```typescript
   // src/scripts/behaviors/client-feature.ts
   export function init(): void {
     // Implementation
   }
   ```

### Customizing Styles

#### Theming Approach

1. **Update design tokens** in abstracts:
   ```scss
   // _colors.scss - Brand colors
   // _typography.scss - Fonts and scales
   // _component-config.scss - Component defaults
   ```

2. **Add client-specific styles** to components or pages as needed.

3. **Avoid modifying base styles** unless fixing bugs or adding features that benefit all projects.

#### Typography Customization

```scss
// src/styles/abstracts/_typography.scss
$font-family-base: 'Client Sans', system-ui, sans-serif;
$font-family-heading: 'Client Serif', Georgia, serif;

// Update font sizes if needed
$font-sizes: (
  'xs': 0.75rem,
  'sm': 0.875rem,
  'base': 1rem,
  // ...
);
```

### Best Practices for New Sites

1. **Start with content** - Define content structure in `src/data/content/` before building pages.

2. **Use existing variants first** - Try the pre-built component variants before creating custom ones.

3. **Maintain type safety** - Extend existing types rather than using `any`.

4. **Keep abstracts generic** - Client-specific styles belong in components or pages, not abstracts.

5. **Test responsive behavior** - Verify layouts work across breakpoints.

6. **Preserve accessibility** - Don't remove ARIA attributes or keyboard support.

7. **Document customizations** - Add comments explaining client-specific code.

8. **Use the asset system** - Import images through `@assets/images/` for optimization.

### Quick Reference

| Task | Location |
|------|----------|
| **Site blueprint** | `site-blueprint.json` (check first!) |
| Site metadata | `src/data/config.ts` |
| Navigation | `src/data/site/navigation.ts` |
| Page content | `src/data/content/*.ts` |
| Brand colors | `src/styles/abstracts/_colors.scss` |
| Typography | `src/styles/abstracts/_typography.scss` |
| Component selection | `config.components` |
| Add new page | `src/pages/*.astro` |
| Add section component | `src/components/sections/*` |
| Add UI component | `src/components/ui/*` |
| Add behavior | `src/scripts/behaviors/*` |
| Images | `src/assets/images/*` |
| Component docs | `src/pages/docs/components.astro` |
| Styling docs | `src/pages/docs/styling.astro` |
| Behavior docs | `src/pages/docs/behaviors.astro` |

---

## Summary

This boilerplate provides a solid foundation with:
- **Variant-based components** - Multiple layouts per component type
- **Typed content data** - Structure for AI-assisted content population
- **Data-attribute behaviors** - Non-invasive JavaScript patterns
- **Token-based styling** - Consistent, themeable design system

The goal is to accelerate development while maintaining flexibility. Use what works, customize what doesn't, and always prioritize the client's needs over architectural purity.
