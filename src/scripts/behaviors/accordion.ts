/**
 * Accordion Behavior
 *
 * Data-attribute driven accordion/collapse functionality.
 * - Supports multiple open panels
 * - Proper ARIA attributes
 * - Keyboard navigation
 *
 * @example
 * ```html
 * <div data-accordion data-accordion-multiple="false">
 *   <div data-accordion-item>
 *     <button data-accordion-trigger>Question 1</button>
 *     <div data-accordion-content>Answer 1</div>
 *   </div>
 *   <div data-accordion-item>
 *     <button data-accordion-trigger>Question 2</button>
 *     <div data-accordion-content>Answer 2</div>
 *   </div>
 * </div>
 * ```
 */

import { $, $$ } from '../core/dom';

export interface AccordionOptions {
    multiple?: boolean;
    onOpen?: (item: Element, accordion: Element) => void;
    onClose?: (item: Element, accordion: Element) => void;
}

interface AccordionInstance {
    element: Element;
    options: AccordionOptions;
    items: Element[];
}

const instances = new Map<Element, AccordionInstance>();

/**
 * Generates a unique ID
 */
function generateId(prefix: string): string {
    return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

/**
 * Opens an accordion item
 */
export function openItem(item: Element, accordion: Element): void {
    const instance = instances.get(accordion);
    if (!instance) return;

    const trigger = $<HTMLButtonElement>('[data-accordion-trigger]', item);
    const content = $<HTMLElement>('[data-accordion-content]', item);

    if (!trigger || !content) return;

    // Close others if not multiple
    if (!instance.options.multiple) {
        instance.items.forEach((otherItem) => {
            if (otherItem !== item) {
                closeItem(otherItem, accordion);
            }
        });
    }

    // Open this item
    item.setAttribute('data-accordion-open', 'true');
    trigger.setAttribute('aria-expanded', 'true');
    content.hidden = false;

    instance.options.onOpen?.(item, accordion);
}

/**
 * Closes an accordion item
 */
export function closeItem(item: Element, accordion: Element): void {
    const instance = instances.get(accordion);
    if (!instance) return;

    const trigger = $<HTMLButtonElement>('[data-accordion-trigger]', item);
    const content = $<HTMLElement>('[data-accordion-content]', item);

    if (!trigger || !content) return;

    item.setAttribute('data-accordion-open', 'false');
    trigger.setAttribute('aria-expanded', 'false');
    content.hidden = true;

    instance.options.onClose?.(item, accordion);
}

/**
 * Toggles an accordion item
 */
export function toggleItem(item: Element, accordion: Element): void {
    const isOpen = item.getAttribute('data-accordion-open') === 'true';

    if (isOpen) {
        closeItem(item, accordion);
    } else {
        openItem(item, accordion);
    }
}

/**
 * Creates an accordion instance programmatically
 */
export function createAccordion(
    element: Element,
    options: AccordionOptions = {}
): {
    openItem: (item: Element) => void;
    closeItem: (item: Element) => void;
    toggleItem: (item: Element) => void;
    openAll: () => void;
    closeAll: () => void;
} {
    const items = $$('[data-accordion-item]', element);

    const instance: AccordionInstance = {
        element,
        options: {
            multiple: options.multiple ?? false,
            ...options,
        },
        items,
    };

    instances.set(element, instance);

    // Setup ARIA and event listeners
    setupAccordion(element, items);

    return {
        openItem: (item: Element) => openItem(item, element),
        closeItem: (item: Element) => closeItem(item, element),
        toggleItem: (item: Element) => toggleItem(item, element),
        openAll: () => items.forEach((item) => openItem(item, element)),
        closeAll: () => items.forEach((item) => closeItem(item, element)),
    };
}

/**
 * Setup ARIA attributes and event listeners
 */
function setupAccordion(accordion: Element, items: Element[]): void {
    items.forEach((item, index) => {
        const trigger = $<HTMLButtonElement>('[data-accordion-trigger]', item);
        const content = $<HTMLElement>('[data-accordion-content]', item);

        if (!trigger || !content) return;

        // Generate unique IDs
        const triggerId = trigger.id || generateId('accordion-trigger');
        const contentId = content.id || generateId('accordion-content');

        trigger.id = triggerId;
        content.id = contentId;

        // Set ARIA attributes
        trigger.setAttribute('aria-expanded', 'false');
        trigger.setAttribute('aria-controls', contentId);
        content.setAttribute('aria-labelledby', triggerId);
        content.setAttribute('role', 'region');
        content.hidden = true;

        // Initialize state
        item.setAttribute('data-accordion-open', 'false');

        // Handle click
        trigger.addEventListener('click', (e) => {
            e.preventDefault();
            toggleItem(item, accordion);
        });

        // Handle keyboard navigation
        trigger.addEventListener('keydown', (e) => {
            const triggers = $$<HTMLButtonElement>(
                '[data-accordion-trigger]',
                accordion
            );
            const currentIndex = triggers.indexOf(trigger);

            switch (e.key) {
                case 'ArrowDown':
                    e.preventDefault();
                    triggers[(currentIndex + 1) % triggers.length]?.focus();
                    break;
                case 'ArrowUp':
                    e.preventDefault();
                    triggers[
                        (currentIndex - 1 + triggers.length) % triggers.length
                    ]?.focus();
                    break;
                case 'Home':
                    e.preventDefault();
                    triggers[0]?.focus();
                    break;
                case 'End':
                    e.preventDefault();
                    triggers[triggers.length - 1]?.focus();
                    break;
            }
        });
    });
}

/**
 * Destroys an accordion instance
 */
export function destroy(accordion: Element): void {
    instances.delete(accordion);
}

/**
 * Initialize all accordions from data attributes
 */
export function init(): void {
    const accordions = $$('[data-accordion]');

    accordions.forEach((accordion) => {
        if (instances.has(accordion)) return;

        const multiple = accordion.getAttribute('data-accordion-multiple') === 'true';

        createAccordion(accordion, { multiple });

        // Open any initially active items
        const initiallyOpen = $$('[data-accordion-item][data-accordion-open="true"]', accordion);
        initiallyOpen.forEach((item) => {
            openItem(item, accordion);
        });
    });
}
