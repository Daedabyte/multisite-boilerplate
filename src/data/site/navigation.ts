/**
 * Navigation Item
 * @description Defines the structure for navigation items used throughout the site.
 * @interface NavItem
 * @property {string} label - The display text for the navigation item.
 * @property {string} url - The URL the navigation item points to.
 * @property {boolean} [global] - Indicates if the item is part of the global navigation (aka. Main Navigation Bar).
 * @property {boolean} [external] - Indicates if the link is external (opens in a new tab).
 * @property {Record<string, NavItem[]>} [children] - An optional object containing child navigation items, categorized by section.
 */

export interface NavItem {
    label: string;
    url: string;
    global?: boolean;
    external?: boolean;
    children?: Record<string, NavItem>;
}

/**
 * Site Navigation
 * @description An object representing the site's navigation structure, including main and footer navigation items.
 * @constant {Record<string, NavItem>} navigation - The navigation object containing various navigation items.
 */

export const navigation: Record<string, NavItem> = {
    "home": {
        label: "Home",
        url: "/",
    },
    "about": {
        label: "About",
        url: "/about",
        global: true
    },
    "documentation": {
        label: "Docs",
        url: "/docs",
        global: true,
        children: {
            "colors": {
                label: "Colors",
                url: "/docs/colors",
                global: true
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