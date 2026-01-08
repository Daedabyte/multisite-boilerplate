# Data & Content Guidelines

## Content Development

Page content lives within its respective astro page under `@/pages/`. Any reusable content or data that drives content through-out the site should be stored in a dedicated `.ts` file in `@data/content/`.

### Examples of reusable content or data are:
- Products
- Event Types
- Service Areas
- Product Categories

** Collective content that can live as multiple simple objects of a standard defined interface type can also be stored as a `.ts` file in `@data/content/`.

## Site Configuration

### Main Config (`src/data/config.ts`)

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
};
```

### Navigation (`src/data/site/navigation.ts`)

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

## Creating New Pages

1. Create the page file in `src/pages/`
2. Implement a layout or create a new one for the page from `src/layout/`
3. Import/Create and compose section components
4. Create content in the page and any necessary data in `src/data/content/`
5. Add page-specific styles and js if needed

### Example Page Structure

```astro
---
// src/pages/about.astro
import Layout from '@components/layout/Layout.astro';
import { teamMembers } from '@data/content/teamMembers';
import ContentSection from '@components/sections/content/ContentSection.astro';
import TeamGrid from '@components/sections/team/TeamGrid.astro';
---

<Layout title="About Us">
  <ContentSection>
    <h1>Hello World!</h1>
  </ContentSection>
  <TeamGrid team={teamMembers} />
</Layout>
```

## Type Definitions

Reusable property types that aren't component-specific (color variations, sizes, etc.) should be defined as Enums in the `src/data/types` directory.

```typescript
export enum Colors {
  PRIMARY = 'primary',
  SECONDARY = 'secondary',
  ACCENT_1 = 'accent-1',
  BLACK = 'black',
  WHITE = 'white',
  DARK = 'dark',
  LIGHT = 'light'
}
```

Reusable content, data that drives content, or simple content iterative content that can be turned into an object can be defined in `src/data/content`.

```typescript
export interface OccasionOption {
  key: string;
  title: string;
  description: string;
  href: string;
}

export const occasionOptions: OccasionOption[] = [
  {
    key: 'catering',
    title: 'Catering',
    description: 'Delight your guests with exquisite, locally curated catering — where every dish is crafted to impress and elevate your DMV event.',
    href: '/special-occasions#catering'
  },
  {
    key: 'grazing_tables',
    title: 'Grazing Tables',
    description: 'Transform your next gathering into an unforgettable experience with our handcrafted luxury charcuterie grazing tables — a true taste of elegance in the heart of the DMV.',
    href: '/special-occasions#grazing_tables'
  },
  {
    key: 'private_events',
    title: 'Private Events',
    description: 'Host an unforgettable celebration with our bespoke private event experiences — elegant, intimate, and tailored to the finest tastes of the DMV.',
    href: '/special-occasions#events'
  },
  {
    key: 'corporate_events',
    title: 'Corporate Events',
    description: 'Impress clients and colleagues alike with our refined corporate event catering — seamlessly blending professionalism, flavor, and sophistication across the DMV.',
    href: '/special-occasions#events'
  }
];
```

## Data Organization

```
src/data/
|-- config.ts           # Main site configuration
|-- content/            # Content/Data 
    |-- example.ts      # Contains data/content in array or dictionary, interface for objects, functions related to data
+-- site/               # Other Site Related Data
    |-- navigation.ts   # Navigation structure
    +-- social.ts       # Social media links
+-- type/               # Standard Enums used in various components or scripts
```
