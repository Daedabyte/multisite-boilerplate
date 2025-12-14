/**
 * Site Navigation Configuration
 *
 * Unified navigation structure for headers, footers, and mobile menus.
 * Use `showIn` to control where links appear:
 * - 'both': Header and footer (default)
 * - 'header': Header only
 * - 'footer': Footer only
 * - 'none': Hidden
 *
 * @module navigation
 */

import type {
  NavItem,
  NavLink,
  SocialLink,
  FooterLinkGroup,
  NavigationConfig,
} from '@types';

// Re-export types and helpers for convenience
export type { NavItem, NavLink, SocialLink, FooterLinkGroup, NavigationConfig } from '@types';
export {
  isNavLink,
  asNavLink,
  hasChildren,
  showInHeader,
  showInFooter,
  getHeaderNavItems,
  getFooterLinkGroups,
  getFooterLinks,
  getHeaderSocialLinks,
  getFooterSocialLinks,
} from '@types';

// ===================================
// Main Navigation Items
// ===================================

/**
 * Site navigation items
 * These appear in header, footer, or both based on `showIn` property
 *
 * Current pages in src/pages/:
 * - / (index.astro)
 * - /about (about.astro)
 * - /contact (contact.astro)
 * - /docs (docs/index.astro)
 * - /docs/components, /docs/behaviors, /docs/styling, /docs/colors
 * - /404 (404.astro)
 */
export const navigation: Record<string, NavItem | NavLink> = {
  home: {
    label: 'Home',
    url: '/',
    showIn: 'header', // Home typically only in header
    order: 0,
  },

  about: {
    label: 'About',
    url: '/about',
    showIn: 'both',
    footerGroupTitle: 'Company',
    order: 1,
  },

  docs: {
    label: 'Docs',
    url: '/docs',
    showIn: 'both',
    footerGroupTitle: 'Resources',
    order: 2,
    children: {
      components: {
        label: 'Components',
        url: '/docs/components',
        showIn: 'both',
      },
      behaviors: {
        label: 'Behaviors',
        url: '/docs/behaviors',
        showIn: 'both',
      },
      styling: {
        label: 'Styling',
        url: '/docs/styling',
        showIn: 'both',
      },
      colors: {
        label: 'Colors',
        url: '/docs/colors',
        showIn: 'both',
      },
    },
  },

  contact: {
    label: 'Contact',
    url: '/contact',
    showIn: 'both',
    order: 3,
  },
};

// ===================================
// Social Links
// ===================================

/**
 * Social media links
 * Use `showIn` to control where they appear
 */
export const socialLinks: SocialLink[] = [
  {
    platform: 'twitter',
    url: 'https://twitter.com/your_handle',
    label: 'Follow us on Twitter',
    showIn: 'both',
  },
  {
    platform: 'facebook',
    url: 'https://facebook.com/your_page',
    label: 'Like us on Facebook',
    showIn: 'footer', // Footer only
  },
  {
    platform: 'instagram',
    url: 'https://instagram.com/your_handle',
    label: 'Follow us on Instagram',
    showIn: 'both',
  },
  {
    platform: 'linkedin',
    url: 'https://linkedin.com/company/your_company',
    label: 'Connect on LinkedIn',
    showIn: 'both',
  },
  {
    platform: 'github',
    url: 'https://github.com/your_org',
    label: 'View our GitHub',
    showIn: 'footer', // Footer only
  },
];

// ===================================
// Footer-Only Link Groups
// ===================================

/**
 * Additional footer link groups
 * These are footer-only items like legal pages
 *
 * Note: Add these pages to src/pages/ when needed:
 * - /privacy (privacy.astro)
 * - /terms (terms.astro)
 * - /cookies (cookies.astro)
 * - /accessibility (accessibility.astro)
 */
export const footerOnlyGroups: FooterLinkGroup[] = [
  // Uncomment when legal pages are created
  // {
  //   title: 'Legal',
  //   order: 100,
  //   links: [
  //     { href: '/privacy', label: 'Privacy Policy' },
  //     { href: '/terms', label: 'Terms of Service' },
  //     { href: '/cookies', label: 'Cookie Policy' },
  //     { href: '/accessibility', label: 'Accessibility' },
  //   ],
  // },
];

// ===================================
// Combined Navigation Config
// ===================================

/**
 * Complete navigation configuration
 * Import this for the full navigation setup
 */
export const navigationConfig: NavigationConfig = {
  items: navigation,
  social: socialLinks,
  footerGroups: footerOnlyGroups,
};

// ===================================
// Convenience Exports
// ===================================

// Pre-computed values for common use cases
import {
  getHeaderNavItems,
  getFooterLinkGroups,
  getFooterSocialLinks,
} from '@types';

/** Navigation items filtered for header display */
export const headerNavigation = getHeaderNavItems(navigation);

/** Footer link groups (auto-generated from navigation + footer-only groups) */
export const footerLinkGroups = getFooterLinkGroups(navigation, footerOnlyGroups);

/** Social links filtered for footer display */
export const footerSocialLinks = getFooterSocialLinks(socialLinks);
