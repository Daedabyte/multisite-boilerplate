/**
 * Homepage Content
 *
 * Content data for the homepage. Edit this file to update homepage content.
 * The structure is typed to ensure consistency across the site.
 *
 * @example Usage in page:
 * ```astro
 * import { homepage } from '@data/content';
 * <HeroStandard {...homepage.hero} />
 * ```
 */

import type { HomepageContent } from './types';

export const homepage: HomepageContent = {
    hero: {
        variant: 'standard',
        size: 'partial',
        title: 'Build Better Websites, Faster',
        subtitle: 'A flexible, configuration-driven boilerplate for rapid website development.',
        alignment: 'center',
        // backgroundImage is set in index.astro using imported asset
        actions: [
            {
                label: 'Get Started',
                href: '/contact',
                variant: 'primary',
            },
            {
                label: 'Learn More',
                href: '/about',
                variant: 'secondary',
                outline: true,
            },
        ],
    },

    features: {
        variant: 'grid',
        heading: 'Why Choose Us',
        subheading: 'Everything you need to launch your website quickly and professionally.',
        columns: 3,
        items: [
            {
                title: 'Fast Development',
                description: 'Launch your site in days, not weeks. Our boilerplate handles the heavy lifting.',
                icon: 'fa-solid fa-rocket',
            },
            {
                title: 'Fully Customizable',
                description: 'Every component is configurable. Adapt the design to match your brand.',
                icon: 'fa-solid fa-palette',
            },
            {
                title: 'SEO Optimized',
                description: 'Built-in best practices for search engine optimization and performance.',
                icon: 'fa-solid fa-magnifying-glass',
            },
            {
                title: 'Mobile First',
                description: 'Responsive design that looks great on any device, from phones to desktops.',
                icon: 'fa-solid fa-mobile-screen',
            },
            {
                title: 'Accessible',
                description: 'WCAG compliant components ensure your site is usable by everyone.',
                icon: 'fa-solid fa-universal-access',
            },
            {
                title: 'Modern Stack',
                description: 'Built with Astro, TypeScript, and SCSS for a robust development experience.',
                icon: 'fa-solid fa-code',
            },
        ],
    },

    about: {
        heading: 'About Our Company',
        content: `We're passionate about creating high-quality websites that help businesses succeed online.

With years of experience in web development, we've refined our process to deliver exceptional results efficiently. Our boilerplate represents the culmination of best practices and lessons learned from countless projects.`,
        cta: {
            label: 'Learn More About Us',
            href: '/about',
            variant: 'primary',
        },
    },

    testimonials: {
        heading: 'What Our Clients Say',
        subheading: 'Don\'t just take our word for it.',
        items: [
            {
                quote: 'Working with this team was an absolute pleasure. They delivered our website on time and exceeded our expectations.',
                author: 'Jane Smith',
                title: 'CEO',
                company: 'Tech Startup Inc.',
                rating: 5,
            },
            {
                quote: 'The attention to detail and code quality is outstanding. Our site loads faster than ever.',
                author: 'John Doe',
                title: 'Marketing Director',
                company: 'Growth Agency',
                rating: 5,
            },
            {
                quote: 'Finally, a development team that understands both design and performance. Highly recommended!',
                author: 'Sarah Johnson',
                title: 'Founder',
                company: 'Creative Studio',
                rating: 5,
            },
        ],
    },

    stats: {
        heading: 'Our Track Record',
        items: [
            {
                value: '100+',
                label: 'Projects Completed',
                description: 'Websites launched and maintained',
            },
            {
                value: '50+',
                label: 'Happy Clients',
                description: 'Businesses we\'ve helped grow',
            },
            {
                value: '99%',
                label: 'Satisfaction Rate',
                description: 'Client satisfaction score',
            },
            {
                value: '24/7',
                label: 'Support',
                description: 'We\'re always here to help',
            },
        ],
    },

    cta: {
        variant: 'banner',
        heading: 'Ready to Get Started?',
        description: 'Let\'s build something great together. Contact us today for a free consultation.',
        actions: [
            {
                label: 'Contact Us',
                href: '/contact',
                variant: 'primary',
            },
            {
                label: 'View Documentation',
                href: '/docs',
                variant: 'secondary',
                outline: true,
            },
        ],
    },

    faq: {
        heading: 'Frequently Asked Questions',
        subheading: 'Got questions? We\'ve got answers.',
        items: [
            {
                question: 'How long does it take to build a website?',
                answer: 'Depending on the complexity, most websites can be completed within 1-3 weeks. Our boilerplate approach allows us to deliver high-quality sites faster than traditional development.',
            },
            {
                question: 'Do you provide ongoing maintenance?',
                answer: 'Yes! We offer various maintenance packages to keep your site secure, updated, and performing optimally.',
            },
            {
                question: 'Can I update the content myself?',
                answer: 'Absolutely. Our sites are built with content management in mind, making it easy for you to update text, images, and other content.',
            },
            {
                question: 'What technologies do you use?',
                answer: 'We use modern technologies like Astro, TypeScript, and SCSS to build fast, maintainable websites that scale with your business.',
            },
        ],
    },
};
