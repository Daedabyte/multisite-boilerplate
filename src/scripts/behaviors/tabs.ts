/**
 * Tabs Behavior
 *
 * Data-attribute driven tab switching functionality.
 * - Proper ARIA attributes
 * - Keyboard navigation
 *
 * @example
 * ```html
 * <div data-tabs>
 *   <div role="tablist">
 *     <button data-tab-trigger="tab1" data-tab-active>Tab 1</button>
 *     <button data-tab-trigger="tab2">Tab 2</button>
 *   </div>
 *   <div data-tab-content="tab1" data-tab-active>Content 1</div>
 *   <div data-tab-content="tab2">Content 2</div>
 * </div>
 * ```
 */

import { $, $$ } from '../core/dom';

export interface TabsOptions {
    onChange?: (tabId: string, tabs: Element) => void;
}

interface TabsInstance {
    element: Element;
    options: TabsOptions;
    triggers: HTMLElement[];
    contents: HTMLElement[];
    activeTab: string | null;
}

const instances = new Map<Element, TabsInstance>();

/**
 * Generates a unique ID
 */
function generateId(prefix: string): string {
    return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

/**
 * Activates a tab by ID
 */
export function activateTab(tabId: string, tabs: Element): void {
    const instance = instances.get(tabs);
    if (!instance) return;

    // Deactivate all tabs
    instance.triggers.forEach((trigger) => {
        trigger.setAttribute('aria-selected', 'false');
        trigger.setAttribute('tabindex', '-1');
        trigger.removeAttribute('data-tab-active');
    });

    instance.contents.forEach((content) => {
        content.hidden = true;
        content.removeAttribute('data-tab-active');
    });

    // Activate selected tab
    const trigger = instance.triggers.find(
        (t) => t.dataset.tabTrigger === tabId
    );
    const content = instance.contents.find(
        (c) => c.dataset.tabContent === tabId
    );

    if (trigger) {
        trigger.setAttribute('aria-selected', 'true');
        trigger.setAttribute('tabindex', '0');
        trigger.setAttribute('data-tab-active', '');
    }

    if (content) {
        content.hidden = false;
        content.setAttribute('data-tab-active', '');
    }

    instance.activeTab = tabId;
    instance.options.onChange?.(tabId, tabs);
}

/**
 * Gets the currently active tab ID
 */
export function getActiveTab(tabs: Element): string | null {
    const instance = instances.get(tabs);
    return instance?.activeTab ?? null;
}

/**
 * Creates a tabs instance programmatically
 */
export function createTabs(
    element: Element,
    options: TabsOptions = {}
): {
    activateTab: (tabId: string) => void;
    getActiveTab: () => string | null;
    nextTab: () => void;
    prevTab: () => void;
} {
    const triggers = $$<HTMLElement>('[data-tab-trigger]', element);
    const contents = $$<HTMLElement>('[data-tab-content]', element);

    const instance: TabsInstance = {
        element,
        options,
        triggers,
        contents,
        activeTab: null,
    };

    instances.set(element, instance);

    // Setup ARIA and event listeners
    setupTabs(element, triggers, contents);

    // Find and activate initial tab
    const initialActive = triggers.find(
        (t) => t.hasAttribute('data-tab-active')
    );
    if (initialActive?.dataset.tabTrigger) {
        activateTab(initialActive.dataset.tabTrigger, element);
    } else if (triggers[0]?.dataset.tabTrigger) {
        activateTab(triggers[0].dataset.tabTrigger, element);
    }

    return {
        activateTab: (tabId: string) => activateTab(tabId, element),
        getActiveTab: () => getActiveTab(element),
        nextTab: () => {
            const currentIndex = triggers.findIndex(
                (t) => t.dataset.tabTrigger === instance.activeTab
            );
            const nextIndex = (currentIndex + 1) % triggers.length;
            const nextTabId = triggers[nextIndex]?.dataset.tabTrigger;
            if (nextTabId) activateTab(nextTabId, element);
        },
        prevTab: () => {
            const currentIndex = triggers.findIndex(
                (t) => t.dataset.tabTrigger === instance.activeTab
            );
            const prevIndex =
                (currentIndex - 1 + triggers.length) % triggers.length;
            const prevTabId = triggers[prevIndex]?.dataset.tabTrigger;
            if (prevTabId) activateTab(prevTabId, element);
        },
    };
}

/**
 * Setup ARIA attributes and event listeners
 */
function setupTabs(
    tabs: Element,
    triggers: HTMLElement[],
    contents: HTMLElement[]
): void {
    // Setup tablist
    const tablist = triggers[0]?.parentElement;
    if (tablist && !tablist.hasAttribute('role')) {
        tablist.setAttribute('role', 'tablist');
    }

    triggers.forEach((trigger) => {
        const tabId = trigger.dataset.tabTrigger;
        if (!tabId) return;

        // Generate unique IDs
        const triggerId = trigger.id || generateId('tab');
        const content = contents.find((c) => c.dataset.tabContent === tabId);
        const contentId = content?.id || generateId('tabpanel');

        trigger.id = triggerId;
        if (content) content.id = contentId;

        // Set ARIA attributes on trigger
        trigger.setAttribute('role', 'tab');
        trigger.setAttribute('aria-selected', 'false');
        trigger.setAttribute('aria-controls', contentId);
        trigger.setAttribute('tabindex', '-1');

        // Set ARIA attributes on content
        if (content) {
            content.setAttribute('role', 'tabpanel');
            content.setAttribute('aria-labelledby', triggerId);
            content.hidden = true;
        }

        // Handle click
        trigger.addEventListener('click', (e) => {
            e.preventDefault();
            activateTab(tabId, tabs);
            trigger.focus();
        });

        // Handle keyboard navigation
        trigger.addEventListener('keydown', (e) => {
            const currentIndex = triggers.indexOf(trigger);

            switch (e.key) {
                case 'ArrowRight':
                case 'ArrowDown':
                    e.preventDefault();
                    {
                        const nextIndex =
                            (currentIndex + 1) % triggers.length;
                        const nextTrigger = triggers[nextIndex];
                        if (nextTrigger?.dataset.tabTrigger) {
                            activateTab(nextTrigger.dataset.tabTrigger, tabs);
                            nextTrigger.focus();
                        }
                    }
                    break;
                case 'ArrowLeft':
                case 'ArrowUp':
                    e.preventDefault();
                    {
                        const prevIndex =
                            (currentIndex - 1 + triggers.length) %
                            triggers.length;
                        const prevTrigger = triggers[prevIndex];
                        if (prevTrigger?.dataset.tabTrigger) {
                            activateTab(prevTrigger.dataset.tabTrigger, tabs);
                            prevTrigger.focus();
                        }
                    }
                    break;
                case 'Home':
                    e.preventDefault();
                    if (triggers[0]?.dataset.tabTrigger) {
                        activateTab(triggers[0].dataset.tabTrigger, tabs);
                        triggers[0].focus();
                    }
                    break;
                case 'End':
                    e.preventDefault();
                    {
                        const lastTrigger = triggers[triggers.length - 1];
                        if (lastTrigger?.dataset.tabTrigger) {
                            activateTab(lastTrigger.dataset.tabTrigger, tabs);
                            lastTrigger.focus();
                        }
                    }
                    break;
            }
        });
    });
}

/**
 * Destroys a tabs instance
 */
export function destroy(tabs: Element): void {
    instances.delete(tabs);
}

/**
 * Initialize all tabs from data attributes
 */
export function init(): void {
    const tabContainers = $$('[data-tabs]');

    tabContainers.forEach((container) => {
        if (instances.has(container)) return;
        createTabs(container);
    });
}
