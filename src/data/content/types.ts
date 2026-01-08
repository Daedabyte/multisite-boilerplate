/**
 * Content Data Types
 * Type definitions for reusable content data structures
 *
 * These interfaces are for typing reusable content collections
 * (products, services, team members, etc.) that may be shared
 * across multiple pages.
 *
 * Page-specific content should live within the page itself.
 * @see .ai/guidelines/data.md
 */

import type { ImageProps } from '@types';

// ===================================
// Reusable Content Item Types
// ===================================

/**
 * Testimonial item for testimonial collections
 */
export interface TestimonialItem {
  /** Testimonial quote */
  quote: string;
  /** Author name */
  author: string;
  /** Author title/role */
  title?: string;
  /** Author company */
  company?: string;
  /** Author photo */
  image?: ImageProps;
  /** Star rating (1-5) */
  rating?: number;
}

/**
 * Team member item for team collections
 */
export interface TeamMemberItem {
  /** Member name */
  name: string;
  /** Member role/title */
  role: string;
  /** Member bio */
  bio?: string;
  /** Member photo */
  image?: ImageProps;
  /** Social links */
  socials?: Array<{
    platform: string;
    url: string;
  }>;
}

/**
 * FAQ item for FAQ collections
 */
export interface FAQItem {
  /** Question */
  question: string;
  /** Answer (can include markdown) */
  answer: string;
}

/**
 * Stats item for statistics displays
 */
export interface StatItem {
  /** Stat value (e.g., "100+", "5M") */
  value: string;
  /** Stat label */
  label: string;
  /** Optional description */
  description?: string;
  /** Icon identifier */
  icon?: string;
}

/**
 * Gallery item for image galleries
 */
export interface GalleryItem {
  /** Image source */
  src: string;
  /** Image alt text */
  alt: string;
  /** Image caption */
  caption?: string;
  /** Category for filtering */
  category?: string;
}

/**
 * Service item for service listings
 */
export interface ServiceItem {
  /** Service title */
  title: string;
  /** Service description */
  description: string;
  /** Service icon */
  icon?: string;
  /** Service image */
  image?: ImageProps;
  /** Link to service detail page */
  href?: string;
  /** Features/benefits list */
  features?: string[];
  /** Starting price */
  price?: string;
}

/**
 * Product item for product listings
 */
export interface ProductItem {
  /** Product name */
  name: string;
  /** Product description */
  description: string;
  /** Product price */
  price: string;
  /** Sale price (optional) */
  salePrice?: string;
  /** Product image */
  image?: ImageProps;
  /** Link to product page */
  href?: string;
  /** Product category */
  category?: string;
  /** In stock status */
  inStock?: boolean;
  /** Product features */
  features?: string[];
}

/**
 * Event item for event listings
 */
export interface EventItem {
  /** Event title */
  title: string;
  /** Event description */
  description: string;
  /** Event date */
  date: string;
  /** Event time */
  time?: string;
  /** Event location */
  location?: string;
  /** Event image */
  image?: ImageProps;
  /** Link to event page */
  href?: string;
  /** Event category/type */
  category?: string;
}

/**
 * Blog post item for blog listings
 */
export interface BlogPostItem {
  /** Post title */
  title: string;
  /** Post excerpt/summary */
  excerpt: string;
  /** Post date */
  date: string;
  /** Post author */
  author?: string;
  /** Featured image */
  image?: ImageProps;
  /** Link to full post */
  href: string;
  /** Post categories/tags */
  categories?: string[];
  /** Reading time estimate */
  readingTime?: string;
}

/**
 * Pricing tier for pricing tables
 */
export interface PricingTier {
  /** Tier name */
  name: string;
  /** Tier description */
  description?: string;
  /** Price amount */
  price: string;
  /** Billing period (e.g., "/month") */
  period?: string;
  /** List of included features */
  features: string[];
  /** CTA button text */
  ctaText?: string;
  /** CTA button link */
  ctaHref?: string;
  /** Highlight this tier */
  highlighted?: boolean;
  /** Badge text (e.g., "Most Popular") */
  badge?: string;
}
