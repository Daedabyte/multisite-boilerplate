/**
 * Toast Notification Behavior
 *
 * Provides a simple API for creating toast notifications.
 *
 * @example
 * ```typescript
 * import { toast } from '@scripts/behaviors/toast';
 *
 * // Simple success toast
 * toast.success('Changes saved!');
 *
 * // With message
 * toast.error('Upload failed', 'Please try again later.');
 *
 * // With options
 * toast.show({
 *   title: 'New message',
 *   message: 'You have 3 unread messages',
 *   status: 'info',
 *   duration: 5000,
 * });
 * ```
 */

import type { ToastStatus, ToastPosition, ToastOptions } from '../../types/components';

interface ToastConfig {
  position: ToastPosition;
  duration: number;
  dismissible: boolean;
}

interface ToastInstance {
  id: string;
  element: HTMLElement;
  timer: number | null;
}

// Default configuration
const config: ToastConfig = {
  position: 'top-right',
  duration: 4000,
  dismissible: true,
};

// Active toasts
const toasts = new Map<string, ToastInstance>();

// Container element
let container: HTMLElement | null = null;

/**
 * Get or create the toast container
 */
function getContainer(): HTMLElement {
  if (container && document.body.contains(container)) {
    return container;
  }

  container = document.createElement('div');
  container.className = `toast-container toast-container--${config.position}`;
  container.setAttribute('aria-live', 'polite');
  container.setAttribute('aria-atomic', 'true');
  document.body.appendChild(container);

  return container;
}

/**
 * Get icon for status
 */
function getStatusIcon(status: ToastStatus): string {
  switch (status) {
    case 'success':
      return '<i class="fa-solid fa-check" aria-hidden="true"></i>';
    case 'error':
      return '<i class="fa-solid fa-xmark" aria-hidden="true"></i>';
    case 'warning':
      return '<i class="fa-solid fa-exclamation" aria-hidden="true"></i>';
    case 'info':
    default:
      return '<i class="fa-solid fa-info" aria-hidden="true"></i>';
  }
}

/**
 * Generate unique ID
 */
function generateId(): string {
  return `toast-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

/**
 * Create and show a toast notification
 */
function show(options: ToastOptions): string {
  const id = generateId();
  const {
    title,
    message,
    status = 'info',
    duration = config.duration,
    dismissible = config.dismissible,
  } = options;

  const containerEl = getContainer();

  // Create toast element
  const toast = document.createElement('div');
  toast.id = id;
  toast.className = `toast toast--${status}`;
  toast.setAttribute('role', 'alert');

  // Build toast HTML
  toast.innerHTML = `
    <div class="toast__icon">
      ${getStatusIcon(status)}
    </div>
    <div class="toast__content">
      <div class="toast__title">${escapeHtml(title)}</div>
      ${message ? `<div class="toast__message">${escapeHtml(message)}</div>` : ''}
    </div>
    ${dismissible ? `
      <button type="button" class="toast__close" aria-label="Dismiss">
        <i class="fa-solid fa-xmark" aria-hidden="true"></i>
      </button>
    ` : ''}
  `;

  // Add to container
  containerEl.appendChild(toast);

  // Trigger animation
  requestAnimationFrame(() => {
    toast.classList.add('toast--visible');
  });

  // Setup close button
  if (dismissible) {
    const closeBtn = toast.querySelector('.toast__close');
    closeBtn?.addEventListener('click', () => dismiss(id));
  }

  // Setup auto-dismiss timer
  let timer: number | null = null;
  if (duration > 0) {
    timer = window.setTimeout(() => {
      dismiss(id);
    }, duration);
  }

  // Store instance
  toasts.set(id, { id, element: toast, timer });

  return id;
}

/**
 * Escape HTML to prevent XSS
 */
function escapeHtml(text: string): string {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

/**
 * Dismiss a toast by ID
 */
function dismiss(id: string): void {
  const instance = toasts.get(id);
  if (!instance) return;

  const { element, timer } = instance;

  // Clear timer
  if (timer !== null) {
    clearTimeout(timer);
  }

  // Animate out
  element.classList.remove('toast--visible');
  element.classList.add('toast--hiding');

  // Remove after animation
  setTimeout(() => {
    element.remove();
    toasts.delete(id);

    // Remove container if empty
    if (toasts.size === 0 && container) {
      container.remove();
      container = null;
    }
  }, 300);
}

/**
 * Dismiss all toasts
 */
function dismissAll(): void {
  toasts.forEach((_, id) => dismiss(id));
}

/**
 * Configure toast defaults
 */
function configure(options: Partial<ToastConfig>): void {
  Object.assign(config, options);

  // Update container position if it exists
  if (container) {
    container.className = `toast-container toast-container--${config.position}`;
  }
}

/**
 * Convenience method for success toast
 */
function success(title: string, message?: string): string {
  return show({ title, message, status: 'success' });
}

/**
 * Convenience method for error toast
 */
function error(title: string, message?: string): string {
  return show({ title, message, status: 'error' });
}

/**
 * Convenience method for warning toast
 */
function warning(title: string, message?: string): string {
  return show({ title, message, status: 'warning' });
}

/**
 * Convenience method for info toast
 */
function info(title: string, message?: string): string {
  return show({ title, message, status: 'info' });
}

// Export toast API
export const toast = {
  show,
  dismiss,
  dismissAll,
  configure,
  success,
  error,
  warning,
  info,
};

// Also export individual functions
export { show, dismiss, dismissAll, configure, success, error, warning, info };
