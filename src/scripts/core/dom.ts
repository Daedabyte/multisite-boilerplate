/**
 * DOM Manipulation Utilities
 *
 * Provides utilities for common DOM operations.
 */

/**
 * Query selector shorthand with type safety
 */
export function $<T extends Element = Element>(
    selector: string,
    parent: Element | Document = document
): T | null {
    return parent.querySelector<T>(selector);
}

/**
 * Query selector all shorthand with array return
 */
export function $$<T extends Element = Element>(
    selector: string,
    parent: Element | Document = document
): T[] {
    return Array.from(parent.querySelectorAll<T>(selector));
}

/**
 * Get element by ID with type safety
 */
export function byId<T extends HTMLElement = HTMLElement>(
    id: string
): T | null {
    return document.getElementById(id) as T | null;
}

/**
 * Check if element matches selector
 */
export function matches(element: Element, selector: string): boolean {
    return element.matches(selector);
}

/**
 * Find closest ancestor matching selector
 */
export function closest<T extends Element = Element>(
    element: Element,
    selector: string
): T | null {
    return element.closest<T>(selector);
}

/**
 * Add class(es) to element
 */
export function addClass(
    element: Element,
    ...classes: string[]
): void {
    element.classList.add(...classes);
}

/**
 * Remove class(es) from element
 */
export function removeClass(
    element: Element,
    ...classes: string[]
): void {
    element.classList.remove(...classes);
}

/**
 * Toggle class on element
 */
export function toggleClass(
    element: Element,
    className: string,
    force?: boolean
): boolean {
    return element.classList.toggle(className, force);
}

/**
 * Check if element has class
 */
export function hasClass(element: Element, className: string): boolean {
    return element.classList.contains(className);
}

/**
 * Set multiple attributes on element
 */
export function setAttributes(
    element: Element,
    attributes: Record<string, string | boolean | number>
): void {
    Object.entries(attributes).forEach(([key, value]) => {
        if (typeof value === 'boolean') {
            if (value) {
                element.setAttribute(key, '');
            } else {
                element.removeAttribute(key);
            }
        } else {
            element.setAttribute(key, String(value));
        }
    });
}

/**
 * Get data attribute value
 */
export function getData(
    element: Element,
    key: string
): string | undefined {
    return (element as HTMLElement).dataset[key];
}

/**
 * Set data attribute value
 */
export function setData(
    element: Element,
    key: string,
    value: string
): void {
    (element as HTMLElement).dataset[key] = value;
}

/**
 * Get numeric data attribute with fallback
 */
export function getDataNumber(
    element: Element,
    key: string,
    fallback: number = 0
): number {
    const value = getData(element, key);
    if (value === undefined) return fallback;
    const num = parseFloat(value);
    return isNaN(num) ? fallback : num;
}

/**
 * Get boolean data attribute
 */
export function getDataBool(
    element: Element,
    key: string,
    fallback: boolean = false
): boolean {
    const value = getData(element, key);
    if (value === undefined) return fallback;
    return value !== 'false' && value !== '0';
}

/**
 * Set CSS custom property on element
 */
export function setCSSVar(
    element: Element,
    property: string,
    value: string
): void {
    (element as HTMLElement).style.setProperty(property, value);
}

/**
 * Get CSS custom property value
 */
export function getCSSVar(
    element: Element,
    property: string
): string {
    return getComputedStyle(element).getPropertyValue(property).trim();
}

/**
 * Get element dimensions
 */
export function getDimensions(element: Element): DOMRect {
    return element.getBoundingClientRect();
}

/**
 * Check if element is visible in viewport
 */
export function isInViewport(element: Element): boolean {
    const rect = element.getBoundingClientRect();
    return (
        rect.top < window.innerHeight &&
        rect.bottom > 0 &&
        rect.left < window.innerWidth &&
        rect.right > 0
    );
}

/**
 * Create element with attributes and children
 */
export function createElement<K extends keyof HTMLElementTagNameMap>(
    tag: K,
    attributes?: Record<string, string>,
    children?: (Node | string)[]
): HTMLElementTagNameMap[K] {
    const element = document.createElement(tag);

    if (attributes) {
        Object.entries(attributes).forEach(([key, value]) => {
            if (key === 'class') {
                element.className = value;
            } else {
                element.setAttribute(key, value);
            }
        });
    }

    if (children) {
        children.forEach((child) => {
            if (typeof child === 'string') {
                element.appendChild(document.createTextNode(child));
            } else {
                element.appendChild(child);
            }
        });
    }

    return element;
}

/**
 * Remove element from DOM
 */
export function removeElement(element: Element): void {
    element.remove();
}

/**
 * Trap focus within an element (useful for modals)
 */
export function trapFocus(container: Element): () => void {
    const focusableSelectors = [
        'a[href]',
        'button:not([disabled])',
        'input:not([disabled])',
        'select:not([disabled])',
        'textarea:not([disabled])',
        '[tabindex]:not([tabindex="-1"])',
    ].join(',');

    const focusableElements = $$(focusableSelectors, container);
    const firstFocusable = focusableElements[0] as HTMLElement;
    const lastFocusable = focusableElements[focusableElements.length - 1] as HTMLElement;

    const handleKeydown = (e: KeyboardEvent) => {
        if (e.key !== 'Tab') return;

        if (e.shiftKey) {
            if (document.activeElement === firstFocusable) {
                e.preventDefault();
                lastFocusable?.focus();
            }
        } else {
            if (document.activeElement === lastFocusable) {
                e.preventDefault();
                firstFocusable?.focus();
            }
        }
    };

    container.addEventListener('keydown', handleKeydown as EventListener);
    firstFocusable?.focus();

    return () => {
        container.removeEventListener('keydown', handleKeydown as EventListener);
    };
}
