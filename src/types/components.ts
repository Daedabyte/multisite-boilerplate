/**
 * Base Component Types
 * Shared interfaces used across all components in the boilerplate
 */

// ===================================
// Base Props
// ===================================

/**
 * Base props that all components can accept
 */
export interface BaseProps {
  /** Additional CSS classes */
  class?: string;
  /** Alternative class prop for Astro compatibility */
  classList?: string;
  /** HTML id attribute */
  id?: string;
}

/**
 * Props for components that render as different HTML elements
 */
export interface PolymorphicProps extends BaseProps {
  /** HTML element to render as */
  as?: keyof HTMLElementTagNameMap;
}

// ===================================
// Container & Section Types
// ===================================

/**
 * Container size variants
 */
export type ContainerSize = 'small' | 'medium' | 'large' | 'xl' | 'full';

/**
 * Props for container components
 */
export interface ContainerProps extends PolymorphicProps {
  /** Container max-width size */
  size?: ContainerSize;
  /** Enable horizontal padding (default: true) */
  padding?: boolean;
}

/**
 * Section background variants
 */
export type SectionBackground = 'default' | 'alt' | 'dark' | 'primary' | 'gradient';

/**
 * Section spacing variants
 */
export type SectionSpacing = 'none' | 'small' | 'medium' | 'large';

/**
 * Props for section components
 */
export interface SectionProps extends BaseProps {
  /** Section ID (required for accessibility) */
  id: string;
  /** Container configuration */
  container?: ContainerProps;
  /** Section background variant */
  background?: SectionBackground;
  /** Vertical padding size */
  spacing?: SectionSpacing;
}

// ===================================
// Button Types
// ===================================

/**
 * Button color variants
 */
export type ButtonVariant =
  | 'primary'
  | 'secondary'
  | 'tertiary'
  | 'success'
  | 'danger'
  | 'warning'
  | 'info'
  | 'light'
  | 'dark'
  | 'black'
  | 'white';

/**
 * Button size variants
 */
export type ButtonSize = 'small' | 'medium' | 'large';

/**
 * Button font weight options
 */
export type ButtonWeight = 100 | 200 | 300 | 400 | 500 | 600 | 700 | 800 | 900;

// ===================================
// Link & Action Types
// ===================================

/**
 * Base CTA properties shared by links and buttons
 */
interface CTABase {
  /** Button/link text */
  label: string;
  /** Button color variant */
  variant?: ButtonVariant;
  /** Use outline style */
  outline?: boolean;
  /** Button size */
  size?: ButtonSize;
  /** Icon identifier */
  icon?: string;
}

/**
 * CTA that renders as a link
 */
export interface CTALink extends CTABase {
  /** Destination URL */
  href: string;
  /** Opens in new tab */
  external?: boolean;
  /** Button type - not applicable for links */
  type?: never;
}

/**
 * CTA that renders as a button (no href)
 */
export interface CTAButton extends CTABase {
  /** No href for button actions */
  href?: never;
  /** Button type attribute */
  type?: 'button' | 'submit' | 'reset';
  /** External not applicable for buttons */
  external?: never;
}

/**
 * Call-to-action configuration - can be a link or button
 */
export type CTAAction = CTALink | CTAButton;

// ===================================
// Image & Media Types
// ===================================

/**
 * Image configuration for components
 */
export interface ImageProps {
  /** Image source URL or import */
  src: string;
  /** Alt text for accessibility */
  alt: string;
  /** Image width */
  width?: number;
  /** Image height */
  height?: number;
  /** Loading strategy */
  loading?: 'eager' | 'lazy';
}

/**
 * Background configuration for sections/heroes
 */
export interface BackgroundProps {
  /** Background image URL */
  image?: string;
  /** Show overlay */
  overlay?: boolean;
  /** Overlay opacity (0-1) */
  overlayOpacity?: number;
  /** Background position */
  position?: string;
}

// ===================================
// Content Alignment
// ===================================

/**
 * Horizontal text/content alignment
 */
export type Alignment = 'left' | 'center' | 'right';

// ===================================
// Split Container Types
// ===================================

/**
 * Split layout ratio options
 */
export type SplitRatio = '50-50' | '40-60' | '60-40' | '33-67' | '67-33';

/**
 * Position of media/image in split layout
 */
export type SplitImagePosition = 'left' | 'right';

/**
 * Vertical alignment options for split columns
 */
export type SplitVerticalAlign = 'start' | 'center' | 'end' | 'stretch';

/**
 * Props for SplitContainer component
 */
export interface SplitContainerProps extends BaseProps {
  /** Image configuration (optional if using slots) */
  image?: ImageProps;
  /** Position of the image relative to content */
  imagePosition?: SplitImagePosition;
  /** Column ratio (first value is left column) */
  ratio?: SplitRatio;
  /** Vertical alignment of columns */
  verticalAlign?: SplitVerticalAlign;
  /** Gap between columns */
  gap?: 'none' | 'small' | 'medium' | 'large';
  /** Reverse stack order on mobile */
  mobileReverse?: boolean;
  /** Add border radius to image */
  imageRounded?: boolean;
  /** Add shadow to image */
  imageShadow?: boolean;
}

// ===================================
// Breadcrumb Types
// ===================================

/**
 * Individual breadcrumb item
 */
export interface BreadcrumbItem {
  /** Display label */
  label: string;
  /** Link URL (optional for current/last item) */
  href?: string;
  /** Icon identifier (optional) */
  icon?: string;
}

/**
 * Props for Breadcrumb component
 */
export interface BreadcrumbProps extends BaseProps {
  /** Manual breadcrumb items (if not using auto mode) */
  items?: BreadcrumbItem[];
  /** Auto-generate breadcrumbs from current URL */
  auto?: boolean;
  /** Home link configuration */
  home?: {
    label?: string;
    href?: string;
    icon?: string;
  };
  /** Separator between items */
  separator?: 'chevron' | 'slash' | 'arrow' | string;
  /** Show home icon only (no label) on mobile */
  compactHome?: boolean;
}

// ===================================
// Toast Types
// ===================================

/**
 * Toast status variants
 */
export type ToastStatus = 'success' | 'error' | 'warning' | 'info';

/**
 * Toast position on screen
 */
export type ToastPosition = 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left' | 'top-center' | 'bottom-center';

/**
 * Options for creating a toast notification
 */
export interface ToastOptions {
  /** Toast title (required) */
  title: string;
  /** Optional message/description */
  message?: string;
  /** Toast status - determines icon and color */
  status?: ToastStatus;
  /** Duration in ms before auto-dismiss (0 = no auto-dismiss) */
  duration?: number;
  /** Show close button */
  dismissible?: boolean;
}

// ===================================
// Page Loader Types
// ===================================

/**
 * Spinner animation variants
 */
export type LoaderSpinner = 'spinner' | 'dots' | 'bars' | 'pulse';

/**
 * Props for PageLoader component
 */
export interface PageLoaderProps extends BaseProps {
  /** Spinner animation type */
  spinner?: LoaderSpinner;
  /** Loading text (optional) */
  text?: string;
  /** Background color */
  background?: 'white' | 'dark' | 'primary' | 'transparent';
  /** Spinner/text color */
  color?: 'primary' | 'white' | 'dark';
  /** Spinner size */
  size?: 'small' | 'medium' | 'large';
  /** Auto-hide when page loads (default: true) */
  autoHide?: boolean;
  /** Minimum display time in ms before hiding */
  minDisplayTime?: number;
  /** Fade out duration in ms */
  fadeOutDuration?: number;
}

// ===================================
// List Types
// ===================================

/**
 * Individual item for IconList
 */
export interface IconListItem {
  /** Item text content */
  text: string;
  /** Icon identifier (FontAwesome class) */
  icon?: string;
  /** Optional description below the text */
  description?: string;
}

/**
 * Icon color options
 */
export type IconListColor = 'primary' | 'secondary' | 'success' | 'danger' | 'warning' | 'info' | 'neutral';

/**
 * Props for IconList component
 */
export interface IconListProps extends BaseProps {
  /** List items */
  items: IconListItem[];
  /** Default icon for items without a specific icon */
  defaultIcon?: string;
  /** Icon color variant */
  iconColor?: IconListColor;
  /** Icon size */
  iconSize?: 'small' | 'medium' | 'large';
  /** Space between items */
  spacing?: 'compact' | 'normal' | 'relaxed';
}

/**
 * Bullet style options
 */
export type BulletStyle = 'disc' | 'circle' | 'square' | 'check' | 'arrow' | 'dash' | 'number';

/**
 * Props for BulletList component
 */
export interface BulletListProps extends BaseProps {
  /** List items (strings or slot content) */
  items?: string[];
  /** Bullet style */
  bullet?: BulletStyle;
  /** Bullet color */
  bulletColor?: IconListColor;
  /** Space between items */
  spacing?: 'compact' | 'normal' | 'relaxed';
  /** Indent nested lists */
  nested?: boolean;
}

// ===================================
// Card Types
// ===================================

/**
 * Card hover animation options
 */
export type CardHover = 'none' | 'lift' | 'scale' | 'glow' | 'border' | 'tilt';

/**
 * Card border radius options
 */
export type CardRadius = 'none' | 'small' | 'medium' | 'large';

/**
 * Base card props shared across all card variants
 */
export interface CardBaseProps extends BaseProps {
  /** Hover animation effect */
  hover?: CardHover;
  /** Border radius size */
  radius?: CardRadius;
  /** Make entire card clickable */
  href?: string;
  /** Open link in new tab */
  external?: boolean;
  /** Add shadow */
  shadow?: boolean;
  /** Add border */
  bordered?: boolean;
}

/**
 * Props for SimpleCard component
 */
export interface SimpleCardProps extends CardBaseProps {
  /** Card title */
  title: string;
  /** Card description/content */
  description?: string;
  /** Icon class (FontAwesome) */
  icon?: string;
  /** Icon position */
  iconPosition?: 'top' | 'left';
  /** Card padding size */
  padding?: 'compact' | 'normal' | 'relaxed';
}

/**
 * Props for SlimCard component
 */
export interface SlimCardProps extends CardBaseProps {
  /** Card title */
  title: string;
  /** Short description */
  description?: string;
  /** Icon class */
  icon?: string;
  /** Right-side content (badge, arrow, etc.) */
  suffix?: string;
}

/**
 * Image overlay position options
 */
export type ImageCardOverlay = 'bottom' | 'center' | 'full';

/**
 * Props for ImageCard component (image with text overlay)
 */
export interface ImageCardProps extends CardBaseProps {
  /** Card title */
  title: string;
  /** Card description */
  description?: string;
  /** Image source */
  image: string;
  /** Image alt text */
  imageAlt?: string;
  /** Overlay position */
  overlay?: ImageCardOverlay;
  /** Aspect ratio */
  aspectRatio?: 'square' | 'video' | 'portrait' | 'wide';
  /** Badge/tag text */
  badge?: string;
}

/**
 * Media position for MediaCard
 */
export type MediaCardLayout = 'top' | 'left' | 'right';

/**
 * Props for MediaCard component (image + content)
 */
export interface MediaCardProps extends CardBaseProps {
  /** Card title */
  title: string;
  /** Card description */
  description?: string;
  /** Image source */
  image: string;
  /** Image alt text */
  imageAlt?: string;
  /** Image/content layout */
  layout?: MediaCardLayout;
  /** Aspect ratio for image */
  aspectRatio?: 'square' | 'video' | 'portrait' | 'auto';
  /** Meta text (date, category, etc.) */
  meta?: string;
  /** CTA button/link text */
  ctaText?: string;
}

// ===================================
// SideNav Types
// ===================================

/**
 * Third level nav item (max depth)
 */
export interface SideNavItemL3 {
  /** Display label */
  label: string;
  /** Link URL or anchor */
  href: string;
  /** Icon class (optional) */
  icon?: string;
}

/**
 * Second level nav item with optional children
 */
export interface SideNavItemL2 {
  /** Display label */
  label: string;
  /** Link URL or anchor */
  href?: string;
  /** Icon class (optional) */
  icon?: string;
  /** Third level items */
  children?: SideNavItemL3[];
}

/**
 * Top level nav item with optional children
 */
export interface SideNavItemL1 {
  /** Display label */
  label: string;
  /** Link URL or anchor */
  href?: string;
  /** Icon class (optional) */
  icon?: string;
  /** Second level items */
  children?: SideNavItemL2[];
}

/**
 * Position behavior for SideNav
 */
export type SideNavPosition = 'static' | 'sticky' | 'fixed';

/**
 * Props for SideNav component
 */
export interface SideNavProps extends BaseProps {
  /** Navigation items (max 3 levels deep) */
  items: SideNavItemL1[];
  /** Position behavior */
  position?: SideNavPosition;
  /** Top offset for sticky/fixed positioning */
  topOffset?: string;
  /** Show active state based on current URL */
  highlightActive?: boolean;
  /** Title/heading for the nav */
  title?: string;
  /** Collapsible sections */
  collapsible?: boolean;
  /** Default expanded state for collapsible sections */
  defaultExpanded?: boolean;
}
