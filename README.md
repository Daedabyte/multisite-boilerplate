# Multisite Boilerplate

A flexible, variant-based Astro boilerplate for rapid website development. Features configuration-driven component selection, data-attribute driven JavaScript behaviors, and a content-first architecture.

## Quick Start

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

---

## Architecture Overview

### Core Concepts

1. **Component Variants** - Each component category (headers, footers, heroes) has multiple variants that share TypeScript interfaces
2. **Configuration-Driven** - Site config determines which component variants are used globally
3. **Data-Attribute Behaviors** - JavaScript behaviors are opt-in via `data-*` attributes
4. **Content-First** - Typed content structures enable AI-assisted content population

### Project Structure

```
src/
├── components/
│   ├── common/
│   │   ├── headers/          # Header variants (Standard, Centered, Minimal)
│   │   └── footers/          # Footer variants (Standard, Simple, Centered)
│   ├── sections/
│   │   ├── heroes/           # Hero variants (Standard, Split, Minimal)
│   │   ├── features/         # Feature section variants
│   │   └── cta/              # CTA variants
│   └── ui/                   # Reusable UI components (Button, Card, Container)
├── data/
│   ├── config.ts             # Site configuration
│   ├── content/              # Page content data files
│   └── site/                 # Site-wide data (navigation)
├── layouts/
│   ├── BaseLayout.astro      # HTML base layout
│   └── DefaultLayout.astro   # Config-driven header/footer selection
├── scripts/
│   ├── core/                 # Utility functions (dom, events, observers, scroll)
│   ├── behaviors/            # Interactive behaviors (modal, accordion, tabs)
│   ├── animations/           # Scroll animations (reveal, stagger, counter)
│   └── init.ts               # Auto-initialization
├── styles/
│   ├── abstracts/            # Variables, mixins, functions
│   ├── base/                 # Reset, typography, base elements
│   └── components/           # Component-specific styles
└── types/                    # Centralized TypeScript interfaces
```

---

## Component System

### Variant-Based Architecture

Each component category provides multiple variants with shared interfaces. Switching variants never requires content restructuring.

#### Headers

| Variant | Description | Best For |
|---------|-------------|----------|
| `HeaderStandard` | Logo left, nav right | Corporate sites, blogs |
| `HeaderCentered` | Logo center, nav split | Brand-focused sites, restaurants |
| `HeaderMinimal` | Logo + hamburger only | Portfolios, single-page sites |

#### Footers

| Variant | Description | Best For |
|---------|-------------|----------|
| `FooterStandard` | Multi-column with link groups | Corporate, e-commerce |
| `FooterSimple` | Single row minimal | Landing pages, portfolios |
| `FooterCentered` | Centered, stacked layout | Brand-focused sites |

#### Heroes

| Variant | Description | Best For |
|---------|-------------|----------|
| `HeroStandard` | Background image with overlay | Landing pages, marketing |
| `HeroSplit` | Content + image side by side | Product showcases, SaaS |
| `HeroMinimal` | Text only with breadcrumbs | Inner pages, documentation |

### Configuration-Driven Selection

Set component variants globally in `src/data/config.ts`:

```typescript
export const config: SiteConfig = {
  // ... other config
  components: {
    header: 'standard',  // 'standard' | 'centered' | 'minimal'
    footer: 'standard',  // 'standard' | 'simple' | 'centered'
  },
};
```

The `DefaultLayout.astro` automatically selects the correct component:

```astro
---
import { componentConfig } from "@data/config";
import { HeaderStandard, HeaderCentered, HeaderMinimal } from "@components/layout/headers";

const headers = {
  standard: HeaderStandard,
  centered: HeaderCentered,
  minimal: HeaderMinimal,
};

const Header = headers[componentConfig.header];
---

<Header />
```

### Path Aliases

Import components using path aliases:

```typescript
import { HeaderStandard } from '@components/layout/headers';
import { HeroSplit } from '@components/layout/heroes';
import type { NavItem } from '@types/navigation';
import { config } from '@data/config';
```

---

## JavaScript Behaviors

### Data-Attribute Driven

All JavaScript behaviors are opt-in via `data-*` attributes. No JavaScript changes needed per-project.

### Available Behaviors

#### Modal

```html
<button data-modal-trigger="contact-modal">Open</button>
<dialog data-modal="contact-modal" data-modal-close-on-overlay="true">
  <button data-modal-close>×</button>
  <div>Modal content</div>
</dialog>
```

#### Accordion

```html
<div data-accordion data-accordion-multiple="false">
  <div data-accordion-item>
    <button data-accordion-trigger>Question</button>
    <div data-accordion-content>Answer</div>
  </div>
</div>
```

#### Tabs

```html
<div data-tabs>
  <div role="tablist">
    <button data-tab-trigger="tab1" data-tab-active>Tab 1</button>
    <button data-tab-trigger="tab2">Tab 2</button>
  </div>
  <div data-tab-content="tab1" data-tab-active>Content 1</div>
  <div data-tab-content="tab2">Content 2</div>
</div>
```

#### Dropdown

```html
<div data-dropdown>
  <button data-dropdown-trigger>Menu</button>
  <div data-dropdown-content>
    <a href="#" data-dropdown-item>Item 1</a>
    <a href="#" data-dropdown-item>Item 2</a>
  </div>
</div>
```

#### Form Validation

```html
<form data-validate>
  <div data-field>
    <label for="email">Email</label>
    <input
      type="email"
      id="email"
      data-validate-required
      data-validate-email
      data-validate-message-required="Email is required"
    />
    <span data-field-error></span>
  </div>
</form>
```

### Animation System

#### Scroll Reveal

```html
<div data-reveal="fade-up" data-reveal-delay="100">Content</div>
```

Reveal types: `fade`, `fade-up`, `fade-down`, `fade-left`, `fade-right`, `zoom`, `flip`

#### Stagger Animation

```html
<div data-stagger data-stagger-delay="100">
  <div>Child 1</div>
  <div>Child 2</div>
  <div>Child 3</div>
</div>
```

#### Counter Animation

```html
<span data-counter data-counter-target="1500" data-counter-duration="2000">0</span>
```

#### Parallax

```html
<div data-parallax data-parallax-speed="0.5">Background content</div>
```

### Auto-Initialization

All behaviors auto-initialize when `DefaultLayout.astro` is used:

```astro
<script>
  import '@scripts/init';
</script>
```

Or initialize manually:

```typescript
import * as modal from '@scripts/behaviors/modal';
modal.init();
```

---

## Content Data Structure

### Typed Content Files

Create content data files in `src/data/content/`:

```typescript
// src/data/content/homepage.ts
import type { HomepageContent } from './types';

export const homepage: HomepageContent = {
  hero: {
    variant: 'standard',
    title: 'Welcome to Our Site',
    subtitle: 'We help you achieve your goals',
    actions: [
      { label: 'Get Started', href: '/contact', variant: 'primary' }
    ],
  },
  features: {
    heading: 'Our Features',
    items: [
      { title: 'Feature 1', description: 'Description', icon: 'fa-star' }
    ],
  },
};
```

### Usage in Pages

```astro
---
import { homepage } from '@data/content';
import { HeroStandard } from '@components/layout/heroes';
---

<HeroStandard {...homepage.hero} />
```

---

## SCSS Architecture

### CSS Custom Properties

All components use CSS custom properties for theming:

```scss
// Header theming
--header-height: 5rem;
--header-background: var(--color-black);
--header-color: var(--color-white);

// Form theming
--input-border-color: var(--color-neutral-300);
--input-focus-border-color: var(--color-primary);

// Section theming
--section-padding-y: var(--space-16);
--section-background: var(--color-white);
```

### Abstracts System

```scss
// Access design tokens
@use '../styles/abstracts' as *;

.component {
  padding: spacer(6);
  background: color('primary', 500);
  border-radius: border-radius('lg');

  @include media-up('lg') {
    padding: spacer(8);
  }
}
```

### Component SCSS Pattern

Each component category has a shared SCSS file:

```scss
// src/components/common/headers/headers.scss
@use 'sass:map';
@use '../../../styles/abstracts' as *;

.header {
  position: fixed;
  width: 100%;
  background-color: var(--header-background);

  &--standard { /* variant styles */ }
  &--centered { /* variant styles */ }
  &--minimal { /* variant styles */ }
}
```

---

## TypeScript Interfaces

### Centralized Types

All types are in `src/types/`:

```typescript
// Base props shared by all components
import type { BaseProps } from '@types/components';

// Navigation types with guards
import { type NavItem, isNavLink, hasChildren } from '@types/navigation';

// Content types for pages
import type { HomepageContent, AboutPageContent } from '@data/content/types';
```

### Component Props Pattern

```typescript
// src/components/sections/heroes/types.ts
import type { BaseProps, CTAAction, ContainerProps } from '@types/components';

export type HeroVariant = 'standard' | 'split' | 'minimal';

export interface HeroProps extends BaseProps {
  title: string;
  subtitle?: string;
  actions?: CTAAction[];
  size?: 'full' | 'partial' | 'auto';
  alignment?: 'left' | 'center' | 'right';
}
```

---

## Development Workflow

### Adding a New Component Variant

1. Create variant file: `ComponentVariant.astro`
2. Add documentation header comment
3. Import shared types from `types.ts`
4. Use shared styles from component SCSS
5. Export from `index.ts`

### Adding a New Behavior

1. Create behavior file in `src/scripts/behaviors/`
2. Export `init()` for auto-initialization
3. Export programmatic API
4. Add data attribute documentation
5. Import in `src/scripts/init.ts`

### Per-Client Customization

1. Update `src/data/config.ts` with site settings
2. Choose component variants
3. Customize CSS custom properties
4. Create content data files
5. Override SCSS variables in abstracts

---

## Key Principles

1. **Props are content-shaped, not design-shaped** - Variants handle layout, props handle content
2. **Underscore prefix for internal components** - `_MobileNav.astro` indicates non-public
3. **No JavaScript for layout differences** - Use CSS and data attributes
4. **Each variant is self-contained** - Can be understood in isolation
5. **Accessibility first** - Proper ARIA, focus management, keyboard navigation
6. **2-3 variants per category initially** - Add variants as patterns emerge

---

## Commands

```bash
npm run dev       # Start dev server
npm run build     # Build for production
npm run preview   # Preview production build
npm run astro     # Run Astro CLI
```
