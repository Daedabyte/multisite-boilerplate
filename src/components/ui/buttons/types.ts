/**
 * Button Component Types
 * Props interface for Button component variants
 */

import type { BaseProps } from '@types';

// ===================================
// Button Types
// ===================================

/** Button color variants */
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

/** Button size variants */
export type ButtonSize = 'small' | 'medium' | 'large';

/** Button font weight options */
export type ButtonWeight = 100 | 200 | 300 | 400 | 500 | 600 | 700 | 800 | 900;

// ===================================
// Button Props
// ===================================

/** Button component props */
export interface ButtonProps extends BaseProps {
  /** Color variant */
  variant?: ButtonVariant;
  /** Outline style (transparent background) */
  outline?: boolean;
  /** Font weight (100-900) */
  weight?: ButtonWeight;
  /** Size variant */
  size?: ButtonSize;
  /** Link URL (renders as <a> element) */
  href?: string;
  /** Button type (when not a link) */
  type?: 'button' | 'submit' | 'reset';
  /** Disabled state */
  disabled?: boolean;
  /** Icon before text */
  iconBefore?: string;
  /** Icon after text */
  iconAfter?: string;
  /** Full width button */
  fullWidth?: boolean;
}

// ===================================
// CTA Types
// ===================================

/** Base CTA properties shared by links and buttons */
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

/** CTA that renders as a link */
export interface CTALink extends CTABase {
  /** Destination URL */
  href: string;
  /** Opens in new tab */
  external?: boolean;
  /** Button type - not applicable for links */
  type?: never;
}

/** CTA that renders as a button (no href) */
export interface CTAButton extends CTABase {
  /** No href for button actions */
  href?: never;
  /** Button type attribute */
  type?: 'button' | 'submit' | 'reset';
  /** External not applicable for buttons */
  external?: never;
}

/** Call-to-action configuration - can be a link or button */
export type CTAAction = CTALink | CTAButton;
