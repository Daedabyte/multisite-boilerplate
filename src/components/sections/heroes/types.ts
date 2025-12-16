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
export type HeroVariant = 'standard' | 'split' | 'video' | 'minimal' | 'animated';

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
  variant?: 'split';
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
  variant?: 'video';
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
  variant?: 'minimal';
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

// ===================================
// Animated Hero Types
// ===================================

/**
 * Background animation effect types
 */
export type HeroBgEffect =
  | 'none'
  | 'pulse'           // Zoom in/out loop
  | 'blur-reveal'     // Blur to sharp, then static
  | 'ken-burns'       // Slow pan and zoom
  | 'parallax';       // Scroll-based parallax

/**
 * Content animation effect types
 */
export type HeroContentEffect =
  | 'none'
  | 'fade-up'         // Fade in from below
  | 'fade-in'         // Simple fade in
  | 'slide-in'        // Slide in from side
  | 'stagger';        // Stagger children animations

/**
 * Configuration for background effects
 */
export interface HeroBgEffectConfig {
  /** Effect type */
  type: HeroBgEffect;
  /** Animation duration in seconds */
  duration?: number;
  /** Delay before animation starts (seconds) */
  delay?: number;
  /** Scale amount for pulse/ken-burns (e.g., 1.1 = 110%) */
  scale?: number;
  /** Initial blur amount in pixels for blur-reveal */
  blurAmount?: number;
  /** Whether animation loops (for pulse, ken-burns) */
  loop?: boolean;
  /** Easing function */
  easing?: 'ease' | 'ease-in' | 'ease-out' | 'ease-in-out' | 'linear';
}

/**
 * Animated hero: background with animated effects
 */
export interface HeroAnimatedProps extends HeroBaseProps {
  variant?: 'animated';
  /** Main heading */
  title: string;
  /** Subtitle or description */
  subtitle?: string;
  /** Call-to-action buttons */
  actions?: CTAAction[];
  /** Background image URL */
  backgroundImage: string;
  /** Background effect configuration */
  bgEffect?: HeroBgEffect | HeroBgEffectConfig;
  /** Content entrance animation */
  contentEffect?: HeroContentEffect;
  /** Content animation delay in seconds */
  contentDelay?: number;
  /** Overlay opacity (0-1) */
  overlayOpacity?: number;
  /** Overlay color (CSS color value) */
  overlayColor?: string;
}

/**
 * Union type for all hero variants
 */
export type HeroProps =
  | HeroStandardProps
  | HeroSplitProps
  | HeroVideoProps
  | HeroMinimalProps
  | HeroAnimatedProps;
