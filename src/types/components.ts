/**
 * Base Component Types
 * Shared interfaces used across all components in the boilerplate
 */

// ===================================
// Base Props
// ===================================

/**
 * Base props that all components can accept
 */
export interface BaseProps {
  /** Additional CSS classes */
  class?: string;
  /** Alternative class prop for Astro compatibility */
  classList?: string;
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
// Container & Section Types
// ===================================

/**
 * Container size variants
 */
export type ContainerSize = 'small' | 'medium' | 'large' | 'xl' | 'full';

/**
 * Props for container components
 */
export interface ContainerProps extends PolymorphicProps {
  /** Container max-width size */
  size?: ContainerSize;
  /** Enable horizontal padding (default: true) */
  padding?: boolean;
}

/**
 * Section background variants
 */
export type SectionBackground = 'default' | 'alt' | 'dark' | 'primary' | 'gradient';

/**
 * Section spacing variants
 */
export type SectionSpacing = 'none' | 'small' | 'medium' | 'large';

/**
 * Props for section components
 */
export interface SectionProps extends BaseProps {
  /** Section ID (required for accessibility) */
  id: string;
  /** Container configuration */
  container?: ContainerProps;
  /** Section background variant */
  background?: SectionBackground;
  /** Vertical padding size */
  spacing?: SectionSpacing;
}

// ===================================
// Button Types
// ===================================

/**
 * Button color variants
 */
export type ButtonVariant =
  | 'primary'
  | 'secondary'
  | 'tertiary'
  | 'success'
  | 'danger'
  | 'warning'
  | 'info'
  | 'light'
  | 'dark'
  | 'black'
  | 'white';

/**
 * Button size variants
 */
export type ButtonSize = 'small' | 'medium' | 'large';

/**
 * Button font weight options
 */
export type ButtonWeight = 100 | 200 | 300 | 400 | 500 | 600 | 700 | 800 | 900;

// ===================================
// Link & Action Types
// ===================================

/**
 * Base CTA properties shared by links and buttons
 */
interface CTABase {
  /** Button/link text */
  label: string;
  /** Button color variant */
  variant?: ButtonVariant;
  /** Use outline style */
  outline?: boolean;
  /** Button size */
  size?: ButtonSize;
  /** Icon identifier */
  icon?: string;
}

/**
 * CTA that renders as a link
 */
export interface CTALink extends CTABase {
  /** Destination URL */
  href: string;
  /** Opens in new tab */
  external?: boolean;
  /** Button type - not applicable for links */
  type?: never;
}

/**
 * CTA that renders as a button (no href)
 */
export interface CTAButton extends CTABase {
  /** No href for button actions */
  href?: never;
  /** Button type attribute */
  type?: 'button' | 'submit' | 'reset';
  /** External not applicable for buttons */
  external?: never;
}

/**
 * Call-to-action configuration - can be a link or button
 */
export type CTAAction = CTALink | CTAButton;

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
