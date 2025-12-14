/**
 * Content Data Types
 * Type definitions for page content data structures
 *
 * These interfaces ensure content data is properly typed and
 * can be easily populated by AI or content management systems.
 */

import type { CTAAction, ImageProps, Alignment } from '@types';
import type { HeroProps, HeroVariant, HeroSize } from '@components/sections/heroes/types';
import type { FeaturesProps, FeatureItem, FeaturesVariant } from '@components/sections/features/types';
import type { CTAProps, CTAVariant } from '@components/sections/cta/types';

// ===================================
// Section Content Types
// ===================================

/**
 * Hero section content
 */
export interface HeroContent {
    /** Hero variant to use */
    variant?: HeroVariant;
    /** Hero size */
    size?: HeroSize;
    /** Main heading */
    title: string;
    /** Subtitle or description */
    subtitle?: string;
    /** Call-to-action buttons */
    actions?: CTAAction[];
    /** Background image URL */
    backgroundImage?: string;
    /** Featured image (for split variant) */
    image?: {
        src: string;
        alt: string;
    };
    /** Text alignment */
    alignment?: Alignment;
    /** Badge text */
    badge?: string;
}

/**
 * Features section content
 */
export interface FeaturesContent {
    /** Features variant to use */
    variant?: FeaturesVariant;
    /** Section heading */
    heading?: string;
    /** Section subheading */
    subheading?: string;
    /** Feature items */
    items: FeatureItem[];
    /** Number of columns (for grid variants) */
    columns?: 2 | 3 | 4;
}

/**
 * CTA section content
 */
export interface CTAContent {
    /** CTA variant to use */
    variant?: CTAVariant;
    /** Main heading */
    heading: string;
    /** Supporting description */
    description?: string;
    /** Action buttons */
    actions?: CTAAction[];
    /** Background image */
    backgroundImage?: string;
}

/**
 * Testimonial item
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
 * Testimonials section content
 */
export interface TestimonialsContent {
    /** Section heading */
    heading?: string;
    /** Section subheading */
    subheading?: string;
    /** Testimonial items */
    items: TestimonialItem[];
}

/**
 * Team member item
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
 * Team section content
 */
export interface TeamContent {
    /** Section heading */
    heading?: string;
    /** Section subheading */
    subheading?: string;
    /** Team members */
    members: TeamMemberItem[];
}

/**
 * FAQ item
 */
export interface FAQItem {
    /** Question */
    question: string;
    /** Answer (can include markdown) */
    answer: string;
}

/**
 * FAQ section content
 */
export interface FAQContent {
    /** Section heading */
    heading?: string;
    /** Section subheading */
    subheading?: string;
    /** FAQ items */
    items: FAQItem[];
}

/**
 * Stats item
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
 * Stats section content
 */
export interface StatsContent {
    /** Section heading */
    heading?: string;
    /** Stat items */
    items: StatItem[];
}

/**
 * Gallery item
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
 * Gallery section content
 */
export interface GalleryContent {
    /** Section heading */
    heading?: string;
    /** Section subheading */
    subheading?: string;
    /** Gallery images */
    items: GalleryItem[];
    /** Show category filters */
    showFilters?: boolean;
}

/**
 * Service item
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
 * Services section content
 */
export interface ServicesContent {
    /** Section heading */
    heading?: string;
    /** Section subheading */
    subheading?: string;
    /** Service items */
    items: ServiceItem[];
}

/**
 * Contact section content
 */
export interface ContactContent {
    /** Section heading */
    heading?: string;
    /** Section subheading */
    subheading?: string;
    /** Form configuration */
    form?: {
        /** Form action URL */
        action?: string;
        /** Success message */
        successMessage?: string;
        /** Error message */
        errorMessage?: string;
    };
    /** Show contact info */
    showContactInfo?: boolean;
    /** Show map */
    showMap?: boolean;
    /** Map embed URL */
    mapUrl?: string;
}

// ===================================
// Page Content Types
// ===================================

/**
 * Homepage content structure
 */
export interface HomepageContent {
    hero: HeroContent;
    features?: FeaturesContent;
    about?: {
        heading?: string;
        content: string;
        image?: ImageProps;
        cta?: CTAAction;
    };
    services?: ServicesContent;
    testimonials?: TestimonialsContent;
    stats?: StatsContent;
    cta?: CTAContent;
    faq?: FAQContent;
}

/**
 * About page content structure
 */
export interface AboutPageContent {
    hero: HeroContent;
    story?: {
        heading?: string;
        content: string;
        image?: ImageProps;
    };
    mission?: {
        heading?: string;
        content: string;
    };
    values?: FeaturesContent;
    team?: TeamContent;
    timeline?: Array<{
        year: string;
        title: string;
        description: string;
    }>;
    cta?: CTAContent;
}

/**
 * Contact page content structure
 */
export interface ContactPageContent {
    hero: HeroContent;
    contact: ContactContent;
}

/**
 * Services page content structure
 */
export interface ServicesPageContent {
    hero: HeroContent;
    services: ServicesContent;
    process?: FeaturesContent;
    cta?: CTAContent;
    faq?: FAQContent;
}

/**
 * Generic page content structure
 */
export interface GenericPageContent {
    hero: HeroContent;
    sections?: Array<
        | { type: 'features'; content: FeaturesContent }
        | { type: 'testimonials'; content: TestimonialsContent }
        | { type: 'cta'; content: CTAContent }
        | { type: 'faq'; content: FAQContent }
        | { type: 'team'; content: TeamContent }
        | { type: 'stats'; content: StatsContent }
        | { type: 'gallery'; content: GalleryContent }
        | { type: 'services'; content: ServicesContent }
        | { type: 'contact'; content: ContactContent }
    >;
}
