# SCSS Architecture Usage Guidelines

## Overview
Your hybrid architecture combines three styling approaches for maximum flexibility and maintainability:

1. **SCSS Modules** - Global foundation and reusable systems
2. **Utility Classes** - Quick spacing, typography, and layout helpers
3. **Component SCSS** - Component-specific styling within `.astro` files

---

## 1. SCSS Modules (Global Foundation)

**Purpose:** Global styles, design system foundation, reusable mixins/functions

**Location:** `src/styles/` directory

**When to Use:**
- Base element styling (typography, links, forms)
- Global component classes (buttons, cards, containers)
- Mixins and functions for reuse
- Design tokens and variables

**Example:**
```scss
// src/styles/components/_hero.scss
@use '../abstracts' as *;

.hero {
  padding: map.get($spacers, 16) 0;
  background: linear-gradient(135deg, $color-primary, $color-primary-dark);
  
  &__title {
    @include text-size('4xl');
    color: $color-white;
    margin-bottom: map.get($spacers, 6);
    
    @include media-up('lg') {
      @include text-size('5xl');
    }
  }
  
  &__subtitle {
    @include text-size('lg');
    color: rgba($color-white, 0.9);
  }
}
```

**Usage in Templates:**
```astro
<!-- No imports needed - globally available -->
<section class="hero">
  <h1 class="hero__title">Professional Moving Services</h1>
  <p class="hero__subtitle">Trusted movers in the DMV area</p>
</section>
```

---

## 2. Utility Classes (Quick Helpers)

**Purpose:** Consistent spacing, typography sizing, display properties, and text alignment

**Generated From:** `src/styles/base/_utilities.scss`

**When to Use:**
- Quick spacing adjustments (`mt-4`, `px-6`, `py-8`)
- Typography sizing (`text-lg`, `text-2xl`)
- Display properties (`flex`, `hidden`, `block`)
- Text alignment (`text-center`, `text-left`)
- Responsive visibility (`md:hidden`, `lg:flex`)

**Acceptable Utilities:**
```css
/* Spacing */
.mt-4, .mb-6, .px-8, .py-12, .m-0

/* Typography */
.text-sm, .text-lg, .text-2xl, .text-4xl

/* Display */
.flex, .grid, .hidden, .block, .inline-block

/* Text Alignment */
.text-center, .text-left, .text-right

/* Responsive */
.md:flex, .lg:hidden, .xl:block
```

**Usage Example:**
```astro
<section class="py-16 px-4">
  <div class="text-center mb-12">
    <h2 class="text-3xl mb-4">Our Services</h2>
    <p class="text-lg">Professional moving solutions</p>
  </div>
  <div class="flex md:hidden">
    <!-- Mobile-only content -->
  </div>
</section>
```

**❌ DON'T Use Utilities For:**
- Colors (use CSS custom properties)
- Complex layouts (use component SCSS)
- Brand-specific styling (use component SCSS)
- Interactive states (use component SCSS)

---

## 3. Component SCSS (Specific Styling)

**Purpose:** Component-specific styling, custom layouts, brand elements, interactive states

**Location:** `<style lang="scss">` blocks within `.astro` files

**When to Use:**
- Component-specific layouts and positioning
- Brand colors and custom styling
- Interactive states (hover, focus, active)
- Complex responsive behavior
- Unique visual treatments

**Accessing the Design System:**

### Method 1: Import SCSS Abstracts
```astro
<style lang="scss">
  @use '../styles/abstracts' as *;
  
  .service-card {
    padding: map.get($spacers, 6);
    background: $color-white;
    border-radius: $border-radius-lg;
    box-shadow: $shadow-base;
    transition: $transition-base;
    
    &:hover {
      transform: translateY(-4px);
      box-shadow: $shadow-lg;
    }
    
    &__icon {
      color: $color-primary;
      @include text-size('2xl');
    }
  }
</style>
```

### Method 2: Use CSS Custom Properties
```astro
<style lang="scss">
  .quote-form {
    background: var(--color-white);
    padding: var(--space-8);
    border-radius: var(--border-radius-lg);
    box-shadow: var(--shadow-md);
    
    &__input {
      border: 2px solid var(--color-gray-300);
      padding: var(--space-3);
      font-size: var(--font-size-base);
      
      &:focus {
        border-color: var(--color-primary);
        box-shadow: 0 0 0 3px rgba(var(--color-primary), 0.1);
      }
    }
    
    &__submit {
      background: var(--color-primary);
      color: var(--color-white);
      padding: var(--space-4) var(--space-8);
      border-radius: var(--border-radius-base);
      
      &:hover {
        background: var(--color-primary-dark);
      }
    }
  }
</style>
```

### Method 3: Hybrid Approach (Recommended)
```astro
<style lang="scss">
  @use '../styles/abstracts' as *;
  
  .testimonial {
    // Use SCSS for complex logic
    @include container('medium');
    @include media-up('lg') {
      display: grid;
      grid-template-columns: 1fr 2fr;
      gap: map.get($spacers, 8);
    }
    
    // Use CSS custom properties for brand elements
    background: var(--color-gray-100);
    border-left: 4px solid var(--color-primary);
    
    &__quote {
      font-size: var(--font-size-lg);
      color: var(--color-gray-700);
      font-style: italic;
    }
    
    &__author {
      color: var(--color-primary);
      font-weight: var(--font-weight-semibold);
    }
  }
</style>
```

---

## Decision Tree: Which Approach to Use?

### Use SCSS Modules When:
- ✅ Creating reusable component classes
- ✅ Defining global typography/form styles  
- ✅ Building layout systems (containers, grids)
- ✅ Creating mixins for common patterns

### Use Utility Classes When:
- ✅ Quick spacing adjustments (`mt-4`, `px-6`)
- ✅ Typography sizing (`text-lg`, `text-xl`)
- ✅ Simple display changes (`flex`, `hidden`)
- ✅ Responsive visibility (`md:flex`, `lg:hidden`)

### Use Component SCSS When:
- ✅ Component-specific layouts
- ✅ Interactive states and animations
- ✅ Brand-specific styling
- ✅ Complex responsive behavior
- ✅ Custom visual treatments

---

## Key Principles

1. **Start with utilities** for quick layouts and spacing
2. **Use global SCSS modules** for reusable patterns
3. **Add component SCSS** for custom styling and interactions
4. **Access design tokens** through both SCSS variables and CSS custom properties
5. **Keep component styles scoped** to their specific use case
6. **Favor CSS custom properties** for values that might change (colors, spacing)
7. **Use SCSS variables** for complex calculations and mixins

This approach gives you rapid development speed with utility classes while maintaining design system consistency and component flexibility.