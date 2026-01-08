# Component Guidelines

## Directory Structure

Components are organized by purpose:

```
src/components/
├── layout/          # Structural components (Section, Container, Header, Footer, Hero, SideNav)
├── ui/              # Visual elements (Button, Card, Form fields, Icons, Page Loaders)
├── sections/        # Content formatting (CTAs, FAQs, Stylized Content, Blog Posts)
└── common/          # Reusable components (Gallery, Product Carousel, Product)
```

### Placement Rules

- **layout/** - Components that affect the general structure of the site: padding, margins, z-indexes, etc. These define the foundational layout patterns.
- **ui/** - Smaller components that affect the look of the site. These are small but important visual aspects.
- **sections/** - Predefined structures and styles for content display. Reusable content formatting for large sections.
- **common/** - Components used throughout the site that don't fit into other categories.

## Creating New Components

There are two methods depending on the type of component being built:

### Method 1: Components with Variations

For components with many variations (e.g., Standard Header, Minimal Header, Centered Header):

1. Create a subdirectory within the purpose directory
2. Include a `types.ts` file for common props shared across all variations
3. Include a shared `.scss` file for common styles
4. Each variation gets its own `.astro` file containing:
   - Variation-specific props (extending common props)
   - Variation-specific styles
   - The component markup

The component-specific directory should only contain variations—other components belong in the purpose directory or their own subdirectory.

### Method 2: Simple Components

For components without variations, create a single `.astro` file directly in the appropriate purpose directory.

### Start with Types

Define the interface in a `types.ts` file within the component directory:

```typescript
// src/components/sections/pricing/types.ts
import type { BaseProps, CTAAction, ContainerProps } from '@data/types';

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

### 2. Create the Component

Follow the established pattern:

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
import Container from '@components/layout/Container.astro';

interface Props extends PricingCardsProps {}

const {
  heading,
  subheading,
  tiers,
  container,
  classList,
  ...attrs
} = Astro.props;
---

<section class:list={['pricing', 'pricing--cards', classList]} {...attrs}>
  <Container {...container}>
    <!-- Component markup -->
  </Container>
</section>

<style lang="scss">
  @use './pricing.scss';
</style>
```

## Component Patterns

### Child Component Props

When a component contains another component, the child's props should be expected as a property of the parent:

```typescript
import type { Props as ContainerProps } from '@components/layout/Container.astro';
import type { Props as CardProps } from '@components/ui/Card.astro';

export interface Props {
  heading: string;
  container: ContainerProps;
  cards: CardProps[];
}

<div {...container}>
  {cards.map((card, index) => (
    // Card code
  ))}
</div>
```

### classList Implementation

Components should have a `classList` property applied to the top-level element:

```astro
<!-- Basic usage -->
<div class={classList}>

<!-- With default classes -->
<div class=`default__class ${classList}`>

<!-- With conditional classes -->
<div class=`default__class ${rounded} ${classList}`>
```

### Common Property Types

Reusable property types that aren't component-specific (color variations, sizes, etc.) should be defined as Enums in the `src/data/types` directory.

### General Patterns

- **Extend BaseProps** - All components should extend `BaseProps` for consistent `classList` support.
- **Spread remaining attrs** - Use `{...attrs}` to pass through additional HTML attributes..
- **Use slots** - Provide `<slot />` and named slots for content customization.

## Container Configuration

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

## Component-Level Scripts

For client-side JavaScript within a component, write scripts assuming multiple instances may exist on the page:

```astro
<script>
  // Query all instances of this component
  const components = document.querySelectorAll('[data-my-component]');

  components.forEach((component) => {
    // Initialize each instance independently
    const button = component.querySelector('[data-trigger]');
    button?.addEventListener('click', () => {
      // Handle click for this specific instance
    });
  });
</script>
```

### Single-Use Components

For components that should only appear once per page (nav, header, footer), document this at the top of the script:

```astro
<script>
  /**
   * Single-use component script
   * This component should only be used once per page (e.g., Header, Footer, Nav)
   */
  const nav = document.querySelector('[data-nav]');

  if (nav) {
    // Initialize single instance
  }
</script>
```

## Documentation Requirements

When creating new components:

1. **Add to docs page** - Update `src/pages/docs/components.astro` with examples of the new component and its variants.
2. **Include all variants** - Show each variant with realistic content and explain when to use each.
3. **Document props** - List available props with their types and defaults.
4. **Show code examples** - Provide copy-paste ready usage examples.
