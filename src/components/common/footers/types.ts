/**
 * Footer Component Types
 * Shared interfaces for all footer variants
 */

import type { ImageMetadata } from 'astro';
import type {
  BaseProps,
  ContainerProps,
  FooterLinkGroup,
  SocialLink,
} from '@types';

// ===================================
// Footer Variants
// ===================================

/**
 * Available footer layout variants
 */
export type FooterVariant = 'standard' | 'simple' | 'centered';

// ===================================
// Footer Props
// ===================================

/**
 * Base props shared by all footer variants
 */
export interface FooterBaseProps extends BaseProps {
  /** Logo image configuration (falls back to default logo if not provided) */
  logo?: {
    /** Image source - can be an imported image or URL string */
    src: ImageMetadata | string;
    /** Alt text for accessibility */
    alt: string;
    /** Link destination (defaults to '/') */
    href?: string;
    /** Logo width in pixels */
    width?: number;
    /** Logo height in pixels */
    height?: number;
  };
  /** Company/site description */
  description?: string;
  /** Copyright text (year auto-added if not present) */
  copyright?: string;
  /** Container configuration */
  container?: ContainerProps;
}

/**
 * Standard footer: multi-column with links
 */
export interface FooterStandardProps extends FooterBaseProps {
  variant?: 'standard';
  /** Link groups for footer columns */
  linkGroups?: FooterLinkGroup[];
  /** Social media links */
  socialLinks?: SocialLink[];
  /** Contact information */
  contact?: {
    phone?: string;
    phoneFormatted?: string;
    email?: string;
    address?: string;
  };
  /** Attribution/credit message */
  attribution?: {
    message: string;
    link?: {
      href: string;
      label: string;
    };
  };
}

/**
 * Simple footer: single row, minimal content
 */
export interface FooterSimpleProps extends FooterBaseProps {
  variant?: 'simple';
  /** Quick links in single row */
  links?: Array<{
    href: string;
    label: string;
    external?: boolean;
  }>;
}

/**
 * Centered footer: stacked, centered content
 */
export interface FooterCenteredProps extends FooterBaseProps {
  variant?: 'centered';
  /** Social media links */
  socialLinks?: SocialLink[];
  /** Quick links below social */
  links?: Array<{
    href: string;
    label: string;
    external?: boolean;
  }>;
}

/**
 * Union type for all footer variants
 */
export type FooterProps =
  | FooterStandardProps
  | FooterSimpleProps
  | FooterCenteredProps;
