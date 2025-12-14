/**
 * Header Component Types
 * Shared interfaces for all header variants
 */

import type {
  BaseProps,
  ContainerProps,
  CTAAction,
  ImageProps,
  NavItem,
  NavLink,
  SocialLink,
} from '@types';

// ===================================
// Header Variants
// ===================================

/**
 * Available header layout variants
 */
export type HeaderVariant = 'standard' | 'centered' | 'minimal';

// ===================================
// Header Props
// ===================================

/**
 * Base props shared by all header variants
 */
export interface HeaderBaseProps extends BaseProps {
  /** Logo image configuration */
  logo?: {
    src: string;
    alt: string;
    href?: string;
  };
  /** Navigation items */
  navigation?: Record<string, NavItem | NavLink>;
  /** Whether header is transparent on load */
  transparent?: boolean;
  /** Whether header is sticky/fixed */
  sticky?: boolean;
  /** Container configuration */
  container?: ContainerProps;
}

/**
 * Standard header: logo left, nav right
 */
export interface HeaderStandardProps extends HeaderBaseProps {
  variant?: 'standard';
  /** Call-to-action button in header */
  cta?: CTAAction;
  /** Utility links (social, cart, search) */
  utilities?: {
    social?: SocialLink[];
    cart?: boolean;
    search?: boolean;
  };
}

/**
 * Centered header: logo center, nav below or split
 */
export interface HeaderCenteredProps extends HeaderBaseProps {
  variant?: 'centered';
  /** Tagline below logo */
  tagline?: string;
  /** Utility links positioned at edges */
  utilities?: {
    social?: SocialLink[];
    cart?: boolean;
    search?: boolean;
  };
}

/**
 * Minimal header: logo + hamburger only (mobile-first)
 */
export interface HeaderMinimalProps extends HeaderBaseProps {
  variant?: 'minimal';
}

/**
 * Union type for all header variants
 */
export type HeaderProps =
  | HeaderStandardProps
  | HeaderCenteredProps
  | HeaderMinimalProps;

// ===================================
// Internal Component Props
// ===================================

/**
 * Props for shared NavLinks component
 */
export interface NavLinksProps {
  /** Navigation items to render */
  items: Record<string, NavItem | NavLink>;
  /** Current page path for active state */
  currentPath: string;
  /** Nesting depth (for styling) */
  depth?: number;
}

/**
 * Props for shared MobileNav component
 */
export interface MobileNavProps {
  /** Navigation items */
  items: Record<string, NavItem | NavLink>;
  /** Current page path */
  currentPath: string;
  /** Open state */
  isOpen?: boolean;
}
