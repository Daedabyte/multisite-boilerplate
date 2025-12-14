/**
 * Stagger Animation
 *
 * Data-attribute driven staggered children animations.
 * Animates children elements with a configurable delay between each.
 *
 * @example
 * ```html
 * <div data-stagger data-stagger-delay="100">
 *   <div>Child 1</div>
 *   <div>Child 2</div>
 *   <div>Child 3</div>
 * </div>
 *
 * <!-- With custom reveal type -->
 * <div data-stagger data-stagger-delay="150" data-stagger-reveal="fade-left">
 *   <div>Child 1</div>
 *   <div>Child 2</div>
 * </div>
 * ```
 */

import { $$ } from '../core/dom';
import { createObserver } from '../core/observers';
import type { RevealType } from './scroll-reveal';

export interface StaggerOptions {
    delay?: number;
    duration?: number;
    easing?: string;
    reveal?: RevealType;
    distance?: string;
    threshold?: number;
    childSelector?: string;
}

const defaultOptions: Required<StaggerOptions> = {
    delay: 100,
    duration: 600,
    easing: 'ease',
    reveal: 'fade-up',
    distance: '30px',
    threshold: 0.1,
    childSelector: ':scope > *',
};

// Track staggered containers
const staggeredContainers = new WeakSet<Element>();

/**
 * Gets stagger options from element data attributes
 */
function getOptionsFromElement(element: Element): StaggerOptions {
    const dataset = (element as HTMLElement).dataset;

    return {
        delay: dataset.staggerDelay
            ? parseInt(dataset.staggerDelay, 10)
            : defaultOptions.delay,
        duration: dataset.staggerDuration
            ? parseInt(dataset.staggerDuration, 10)
            : defaultOptions.duration,
        easing: dataset.staggerEasing || defaultOptions.easing,
        reveal: (dataset.staggerReveal as RevealType) || defaultOptions.reveal,
        distance: dataset.staggerDistance || defaultOptions.distance,
        threshold: dataset.staggerThreshold
            ? parseFloat(dataset.staggerThreshold)
            : defaultOptions.threshold,
        childSelector: dataset.staggerChildren || defaultOptions.childSelector,
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
 * Applies initial hidden styles to children
 */
function hideChildren(
    container: HTMLElement,
    options: StaggerOptions
): HTMLElement[] {
    const { reveal, duration, easing, distance, childSelector } = {
        ...defaultOptions,
        ...options,
    };

    const children = $$<HTMLElement>(childSelector, container);

    children.forEach((child) => {
        child.style.opacity = '0';
        child.style.transform = getInitialTransform(reveal, distance);
        child.style.transition = `opacity ${duration}ms ${easing}, transform ${duration}ms ${easing}`;
    });

    return children;
}

/**
 * Reveals children with staggered animation
 */
function revealChildren(children: HTMLElement[], delay: number): void {
    children.forEach((child, index) => {
        setTimeout(() => {
            child.style.opacity = '1';
            child.style.transform = 'none';
            child.classList.add('is-revealed');
        }, index * delay);
    });
}

/**
 * Creates a stagger animation for a container
 */
export function stagger(
    container: HTMLElement,
    options: StaggerOptions = {}
): IntersectionObserver {
    const mergedOptions = { ...defaultOptions, ...options };

    // Hide children initially
    const children = hideChildren(container, mergedOptions);

    // Create observer
    const observer = createObserver(
        (entry) => {
            if (entry.isIntersecting && !staggeredContainers.has(container)) {
                staggeredContainers.add(container);
                revealChildren(children, mergedOptions.delay);
            }
        },
        {
            threshold: mergedOptions.threshold,
            once: true,
        }
    );

    observer.observe(container);

    return observer;
}

/**
 * Initialize all stagger containers from data attributes
 */
export function init(): void {
    const containers = $$<HTMLElement>('[data-stagger]');

    if (containers.length === 0) return;

    containers.forEach((container) => {
        if (staggeredContainers.has(container)) return;

        const options = getOptionsFromElement(container);

        // Hide children initially
        const children = hideChildren(container, options);

        // Create observer
        const observer = createObserver(
            (entry) => {
                if (entry.isIntersecting && !staggeredContainers.has(container)) {
                    staggeredContainers.add(container);
                    revealChildren(children, options.delay ?? defaultOptions.delay);
                }
            },
            {
                threshold: options.threshold ?? defaultOptions.threshold,
                once: true,
            }
        );

        observer.observe(container);
    });
}
