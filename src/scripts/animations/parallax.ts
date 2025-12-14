/**
 * Parallax Animation
 *
 * Data-attribute driven parallax scrolling effects.
 * Uses transform for GPU-accelerated animations.
 *
 * @example
 * ```html
 * <!-- Basic parallax -->
 * <div data-parallax data-parallax-speed="0.5">
 *   Background content moves at 50% scroll speed
 * </div>
 *
 * <!-- Parallax with direction -->
 * <div data-parallax data-parallax-speed="-0.3" data-parallax-direction="horizontal">
 *   Moves opposite to scroll horizontally
 * </div>
 * ```
 */

import { $$ } from '../core/dom';
import { throttle } from '../core/events';

export type ParallaxDirection = 'vertical' | 'horizontal';

export interface ParallaxOptions {
    speed?: number;
    direction?: ParallaxDirection;
    disabled?: boolean;
}

const defaultOptions: Required<ParallaxOptions> = {
    speed: 0.5,
    direction: 'vertical',
    disabled: false,
};

interface ParallaxInstance {
    element: HTMLElement;
    options: Required<ParallaxOptions>;
}

const instances: ParallaxInstance[] = [];
let isInitialized = false;
let cleanupFn: (() => void) | null = null;

/**
 * Gets parallax options from element data attributes
 */
function getOptionsFromElement(element: Element): ParallaxOptions {
    const dataset = (element as HTMLElement).dataset;

    return {
        speed: dataset.parallaxSpeed
            ? parseFloat(dataset.parallaxSpeed)
            : defaultOptions.speed,
        direction:
            (dataset.parallaxDirection as ParallaxDirection) ??
            defaultOptions.direction,
        disabled: dataset.parallaxDisabled === 'true',
    };
}

/**
 * Checks if parallax should be disabled (e.g., on mobile, reduced motion)
 */
function shouldDisable(): boolean {
    // Check for reduced motion preference
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        return true;
    }

    // Optionally disable on touch devices for performance
    // Uncomment if needed:
    // if ('ontouchstart' in window) {
    //     return true;
    // }

    return false;
}

/**
 * Calculates the parallax offset for an element
 */
function calculateOffset(
    element: HTMLElement,
    speed: number,
    scrollY: number
): number {
    const rect = element.getBoundingClientRect();
    const elementTop = rect.top + scrollY;
    const viewportHeight = window.innerHeight;

    // Calculate how far the element is from the center of the viewport
    const elementCenter = elementTop + rect.height / 2;
    const viewportCenter = scrollY + viewportHeight / 2;
    const distanceFromCenter = elementCenter - viewportCenter;

    // Apply speed multiplier
    return distanceFromCenter * speed * -1;
}

/**
 * Updates parallax positions
 */
function updateParallax(): void {
    if (shouldDisable()) return;

    const scrollY = window.scrollY;

    instances.forEach(({ element, options }) => {
        if (options.disabled) return;

        const offset = calculateOffset(element, options.speed, scrollY);

        if (options.direction === 'horizontal') {
            element.style.transform = `translate3d(${offset}px, 0, 0)`;
        } else {
            element.style.transform = `translate3d(0, ${offset}px, 0)`;
        }
    });
}

/**
 * Creates a parallax effect for an element
 */
export function createParallax(
    element: HTMLElement,
    options: ParallaxOptions = {}
): {
    update: () => void;
    destroy: () => void;
} {
    const mergedOptions = { ...defaultOptions, ...options };

    const instance: ParallaxInstance = {
        element,
        options: mergedOptions,
    };

    // Set up element styles
    element.style.willChange = 'transform';

    instances.push(instance);

    // Initialize scroll listener if not already
    if (!isInitialized) {
        initScrollListener();
    }

    // Initial update
    updateParallax();

    return {
        update: updateParallax,
        destroy: () => {
            const index = instances.indexOf(instance);
            if (index > -1) {
                instances.splice(index, 1);
            }
            element.style.transform = '';
            element.style.willChange = '';
        },
    };
}

/**
 * Initialize scroll listener
 */
function initScrollListener(): void {
    if (isInitialized) return;

    const throttledUpdate = throttle(updateParallax, 16); // ~60fps

    window.addEventListener('scroll', throttledUpdate, { passive: true });
    window.addEventListener('resize', throttledUpdate, { passive: true });

    cleanupFn = () => {
        window.removeEventListener('scroll', throttledUpdate);
        window.removeEventListener('resize', throttledUpdate);
    };

    isInitialized = true;
}

/**
 * Initialize all parallax elements from data attributes
 */
export function init(): void {
    // Check if should disable globally
    if (shouldDisable()) return;

    const elements = $$<HTMLElement>('[data-parallax]');

    if (elements.length === 0) return;

    elements.forEach((element) => {
        const options = getOptionsFromElement(element);

        if (options.disabled) return;

        // Set up element styles
        element.style.willChange = 'transform';

        instances.push({
            element,
            options: { ...defaultOptions, ...options },
        });
    });

    // Initialize scroll listener
    initScrollListener();

    // Initial update
    updateParallax();
}

/**
 * Destroy all parallax instances
 */
export function destroy(): void {
    instances.forEach(({ element }) => {
        element.style.transform = '';
        element.style.willChange = '';
    });

    instances.length = 0;

    if (cleanupFn) {
        cleanupFn();
        cleanupFn = null;
    }

    isInitialized = false;
}
