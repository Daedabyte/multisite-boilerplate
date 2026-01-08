/**
 * Footer Component Types
 * Base/shared interfaces for all footer variants
 * Variant-specific props are defined in each variant's .astro file
 */

import type { ImageMetadata } from 'astro';
import type {
  BaseProps,
  ContainerProps,
} from '@types';

// ===================================
// Footer Base Props
// ===================================

/**
 * Base props shared by all footer variants
 */
export interface FooterBaseProps extends BaseProps {
  /** Logo image configuration (falls back to default logo if not provided) */
  logo?: {
    /** Image source - can be an imported image or URL string */
    src: ImageMetadata | string;
    /** Alt text for accessibility */
    alt: string;
    /** Link destination (defaults to '/') */
    href?: string;
    /** Logo width in pixels */
    width?: number;
    /** Logo height in pixels */
    height?: number;
  };
  /** Company/site description */
  description?: string;
  /** Copyright text (year auto-added if not present) */
  copyright?: string;
  /** Container configuration */
  container?: ContainerProps;
}
