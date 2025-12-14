/**
 * Hero Section Component Types
 * Shared interfaces for all hero variants
 */

import type {
  BaseProps,
  ContainerProps,
  CTAAction,
  BackgroundProps,
  Alignment,
} from '@types';

// ===================================
// Hero Variants
// ===================================

/**
 * Available hero layout variants
 */
export type HeroVariant = 'standard' | 'split' | 'video' | 'minimal';

/**
 * Hero height options
 */
export type HeroSize = 'full' | 'partial' | 'auto';

// ===================================
// Hero Props
// ===================================

/**
 * Base props shared by all hero variants
 */
export interface HeroBaseProps extends BaseProps {
  /** Hero height variant */
  size?: HeroSize;
  /** Text alignment */
  alignment?: Alignment;
  /** Container configuration */
  container?: ContainerProps;
  /** Background configuration */
  background?: BackgroundProps;
}

/**
 * Standard hero: background image with centered content
 */
export interface HeroStandardProps extends HeroBaseProps {
  variant?: 'standard';
  /** Main heading */
  title: string;
  /** Subtitle or description */
  subtitle?: string;
  /** Call-to-action buttons */
  actions?: CTAAction[];
  /** Background image URL (shorthand for background.image) */
  backgroundImage?: string;
}

/**
 * Split hero: content on one side, image on the other
 */
export interface HeroSplitProps extends HeroBaseProps {
  variant: 'split';
  /** Main heading */
  title: string;
  /** Subtitle or description */
  subtitle?: string;
  /** Call-to-action buttons */
  actions?: CTAAction[];
  /** Featured image */
  image: {
    src: string;
    alt: string;
  };
  /** Image position */
  imagePosition?: 'left' | 'right';
}

/**
 * Video hero: video background with overlay content
 */
export interface HeroVideoProps extends HeroBaseProps {
  variant: 'video';
  /** Main heading */
  title: string;
  /** Subtitle or description */
  subtitle?: string;
  /** Call-to-action buttons */
  actions?: CTAAction[];
  /** Video configuration */
  video: {
    src: string;
    poster?: string;
    autoplay?: boolean;
    loop?: boolean;
    muted?: boolean;
  };
}

/**
 * Minimal hero: text only, for inner pages
 */
export interface HeroMinimalProps extends HeroBaseProps {
  variant: 'minimal';
  /** Main heading */
  title: string;
  /** Subtitle or description */
  subtitle?: string;
  /** Breadcrumbs for navigation */
  breadcrumbs?: Array<{
    href: string;
    label: string;
  }>;
}

/**
 * Union type for all hero variants
 */
export type HeroProps =
  | HeroStandardProps
  | HeroSplitProps
  | HeroVideoProps
  | HeroMinimalProps;
