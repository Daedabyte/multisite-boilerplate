/**
 * Navigation Type Definitions
 *
 * Unified navigation system for headers, footers, and mobile menus.
 * Links can be configured to appear in header, footer, or both.
 */

// ===================================
// Link Visibility Configuration
// ===================================

/**
 * Where a link should appear
 * - 'both': Appears in both header and footer (default)
 * - 'header': Header navigation only
 * - 'footer': Footer navigation only
 * - 'none': Hidden from navigation (useful for temporarily disabling)
 */
export type LinkVisibility = 'both' | 'header' | 'footer' | 'none';

// ===================================
// Core Navigation Types
// ===================================

/**
 * Base navigation item (category/group without URL)
 */
export interface NavItem {
  /** Display label for the navigation item */
  label: string;
  /** Where this link appears: 'both' | 'header' | 'footer' | 'none' */
  showIn?: LinkVisibility;
  /** Child navigation items */
  children?: Record<string, NavItem | NavLink>;
  /** Icon identifier (e.g., FontAwesome class) */
  icon?: string;
  /** Description for mega menus or footer descriptions */
  description?: string;
  /** Footer group title (if different from label) */
  footerGroupTitle?: string;
  /** Order priority (lower = first, default: 0) */
  order?: number;
  /**
   * If true, children are displayed as a side navigation on the parent page
   * instead of as a dropdown in the header. The parent link navigates to its
   * page which contains a SideNav with children links.
   */
  sideNav?: boolean;

  /** @deprecated Use showIn instead */
  global?: boolean;
}

/**
 * Navigation link with URL
 */
export interface NavLink extends NavItem {
  /** URL the link points to */
  url: string;
  /** Whether link opens in new tab */
  external?: boolean;
}

// ===================================
// Social Links
// ===================================

/**
 * Supported social media platforms
 */
export type SocialPlatform =
  | 'twitter'
  | 'x'
  | 'facebook'
  | 'instagram'
  | 'linkedin'
  | 'github'
  | 'youtube'
  | 'tiktok'
  | 'discord'
  | 'pinterest'
  | 'threads';

/**
 * Social media link configuration
 */
export interface SocialLink {
  /** Social platform identifier */
  platform: SocialPlatform;
  /** Profile URL */
  url: string;
  /** Accessible label (defaults to platform name) */
  label?: string;
  /** Custom icon class (overrides platform default) */
  icon?: string;
  /** Where to show: 'both' | 'header' | 'footer' | 'none' */
  showIn?: LinkVisibility;
}

// ===================================
// Footer-Specific Types
// ===================================

/**
 * Footer link (flattened for footer display)
 */
export interface FooterLink {
  /** Link URL */
  href: string;
  /** Display label */
  label: string;
  /** Opens in new tab */
  external?: boolean;
  /** Order within group */
  order?: number;
}

/**
 * Footer link group (column of links)
 */
export interface FooterLinkGroup {
  /** Group heading */
  title: string;
  /** Links in the group */
  links: FooterLink[];
  /** Order of the group (lower = first) */
  order?: number;
}

// ===================================
// Unified Navigation Config
// ===================================

/**
 * Complete navigation configuration
 */
export interface NavigationConfig {
  /** Main navigation items */
  items: Record<string, NavItem | NavLink>;
  /** Social media links */
  social?: SocialLink[];
  /** Footer-only link groups (legal, etc.) */
  footerGroups?: FooterLinkGroup[];
}

// ===================================
// Type Guards
// ===================================

/**
 * Check if a NavItem is actually a NavLink (has URL)
 */
export function isNavLink(item: NavItem | NavLink): item is NavLink {
  return 'url' in item && typeof (item as NavLink).url === 'string';
}

/**
 * Safely cast NavItem to NavLink or return null
 */
export function asNavLink(item: NavItem | NavLink): NavLink | null {
  return isNavLink(item) ? item : null;
}

/**
 * Check if navigation item has children
 */
export function hasChildren(item: NavItem | NavLink): boolean {
  return !!item.children && Object.keys(item.children).length > 0;
}

/**
 * Check if item uses side navigation (children shown on page, not dropdown)
 */
export function usesSideNav(item: NavItem | NavLink): boolean {
  return item.sideNav === true && hasChildren(item);
}

/**
 * Check if item should show in header
 */
export function showInHeader(item: NavItem | NavLink): boolean {
  // Support legacy 'global' property
  if (item.global !== undefined) {
    return item.global;
  }
  const visibility = item.showIn ?? 'both';
  return visibility === 'both' || visibility === 'header';
}

/**
 * Check if item should show in footer
 */
export function showInFooter(item: NavItem | NavLink): boolean {
  const visibility = item.showIn ?? 'both';
  return visibility === 'both' || visibility === 'footer';
}

/**
 * Check if social link should show in header
 */
export function showSocialInHeader(link: SocialLink): boolean {
  const visibility = link.showIn ?? 'both';
  return visibility === 'both' || visibility === 'header';
}

/**
 * Check if social link should show in footer
 */
export function showSocialInFooter(link: SocialLink): boolean {
  const visibility = link.showIn ?? 'both';
  return visibility === 'both' || visibility === 'footer';
}

// ===================================
// Navigation Helpers
// ===================================

/**
 * Filter navigation items for header display
 */
export function getHeaderNavItems(
  items: Record<string, NavItem | NavLink>
): Record<string, NavItem | NavLink> {
  const result: Record<string, NavItem | NavLink> = {};

  for (const [key, item] of Object.entries(items)) {
    if (showInHeader(item)) {
      // Filter children too
      if (item.children) {
        const filteredChildren: Record<string, NavItem | NavLink> = {};
        for (const [childKey, child] of Object.entries(item.children)) {
          if (showInHeader(child)) {
            // Filter nested children (3rd level)
            if (child.children) {
              const nestedChildren: Record<string, NavItem | NavLink> = {};
              for (const [nestedKey, nested] of Object.entries(child.children)) {
                if (showInHeader(nested)) {
                  nestedChildren[nestedKey] = nested;
                }
              }
              filteredChildren[childKey] = { ...child, children: nestedChildren };
            } else {
              filteredChildren[childKey] = child;
            }
          }
        }
        result[key] = { ...item, children: filteredChildren };
      } else {
        result[key] = item;
      }
    }
  }

  return result;
}

/**
 * Convert navigation items to footer link groups
 */
export function getFooterLinkGroups(
  items: Record<string, NavItem | NavLink>,
  additionalGroups?: FooterLinkGroup[]
): FooterLinkGroup[] {
  const groups: FooterLinkGroup[] = [];

  // Convert nav items to footer groups
  for (const [key, item] of Object.entries(items)) {
    if (showInFooter(item) && item.children) {
      const links: FooterLink[] = [];

      // Add parent link first if it has a URL
      if (isNavLink(item)) {
        links.push({
          href: item.url,
          label: item.label,
          external: item.external,
          order: -1, // Parent link first
        });
      }

      // Add child links
      for (const [childKey, child] of Object.entries(item.children)) {
        if (showInFooter(child) && isNavLink(child)) {
          links.push({
            href: child.url,
            label: child.label,
            external: child.external,
            order: child.order ?? 0,
          });
        }
      }

      if (links.length > 0) {
        groups.push({
          title: item.footerGroupTitle ?? item.label,
          links: links.sort((a, b) => (a.order ?? 0) - (b.order ?? 0)),
          order: item.order ?? 0,
        });
      }
    }
  }

  // Add additional footer-only groups
  if (additionalGroups) {
    groups.push(...additionalGroups);
  }

  // Sort by order
  return groups.sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
}

/**
 * Get flat list of footer links (for simple footers)
 */
export function getFooterLinks(
  items: Record<string, NavItem | NavLink>
): FooterLink[] {
  const links: FooterLink[] = [];

  for (const [key, item] of Object.entries(items)) {
    if (showInFooter(item) && isNavLink(item)) {
      links.push({
        href: item.url,
        label: item.label,
        external: item.external,
        order: item.order ?? 0,
      });
    }
  }

  return links.sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
}

/**
 * Filter social links for header
 */
export function getHeaderSocialLinks(links: SocialLink[]): SocialLink[] {
  return links.filter(showSocialInHeader);
}

/**
 * Filter social links for footer
 */
export function getFooterSocialLinks(links: SocialLink[]): SocialLink[] {
  return links.filter(showSocialInFooter);
}

// ===================================
// Side Navigation Helpers
// ===================================

/**
 * SideNav item structure (mirrors SideNavItemL1/L2/L3 from components.ts)
 */
export interface SideNavItem {
  label: string;
  href?: string;
  icon?: string;
  children?: SideNavItem[];
}

/**
 * Convert navigation children to SideNav items format
 * Supports up to 3 levels of depth
 */
export function getSideNavItems(item: NavItem | NavLink): SideNavItem[] {
  if (!item.children) return [];

  const items: SideNavItem[] = [];

  for (const [key, child] of Object.entries(item.children)) {
    const sideNavItem: SideNavItem = {
      label: child.label,
      href: isNavLink(child) ? child.url : undefined,
      icon: child.icon,
    };

    // Add L2 children
    if (child.children) {
      sideNavItem.children = [];
      for (const [l2Key, l2Child] of Object.entries(child.children)) {
        const l2Item: SideNavItem = {
          label: l2Child.label,
          href: isNavLink(l2Child) ? l2Child.url : undefined,
          icon: l2Child.icon,
        };

        // Add L3 children (max depth)
        if (l2Child.children) {
          l2Item.children = [];
          for (const [l3Key, l3Child] of Object.entries(l2Child.children)) {
            l2Item.children.push({
              label: l3Child.label,
              href: isNavLink(l3Child) ? l3Child.url : undefined,
              icon: l3Child.icon,
            });
          }
        }

        sideNavItem.children.push(l2Item);
      }
    }

    items.push(sideNavItem);
  }

  return items;
}

/**
 * Find a navigation item by URL path
 */
export function findNavItemByPath(
  items: Record<string, NavItem | NavLink>,
  path: string
): (NavItem | NavLink) | null {
  for (const [key, item] of Object.entries(items)) {
    // Check if this item matches the path
    if (isNavLink(item) && item.url === path) {
      return item;
    }

    // Check children
    if (item.children) {
      const found = findNavItemByPath(item.children, path);
      if (found) return found;
    }
  }

  return null;
}

/**
 * Find the parent navigation item that contains a given path
 * Useful for finding which sideNav parent owns a child page
 */
export function findSideNavParent(
  items: Record<string, NavItem | NavLink>,
  path: string
): (NavItem | NavLink) | null {
  for (const [key, item] of Object.entries(items)) {
    if (!usesSideNav(item)) continue;

    // Check if path matches this parent's URL
    if (isNavLink(item) && item.url === path) {
      return item;
    }

    // Check if path matches any child URL
    if (item.children) {
      for (const [childKey, child] of Object.entries(item.children)) {
        if (isNavLink(child) && child.url === path) {
          return item;
        }
        // Check nested children
        if (child.children) {
          for (const [nestedKey, nested] of Object.entries(child.children)) {
            if (isNavLink(nested) && nested.url === path) {
              return item;
            }
          }
        }
      }
    }
  }

  return null;
}
