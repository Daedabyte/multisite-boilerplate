/**
 * Modal Behavior
 *
 * Data-attribute driven modal/dialog functionality.
 * - Traps focus within modal
 * - Handles Escape key
 * - Prevents body scroll when open
 * - Supports close on overlay click
 *
 * @example
 * ```html
 * <button data-modal-trigger="contact-modal">Open</button>
 * <dialog data-modal="contact-modal" data-modal-close-on-overlay="true">
 *   <button data-modal-close>×</button>
 *   <div>Modal content</div>
 * </dialog>
 * ```
 */

import { $, $$, trapFocus } from '../core/dom';
import { lockScroll, unlockScroll } from '../core/scroll';

export interface ModalOptions {
    closeOnOverlay?: boolean;
    closeOnEscape?: boolean;
    onOpen?: (modal: HTMLDialogElement) => void;
    onClose?: (modal: HTMLDialogElement) => void;
}

interface ModalInstance {
    element: HTMLDialogElement;
    options: ModalOptions;
    cleanupFocusTrap: (() => void) | null;
}

const instances = new Map<string, ModalInstance>();

/**
 * Opens a modal by ID
 */
export function open(modalId: string): void {
    const instance = instances.get(modalId);
    if (!instance) return;

    const { element, options } = instance;

    // Show the modal
    element.showModal();
    element.setAttribute('aria-hidden', 'false');

    // Lock body scroll
    lockScroll();

    // Trap focus
    instance.cleanupFocusTrap = trapFocus(element);

    // Trigger callback
    options.onOpen?.(element);
}

/**
 * Closes a modal by ID
 */
export function close(modalId: string): void {
    const instance = instances.get(modalId);
    if (!instance) return;

    const { element, options, cleanupFocusTrap } = instance;

    // Close the modal
    element.close();
    element.setAttribute('aria-hidden', 'true');

    // Unlock body scroll
    unlockScroll();

    // Cleanup focus trap
    if (cleanupFocusTrap) {
        cleanupFocusTrap();
        instance.cleanupFocusTrap = null;
    }

    // Trigger callback
    options.onClose?.(element);
}

/**
 * Toggles a modal by ID
 */
export function toggle(modalId: string): void {
    const instance = instances.get(modalId);
    if (!instance) return;

    if (instance.element.open) {
        close(modalId);
    } else {
        open(modalId);
    }
}

/**
 * Creates a modal instance programmatically
 */
export function createModal(
    element: HTMLDialogElement,
    options: ModalOptions = {}
): { open: () => void; close: () => void; toggle: () => void } {
    const modalId =
        element.dataset.modal || `modal-${Date.now()}-${Math.random()}`;
    element.dataset.modal = modalId;

    const instance: ModalInstance = {
        element,
        options: {
            closeOnOverlay: options.closeOnOverlay ?? true,
            closeOnEscape: options.closeOnEscape ?? true,
            ...options,
        },
        cleanupFocusTrap: null,
    };

    instances.set(modalId, instance);

    // Setup event listeners
    setupModalListeners(modalId);

    return {
        open: () => open(modalId),
        close: () => close(modalId),
        toggle: () => toggle(modalId),
    };
}

/**
 * Setup event listeners for a modal
 */
function setupModalListeners(modalId: string): void {
    const instance = instances.get(modalId);
    if (!instance) return;

    const { element, options } = instance;

    // Handle close button clicks
    const closeButtons = $$('[data-modal-close]', element);
    closeButtons.forEach((button) => {
        button.addEventListener('click', () => close(modalId));
    });

    // Handle overlay clicks
    if (options.closeOnOverlay) {
        element.addEventListener('click', (e) => {
            // Only close if clicking the dialog backdrop itself
            if (e.target === element) {
                close(modalId);
            }
        });
    }

    // Handle escape key
    if (options.closeOnEscape) {
        element.addEventListener('cancel', (e) => {
            e.preventDefault();
            close(modalId);
        });
    }
}

/**
 * Destroys a modal instance
 */
export function destroy(modalId: string): void {
    const instance = instances.get(modalId);
    if (!instance) return;

    // Cleanup focus trap if active
    if (instance.cleanupFocusTrap) {
        instance.cleanupFocusTrap();
    }

    // Close if open
    if (instance.element.open) {
        instance.element.close();
        unlockScroll();
    }

    instances.delete(modalId);
}

/**
 * Initialize all modals from data attributes
 */
export function init(): void {
    // Setup modals
    const modals = $$<HTMLDialogElement>('[data-modal]');
    modals.forEach((modal) => {
        const modalId = modal.dataset.modal;
        if (!modalId || instances.has(modalId)) return;

        const closeOnOverlay =
            modal.dataset.modalCloseOnOverlay !== 'false';

        createModal(modal, { closeOnOverlay });
    });

    // Setup triggers
    const triggers = $$<HTMLElement>('[data-modal-trigger]');
    triggers.forEach((trigger) => {
        const modalId = trigger.dataset.modalTrigger;
        if (!modalId) return;

        trigger.addEventListener('click', (e) => {
            e.preventDefault();
            open(modalId);
        });
    });
}
