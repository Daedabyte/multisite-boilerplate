/**
 * Hero Section Component Types
 * Base/shared interfaces for all hero variants
 * Variant-specific props are defined in each variant's .astro file
 */

import type {
  BaseProps,
  ContainerProps,
  BackgroundProps,
  Alignment,
} from '@types';
import type { CTAAction } from '@components/ui/buttons/types';

// ===================================
// Hero Shared Types
// ===================================

/**
 * Hero height options
 */
export type HeroSize = 'full' | 'partial' | 'auto';

/**
 * Background animation effect types (for animated variant)
 */
export type HeroBgEffect =
  | 'none'
  | 'pulse'
  | 'blur-reveal'
  | 'ken-burns'
  | 'parallax';

/**
 * Content animation effect types (for animated variant)
 */
export type HeroContentEffect =
  | 'none'
  | 'fade-up'
  | 'fade-in'
  | 'slide-in'
  | 'stagger';

/**
 * Configuration for background effects
 */
export interface HeroBgEffectConfig {
  type: HeroBgEffect;
  duration?: number;
  delay?: number;
  scale?: number;
  blurAmount?: number;
  loop?: boolean;
  easing?: 'ease' | 'ease-in' | 'ease-out' | 'ease-in-out' | 'linear';
}

// ===================================
// Hero Base Props
// ===================================

/**
 * Base props shared by all hero variants
 */
export interface HeroBaseProps extends BaseProps {
  /** Section ID */
  id?: string;
  /** Hero height variant */
  size?: HeroSize;
  /** Text alignment */
  alignment?: Alignment;
  /** Container configuration */
  container?: ContainerProps;
  /** Background configuration */
  background?: BackgroundProps;
  /** Main heading */
  title: string;
  /** Subtitle or description */
  subtitle?: string;
  /** Call-to-action buttons */
  actions?: CTAAction[];
}
