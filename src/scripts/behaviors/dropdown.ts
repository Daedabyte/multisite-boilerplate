/**
 * Dropdown Behavior
 *
 * Data-attribute driven dropdown menu functionality.
 * - Proper ARIA attributes
 * - Keyboard navigation
 * - Click outside to close
 * - Focus management
 *
 * @example
 * ```html
 * <div data-dropdown>
 *   <button data-dropdown-trigger>Menu</button>
 *   <div data-dropdown-content>
 *     <a href="#" data-dropdown-item>Item 1</a>
 *     <a href="#" data-dropdown-item>Item 2</a>
 *   </div>
 * </div>
 * ```
 */

import { $, $$ } from '../core/dom';

export interface DropdownOptions {
    closeOnClickOutside?: boolean;
    closeOnEscape?: boolean;
    closeOnSelect?: boolean;
    onOpen?: (dropdown: Element) => void;
    onClose?: (dropdown: Element) => void;
}

interface DropdownInstance {
    element: Element;
    trigger: HTMLElement;
    content: HTMLElement;
    options: DropdownOptions;
    isOpen: boolean;
    cleanup: (() => void) | null;
}

const instances = new Map<Element, DropdownInstance>();

/**
 * Generates a unique ID
 */
function generateId(prefix: string): string {
    return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

/**
 * Opens a dropdown
 */
export function open(dropdown: Element): void {
    const instance = instances.get(dropdown);
    if (!instance || instance.isOpen) return;

    instance.isOpen = true;
    instance.trigger.setAttribute('aria-expanded', 'true');
    instance.content.hidden = false;
    dropdown.setAttribute('data-dropdown-open', '');

    // Focus first item
    const firstItem = $<HTMLElement>('[data-dropdown-item]', instance.content);
    firstItem?.focus();

    // Setup click outside listener
    const handleClickOutside = (e: MouseEvent) => {
        if (!dropdown.contains(e.target as Node)) {
            close(dropdown);
        }
    };

    // Setup escape key listener
    const handleEscape = (e: KeyboardEvent) => {
        if (e.key === 'Escape') {
            close(dropdown);
            instance.trigger.focus();
        }
    };

    if (instance.options.closeOnClickOutside) {
        document.addEventListener('click', handleClickOutside);
    }

    if (instance.options.closeOnEscape) {
        document.addEventListener('keydown', handleEscape);
    }

    instance.cleanup = () => {
        document.removeEventListener('click', handleClickOutside);
        document.removeEventListener('keydown', handleEscape);
    };

    instance.options.onOpen?.(dropdown);
}

/**
 * Closes a dropdown
 */
export function close(dropdown: Element): void {
    const instance = instances.get(dropdown);
    if (!instance || !instance.isOpen) return;

    instance.isOpen = false;
    instance.trigger.setAttribute('aria-expanded', 'false');
    instance.content.hidden = true;
    dropdown.removeAttribute('data-dropdown-open');

    // Cleanup listeners
    instance.cleanup?.();
    instance.cleanup = null;

    instance.options.onClose?.(dropdown);
}

/**
 * Toggles a dropdown
 */
export function toggle(dropdown: Element): void {
    const instance = instances.get(dropdown);
    if (!instance) return;

    if (instance.isOpen) {
        close(dropdown);
    } else {
        open(dropdown);
    }
}

/**
 * Creates a dropdown instance programmatically
 */
export function createDropdown(
    element: Element,
    options: DropdownOptions = {}
): {
    open: () => void;
    close: () => void;
    toggle: () => void;
    isOpen: () => boolean;
} {
    const trigger = $<HTMLElement>('[data-dropdown-trigger]', element);
    const content = $<HTMLElement>('[data-dropdown-content]', element);

    if (!trigger || !content) {
        throw new Error('Dropdown requires trigger and content elements');
    }

    const instance: DropdownInstance = {
        element,
        trigger,
        content,
        options: {
            closeOnClickOutside: options.closeOnClickOutside ?? true,
            closeOnEscape: options.closeOnEscape ?? true,
            closeOnSelect: options.closeOnSelect ?? true,
            ...options,
        },
        isOpen: false,
        cleanup: null,
    };

    instances.set(element, instance);

    // Setup ARIA and event listeners
    setupDropdown(element, trigger, content, instance.options);

    return {
        open: () => open(element),
        close: () => close(element),
        toggle: () => toggle(element),
        isOpen: () => instance.isOpen,
    };
}

/**
 * Setup ARIA attributes and event listeners
 */
function setupDropdown(
    dropdown: Element,
    trigger: HTMLElement,
    content: HTMLElement,
    options: DropdownOptions
): void {
    // Generate unique IDs
    const triggerId = trigger.id || generateId('dropdown-trigger');
    const contentId = content.id || generateId('dropdown-content');

    trigger.id = triggerId;
    content.id = contentId;

    // Set ARIA attributes
    trigger.setAttribute('aria-haspopup', 'true');
    trigger.setAttribute('aria-expanded', 'false');
    trigger.setAttribute('aria-controls', contentId);
    content.setAttribute('role', 'menu');
    content.setAttribute('aria-labelledby', triggerId);
    content.hidden = true;

    // Set up items
    const items = $$<HTMLElement>('[data-dropdown-item]', content);
    items.forEach((item) => {
        item.setAttribute('role', 'menuitem');
        item.setAttribute('tabindex', '-1');

        // Close on select if configured
        if (options.closeOnSelect) {
            item.addEventListener('click', () => {
                close(dropdown);
            });
        }
    });

    // Handle trigger click
    trigger.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        toggle(dropdown);
    });

    // Handle trigger keyboard
    trigger.addEventListener('keydown', (e) => {
        switch (e.key) {
            case 'Enter':
            case ' ':
            case 'ArrowDown':
                e.preventDefault();
                open(dropdown);
                break;
            case 'ArrowUp':
                e.preventDefault();
                open(dropdown);
                // Focus last item
                const lastItem = items[items.length - 1];
                lastItem?.focus();
                break;
        }
    });

    // Handle keyboard navigation within dropdown
    content.addEventListener('keydown', (e) => {
        const currentItem = document.activeElement as HTMLElement;
        const currentIndex = items.indexOf(currentItem);

        switch (e.key) {
            case 'ArrowDown':
                e.preventDefault();
                {
                    const nextIndex = (currentIndex + 1) % items.length;
                    items[nextIndex]?.focus();
                }
                break;
            case 'ArrowUp':
                e.preventDefault();
                {
                    const prevIndex =
                        (currentIndex - 1 + items.length) % items.length;
                    items[prevIndex]?.focus();
                }
                break;
            case 'Home':
                e.preventDefault();
                items[0]?.focus();
                break;
            case 'End':
                e.preventDefault();
                items[items.length - 1]?.focus();
                break;
            case 'Tab':
                close(dropdown);
                break;
        }
    });
}

/**
 * Destroys a dropdown instance
 */
export function destroy(dropdown: Element): void {
    const instance = instances.get(dropdown);
    if (instance) {
        instance.cleanup?.();
        instances.delete(dropdown);
    }
}

/**
 * Initialize all dropdowns from data attributes
 */
export function init(): void {
    const dropdowns = $$('[data-dropdown]');

    dropdowns.forEach((dropdown) => {
        if (instances.has(dropdown)) return;

        const closeOnSelect =
            dropdown.getAttribute('data-dropdown-close-on-select') !== 'false';

        createDropdown(dropdown, { closeOnSelect });
    });
}
