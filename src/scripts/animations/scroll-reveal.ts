/**
 * Scroll Reveal Animation
 *
 * Data-attribute driven scroll reveal animations.
 * Uses IntersectionObserver for performance.
 *
 * Supported reveal types:
 * - fade
 * - fade-up
 * - fade-down
 * - fade-left
 * - fade-right
 * - zoom
 * - flip
 *
 * @example
 * ```html
 * <div data-reveal="fade-up" data-reveal-delay="100">Content</div>
 * <div
 *   data-reveal="fade"
 *   data-reveal-delay="200"
 *   data-reveal-duration="600"
 *   data-reveal-easing="ease-out"
 *   data-reveal-distance="30px"
 * >
 *   Content
 * </div>
 * ```
 */

import { $$ } from '../core/dom';
import { createObserver } from '../core/observers';

export type RevealType =
    | 'fade'
    | 'fade-up'
    | 'fade-down'
    | 'fade-left'
    | 'fade-right'
    | 'zoom'
    | 'flip';

export interface RevealOptions {
    type?: RevealType;
    delay?: number;
    duration?: number;
    easing?: string;
    distance?: string;
    threshold?: number;
    rootMargin?: string;
    once?: boolean;
}

const defaultOptions: Required<RevealOptions> = {
    type: 'fade',
    delay: 0,
    duration: 600,
    easing: 'ease',
    distance: '30px',
    threshold: 0.1,
    rootMargin: '0px',
    once: true,
};

// Track revealed elements
const revealedElements = new WeakSet<Element>();

/**
 * Gets reveal options from element data attributes
 */
function getOptionsFromElement(element: Element): RevealOptions {
    const dataset = (element as HTMLElement).dataset;

    return {
        type: (dataset.reveal as RevealType) || defaultOptions.type,
        delay: dataset.revealDelay
            ? parseInt(dataset.revealDelay, 10)
            : defaultOptions.delay,
        duration: dataset.revealDuration
            ? parseInt(dataset.revealDuration, 10)
            : defaultOptions.duration,
        easing: dataset.revealEasing || defaultOptions.easing,
        distance: dataset.revealDistance || defaultOptions.distance,
        threshold: dataset.revealThreshold
            ? parseFloat(dataset.revealThreshold)
            : defaultOptions.threshold,
        once: dataset.revealOnce !== 'false',
    };
}

/**
 * Gets the initial transform based on reveal type
 */
function getInitialTransform(type: RevealType, distance: string): string {
    switch (type) {
        case 'fade-up':
            return `translateY(${distance})`;
        case 'fade-down':
            return `translateY(-${distance})`;
        case 'fade-left':
            return `translateX(${distance})`;
        case 'fade-right':
            return `translateX(-${distance})`;
        case 'zoom':
            return 'scale(0.95)';
        case 'flip':
            return 'perspective(1000px) rotateX(10deg)';
        case 'fade':
        default:
            return 'none';
    }
}

/**
 * Applies initial hidden styles to element
 */
function hideElement(element: HTMLElement, options: RevealOptions): void {
    const { type, duration, easing, distance } = {
        ...defaultOptions,
        ...options,
    };

    element.style.opacity = '0';
    element.style.transform = getInitialTransform(type, distance);
    element.style.transition = `opacity ${duration}ms ${easing}, transform ${duration}ms ${easing}`;
}

/**
 * Reveals an element with animation
 */
function revealElement(element: HTMLElement, options: RevealOptions): void {
    const { delay } = { ...defaultOptions, ...options };

    setTimeout(() => {
        element.style.opacity = '1';
        element.style.transform = 'none';
        element.classList.add('is-revealed');
    }, delay);
}

/**
 * Hides a revealed element (for non-once reveals)
 */
function unreveallElement(element: HTMLElement, options: RevealOptions): void {
    const { type, distance } = { ...defaultOptions, ...options };

    element.style.opacity = '0';
    element.style.transform = getInitialTransform(type, distance);
    element.classList.remove('is-revealed');
}

/**
 * Creates a scroll reveal effect for specific elements
 */
export function reveal(
    elements: string | NodeListOf<Element> | Element[],
    options: RevealOptions = {}
): IntersectionObserver {
    const targetElements =
        typeof elements === 'string'
            ? $$<HTMLElement>(elements)
            : (Array.from(elements) as HTMLElement[]);

    const mergedOptions = { ...defaultOptions, ...options };

    // Apply initial hidden state
    targetElements.forEach((element) => {
        hideElement(element, mergedOptions);
    });

    // Create observer
    const observer = createObserver(
        (entry) => {
            const element = entry.target as HTMLElement;
            const elementOptions = getOptionsFromElement(element);

            if (entry.isIntersecting) {
                if (!revealedElements.has(element)) {
                    revealElement(element, { ...mergedOptions, ...elementOptions });
                    revealedElements.add(element);
                }
            } else if (!elementOptions.once) {
                revealedElements.delete(element);
                unreveallElement(element, { ...mergedOptions, ...elementOptions });
            }
        },
        {
            threshold: mergedOptions.threshold,
            rootMargin: mergedOptions.rootMargin,
            once: false, // We handle this manually to support bidirectional
        }
    );

    targetElements.forEach((element) => {
        observer.observe(element);
    });

    return observer;
}

/**
 * Initialize all reveal elements from data attributes
 */
export function init(): void {
    const elements = $$<HTMLElement>('[data-reveal]');

    if (elements.length === 0) return;

    // Group elements by threshold for efficiency
    const thresholdGroups = new Map<number, HTMLElement[]>();

    elements.forEach((element) => {
        const options = getOptionsFromElement(element);
        const threshold = options.threshold ?? defaultOptions.threshold;

        if (!thresholdGroups.has(threshold)) {
            thresholdGroups.set(threshold, []);
        }
        thresholdGroups.get(threshold)!.push(element);

        // Apply initial hidden state
        hideElement(element, options);
    });

    // Create one observer per threshold group
    thresholdGroups.forEach((groupElements, threshold) => {
        const observer = createObserver(
            (entry) => {
                const element = entry.target as HTMLElement;
                const options = getOptionsFromElement(element);

                if (entry.isIntersecting) {
                    if (!revealedElements.has(element)) {
                        revealElement(element, options);
                        revealedElements.add(element);

                        if (options.once) {
                            observer.unobserve(element);
                        }
                    }
                } else if (!options.once) {
                    revealedElements.delete(element);
                    unreveallElement(element, options);
                }
            },
            {
                threshold,
                once: false,
            }
        );

        groupElements.forEach((element) => {
            observer.observe(element);
        });
    });
}
