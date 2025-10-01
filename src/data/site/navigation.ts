/**
 * Site Navigation Configuration
 * @description This module defines the structure of the site's navigation, including main and footer navigation items.
 * @module navigation
 */

/**
 * Type Definition for NavItem
 * @typedef {Object} NavItem - Represents a navigation item with optional children.
 * @property {string} label - The display label for the navigation item.
 * @property {boolean} [global] - Indicates if the item is part of the global navigation.
 * @property {Record<string, NavItem>} [children] - An object containing child navigation items.
 * 
 * @typedef {Object} NavLink - Represents a navigation link item.
 */
interface NavItem {
    label: string;
    global?: boolean;
    children ?: Record<string, NavItem>;
}

/**
 * Type Definition for NavLink
 * @typedef {Object} NavLink - Represents a navigation link item extending NavItem.
 * @property {string} url - The URL the navigation link points to.
 * @property {boolean} [external] - Indicates if the link is external.
 * @property {Record<string, NavItem | NavLink>} [children] - An object containing child navigation items or links.
 * @extends {NavItem}
 */
interface NavLink extends NavItem {
    url: string;
    external?: boolean;
    children?: Record<string, NavItem | NavLink>;
}

/**
 * Type Guard for NavLink
 * @function isNavItem
 * @param {NavItem | NavLink} item - The item to check.
 * @return {item is NavLink} - Returns true if the item is a NavLink, false otherwise.
 */
export function isNavLink(item: NavItem): item is NavLink {
    return (item as NavLink).url !== undefined;
}

export function asNavLink(item: NavItem) : NavLink | null {
    if (isNavLink(item)) {
        return item as NavLink;
    }
    return null;
}

/**
 * Site Navigation
 * @description An object representing the site's navigation structure, including main and footer navigation items.
 * @constant {Record<string, NavItem>} navigation - The navigation object containing various navigation items.
 */

export const navigation: Record<string, NavItem | NavLink> = {
    "home": {
        label: "Home",
        url: "/",
    },
    "about": {
        label: "About",
        url: "/about",
        global: true,
        children: {
            "team": {
                label: "Team",
                url: "/about/team",
                global: true,
            },
            "careers": {
                label: "Careers",
                url: "/about/careers",
                global: true,
            }
        }
    },
    "documentation": {
        label: "Docs",
        global: true,
        children: {
            "style-guide": {
                label: "Style Guide",
                url: "/docs/style-guide",
                global: true,
                children: {
                    "typography": {
                        label: "Typography",
                        url: "/docs/style-guide/typography",
                        global: true,
                    },
                    "colors": {
                        label: "Colors",
                        url: "/docs/style-guide/colors",
                        global: true,
                    },
                }
            },
            "components": {
                label: "Components",
                url: "/docs/components",
                global: true,
            }
        }
    },
    "contact": {
        label: "Contact",
        url: "/contact",
        global: true
    },
    "daedabyte": {
        label: "Daedabyte",
        url: "https://www.daedabyte.com",
        external: true
    }
}