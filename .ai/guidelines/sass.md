# SCSS/Styling Guidelines

## File Organization (ITCSS-inspired)

```
src/styles/
|-- main.scss             # Entry point - imports in specificity order
|-- _abstracts.scss       # Re-exports all abstracts for component use
|-- abstracts/
|   |-- _colors.scss      # Color system with palette generation
|   |-- _typography.scss  # Font scales and families
|   |-- _breakpoints.scss # Media query mixins
|   |-- _mixins.scss      # Utility mixins
|   |-- _utilities.scss   # Spacing, sizing functions
|   +-- _animations.scss  # Keyframes and animation utilities
|-- base/
|   |-- _reset.scss       # CSS reset
|   |-- _base.scss        # Base element styles
|   +-- _utilities.scss   # Utility classes
+-- components/
    +-- *.scss            # Global component styles (modal, accordion, etc.)
```

## When to Extend Abstracts vs Component Styles

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

## Writing Component Styles

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

## Color System

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

### TypeScript Color Types

**IMPORTANT:** When adding or modifying brand colors in SCSS, always update the corresponding TypeScript types in `src/types/components.ts`:

| SCSS | TypeScript |
|------|------------|
| `$brand-colors` map keys | `BrandColor` type |
| Additional colors (neutral, light, dark, black, white) | `Color` type |
| Palette weights (50-900) | `ColorWeight` type |

```typescript
// src/types/components.ts
export type BrandColor =
  | 'primary'
  | 'secondary'
  | 'tertiary'
  | 'success'
  | 'danger'
  | 'warning'
  | 'info';

export type Color =
  | BrandColor
  | 'neutral'
  | 'light'
  | 'dark'
  | 'black'
  | 'white';

export type ColorWeight = 50 | 100 | 200 | 300 | 400 | 500 | 600 | 700 | 800 | 900;
```

This ensures type safety when using color props in components (e.g., `variant`, `color`, `background` props).

**Usage:**
```scss
// SCSS function
background: color('primary', 600);

// CSS custom properties
background: var(--color-primary-600);
background: var(--color-primary); // defaults to 500
```

## Responsive Design

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

## Spacing System

Use CSS custom properties for consistent spacing:

```scss
margin-bottom: var(--space-4);   // 1rem
padding: var(--space-6);          // 1.5rem
gap: var(--space-8);              // 2rem
```

## Typography Customization

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

## Theming Approach

1. **Update design tokens** in abstracts:
   - `_colors.scss` - Brand colors
   - `_typography.scss` - Fonts and scales
   - `_component-config.scss` - Component defaults

2. **Add client-specific styles** to components or pages as needed.

3. **Avoid modifying base styles** unless fixing bugs or adding features that benefit all projects.

4. **Keep abstracts generic** - Client-specific styles belong in components or pages, not abstracts.

## Mixin Declaration Order (Avoiding mixed-decls Warning)

Sass will deprecate placing declarations after nested rules. When using mixins that contain nested rules (like `&--modifier` selectors), place all plain declarations **before** those mixins.

**Problem:**
```scss
.card {
  @include card-base;
  @include card-variants;     // Contains nested rules like &--radius-small
  @include card-hover-variants;

  display: flex;              // ❌ Declaration AFTER nested rules
  padding: var(--space-4);    // ❌ Triggers deprecation warning
}
```

**Solution:**
```scss
.card {
  @include card-base;         // Mixin with no nested rules (OK first)
  display: flex;              // ✅ Declarations BEFORE nested rule mixins
  padding: var(--space-4);

  @include card-variants;     // Mixins with nested rules come after
  @include card-hover-variants;

  // Element selectors are fine after
  &__title { ... }
}
```

**Rule of thumb:** Structure SCSS blocks in this order:
1. `@include` mixins that only contain declarations (no `&` selectors)
2. Plain declarations (`display`, `padding`, `color`, etc.)
3. `@include` mixins that contain nested rules (`&--modifier`, `&:hover`, etc.)
4. Nested selectors (`&__element`, `&--modifier`, `&:hover`)
