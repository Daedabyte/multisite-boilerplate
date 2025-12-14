/**
 * Scroll Position Utilities
 *
 * Provides utilities for tracking and managing scroll position.
 */

/**
 * Get current scroll position
 */
export function getScrollPosition(): { x: number; y: number } {
    return {
        x: window.scrollX || window.pageXOffset,
        y: window.scrollY || window.pageYOffset,
    };
}

/**
 * Get scroll direction
 */
export type ScrollDirection = 'up' | 'down' | 'none';

let lastScrollY = 0;

export function getScrollDirection(): ScrollDirection {
    const currentScrollY = getScrollPosition().y;

    if (currentScrollY > lastScrollY) {
        lastScrollY = currentScrollY;
        return 'down';
    } else if (currentScrollY < lastScrollY) {
        lastScrollY = currentScrollY;
        return 'up';
    }

    return 'none';
}

/**
 * Check if page is scrolled past a threshold
 */
export function isScrolledPast(threshold: number): boolean {
    return getScrollPosition().y > threshold;
}

/**
 * Get scroll percentage of document
 */
export function getScrollPercentage(): number {
    const scrollTop = getScrollPosition().y;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    return docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
}

/**
 * Smooth scroll to element
 */
export function scrollToElement(
    element: Element | string,
    options: ScrollIntoViewOptions = {}
): void {
    const target =
        typeof element === 'string'
            ? document.querySelector(element)
            : element;

    if (target) {
        target.scrollIntoView({
            behavior: 'smooth',
            block: 'start',
            ...options,
        });
    }
}

/**
 * Smooth scroll to top of page
 */
export function scrollToTop(behavior: ScrollBehavior = 'smooth'): void {
    window.scrollTo({
        top: 0,
        behavior,
    });
}

/**
 * Smooth scroll to specific position
 */
export function scrollToPosition(
    y: number,
    behavior: ScrollBehavior = 'smooth'
): void {
    window.scrollTo({
        top: y,
        behavior,
    });
}

/**
 * Lock body scroll (useful for modals)
 * Uses overflow: hidden approach to prevent layout shift and scroll position issues
 */
export function lockScroll(): void {
    // Don't lock if already locked
    if (document.body.dataset.scrollLocked === 'true') return;

    const scrollY = getScrollPosition().y;
    const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;

    // Store current scroll position
    document.body.dataset.scrollLocked = 'true';
    document.body.dataset.scrollPosition = String(scrollY);

    // Apply styles to prevent scroll while maintaining position
    document.documentElement.style.setProperty('--scroll-locked-position', `-${scrollY}px`);
    document.documentElement.style.setProperty('--scrollbar-width', `${scrollbarWidth}px`);
    document.body.classList.add('scroll-locked');
}

/**
 * Unlock body scroll
 */
export function unlockScroll(): void {
    // Don't unlock if not locked
    if (document.body.dataset.scrollLocked !== 'true') return;

    const scrollY = parseInt(document.body.dataset.scrollPosition || '0', 10);

    // Remove lock state
    delete document.body.dataset.scrollLocked;
    delete document.body.dataset.scrollPosition;
    document.body.classList.remove('scroll-locked');

    // Clean up CSS properties
    document.documentElement.style.removeProperty('--scroll-locked-position');
    document.documentElement.style.removeProperty('--scrollbar-width');

    // Restore scroll position instantly (no smooth scroll)
    window.scrollTo({ top: scrollY, behavior: 'instant' });
}

/**
 * Check if scroll is locked
 */
export function isScrollLocked(): boolean {
    return document.body.dataset.scrollLocked === 'true';
}

/**
 * Watch scroll direction with callback
 */
export function watchScrollDirection(
    callback: (direction: ScrollDirection, scrollY: number) => void,
    options: { threshold?: number } = {}
): () => void {
    const { threshold = 0 } = options;
    let lastDirection: ScrollDirection = 'none';
    let lastY = getScrollPosition().y;

    const handleScroll = () => {
        const currentY = getScrollPosition().y;
        const delta = currentY - lastY;

        if (Math.abs(delta) < threshold) return;

        const direction: ScrollDirection =
            delta > 0 ? 'down' : delta < 0 ? 'up' : 'none';

        if (direction !== lastDirection) {
            lastDirection = direction;
            callback(direction, currentY);
        }

        lastY = currentY;
    };

    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
        window.removeEventListener('scroll', handleScroll);
    };
}

/**
 * Watch scroll position with callback (throttled)
 */
export function watchScrollPosition(
    callback: (position: { x: number; y: number; percentage: number }) => void,
    throttleMs: number = 100
): () => void {
    let ticking = false;
    let lastTime = 0;

    const handleScroll = () => {
        const now = Date.now();

        if (!ticking && now - lastTime >= throttleMs) {
            requestAnimationFrame(() => {
                callback({
                    ...getScrollPosition(),
                    percentage: getScrollPercentage(),
                });
                ticking = false;
                lastTime = now;
            });
            ticking = true;
        }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
        window.removeEventListener('scroll', handleScroll);
    };
}
