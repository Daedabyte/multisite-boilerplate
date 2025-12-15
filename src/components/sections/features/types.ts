/**
 * Features Section Component Types
 * Shared interfaces for all features variants
 */

import type {
  BaseProps,
  ContainerProps,
  ImageProps,
} from '@types';

// ===================================
// Feature Item Types
// ===================================

/**
 * Single feature item
 */
export interface FeatureItem {
  /** Feature title */
  title: string;
  /** Feature description */
  description: string;
  /** Icon identifier (FontAwesome class or custom) */
  icon?: string;
  /** Custom image instead of icon */
  image?: ImageProps;
  /** Optional link */
  link?: {
    href: string;
    label?: string;
  };
}

// ===================================
// Features Variants
// ===================================

/**
 * Available features layout variants
 */
export type FeaturesVariant = 'grid' | 'list' | 'cards' | 'alternating';

/**
 * Grid column options
 */
export type FeaturesColumns = 2 | 3 | 4;

// ===================================
// Features Background
// ===================================

/**
 * Features-specific background configuration
 */
export interface FeaturesBackground {
  /** Background variant */
  variant?: 'default' | 'alt';
}

// ===================================
// Features Props
// ===================================

/**
 * Base props shared by all features variants
 */
export interface FeaturesBaseProps extends BaseProps {
  /** Section ID */
  id?: string;
  /** Container configuration */
  container?: ContainerProps;
  /** Section heading */
  heading?: string;
  /** Section subheading */
  subheading?: string;
  /** Feature items */
  features: FeatureItem[];
  /** Background configuration */
  background?: FeaturesBackground;
}

/**
 * Grid layout features
 */
export interface FeaturesGridProps extends FeaturesBaseProps {
  variant?: 'grid';
  /** Number of columns */
  columns?: FeaturesColumns;
}

/**
 * Vertical list layout
 */
export interface FeaturesListProps extends FeaturesBaseProps {
  variant?: 'list';
  /** Show dividers between items */
  dividers?: boolean;
}

/**
 * Card-style features
 */
export interface FeaturesCardsProps extends FeaturesBaseProps {
  variant?: 'cards';
  /** Number of columns */
  columns?: FeaturesColumns;
  /** Enable hover effect */
  hoverEffect?: boolean;
}

/**
 * Alternating left/right layout
 */
export interface FeaturesAlternatingProps extends FeaturesBaseProps {
  variant?: 'alternating';
  /** Features must include images for this variant */
  features: Array<FeatureItem & { image: ImageProps }>;
}

/**
 * Union type for all features variants
 */
export type FeaturesProps =
  | FeaturesGridProps
  | FeaturesListProps
  | FeaturesCardsProps
  | FeaturesAlternatingProps;
