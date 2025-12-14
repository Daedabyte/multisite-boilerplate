/**
 * Button Component Types
 * Props interface for Button component variants
 */

import type {
  BaseProps,
  ButtonVariant,
  ButtonSize,
  ButtonWeight,
} from '@types';

// ===================================
// Button Props
// ===================================

/**
 * Button component props
 */
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

// Re-export base types for convenience
export type { ButtonVariant, ButtonSize, ButtonWeight } from '@types';
