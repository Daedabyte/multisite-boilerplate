/**
 * Site Configuration
 *
 * Central configuration for the entire site.
 * Navigation is imported from the unified navigation module.
 */

import type { CTAAction } from '@components/ui/buttons/types';
import {
  navigation,
  socialLinks,
  footerLinkGroups,
  headerNavigation,
  footerSocialLinks,
  type NavigationConfig,
} from './site/navigation';

// ===================================
// Component Configuration
// ===================================

/**
 * Component variant selection for site-wide defaults
 */
export interface ComponentConfig {
  /** Header layout variant */
  header: 'standard' | 'centered' | 'minimal';
  /** Footer layout variant */
  footer: 'standard' | 'simple' | 'centered';
}

// ===================================
// Logo Configuration
// ===================================

/**
 * Site logo configuration
 */
export interface LogoConfig {
  /** Logo image path or import */
  src: string;
  /** Alt text for accessibility */
  alt: string;
  /** Link destination (defaults to '/') */
  href?: string;
  /** Logo width in pixels */
  width?: number;
  /** Logo height in pixels */
  height?: number;
}

// ===================================
// Company Information
// ===================================

/**
 * Business/company information
 */
export interface CompanyInfo {
  name: string;
  founded?: string;
  address?: string;
  city?: string;
  state?: string;
  zip?: string;
  country?: string;
  phone?: string;
  phoneFormatted?: string;
  email?: string;
  /** Business hours */
  hours?: {
    weekdays?: string;
    weekends?: string;
    holidays?: string;
  };
}

// ===================================
// Feature Flags
// ===================================

/**
 * Site feature toggles and configurations
 */
export interface FeaturesConfig {
  /** Analytics configuration */
  analytics?: {
    googleAnalyticsId?: string;
    [key: string]: any;
  };
  /** Form handling configuration */
  forms?: {
    web3FormsId?: string;
    [key: string]: any;
  };
  /** Enable/disable site search */
  search?: boolean;
  /** Enable/disable shopping cart */
  cart?: boolean;
}

// ===================================
// Main Site Configuration
// ===================================

export interface SiteConfig {
  // Basic site info
  siteName: string;
  siteShortName: string;
  siteDescription: string;
  siteUrl: string;

  // SEO
  defaultImage: string;

  // Branding
  logo: LogoConfig;

  // Header CTA (optional call-to-action button)
  headerCta?: CTAAction;

  // Business Information
  company: CompanyInfo;

  // Features
  features: FeaturesConfig;

  // Component variant selection
  components: ComponentConfig;
}

export const config: SiteConfig = {
  // Basic site info
  siteName: 'Your Site Name',
  siteShortName: 'SiteShort',
  siteDescription: 'An example site configuration',
  siteUrl: 'https://your-site-url.com',

  // SEO
  defaultImage: '/default-image.png',

  // Branding
  logo: {
    src: '/images/logo.png',
    alt: 'Your Site Name',
    href: '/',
    width: 120,
    height: 40,
  },

  // Header CTA
  headerCta: {
    label: 'Get Started',
    href: '/contact',
    variant: 'primary',
  },

  // Business Information
  company: {
    name: 'Your Company Name',
    founded: '2020',
    address: '1234 Main St',
    city: 'Your City',
    state: 'Your State',
    zip: '12345',
    phone: '5551234567',
    phoneFormatted: '(555) 123-4567',
    email: 'hello@yoursite.com',
  },

  // Features
  features: {
    analytics: {
      googleAnalyticsId: 'UA-XXXXXX-X',
    },
    forms: {
      web3FormsId: 'your-web3forms-id',
    },
    search: false,
    cart: false,
  },

  // Component variant selection
  components: {
    header: 'standard',
    footer: 'standard',
  },
};

// ===================================
// Convenience Exports
// ===================================

export const siteInfo = {
  name: config.siteName,
  shortName: config.siteShortName,
  description: config.siteDescription,
  url: config.siteUrl,
  defaultImage: config.defaultImage,
};

export const logo = config.logo;
export const companyInfo = config.company;
export const features = config.features;
export const componentConfig = config.components;
export const headerCta = config.headerCta;

// ===================================
// Navigation Exports (from unified nav)
// ===================================

// Re-export navigation items for components
export {
  navigation,
  socialLinks,
  footerLinkGroups,
  headerNavigation,
  footerSocialLinks,
} from './site/navigation';

// Re-export types
export type { NavItem, NavLink, SocialLink, FooterLinkGroup } from '@types';
