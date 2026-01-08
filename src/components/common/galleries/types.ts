/**
 * Gallery Section Component Types
 * Shared interfaces for all gallery variants
 */

import type {
  BaseProps,
  ContainerProps,
  ImageProps,
} from '@types';

// ===================================
// Gallery Item Types
// ===================================

/**
 * Single gallery image item
 */
export interface GalleryItem {
  /** Image source and alt text */
  image: ImageProps;
  /** Optional title/caption */
  title?: string;
  /** Optional description */
  description?: string;
  /** Optional category for filtering */
  category?: string;
  /** Optional link to full image or page */
  href?: string;
}

// ===================================
// Gallery Variants
// ===================================

/**
 * Available gallery layout variants
 */
export type GalleryVariant = 'grid' | 'carousel' | 'masonry';

/**
 * Grid column options
 */
export type GalleryColumns = 2 | 3 | 4 | 5 | 6;

/**
 * Gallery aspect ratio options
 */
export type GalleryAspectRatio = 'square' | 'landscape' | 'portrait' | 'auto';

// ===================================
// Gallery Background
// ===================================

/**
 * Gallery-specific background configuration
 */
export interface GalleryBackground {
  /** Background variant */
  variant?: 'default' | 'alt' | 'dark';
}

// ===================================
// Gallery Props
// ===================================

/**
 * Base props shared by all gallery variants
 */
export interface GalleryBaseProps extends BaseProps {
  /** Section ID */
  id?: string;
  /** Container configuration */
  container?: ContainerProps;
  /** Section heading */
  heading?: string;
  /** Section subheading */
  subheading?: string;
  /** Gallery items */
  items: GalleryItem[];
  /** Background configuration */
  background?: GalleryBackground;
}

/**
 * Grid layout gallery
 */
export interface GalleryGridProps extends GalleryBaseProps {
  variant?: 'grid';
  /** Number of columns */
  columns?: GalleryColumns;
  /** Image aspect ratio */
  aspectRatio?: GalleryAspectRatio;
  /** Gap between items */
  gap?: 'small' | 'medium' | 'large' | 'none';
  /** Enable hover overlay with title/description */
  showOverlay?: boolean;
  /** Enable lightbox on click */
  lightbox?: boolean;
  /** Enable keyboard navigation in lightbox (default: true) */
  keyboard?: boolean;
}

/**
 * Carousel/slider gallery
 */
export interface GalleryCarouselProps extends GalleryBaseProps {
  variant?: 'carousel';
  /** Number of visible slides */
  slidesPerView?: 1 | 2 | 3 | 4;
  /** Number of slides to advance per step (1 = one at a time, 'max' = slidesPerView) */
  step?: 1 | 2 | 3 | 4 | 'max';
  /** Auto-play slides */
  autoplay?: boolean;
  /** Autoplay interval in milliseconds */
  autoplayInterval?: number;
  /** Show navigation arrows */
  showArrows?: boolean;
  /** Show pagination dots */
  showDots?: boolean;
  /** Enable infinite loop */
  loop?: boolean;
  /** Image aspect ratio */
  aspectRatio?: GalleryAspectRatio;
  /** Enable lightbox on click */
  lightbox?: boolean;
  /** Enable keyboard navigation in lightbox (default: true) */
  keyboard?: boolean;
}

/**
 * Union type for all gallery variants
 */
export type GalleryProps =
  | GalleryGridProps
  | GalleryCarouselProps;
