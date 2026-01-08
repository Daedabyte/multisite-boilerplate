/**
 * Base Component Types
 * Shared interfaces used across all components in the boilerplate
 */

// ===================================
// Base Props
// ===================================

/**
 * Base props that all components can accept
 * Use with class:list directive in components
 */
export interface BaseProps {
  /** Additional CSS classes (for class:list directive) */
  classList?: string | string[] | Record<string, boolean>;
  /** HTML id attribute */
  id?: string;
}

/**
 * Props for components that render as different HTML elements
 */
export interface PolymorphicProps extends BaseProps {
  /** HTML element to render as */
  as?: keyof HTMLElementTagNameMap;
}

// ===================================
// Color Types
// ===================================

/**
 * Brand color names matching SCSS $brand-colors
 * @see src/styles/abstracts/_colors.scss
 */
export type BrandColor =
  | 'primary'
  | 'secondary'
  | 'tertiary'
  | 'success'
  | 'danger'
  | 'warning'
  | 'info';

/**
 * All available color names in the design system
 * Includes brand colors plus neutral and utility colors
 * @see src/styles/abstracts/_colors.scss
 */
export type Color =
  | BrandColor
  | 'neutral'
  | 'light'
  | 'dark'
  | 'black'
  | 'white';

/**
 * Color weight variants (50-900 scale)
 * Used for accessing color palette shades
 */
export type ColorWeight = 50 | 100 | 200 | 300 | 400 | 500 | 600 | 700 | 800 | 900;

// ===================================
// Container Types (Shared)
// ===================================

/**
 * Container size variants
 */
export type ContainerSize = 'small' | 'medium' | 'large' | 'xl' | 'full';

/**
 * Props for configuring containers within components
 * Used by Section, Heroes, CTA sections, etc.
 */
export interface ContainerProps extends PolymorphicProps {
  /** Container max-width size */
  size?: ContainerSize;
  /** Enable horizontal padding (default: true) */
  padding?: boolean;
}

// ===================================
// Image & Media Types
// ===================================

/**
 * Image configuration for components
 */
export interface ImageProps {
  /** Image source URL or import */
  src: string;
  /** Alt text for accessibility */
  alt: string;
  /** Image width */
  width?: number;
  /** Image height */
  height?: number;
  /** Loading strategy */
  loading?: 'eager' | 'lazy';
}

/**
 * Background configuration for sections/heroes
 */
export interface BackgroundProps {
  /** Background image URL */
  image?: string;
  /** Show overlay */
  overlay?: boolean;
  /** Overlay opacity (0-1) */
  overlayOpacity?: number;
  /** Background position */
  position?: string;
}

// ===================================
// Content Alignment
// ===================================

/**
 * Horizontal text/content alignment
 */
export type Alignment = 'left' | 'center' | 'right';

// ===================================
// Toast Types
// ===================================

/**
 * Toast status variants
 */
export type ToastStatus = 'success' | 'error' | 'warning' | 'info';

/**
 * Toast position on screen
 */
export type ToastPosition = 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left' | 'top-center' | 'bottom-center';

/**
 * Options for creating a toast notification
 */
export interface ToastOptions {
  /** Toast title (required) */
  title: string;
  /** Optional message/description */
  message?: string;
  /** Toast status - determines icon and color */
  status?: ToastStatus;
  /** Duration in ms before auto-dismiss (0 = no auto-dismiss) */
  duration?: number;
  /** Show close button */
  dismissible?: boolean;
}
