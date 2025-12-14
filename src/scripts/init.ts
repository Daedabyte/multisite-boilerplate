/**
 * Auto-Initialization
 *
 * Automatically initializes all behaviors and animations based on
 * the presence of data attributes in the DOM.
 *
 * Import this file in your layout to enable auto-initialization:
 *
 * @example
 * ```astro
 * <script>
 *   import '@scripts/init';
 * </script>
 * ```
 *
 * Or import specific modules for manual control:
 *
 * @example
 * ```ts
 * import * as modal from '@scripts/behaviors/modal';
 * modal.init();
 * ```
 */

import * as modal from './behaviors/modal';
import * as accordion from './behaviors/accordion';
import * as tabs from './behaviors/tabs';
import * as dropdown from './behaviors/dropdown';
import * as mobileNav from './behaviors/mobile-nav';
import * as formValidation from './behaviors/form-validation';
import * as scrollReveal from './animations/scroll-reveal';
import * as stagger from './animations/stagger';
import * as counter from './animations/counter';
import * as parallax from './animations/parallax';

/**
 * Initializes all behaviors and animations
 */
export function initAll(): void {
    // Behaviors
    if (document.querySelector('[data-modal]')) {
        modal.init();
    }

    if (document.querySelector('[data-accordion]')) {
        accordion.init();
    }

    if (document.querySelector('[data-tabs]')) {
        tabs.init();
    }

    if (document.querySelector('[data-dropdown]')) {
        dropdown.init();
    }

    if (document.querySelector('[data-mobile-nav]')) {
        mobileNav.init();
    }

    if (document.querySelector('form[data-validate]')) {
        formValidation.init();
    }

    // Animations
    if (document.querySelector('[data-reveal]')) {
        scrollReveal.init();
    }

    if (document.querySelector('[data-stagger]')) {
        stagger.init();
    }

    if (document.querySelector('[data-counter]')) {
        counter.init();
    }

    if (document.querySelector('[data-parallax]')) {
        parallax.init();
    }
}

// Auto-initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initAll);
} else {
    initAll();
}

// Re-export modules for manual access
export { modal, accordion, tabs, dropdown, mobileNav, formValidation };
export { scrollReveal, stagger, counter, parallax };
