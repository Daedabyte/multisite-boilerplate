/**
 * Mobile Navigation Behavior
 *
 * Data-attribute driven mobile navigation drawer functionality.
 * - Slide-in drawer with backdrop
 * - Focus trapping
 * - Body scroll lock
 * - Escape key to close
 * - Submenu support
 *
 * @example
 * ```html
 * <button data-mobile-nav-trigger aria-label="Open menu">☰</button>
 * <nav data-mobile-nav>
 *   <button data-mobile-nav-close aria-label="Close menu">×</button>
 *   <ul data-mobile-nav-menu>
 *     <li><a href="/">Home</a></li>
 *     <li data-mobile-nav-has-children>
 *       <button data-mobile-nav-parent>Products</button>
 *       <ul data-mobile-nav-submenu>
 *         <li><a href="/products/a">Product A</a></li>
 *       </ul>
 *     </li>
 *   </ul>
 * </nav>
 * ```
 */

import { $, $$, trapFocus } from '../core/dom';
import { lockScroll, unlockScroll } from '../core/scroll';

export interface MobileNavOptions {
    closeOnEscape?: boolean;
    closeOnLinkClick?: boolean;
    onOpen?: (nav: Element) => void;
    onClose?: (nav: Element) => void;
}

interface MobileNavInstance {
    element: Element;
    trigger: HTMLElement | null;
    options: MobileNavOptions;
    isOpen: boolean;
    cleanupFocusTrap: (() => void) | null;
    cleanup: (() => void) | null;
}

const instances = new Map<Element, MobileNavInstance>();

/**
 * Opens the mobile navigation
 */
export function open(nav: Element): void {
    const instance = instances.get(nav);
    if (!instance || instance.isOpen) return;

    instance.isOpen = true;
    nav.setAttribute('data-mobile-nav-open', '');
    nav.setAttribute('aria-hidden', 'false');

    if (instance.trigger) {
        instance.trigger.setAttribute('aria-expanded', 'true');
    }

    // Lock body scroll
    lockScroll();

    // Trap focus
    instance.cleanupFocusTrap = trapFocus(nav);

    // Focus close button or first focusable element
    const closeButton = $<HTMLElement>('[data-mobile-nav-close]', nav);
    closeButton?.focus();

    // Setup escape key listener
    const handleEscape = (e: KeyboardEvent) => {
        if (e.key === 'Escape') {
            close(nav);
        }
    };

    if (instance.options.closeOnEscape) {
        document.addEventListener('keydown', handleEscape);
    }

    instance.cleanup = () => {
        document.removeEventListener('keydown', handleEscape);
    };

    instance.options.onOpen?.(nav);
}

/**
 * Closes the mobile navigation
 */
export function close(nav: Element): void {
    const instance = instances.get(nav);
    if (!instance || !instance.isOpen) return;

    instance.isOpen = false;
    nav.removeAttribute('data-mobile-nav-open');
    nav.setAttribute('aria-hidden', 'true');

    if (instance.trigger) {
        instance.trigger.setAttribute('aria-expanded', 'false');
        instance.trigger.focus();
    }

    // Unlock body scroll
    unlockScroll();

    // Cleanup focus trap
    instance.cleanupFocusTrap?.();
    instance.cleanupFocusTrap = null;

    // Cleanup listeners
    instance.cleanup?.();
    instance.cleanup = null;

    // Close all submenus
    closeAllSubmenus(nav);

    instance.options.onClose?.(nav);
}

/**
 * Toggles the mobile navigation
 */
export function toggle(nav: Element): void {
    const instance = instances.get(nav);
    if (!instance) return;

    if (instance.isOpen) {
        close(nav);
    } else {
        open(nav);
    }
}

/**
 * Opens a submenu
 */
export function openSubmenu(parent: Element): void {
    const submenu = $<HTMLElement>('[data-mobile-nav-submenu]', parent);
    const button = $<HTMLElement>('[data-mobile-nav-parent]', parent);

    if (!submenu || !button) return;

    parent.setAttribute('data-mobile-nav-submenu-open', '');
    button.setAttribute('aria-expanded', 'true');
    submenu.hidden = false;
}

/**
 * Closes a submenu
 */
export function closeSubmenu(parent: Element): void {
    const submenu = $<HTMLElement>('[data-mobile-nav-submenu]', parent);
    const button = $<HTMLElement>('[data-mobile-nav-parent]', parent);

    if (!submenu || !button) return;

    parent.removeAttribute('data-mobile-nav-submenu-open');
    button.setAttribute('aria-expanded', 'false');
    submenu.hidden = true;
}

/**
 * Toggles a submenu
 */
export function toggleSubmenu(parent: Element): void {
    const isOpen = parent.hasAttribute('data-mobile-nav-submenu-open');

    if (isOpen) {
        closeSubmenu(parent);
    } else {
        openSubmenu(parent);
    }
}

/**
 * Closes all submenus
 */
export function closeAllSubmenus(nav: Element): void {
    const parents = $$('[data-mobile-nav-has-children]', nav);
    parents.forEach((parent) => closeSubmenu(parent));
}

/**
 * Creates a mobile nav instance programmatically
 */
export function createMobileNav(
    element: Element,
    options: MobileNavOptions = {}
): {
    open: () => void;
    close: () => void;
    toggle: () => void;
    isOpen: () => boolean;
} {
    // Find trigger (can be outside the nav element)
    const trigger = $<HTMLElement>('[data-mobile-nav-trigger]');

    const instance: MobileNavInstance = {
        element,
        trigger,
        options: {
            closeOnEscape: options.closeOnEscape ?? true,
            closeOnLinkClick: options.closeOnLinkClick ?? true,
            ...options,
        },
        isOpen: false,
        cleanupFocusTrap: null,
        cleanup: null,
    };

    instances.set(element, instance);

    // Setup event listeners
    setupMobileNav(element, trigger, instance.options);

    return {
        open: () => open(element),
        close: () => close(element),
        toggle: () => toggle(element),
        isOpen: () => instance.isOpen,
    };
}

/**
 * Setup event listeners
 */
function setupMobileNav(
    nav: Element,
    trigger: HTMLElement | null,
    options: MobileNavOptions
): void {
    // Set initial ARIA state
    nav.setAttribute('aria-hidden', 'true');
    nav.setAttribute('role', 'dialog');
    nav.setAttribute('aria-modal', 'true');

    if (trigger) {
        trigger.setAttribute('aria-expanded', 'false');
        trigger.setAttribute('aria-haspopup', 'dialog');

        trigger.addEventListener('click', (e) => {
            e.preventDefault();
            toggle(nav);
        });
    }

    // Handle close button
    const closeButton = $<HTMLElement>('[data-mobile-nav-close]', nav);
    closeButton?.addEventListener('click', (e) => {
        e.preventDefault();
        close(nav);
    });

    // Handle link clicks
    if (options.closeOnLinkClick) {
        const links = $$<HTMLAnchorElement>('a[href]', nav);
        links.forEach((link) => {
            // Skip parent buttons that open submenus
            if (link.closest('[data-mobile-nav-parent]')) return;

            link.addEventListener('click', () => {
                close(nav);
            });
        });
    }

    // Setup submenus
    const parents = $$('[data-mobile-nav-has-children]', nav);
    parents.forEach((parent) => {
        const button = $<HTMLElement>('[data-mobile-nav-parent]', parent);
        const submenu = $<HTMLElement>('[data-mobile-nav-submenu]', parent);

        if (!button || !submenu) return;

        // Set initial state
        button.setAttribute('aria-expanded', 'false');
        submenu.hidden = true;

        button.addEventListener('click', (e) => {
            e.preventDefault();
            toggleSubmenu(parent);
        });
    });

    // Handle backdrop click (if nav has a backdrop area)
    nav.addEventListener('click', (e) => {
        // Close if clicking directly on the nav backdrop (not content)
        if (e.target === nav) {
            close(nav);
        }
    });
}

/**
 * Destroys a mobile nav instance
 */
export function destroy(nav: Element): void {
    const instance = instances.get(nav);
    if (instance) {
        instance.cleanupFocusTrap?.();
        instance.cleanup?.();
        instances.delete(nav);
    }
}

/**
 * Initialize all mobile navs from data attributes
 */
export function init(): void {
    const navs = $$('[data-mobile-nav]');

    navs.forEach((nav) => {
        if (instances.has(nav)) return;

        const closeOnLinkClick =
            nav.getAttribute('data-mobile-nav-close-on-link') !== 'false';

        createMobileNav(nav, { closeOnLinkClick });
    });
}
