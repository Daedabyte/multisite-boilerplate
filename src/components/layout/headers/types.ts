/**
 * Header Component Types
 * Base/shared interfaces for all header variants
 * Variant-specific props are defined in each variant's .astro file
 */

import type {
  BaseProps,
  ContainerProps,
  NavItem,
  NavLink,
} from '@types';

// ===================================
// Header Base Props
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
    width?: number;
    height?: number;
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
