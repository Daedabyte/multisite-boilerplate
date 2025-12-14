/**
 * Card Component Types
 * Props interface for Card component variants
 */

import type { BaseProps, ImageProps } from '@types';

// ===================================
// Card Variants
// ===================================

/**
 * Card style variants
 */
export type CardVariant = 'default' | 'elevated' | 'outlined' | 'filled';

/**
 * Card padding options
 */
export type CardPadding = 'none' | 'small' | 'medium' | 'large';

// ===================================
// Card Props
// ===================================

/**
 * Base card props
 */
export interface CardProps extends BaseProps {
  /** Card style variant */
  variant?: CardVariant;
  /** Padding size */
  padding?: CardPadding;
  /** Hover lift effect */
  hoverable?: boolean;
  /** Link URL (makes entire card clickable) */
  href?: string;
  /** External link (opens in new tab) */
  external?: boolean;
}

/**
 * Card with image header
 */
export interface CardWithImageProps extends CardProps {
  /** Card header image */
  image: ImageProps;
  /** Image aspect ratio */
  aspectRatio?: '16:9' | '4:3' | '1:1' | 'auto';
}

/**
 * Horizontal card layout
 */
export interface CardHorizontalProps extends CardProps {
  /** Card image */
  image?: ImageProps;
  /** Image position */
  imagePosition?: 'left' | 'right';
  /** Image width percentage */
  imageWidth?: '33' | '40' | '50';
}
