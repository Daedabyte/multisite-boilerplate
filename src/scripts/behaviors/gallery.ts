/**
 * Gallery Lightbox Behavior
 *
 * Provides lightbox functionality for image galleries.
 * Supports keyboard navigation, touch gestures, and thumbnails.
 *
 * @example HTML
 * <!-- Trigger -->
 * <button data-gallery-trigger="my-gallery" data-gallery-index="0">
 *   <img src="thumb.jpg" alt="..." />
 * </button>
 *
 * <!-- Lightbox -->
 * <div data-gallery-lightbox="my-gallery" hidden>
 *   <button data-gallery-close>Close</button>
 *   <button data-gallery-prev>Prev</button>
 *   <button data-gallery-next>Next</button>
 *   <img data-gallery-image />
 *   <div data-gallery-caption></div>
 *   <div data-gallery-counter></div>
 * </div>
 */

import { $, $$, getData, getDataBool, addClass, removeClass } from '../core/dom';

export interface GalleryOptions {
  onOpen?: (gallery: HTMLElement, index: number) => void;
  onClose?: (gallery: HTMLElement) => void;
  onChange?: (gallery: HTMLElement, index: number) => void;
}

interface GalleryInstance {
  element: HTMLElement;
  lightbox: HTMLElement;
  items: GalleryItemData[];
  currentIndex: number;
  options: GalleryOptions;
  keyboard: boolean;
}

interface GalleryItemData {
  src: string;
  alt: string;
  title?: string;
  description?: string;
}

const instances = new Map<string, GalleryInstance>();

/**
 * Initialize all galleries on the page
 */
export function init(options: GalleryOptions = {}): void {
  const galleries = $$<HTMLElement>('[data-gallery]');

  galleries.forEach((gallery) => {
    const id = getData(gallery, 'gallery');
    if (!id || instances.has(id)) return;

    createInstance(gallery, id, options);
  });
}

/**
 * Create a gallery instance
 */
export function createInstance(
  element: HTMLElement,
  id: string,
  options: GalleryOptions = {}
): void {
  const lightbox = $<HTMLElement>(`[data-gallery-lightbox="${id}"]`);
  if (!lightbox) return;

  const triggers = $$<HTMLButtonElement>(`[data-gallery-trigger="${id}"]`);
  const items: GalleryItemData[] = [];

  // Collect item data from triggers
  triggers.forEach((trigger, index) => {
    const img = trigger.querySelector('img');
    if (img) {
      items.push({
        src: img.src,
        alt: img.alt,
        title: trigger.closest('.gallery__item')?.querySelector('.gallery__title')?.textContent || undefined,
        description: trigger.closest('.gallery__item')?.querySelector('.gallery__description')?.textContent || undefined,
      });
    }
  });

  const instance: GalleryInstance = {
    element,
    lightbox,
    items,
    currentIndex: 0,
    options,
    keyboard: getDataBool(element, 'galleryKeyboard', true),
  };

  instances.set(id, instance);

  // Bind events
  bindEvents(id, instance);
}

/**
 * Bind event listeners for a gallery
 */
function bindEvents(id: string, instance: GalleryInstance): void {
  const { lightbox } = instance;

  // Trigger clicks
  document.addEventListener('click', (e) => {
    const trigger = (e.target as HTMLElement).closest<HTMLButtonElement>(`[data-gallery-trigger="${id}"]`);
    if (trigger) {
      e.preventDefault();
      const index = parseInt(getData(trigger, 'galleryIndex') || '0', 10);
      open(id, index);
    }
  });

  // Close button and backdrop
  const closeButtons = $$('[data-gallery-close]', lightbox);
  closeButtons.forEach((btn) => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      close(id);
    });
  });

  // Close when clicking on the lightbox content area (but not on interactive elements)
  const content = $<HTMLElement>('.gallery-lightbox__content', lightbox);
  if (content) {
    content.addEventListener('click', (e) => {
      // Only close if clicked directly on the content container, not on child elements
      if (e.target === content) {
        close(id);
      }
    });
  }

  // Navigation
  const prevBtn = $('[data-gallery-prev]', lightbox);
  const nextBtn = $('[data-gallery-next]', lightbox);

  if (prevBtn) {
    prevBtn.addEventListener('click', () => prev(id));
  }

  if (nextBtn) {
    nextBtn.addEventListener('click', () => next(id));
  }

  // Thumbnail clicks
  const thumbs = $$<HTMLButtonElement>('[data-gallery-thumb]', lightbox);
  thumbs.forEach((thumb) => {
    thumb.addEventListener('click', () => {
      const index = parseInt(getData(thumb, 'galleryThumb') || '0', 10);
      goTo(id, index);
    });
  });

  // Keyboard navigation
  if (instance.keyboard) {
    document.addEventListener('keydown', (e) => {
      if (!isOpen(id)) return;

      switch (e.key) {
        case 'Escape':
          close(id);
          break;
        case 'ArrowLeft':
          prev(id);
          break;
        case 'ArrowRight':
          next(id);
          break;
      }
    });
  }

  // Touch/swipe support
  let touchStartX = 0;
  let touchEndX = 0;

  lightbox.addEventListener('touchstart', (e) => {
    touchStartX = e.changedTouches[0].screenX;
  }, { passive: true });

  lightbox.addEventListener('touchend', (e) => {
    touchEndX = e.changedTouches[0].screenX;
    handleSwipe(id, touchStartX, touchEndX);
  }, { passive: true });
}

/**
 * Handle swipe gesture
 */
function handleSwipe(id: string, startX: number, endX: number): void {
  const threshold = 50;
  const diff = startX - endX;

  if (Math.abs(diff) < threshold) return;

  if (diff > 0) {
    next(id);
  } else {
    prev(id);
  }
}

/**
 * Open the lightbox at a specific index
 */
export function open(id: string, index: number = 0): void {
  const instance = instances.get(id);
  if (!instance) return;

  instance.currentIndex = index;
  instance.lightbox.hidden = false;
  addClass(document.body, 'gallery-lightbox-open');

  updateDisplay(id);

  instance.options.onOpen?.(instance.element, index);

  // Focus management
  const closeBtn = $<HTMLButtonElement>('[data-gallery-close]', instance.lightbox);
  closeBtn?.focus();
}

/**
 * Close the lightbox
 */
export function close(id: string): void {
  const instance = instances.get(id);
  if (!instance) return;

  instance.lightbox.hidden = true;
  removeClass(document.body, 'gallery-lightbox-open');

  instance.options.onClose?.(instance.element);

  // Return focus to trigger
  const trigger = $<HTMLButtonElement>(
    `[data-gallery-trigger="${id}"][data-gallery-index="${instance.currentIndex}"]`
  );
  trigger?.focus();
}

/**
 * Check if lightbox is open
 */
export function isOpen(id: string): boolean {
  const instance = instances.get(id);
  return instance ? !instance.lightbox.hidden : false;
}

/**
 * Go to previous image
 */
export function prev(id: string): void {
  const instance = instances.get(id);
  if (!instance) return;

  const newIndex = instance.currentIndex > 0
    ? instance.currentIndex - 1
    : instance.items.length - 1;

  goTo(id, newIndex);
}

/**
 * Go to next image
 */
export function next(id: string): void {
  const instance = instances.get(id);
  if (!instance) return;

  const newIndex = instance.currentIndex < instance.items.length - 1
    ? instance.currentIndex + 1
    : 0;

  goTo(id, newIndex);
}

/**
 * Go to a specific index
 */
export function goTo(id: string, index: number): void {
  const instance = instances.get(id);
  if (!instance || index < 0 || index >= instance.items.length) return;

  instance.currentIndex = index;
  updateDisplay(id);

  instance.options.onChange?.(instance.element, index);
}

/**
 * Update the lightbox display
 */
function updateDisplay(id: string): void {
  const instance = instances.get(id);
  if (!instance) return;

  const { lightbox, items, currentIndex } = instance;
  const item = items[currentIndex];

  if (!item) return;

  // Update image
  const image = $<HTMLImageElement>('[data-gallery-image]', lightbox);
  if (image) {
    image.src = item.src;
    image.alt = item.alt;
  }

  // Update caption
  const caption = $('[data-gallery-caption]', lightbox);
  if (caption) {
    const captionText = [item.title, item.description].filter(Boolean).join(' - ');
    caption.textContent = captionText;
  }

  // Update counter
  const counter = $('[data-gallery-counter]', lightbox);
  if (counter) {
    counter.textContent = `${currentIndex + 1} / ${items.length}`;
  }

  // Update thumbnails
  const thumbs = $$('[data-gallery-thumb]', lightbox);
  thumbs.forEach((thumb, i) => {
    if (i === currentIndex) {
      addClass(thumb, 'gallery-lightbox__thumb--active');
    } else {
      removeClass(thumb, 'gallery-lightbox__thumb--active');
    }
  });
}

/**
 * Destroy a gallery instance
 */
export function destroy(id: string): void {
  const instance = instances.get(id);
  if (!instance) return;

  close(id);
  instances.delete(id);
}
