# TypeScript Guidelines

## General Rules

- **TypeScript everywhere** - All JavaScript and data files use TypeScript.
- **Path aliases** - Always use path aliases for imports:

```typescript
import { CTAAction } from '@types';
import Button from '@components/ui/Button.astro';
import { config } from '@data/config';
```

- **Register aliases** - New and existing path aliases must be registered in `tsconfig.json`:

```json
{
  "compilerOptions": {
    "paths": {
      "@components/*": ["src/components/*"],
      "@data/*": ["src/data/*"],
      "@types": ["src/types/index"],
      "@types/*": ["src/types/*"]
    }
  }
}
```

## Astro TypeScript Configuration

### Config Templates

Astro provides three extensible `tsconfig.json` templates:
- **base** - Minimal TypeScript support
- **strict** - Recommended for TypeScript projects
- **strictest** - Maximum type safety

This project extends `strict`:

```json
{
  "extends": "astro/tsconfigs/strict",
  "include": [".astro/types.d.ts", "**/*"],
  "exclude": ["dist"]
}
```

### Type Imports

Enable `verbatimModuleSyntax` to enforce explicit type imports:

```json
{
  "compilerOptions": {
    "verbatimModuleSyntax": true
  }
}
```

Use `type` keyword when importing types to prevent bundler issues:

```typescript
import type { Props } from './types';
import type { HTMLAttributes } from 'astro/types';
```

### Component Props Typing

Define a `Props` interface in component frontmatter:

```astro
---
interface Props {
  name: string;
  greeting?: string;
}

const { greeting = "Hello", name } = Astro.props;
---
```

### Astro Type Utilities

Import helpful types from `astro/types`:

| Type | Use Case |
|------|----------|
| `HTMLAttributes<T>` | Type valid HTML attributes for specific elements |
| `ComponentProps<T>` | Reference another component's prop types |
| `Polymorphic<T>` | Build components that render as different HTML elements |
| `GetStaticPaths` | Infer types from dynamic route parameters |

```typescript
import type { HTMLAttributes, ComponentProps } from 'astro/types';
import type Button from '@components/ui/Button.astro';

// Get props from another component
type ButtonProps = ComponentProps<typeof Button>;

// Type HTML attributes for a specific element
interface Props extends HTMLAttributes<'a'> {
  variant?: 'primary' | 'secondary';
}
```

### Global Type Extensions

Create `src/env.d.ts` for custom global declarations:

```typescript
// Extend Window interface
interface Window {
  myFunction(): boolean;
}

// Add custom data attributes
declare namespace astroHTML.JSX {
  interface HTMLAttributes {
    "data-count"?: number;
  }
}
```

### Type Checking

Run `astro check` to validate `.astro` and `.ts` files before deployment:

```bash
npx astro check
```

Add to build process for CI:

```json
{
  "scripts": {
    "build": "astro check && astro build"
  }
}
```

## JavaScript Architecture

### Directory Structure

```
src/scripts/
|-- core/           # DOM utilities, events, observers, scroll helpers
|-- behaviors/      # Interactive features (modal, accordion, tabs, dropdown)
|-- animations/     # Animation modules (scroll-reveal, counter, stagger)
|-- utils/          # Pure utility functions (debounce, throttle)
+-- init.ts         # Auto-initialization based on DOM presence
```

### Data-Attribute Pattern

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

## Creating New Behaviors

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

## Core Utilities

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

## Built-In Behaviors Reference

| Behavior | Data Attributes | Use Case |
|----------|----------------|----------|
| Modal | `data-modal`, `data-modal-trigger` | Dialogs, lightboxes |
| Accordion | `data-accordion`, `data-accordion-item` | FAQs, collapsible content |
| Tabs | `data-tabs`, `data-tab` | Tabbed interfaces |
| Dropdown | `data-dropdown`, `data-dropdown-trigger` | Navigation menus |
| Counter | `data-counter`, `data-counter-target` | Animated statistics |
| Scroll Reveal | `data-reveal` | Entrance animations |
| Stagger | `data-stagger` | Sequential animations |
