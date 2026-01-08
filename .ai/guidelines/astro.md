# Astro Guidelines

## Core Concepts

Astro is a content-driven web framework using an "Islands" architecture that renders HTML on the server with zero JavaScript by default. Interactive components are hydrated selectively using `client:` directives.

### Key Principles

- **Server-first rendering** - Components render to HTML at build time
- **Zero JS by default** - No client-side JavaScript unless explicitly added
- **Framework-agnostic** - Supports React, Vue, Svelte, and others via integrations
- **Content-focused** - Optimized for blogs, marketing sites, and documentation

## Project Structure

```
src/
├── assets/          # Optimized images and assets (processed by Astro)
├── components/      # Reusable Astro components
│   ├── layout/      # Structural components (Section, Container, Header, Footer, Hero, SideNav)
│   ├── ui/          # Visual elements (Button, Card, Form fields, Icons, Page Loaders)
│   ├── sections/    # Content formatting (CTAs, FAQs, Features)
│   └── common/      # Reusable components (Gallery, Product Carousel)
├── data/            # Data files and configuration
│   ├── content/     # Page content data
│   └── site/        # Site-wide data (navigation, config)
├── layouts/         # Page layout templates (BaseLayout, DefaultLayout)
├── pages/           # File-based routing (each file becomes a route)
├── scripts/         # Client-side JavaScript behaviors
├── styles/          # Global SCSS stylesheets
└── types/           # TypeScript type definitions
public/              # Static files served as-is (no processing)
```

### Layouts vs Layout Components

- **`src/layouts/`** - Page-level templates that wrap entire pages with `<html>`, `<head>`, and `<body>` tags. Use `<slot />` to inject page content.
- **`src/components/layout/`** - Structural components like Section and Container that control spacing, containment, and page structure within layouts.

## Component Structure

Astro components have two parts: a **frontmatter script** (server-side) and a **template** (HTML output).

```astro
---
/**
 * ComponentName
 * Brief description of what this component does.
 */

// Imports
import Button from '@components/ui/Button.astro';
import type { Props as ButtonProps } from '@components/ui/Button.astro';

// Props interface
interface Props {
  title: string;
  items?: string[];
  button?: ButtonProps;
}

// Destructure with defaults
const { title, items = [], button } = Astro.props;

// Server-side logic (never sent to browser)
const formattedTitle = title.toUpperCase();
---

<section class="component">
  <h2>{formattedTitle}</h2>
  {items.length > 0 && (
    <ul>
      {items.map((item) => <li>{item}</li>)}
    </ul>
  )}
  {button && <Button {...button} />}
  <slot />
</section>

<style lang="scss">
  @use '@styles/abstracts' as *;

  .component {
    padding: var(--spacing-lg);
  }
</style>
```

## Props and Typing

Always define a `Props` interface for type safety:

```astro
---
interface Props {
  variant?: 'primary' | 'secondary';
  size?: 'small' | 'medium' | 'large';
  disabled?: boolean;
  classList?: string;
}

const {
  variant = 'primary',
  size = 'medium',
  disabled = false,
  classList,
  ...attrs
} = Astro.props;
---

<button
  class:list={['button', `button--${variant}`, `button--${size}`, classList]}
  disabled={disabled}
  {...attrs}
>
  <slot />
</button>
```

## Slots

Slots inject content from parent components:

```astro
<!-- Component definition -->
<article class="card">
  <header class="card__header">
    <slot name="header" />
  </header>
  <div class="card__body">
    <slot />  <!-- Default slot -->
  </div>
  <footer class="card__footer">
    <slot name="footer">
      <!-- Fallback content if no slot provided -->
      <p>Default footer</p>
    </slot>
  </footer>
</article>

<!-- Usage -->
<Card>
  <Fragment slot="header">
    <h2>Card Title</h2>
  </Fragment>

  <p>Main content goes in the default slot</p>

  <Fragment slot="footer">
    <Button>Action</Button>
  </Fragment>
</Card>
```

## Styling

### Scoped Styles (Default)

Styles in `<style>` tags are automatically scoped to the component:

```astro
<style lang="scss">
  .card {
    /* Only affects this component's .card elements */
  }
</style>
```

### Global Styles

Use `is:global` when styles must affect slotted or dynamic content:

```astro
<style lang="scss" is:global>
  .card {
    /* Affects all .card elements including children */
  }
</style>
```

### Dynamic Classes with class:list

```astro
---
const { isActive, variant, classList } = Astro.props;
---

<div class:list={[
  'component',
  `component--${variant}`,
  { 'is-active': isActive },
  classList
]}>
```

### CSS Variables from Props

```astro
---
const { color, size } = Astro.props;
---

<div class="box" style={`--color: ${color}; --size: ${size}px;`}>

<style>
  .box {
    background: var(--color);
    width: var(--size);
  }
</style>
```

## Client-Side Scripts

### Component Scripts (Multi-Instance)

Write scripts assuming multiple component instances exist:

```astro
<div class="accordion" data-accordion>
  <button data-accordion-trigger>Toggle</button>
  <div data-accordion-content>Content</div>
</div>

<script>
  // Query ALL instances
  const accordions = document.querySelectorAll('[data-accordion]');

  accordions.forEach((accordion) => {
    const trigger = accordion.querySelector('[data-accordion-trigger]');
    const content = accordion.querySelector('[data-accordion-content]');

    trigger?.addEventListener('click', () => {
      content?.classList.toggle('is-open');
    });
  });
</script>
```

### Single-Use Component Scripts

For components appearing once per page (header, footer, nav):

```astro
<script>
  /**
   * Single-use component script
   * This component should only appear once per page (Header, Nav, Footer)
   */
  const nav = document.querySelector('[data-nav]');

  if (nav) {
    // Initialize single instance
  }
</script>
```

### Re-running Scripts on Page Navigation

With View Transitions, scripts may not re-run. Use lifecycle events:

```astro
<script>
  function initComponent() {
    // Initialization logic
  }

  // Run on initial load
  initComponent();

  // Re-run after view transitions
  document.addEventListener('astro:page-load', initComponent);
</script>
```

### Passing Server Data to Client Scripts

Use data attributes to bridge server and client:

```astro
---
const { userId, config } = Astro.props;
---

<div
  data-user-id={userId}
  data-config={JSON.stringify(config)}
>

<script>
  const element = document.querySelector('[data-user-id]');
  const userId = element?.dataset.userId;
  const config = JSON.parse(element?.dataset.config || '{}');
</script>
```

## Pages and Routing

### File-Based Routing

Files in `src/pages/` automatically become routes:

```
src/pages/index.astro        → /
src/pages/about.astro        → /about
src/pages/blog/index.astro   → /blog
src/pages/blog/[slug].astro  → /blog/:slug (dynamic)
```

### Dynamic Routes

```astro
---
// src/pages/blog/[slug].astro
import { getCollection } from 'astro:content';

export async function getStaticPaths() {
  const posts = await getCollection('blog');
  return posts.map((post) => ({
    params: { slug: post.slug },
    props: { post },
  }));
}

const { post } = Astro.props;
---
```

### Special Pages

- `src/pages/404.astro` - Custom 404 error page
- `src/pages/500.astro` - Custom 500 error page

## Layouts

Layouts provide consistent page structure:

```astro
---
// src/layouts/BaseLayout.astro
interface Props {
  title: string;
  description?: string;
}

const { title, description } = Astro.props;
---

<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width" />
    <meta name="description" content={description} />
    <title>{title}</title>
  </head>
  <body>
    <slot />
  </body>
</html>
```

### Nested Layouts

```astro
---
// src/layouts/BlogLayout.astro
import BaseLayout from './BaseLayout.astro';

const { frontmatter } = Astro.props;
---

<BaseLayout title={frontmatter.title}>
  <article>
    <h1>{frontmatter.title}</h1>
    <slot />
  </article>
</BaseLayout>
```

## Images

### Optimized Images (src/ folder)

```astro
---
import { Image } from 'astro:assets';
import heroImage from '@assets/images/hero.jpg';
---

<Image
  src={heroImage}
  alt="Hero description"
  width={800}
  height={600}
/>
```

### Remote Images

Configure allowed domains in `astro.config.mjs`:

```javascript
export default defineConfig({
  image: {
    domains: ['example.com'],
  },
});
```

### Static Images (public/ folder)

Files in `public/` are served without optimization:

```astro
<img src="/images/logo.svg" alt="Logo" />
```

## View Transitions

Enable smooth page transitions:

```astro
---
// In your layout
import { ClientRouter } from 'astro:transitions';
---

<head>
  <ClientRouter />
</head>
```

### Transition Directives

```astro
<!-- Name elements for cross-page animation pairing -->
<header transition:name="header">

<!-- Custom animation -->
<div transition:animate="slide">

<!-- Persist element state across navigations -->
<video transition:persist>
```

### Lifecycle Events

| Event | When | Use Case |
|-------|------|----------|
| `astro:before-preparation` | Before content loads | Show loading indicator |
| `astro:after-preparation` | After content loads | Hide loading indicator |
| `astro:before-swap` | Before DOM swap | Modify incoming document |
| `astro:after-swap` | After DOM swap | Apply theme/styling |
| `astro:page-load` | After scripts load | Reinitialize event listeners |

## Content Collections

### Defining Collections

```typescript
// src/content.config.ts
import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const blog = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/blog' }),
  schema: z.object({
    title: z.string(),
    date: z.date(),
    draft: z.boolean().default(false),
    tags: z.array(z.string()).optional(),
  }),
});

export const collections = { blog };
```

### Querying Collections

```astro
---
import { getCollection, getEntry } from 'astro:content';

// Get all entries
const allPosts = await getCollection('blog');

// Filter entries
const publishedPosts = await getCollection('blog', ({ data }) => !data.draft);

// Get single entry
const post = await getEntry('blog', 'my-post-slug');
---
```

## Imports and Path Aliases

### Configured Aliases

```typescript
import Component from '@components/ui/Button.astro';
import { config } from '@data/config';
import type { NavItem } from '@types';
import heroImage from '@assets/images/hero.jpg';
import '@styles/global.scss';
```

### Import Patterns

```typescript
// Components - import .astro files directly (no barrel exports)
import Button from '@components/ui/Button.astro';

// Types - use type keyword
import type { Props } from './types';

// Styles
import '@styles/global.scss';

// JSON data
import data from '@data/content.json';

// Multiple files with glob
const posts = await Astro.glob('./posts/*.md');
```

## Common Patterns

### Conditional Rendering

```astro
{showHeader && <Header />}

{items.length > 0 ? (
  <ul>{items.map(item => <li>{item}</li>)}</ul>
) : (
  <p>No items found</p>
)}
```

### Spreading Props

```astro
---
const { href, ...attrs } = Astro.props;
---

<a href={href} {...attrs}>
  <slot />
</a>
```

### Fragment for Multiple Elements

```astro
{items.map(item => (
  <Fragment>
    <dt>{item.term}</dt>
    <dd>{item.definition}</dd>
  </Fragment>
))}
```

### Set HTML Directly

```astro
---
const rawHTML = '<strong>Bold</strong>';
---

<div set:html={rawHTML} />
```
