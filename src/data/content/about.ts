/**
 * About Page Content
 *
 * Content data for the about page. Edit this file to update about page content.
 * The structure is typed to ensure consistency across the site.
 *
 * @example Usage in page:
 * ```astro
 * import { about } from '@data/content';
 * <HeroMinimal {...about.hero} />
 * ```
 */

import type { AboutPageContent } from './types';

export const about: AboutPageContent = {
    hero: {
        variant: 'minimal',
        title: 'About This Boilerplate',
        subtitle: 'A modern, AI-friendly foundation for building websites faster and smarter.',
        alignment: 'center',
    },

    story: {
        heading: 'The Purpose',
        content: `This boilerplate was born from a simple observation: most website projects share the same foundational needs, yet developers spend countless hours rebuilding the same patterns from scratch.

We created this Astro-based boilerplate to solve that problem. It provides a pre-configured, variant-based component system that handles the common patterns—headers, footers, heroes, features sections, CTAs—so you can focus on what makes each project unique.

The key insight is that content should be separate from presentation. By defining typed content data structures and flexible component variants, we enable rapid site development without sacrificing quality or customization.`,
    },

    mission: {
        heading: 'The Philosophy',
        content: `This boilerplate is built on three core principles:

**Configuration over Code**: Change your site's appearance by selecting component variants and updating content data, not by rewriting templates.

**AI-Friendly Architecture**: Structured content types and clear separation of concerns make it easy for AI assistants to populate and modify content programmatically.

**Developer Experience First**: TypeScript throughout, SCSS with design tokens, path aliases, and comprehensive documentation ensure a smooth development workflow.`,
    },

    values: {
        heading: 'Core Features',
        subheading: 'What makes this boilerplate different.',
        variant: 'grid',
        columns: 3,
        items: [
            {
                title: 'Variant-Based Components',
                description: 'Each component category (heroes, footers, CTAs) offers multiple layouts sharing the same TypeScript interface.',
                icon: 'fa-solid fa-layer-group',
            },
            {
                title: 'Typed Content Data',
                description: 'Content lives in TypeScript files with full type safety, making it easy to populate and validate.',
                icon: 'fa-solid fa-file-code',
            },
            {
                title: 'Design Token System',
                description: 'CSS custom properties for colors, spacing, and typography ensure consistent, themeable styling.',
                icon: 'fa-solid fa-palette',
            },
            {
                title: 'Unified Navigation',
                description: 'Define links once, display them in header, footer, or both with visibility controls.',
                icon: 'fa-solid fa-sitemap',
            },
            {
                title: 'Responsive & Accessible',
                description: 'Mobile-first design with WCAG-compliant components and semantic HTML throughout.',
                icon: 'fa-solid fa-universal-access',
            },
            {
                title: 'Interactive Behaviors',
                description: 'Data-attribute-driven JavaScript for accordions, counters, reveals, and more—no framework required.',
                icon: 'fa-solid fa-wand-magic-sparkles',
            },
        ],
    },

    team: {
        heading: 'Technology Stack',
        subheading: 'Built with modern, battle-tested tools.',
        members: [
            {
                name: 'Astro 5.x',
                role: 'Framework',
                bio: 'Static-first architecture with island hydration. Zero JavaScript by default, incredibly fast builds.',
            },
            {
                name: 'TypeScript',
                role: 'Language',
                bio: 'Full type safety across components, content data, and configuration. Catch errors before they reach production.',
            },
            {
                name: 'SCSS',
                role: 'Styling',
                bio: 'Modular stylesheets with design tokens, utility mixins, and automatic color palette generation.',
            },
            {
                name: 'Font Awesome',
                role: 'Icons',
                bio: 'Comprehensive icon library integrated via CDN for easy access to thousands of icons.',
            },
        ],
    },

    timeline: [
        {
            year: 'Themes',
            title: 'Pre-Built Theme Presets',
            description: 'One-click theme switching with curated color palettes, typography pairings, and component styling for different industries—SaaS, agency, e-commerce, portfolio, and more.',
        },
        {
            year: 'Components',
            title: 'Expanded Component Library',
            description: 'Pricing tables, testimonial carousels, team grids, blog cards, portfolio galleries, contact forms with validation, and newsletter signup sections.',
        },
        {
            year: 'Config',
            title: 'Visual Configuration',
            description: 'A companion web tool for configuring site settings, selecting component variants, and previewing changes in real-time without touching code.',
        },
        {
            year: 'CMS',
            title: 'Headless CMS Integration',
            description: 'First-class support for popular headless CMS platforms like Sanity, Strapi, and Contentful with pre-built content schemas and data fetching utilities.',
        },
        {
            year: 'Commerce',
            title: 'E-Commerce Components',
            description: 'Product cards, shopping cart, checkout flow, and integration patterns for Shopify, Snipcart, and Stripe for building online stores.',
        },
        {
            year: 'CLI',
            title: 'Project Scaffolding CLI',
            description: 'Interactive command-line tool to scaffold new projects, select theme presets, choose component variants, and configure integrations from the start.',
        },
        {
            year: 'AI',
            title: 'AI Content Generation',
            description: 'Built-in prompts and workflows for AI assistants to generate and populate content data, create new pages, and customize components intelligently.',
        },
        {
            year: 'i18n',
            title: 'Internationalization',
            description: 'Multi-language support with locale-aware routing, translated content structures, and RTL layout support for global audiences.',
        },
    ],

    cta: {
        variant: 'simple',
        heading: 'Ready to Build?',
        description: 'Explore the documentation to see all available components and start building your next project.',
        actions: [
            {
                label: 'View Components',
                href: '/docs/components',
                variant: 'primary',
            },
            {
                label: 'Read the Docs',
                href: '/docs',
                variant: 'secondary',
            },
        ],
    },
};
