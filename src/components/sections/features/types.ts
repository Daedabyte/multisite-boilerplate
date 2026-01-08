/**
 * Features Section Component Types
 * Base/shared interfaces for all features variants
 * Variant-specific props are defined in each variant's .astro file
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
// Features Base Props
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
