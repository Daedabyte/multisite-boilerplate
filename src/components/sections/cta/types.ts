/**
 * CTA (Call-to-Action) Section Component Types
 * Base/shared interfaces for all CTA variants
 * Variant-specific props are defined in each variant's .astro file
 */

import type {
  BaseProps,
  ContainerProps,
} from '@types';
import type { CTAAction } from '@components/ui/buttons/types';

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
// CTA Base Props
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
