# Multisite Boilerplate - Development Guidelines

## Overview
This boilerplate provides a structured approach to building fast, maintainable Astro websites with a hybrid styling architecture and organized component system.

---

## 🏗️ Project Structure & Architecture

### Core Directories

```text
src/
├── components/
│   ├── sections/          # Page-specific sections
│   ├── ui/               # Reusable UI components
│   └── common/           # Site-wide components (Header, Footer)
├── layouts/              # Page layout templates
├── pages/               # Route-based pages
└── styles/              # Global SCSS architecture
```

### 1. Page Sections (`src/components/sections/`)

**Purpose:** Break down pages into isolated, manageable sections

**Guidelines:**
- Create focused, single-purpose components for each page section
- Keep sections decentralized to enable faster, isolated updates
- Use descriptive naming: `HeroSection.astro`, `FeaturesGrid.astro`, `TestimonialsCarousel.astro`

**Example Structure:**
```text
src/components/sections/
├── home/
│   ├── HeroSection.astro
│   ├── ServicesOverview.astro
│   └── CallToActionSection.astro
├── about/
│   ├── TeamSection.astro
│   └── CompanyHistorySection.astro
└── contact/
    └── ContactFormSection.astro
```

**Usage:**
```astro
---
// src/pages/index.astro
import PageLayout from '../layouts/PageLayout.astro';
import HeroSection from '../components/sections/home/HeroSection.astro';
import ServicesOverview from '../components/sections/home/ServicesOverview.astro';
import CallToActionSection from '../components/sections/home/CallToActionSection.astro';
---

<PageLayout title="Home">
  <HeroSection />
  <ServicesOverview />
  <CallToActionSection />
</PageLayout>
```

### 2. Reusable UI Components (`src/components/ui/`)

**Purpose:** House components that appear multiple times across the project

**When to Move to UI:**
- Component is used in 2+ different locations
- Component provides generic functionality (buttons, cards, modals)
- Component is likely to be reused in future development

**Examples:**
```text
src/components/ui/
├── Button.astro          # Primary/secondary/outline variants
├── Card.astro            # Generic content container
├── Container.astro       # Layout container with size variants
├── Modal.astro           # Reusable modal component
├── FormField.astro       # Input field with label and validation
└── Badge.astro           # Status/category indicators
```

**Migration Strategy:**
1. Develop components in their initial location
2. When reuse is identified, move to `src/components/ui/`
3. Update all imports to reflect new location
4. Document component props and variants

### 3. Page Organization (`src/pages/`)

**File-Based Routing:**
- Each `.astro` file becomes a route
- Nested folders create nested routes
- Use `index.astro` for directory default pages

**Subpage Strategy Decision Points:**

**Option A: Dedicated Index Pages**
```text
src/pages/
├── services/
│   ├── index.astro       # /services (overview page)
│   ├── moving.astro      # /services/moving
│   └── storage.astro     # /services/storage
```
**When to Use:** Complex section with substantial overview content

**Option B: Direct Subpages**
```text
src/pages/
├── services/
│   ├── moving.astro      # /services/moving
│   └── storage.astro     # /services/storage
```
**When to Use:** Simple navigation, no dedicated overview needed

**Decision Matrix:**
- **Create index page if:** Section needs navigation, overview content, or SEO landing page
- **Skip index page if:** Subpages are independent or section is simple

---

## 🎨 SCSS Architecture

### Hybrid Styling Approach

1. **SCSS Modules** - Global foundation and reusable systems
2. **Utility Classes** - Quick spacing, typography, and layout helpers  
3. **Component SCSS** - Component-specific styling within `.astro` files

### 1. SCSS Modules (Global Foundation)

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
}
```

### 2. Utility Classes (Quick Helpers)

**Purpose:** Consistent spacing, typography sizing, display properties, and text alignment

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

**❌ DON'T Use Utilities For:**
- Colors (use CSS custom properties)
- Complex layouts (use component SCSS)
- Brand-specific styling (use component SCSS)
- Interactive states (use component SCSS)

### 3. Component SCSS (Specific Styling)

**Purpose:** Component-specific styling, custom layouts, brand elements, interactive states

**Location:** `<style lang="scss">` blocks within `.astro` files

**When to Use:**
- Component-specific layouts and positioning
- Brand colors and custom styling
- Interactive states (hover, focus, active)
- Complex responsive behavior
- Unique visual treatments

**Accessing the Design System:**

**Method 1: Import SCSS Abstracts**
```astro
<style lang="scss">
  @use '../styles/abstracts' as *;
  
  .service-card {
    padding: map.get($spacers, 6);
    background: $color-white;
    border-radius: $border-radius-lg;
    
    &:hover {
      transform: translateY(-4px);
      box-shadow: $shadow-lg;
    }
  }
</style>
```

**Method 2: Use CSS Custom Properties**
```astro
<style lang="scss">
  .quote-form {
    background: var(--color-white);
    padding: var(--space-8);
    border-radius: var(--border-radius-lg);
    
    &__input:focus {
      border-color: var(--color-primary);
      box-shadow: 0 0 0 3px rgba(var(--color-primary), 0.1);
    }
  }
</style>
```

---

## 📋 Development Workflow

### Component Development Process

1. **Start with Sections:** Build page-specific components in `src/components/sections/`
2. **Identify Reuse:** Monitor for components used 2+ times
3. **Extract to UI:** Move reusable components to `src/components/ui/`
4. **Update Imports:** Refactor all references to new locations
5. **Document Props:** Add clear prop interfaces and usage examples

### Styling Decision Tree

**Start Here:** Can this be accomplished with utility classes?
- **Yes:** Use utilities (`mt-4`, `text-lg`, `flex`)
- **No:** Continue...

**Is this a global, reusable pattern?**
- **Yes:** Create/extend SCSS modules in `src/styles/`
- **No:** Use component SCSS with `<style lang="scss">`

**Does it need design system values?**
- **Yes:** Import abstracts or use CSS custom properties
- **No:** Use standard CSS values

### Page Structure Recommendations

**Simple Pages:**
```astro
<!-- Minimal imports, direct content -->
---
import PageLayout from '../layouts/PageLayout.astro';
import Container from '../components/ui/Container.astro';
---

<PageLayout title="About">
  <Container>
    <h1>About Us</h1>
    <!-- Direct content -->
  </Container>
</PageLayout>
```

**Complex Pages:**
```astro
<!-- Section-based architecture -->
---
import PageLayout from '../layouts/PageLayout.astro';
import HeroSection from '../components/sections/about/HeroSection.astro';
import TeamSection from '../components/sections/about/TeamSection.astro';
import ValuesSection from '../components/sections/about/ValuesSection.astro';
---

<PageLayout title="About">
  <HeroSection />
  <TeamSection />
  <ValuesSection />
</PageLayout>
```

---

## 🎯 Key Principles

1. **Decentralize sections** for faster, isolated updates
2. **Centralize reusable UI** for consistency and maintainability
3. **Start with utilities** for quick layouts and spacing
4. **Use global SCSS modules** for reusable patterns
5. **Add component SCSS** for custom styling and interactions
6. **Make deliberate decisions** about subpage index pages
7. **Keep components focused** on single responsibilities
8. **Favor CSS custom properties** for values that might change
9. **Use SCSS variables** for complex calculations and mixins

This architecture enables rapid development while maintaining code organization, reusability, and long-term maintainability.