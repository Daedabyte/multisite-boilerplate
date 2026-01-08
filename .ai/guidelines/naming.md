# Naming Conventions

## BEM Class Names

Use the Block__Element--Modifier pattern for all CSS classes:

```html
<div class="card card--featured">
  <h3 class="card__title">Title</h3>
  <p class="card__description">Description</p>
  <a class="card__link card__link--primary">Read More</a>
</div>
```

### Structure

- **Block** - The standalone component name (e.g., `card`, `hero`, `nav`)
- **Element** - A part of the block that has no standalone meaning (e.g., `card__title`, `hero__image`)
- **Modifier** - A variation or state of a block or element (e.g., `card--featured`, `button--large`)

### Examples

```html
<!-- Hero section -->
<section class="hero hero--centered">
  <div class="hero__content">
    <h1 class="hero__title">Welcome</h1>
    <p class="hero__subtitle">Subtitle text</p>
  </div>
  <div class="hero__image">
    <img class="hero__img" src="..." alt="..." />
  </div>
</section>

<!-- Navigation -->
<nav class="nav nav--sticky">
  <ul class="nav__list">
    <li class="nav__item nav__item--active">
      <a class="nav__link" href="/">Home</a>
    </li>
  </ul>
</nav>

<!-- Button variants -->
<button class="button button--primary button--large">Submit</button>
<button class="button button--secondary button--small">Cancel</button>
```

## Component Naming

### File Names

- Astro components: `PascalCase.astro` (e.g., `HeroStandard.astro`, `FeatureGrid.astro`)
- TypeScript files: `kebab-case.ts` (e.g., `types.ts`, `my-feature.ts`)
- SCSS files: `kebab-case.scss` (e.g., `pricing.scss`, `_colors.scss`)

### Type Names

- Interfaces: `PascalCase` with descriptive suffix (e.g., `PricingCardsProps`, `NavItem`)
- Type aliases: `PascalCase` (e.g., `PricingVariant`, `ButtonSize`)

### Data Attributes

Use `kebab-case` for data attribute names:

```html
<div data-accordion data-accordion-multiple="false">
<button data-modal-trigger="contact-modal">
<span data-counter data-counter-target="100" data-counter-suffix="+">
```

## ID Naming

Use `kebab-case` for element IDs:

```html
<section id="hero-section">
<form id="contact-form">
<div id="pricing-cards">
```

## Variable Naming

### CSS Custom Properties

Use `kebab-case` with category prefixes:

```scss
--color-primary
--color-primary-600
--space-4
--font-size-lg
--border-radius-md
--shadow-lg
```

### SCSS Variables

Use `kebab-case` with `$` prefix:

```scss
$brand-colors
$font-family-base
$breakpoints
```

### TypeScript/JavaScript

Use `camelCase` for variables and functions:

```typescript
const modalTrigger = $('[data-modal-trigger]');
function initAccordion() { }
const getDataNumber = (el, attr, fallback) => { };
```

Use `PascalCase` for classes, interfaces, and types:

```typescript
interface FeatureItem { }
type ButtonVariant = 'primary' | 'secondary';
class ModalController { }
```
