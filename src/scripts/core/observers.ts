/**
 * Intersection Observer Utilities
 *
 * Provides utilities for creating and managing IntersectionObservers
 * for scroll-based animations and lazy loading.
 */

export type ObserverCallback = (entry: IntersectionObserverEntry) => void;

export interface ObserverOptions {
    /** Root element for intersection */
    root?: Element | null;
    /** Margin around the root */
    rootMargin?: string;
    /** Threshold(s) for triggering callback */
    threshold?: number | number[];
    /** Only trigger once per element */
    once?: boolean;
}

const defaultOptions: ObserverOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.1,
    once: true,
};

/**
 * Creates a configured IntersectionObserver
 */
export function createObserver(
    callback: ObserverCallback,
    options: ObserverOptions = {}
): IntersectionObserver {
    const mergedOptions = { ...defaultOptions, ...options };
    const { once, ...observerOptions } = mergedOptions;

    return new IntersectionObserver((entries, observer) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                callback(entry);
                if (once) {
                    observer.unobserve(entry.target);
                }
            }
        });
    }, observerOptions);
}

/**
 * Observes elements matching a selector or NodeList
 */
export function observeElements(
    selector: string | NodeListOf<Element> | Element[],
    callback: ObserverCallback,
    options: ObserverOptions = {}
): IntersectionObserver {
    const observer = createObserver(callback, options);

    const elements =
        typeof selector === 'string'
            ? document.querySelectorAll(selector)
            : selector;

    elements.forEach((element) => {
        observer.observe(element);
    });

    return observer;
}

/**
 * Creates an observer that triggers when element enters viewport
 */
export function onEnterViewport(
    selector: string | NodeListOf<Element> | Element[],
    callback: ObserverCallback,
    options: ObserverOptions = {}
): IntersectionObserver {
    return observeElements(selector, callback, {
        threshold: 0,
        ...options,
    });
}

/**
 * Creates an observer for lazy loading images
 */
export function lazyLoadImages(
    selector: string = '[data-lazy-src]',
    options: ObserverOptions = {}
): IntersectionObserver {
    return observeElements(
        selector,
        (entry) => {
            const img = entry.target as HTMLImageElement;
            const src = img.dataset.lazySrc;

            if (src) {
                img.src = src;
                img.removeAttribute('data-lazy-src');
                img.classList.add('is-loaded');
            }
        },
        {
            rootMargin: '50px',
            ...options,
        }
    );
}

/**
 * Cleanup function to disconnect an observer
 */
export function disconnectObserver(observer: IntersectionObserver): void {
    observer.disconnect();
}
