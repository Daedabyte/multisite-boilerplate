/**
 * Card Component Base Types
 * Shared types used across all card component variants
 */

import type { BaseProps } from '@types';

// ===================================
// Card Shared Types
// ===================================

/** Card hover animation options */
export type CardHover = 'none' | 'lift' | 'scale' | 'glow' | 'border' | 'tilt';

/** Card border radius options */
export type CardRadius = 'none' | 'small' | 'medium' | 'large';

/**
 * Base card props shared across all card variants
 */
export interface CardBaseProps extends BaseProps {
  /** Hover animation effect */
  hover?: CardHover;
  /** Border radius size */
  radius?: CardRadius;
  /** Make entire card clickable */
  href?: string;
  /** Open link in new tab */
  external?: boolean;
  /** Add shadow */
  shadow?: boolean;
  /** Add border */
  bordered?: boolean;
}
