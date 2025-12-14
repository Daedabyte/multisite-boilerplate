/**
 * Counter Animation
 *
 * Data-attribute driven number counting animation.
 * Animates from a starting number to a target number.
 *
 * @example
 * ```html
 * <span data-counter data-counter-target="1500">0</span>
 * <span
 *   data-counter
 *   data-counter-target="99.9"
 *   data-counter-duration="2000"
 *   data-counter-start="0"
 *   data-counter-decimals="1"
 *   data-counter-prefix="$"
 *   data-counter-suffix="M"
 * >
 *   $0M
 * </span>
 * ```
 */

import { $$ } from '../core/dom';
import { createObserver } from '../core/observers';

export interface CounterOptions {
    target: number;
    start?: number;
    duration?: number;
    decimals?: number;
    prefix?: string;
    suffix?: string;
    separator?: string;
    easing?: 'linear' | 'easeOut' | 'easeInOut';
    threshold?: number;
}

const defaultOptions: Required<Omit<CounterOptions, 'target'>> = {
    start: 0,
    duration: 2000,
    decimals: 0,
    prefix: '',
    suffix: '',
    separator: ',',
    easing: 'easeOut',
    threshold: 0.5,
};

// Track counted elements
const countedElements = new WeakSet<Element>();

/**
 * Gets counter options from element data attributes
 */
function getOptionsFromElement(element: Element): CounterOptions | null {
    const dataset = (element as HTMLElement).dataset;

    if (!dataset.counterTarget) {
        console.warn('Counter element missing data-counter-target');
        return null;
    }

    return {
        target: parseFloat(dataset.counterTarget),
        start: dataset.counterStart
            ? parseFloat(dataset.counterStart)
            : defaultOptions.start,
        duration: dataset.counterDuration
            ? parseInt(dataset.counterDuration, 10)
            : defaultOptions.duration,
        decimals: dataset.counterDecimals
            ? parseInt(dataset.counterDecimals, 10)
            : defaultOptions.decimals,
        prefix: dataset.counterPrefix ?? defaultOptions.prefix,
        suffix: dataset.counterSuffix ?? defaultOptions.suffix,
        separator: dataset.counterSeparator ?? defaultOptions.separator,
        easing:
            (dataset.counterEasing as CounterOptions['easing']) ??
            defaultOptions.easing,
        threshold: dataset.counterThreshold
            ? parseFloat(dataset.counterThreshold)
            : defaultOptions.threshold,
    };
}

/**
 * Formats a number with separators and decimals
 */
function formatNumber(
    value: number,
    decimals: number,
    separator: string
): string {
    const fixed = value.toFixed(decimals);
    const [intPart, decPart] = fixed.split('.');

    // Add thousand separators
    const formattedInt = intPart.replace(/\B(?=(\d{3})+(?!\d))/g, separator);

    return decPart ? `${formattedInt}.${decPart}` : formattedInt;
}

/**
 * Easing functions
 */
const easingFunctions = {
    linear: (t: number) => t,
    easeOut: (t: number) => 1 - Math.pow(1 - t, 3),
    easeInOut: (t: number) =>
        t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2,
};

/**
 * Animates a counter from start to target
 */
export function animateCounter(
    element: HTMLElement,
    options: CounterOptions
): void {
    const {
        target,
        start,
        duration,
        decimals,
        prefix,
        suffix,
        separator,
        easing,
    } = { ...defaultOptions, ...options };

    const easeFn = easingFunctions[easing];
    const range = target - start;
    const startTime = performance.now();

    function update(currentTime: number): void {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const easedProgress = easeFn(progress);
        const currentValue = start + range * easedProgress;

        element.textContent = `${prefix}${formatNumber(currentValue, decimals, separator)}${suffix}`;

        if (progress < 1) {
            requestAnimationFrame(update);
        } else {
            // Ensure final value is exact
            element.textContent = `${prefix}${formatNumber(target, decimals, separator)}${suffix}`;
            element.classList.add('is-counted');
        }
    }

    requestAnimationFrame(update);
}

/**
 * Creates a counter animation for an element
 */
export function counter(
    element: HTMLElement,
    options: CounterOptions
): IntersectionObserver {
    const mergedOptions = { ...defaultOptions, ...options };

    // Set initial value
    element.textContent = `${mergedOptions.prefix}${formatNumber(mergedOptions.start, mergedOptions.decimals, mergedOptions.separator)}${mergedOptions.suffix}`;

    // Create observer
    const observer = createObserver(
        (entry) => {
            if (entry.isIntersecting && !countedElements.has(element)) {
                countedElements.add(element);
                animateCounter(element, options);
            }
        },
        {
            threshold: mergedOptions.threshold,
            once: true,
        }
    );

    observer.observe(element);

    return observer;
}

/**
 * Initialize all counter elements from data attributes
 */
export function init(): void {
    const elements = $$<HTMLElement>('[data-counter]');

    if (elements.length === 0) return;

    elements.forEach((element) => {
        if (countedElements.has(element)) return;

        const options = getOptionsFromElement(element);
        if (!options) return;

        // Set initial value
        const { start, decimals, prefix, suffix, separator } = {
            ...defaultOptions,
            ...options,
        };
        element.textContent = `${prefix}${formatNumber(start, decimals, separator)}${suffix}`;

        // Create observer
        const observer = createObserver(
            (entry) => {
                if (entry.isIntersecting && !countedElements.has(element)) {
                    countedElements.add(element);
                    animateCounter(element, options);
                }
            },
            {
                threshold: options.threshold ?? defaultOptions.threshold,
                once: true,
            }
        );

        observer.observe(element);
    });
}
