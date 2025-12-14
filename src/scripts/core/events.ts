/**
 * Event Utilities
 *
 * Provides utilities for event delegation, throttling, and debouncing.
 */

/**
 * Event delegation - attach a single listener for multiple elements
 *
 * @param parent - Parent element or document to attach listener to
 * @param eventType - Event type (e.g., 'click', 'keydown')
 * @param selector - CSS selector to match target elements
 * @param handler - Event handler function
 * @returns Cleanup function to remove the listener
 *
 * @example
 * ```ts
 * const cleanup = delegate(document, 'click', '.btn', (e, target) => {
 *   console.log('Button clicked:', target);
 * });
 * // Later: cleanup();
 * ```
 */
export function delegate<T extends Event = Event>(
    parent: Element | Document,
    eventType: string,
    selector: string,
    handler: (event: T, target: Element) => void
): () => void {
    const listener = (event: Event) => {
        const target = (event.target as Element).closest(selector);
        if (target && parent.contains(target)) {
            handler(event as T, target);
        }
    };

    parent.addEventListener(eventType, listener);

    return () => {
        parent.removeEventListener(eventType, listener);
    };
}

/**
 * Throttle a function to execute at most once per interval
 *
 * @param fn - Function to throttle
 * @param limit - Minimum time between executions (ms)
 * @returns Throttled function
 *
 * @example
 * ```ts
 * const throttledScroll = throttle(() => {
 *   console.log('Scrolling...');
 * }, 100);
 * window.addEventListener('scroll', throttledScroll);
 * ```
 */
export function throttle<T extends (...args: unknown[]) => void>(
    fn: T,
    limit: number
): T {
    let inThrottle = false;
    let lastArgs: unknown[] | null = null;

    const throttled = (...args: unknown[]) => {
        if (!inThrottle) {
            fn(...args);
            inThrottle = true;
            setTimeout(() => {
                inThrottle = false;
                if (lastArgs) {
                    fn(...lastArgs);
                    lastArgs = null;
                }
            }, limit);
        } else {
            lastArgs = args;
        }
    };

    return throttled as T;
}

/**
 * Debounce a function to execute only after a delay
 *
 * @param fn - Function to debounce
 * @param wait - Delay before execution (ms)
 * @param immediate - Execute on leading edge instead of trailing
 * @returns Debounced function with cancel method
 *
 * @example
 * ```ts
 * const debouncedSearch = debounce((query) => {
 *   fetchResults(query);
 * }, 300);
 * input.addEventListener('input', (e) => debouncedSearch(e.target.value));
 * ```
 */
export function debounce<T extends (...args: unknown[]) => void>(
    fn: T,
    wait: number,
    immediate = false
): T & { cancel: () => void } {
    let timeout: ReturnType<typeof setTimeout> | null = null;

    const debounced = (...args: unknown[]) => {
        const later = () => {
            timeout = null;
            if (!immediate) fn(...args);
        };

        const callNow = immediate && !timeout;

        if (timeout) clearTimeout(timeout);
        timeout = setTimeout(later, wait);

        if (callNow) fn(...args);
    };

    debounced.cancel = () => {
        if (timeout) {
            clearTimeout(timeout);
            timeout = null;
        }
    };

    return debounced as T & { cancel: () => void };
}

/**
 * Execute callback on next animation frame
 */
export function nextFrame(callback: FrameRequestCallback): number {
    return requestAnimationFrame(callback);
}

/**
 * Execute callback after DOM is ready
 */
export function onReady(callback: () => void): void {
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', callback);
    } else {
        callback();
    }
}

/**
 * Execute callback after page is fully loaded (including images)
 */
export function onLoad(callback: () => void): void {
    if (document.readyState === 'complete') {
        callback();
    } else {
        window.addEventListener('load', callback);
    }
}

/**
 * Add event listener with automatic cleanup on page navigation (for SPAs)
 */
export function addEventListenerWithCleanup(
    element: Element | Window | Document,
    eventType: string,
    handler: EventListener,
    options?: AddEventListenerOptions
): () => void {
    element.addEventListener(eventType, handler, options);

    return () => {
        element.removeEventListener(eventType, handler, options);
    };
}
