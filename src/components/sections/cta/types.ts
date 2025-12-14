/**
 * CTA (Call-to-Action) Section Component Types
 * Shared interfaces for all CTA variants
 */

import type {
  BaseProps,
  ContainerProps,
  CTAAction,
} from '@types';

// ===================================
// CTA Variants
// ===================================

/**
 * Available CTA layout variants
 */
export type CTAVariant = 'simple' | 'split' | 'banner' | 'newsletter';

// ===================================
// CTA Background
// ===================================

/**
 * CTA-specific background configuration
 */
export interface CTABackground {
  /** Background variant */
  variant?: 'default' | 'alt' | 'dark' | 'primary';
  /** Background image URL */
  image?: string;
}

// ===================================
// CTA Props
// ===================================

/**
 * Base props shared by all CTA variants
 */
export interface CTABaseProps extends BaseProps {
  /** Section ID */
  id?: string;
  /** Container configuration */
  container?: ContainerProps;
  /** Main heading */
  heading: string;
  /** Supporting text */
  description?: string;
  /** Action buttons */
  actions?: CTAAction[];
  /** Background configuration */
  background?: CTABackground;
}

/**
 * Simple centered CTA
 */
export interface CTASimpleProps extends CTABaseProps {
  variant?: 'simple';
}

/**
 * Split CTA with image
 */
export interface CTASplitProps extends CTABaseProps {
  variant: 'split';
  /** Featured image */
  image: {
    src: string;
    alt: string;
  };
  /** Image position */
  imagePosition?: 'left' | 'right';
}

/**
 * Full-width banner CTA
 */
export interface CTABannerProps extends CTABaseProps {
  variant: 'banner';
  /** Compact styling */
  compact?: boolean;
}

/**
 * Newsletter signup CTA
 */
export interface CTANewsletterProps extends CTABaseProps {
  variant: 'newsletter';
  /** Form configuration */
  form?: {
    action?: string;
    method?: 'GET' | 'POST';
    placeholder?: string;
    buttonText?: string;
  };
  /** Privacy notice text */
  privacyText?: string;
}

/**
 * Union type for all CTA variants
 */
export type CTAProps =
  | CTASimpleProps
  | CTASplitProps
  | CTABannerProps
  | CTANewsletterProps;
