/**
 * Carousel Behavior
 *
 * Provides sliding carousel functionality with autoplay, navigation, and touch support.
 *
 * Animation modes:
 * - Single slide (slidesPerView=1): Uses enter/exit CSS animations
 * - Multiple slides (slidesPerView>1): Uses translateX on track
 *
 * @example HTML
 * <div data-carousel="my-carousel"
 *      data-carousel-autoplay="true"
 *      data-carousel-interval="5000"
 *      data-carousel-loop="true"
 *      data-carousel-slides-per-view="3"
 *      data-carousel-step="1">
 *   <div data-carousel-track>
 *     <div class="carousel__slide">Slide 1</div>
 *     <div class="carousel__slide">Slide 2</div>
 *   </div>
 *   <button data-carousel-prev>Prev</button>
 *   <button data-carousel-next>Next</button>
 *   <div class="carousel__dots">
 *     <button data-carousel-dot="0">1</button>
 *     <button data-carousel-dot="1">2</button>
 *   </div>
 * </div>
 *
 * Single slide states (data-slide-state):
 * - "active": Currently visible slide
 * - "entering": Slide animating in
 * - "exiting": Slide animating out
 * - No attribute: Hidden slides
 *
 * Direction (data-carousel-direction):
 * - "left": Navigating forward (next)
 * - "right": Navigating backward (prev)
 */

import { $, $$, getData, getDataBool, getDataNumber, addClass, removeClass } from '../core/dom';

export interface CarouselOptions {
  onSlideChange?: (carousel: HTMLElement, index: number) => void;
}

interface CarouselInstance {
  element: HTMLElement;
  track: HTMLElement;
  slides: HTMLElement[];
  dots: HTMLButtonElement[];
  currentIndex: number;
  previousIndex: number;
  slidesPerView: number;
  step: number;
  autoplay: boolean;
  autoplayInterval: number;
  loop: boolean;
  autoplayTimer: number | null;
  isAnimating: boolean;
  options: CarouselOptions;
}

const instances = new Map<string, CarouselInstance>();
const ANIMATION_DURATION = 400;

/**
 * Initialize all carousels on the page
 */
export function init(options: CarouselOptions = {}): void {
  const carousels = $$<HTMLElement>('[data-carousel]');

  carousels.forEach((carousel) => {
    const id = getData(carousel, 'carousel');
    if (!id || instances.has(id)) return;

    createInstance(carousel, id, options);
  });
}

/**
 * Create a carousel instance
 */
export function createInstance(
  element: HTMLElement,
  id: string,
  options: CarouselOptions = {}
): void {
  const track = $<HTMLElement>('[data-carousel-track]', element);
  if (!track) return;

  const slides = $$<HTMLElement>('.carousel__slide', element);
  const dots = $$<HTMLButtonElement>('[data-carousel-dot]', element);

  const slidesPerView = getDataNumber(element, 'carouselSlidesPerView', 1);
  // Step can never exceed slidesPerView
  const configuredStep = getDataNumber(element, 'carouselStep', 1);
  const stepValue = Math.min(configuredStep, slidesPerView);

  const instance: CarouselInstance = {
    element,
    track,
    slides: Array.from(slides),
    dots: Array.from(dots),
    currentIndex: 0,
    previousIndex: 0,
    slidesPerView,
    step: stepValue,
    autoplay: getDataBool(element, 'carouselAutoplay', false),
    autoplayInterval: getDataNumber(element, 'carouselInterval', 5000),
    loop: getDataBool(element, 'carouselLoop', false),
    autoplayTimer: null,
    isAnimating: false,
    options,
  };

  instances.set(id, instance);

  // Set mode attribute for CSS
  const currentSlidesPerView = getSlidesPerViewAtBreakpoint(instance);
  element.setAttribute('data-carousel-mode', currentSlidesPerView === 1 ? 'single' : 'multi');

  // Bind events
  bindEvents(id, instance);

  // Start autoplay
  if (instance.autoplay) {
    startAutoplay(id);
  }

  // Initial state
  initializeSlides(id);
}

/**
 * Initialize slides based on current mode
 */
function initializeSlides(id: string): void {
  const instance = instances.get(id);
  if (!instance) return;

  const slidesPerView = getSlidesPerViewAtBreakpoint(instance);

  // Update mode attribute
  instance.element.setAttribute('data-carousel-mode', slidesPerView === 1 ? 'single' : 'multi');

  if (slidesPerView === 1) {
    // Single slide mode: hide all except active
    instance.slides.forEach((slide, index) => {
      removeClass(slide, 'carousel__slide--active', 'carousel__slide--entering', 'carousel__slide--exiting');
      if (index === instance.currentIndex) {
        slide.setAttribute('data-slide-state', 'active');
        addClass(slide, 'carousel__slide--active');
      } else {
        slide.removeAttribute('data-slide-state');
      }
    });
    // Reset track transform
    instance.track.style.transform = '';
  } else {
    // Multi-slide mode: show all slides, use track transform
    instance.slides.forEach((slide) => {
      slide.removeAttribute('data-slide-state');
      removeClass(slide, 'carousel__slide--active', 'carousel__slide--entering', 'carousel__slide--exiting');
    });
    updateTrackPosition(id);
  }

  updateDots(id);
  updateNavButtons(id);
}

/**
 * Bind event listeners for a carousel
 */
function bindEvents(id: string, instance: CarouselInstance): void {
  const { element } = instance;

  // Navigation buttons
  const prevBtn = $('[data-carousel-prev]', element);
  const nextBtn = $('[data-carousel-next]', element);

  if (prevBtn) {
    prevBtn.addEventListener('click', () => prev(id));
  }

  if (nextBtn) {
    nextBtn.addEventListener('click', () => next(id));
  }

  // Dot navigation
  instance.dots.forEach((dot) => {
    dot.addEventListener('click', () => {
      const index = parseInt(getData(dot, 'carouselDot') || '0', 10);
      const slidesPerView = getSlidesPerViewAtBreakpoint(instance);
      goTo(id, index * slidesPerView);
    });
  });

  // Touch/swipe support
  let touchStartX = 0;
  let touchEndX = 0;

  element.addEventListener('touchstart', (e) => {
    touchStartX = e.changedTouches[0].screenX;
    pauseAutoplay(id);
  }, { passive: true });

  element.addEventListener('touchend', (e) => {
    touchEndX = e.changedTouches[0].screenX;
    handleSwipe(id, touchStartX, touchEndX);
    if (instance.autoplay) {
      startAutoplay(id);
    }
  }, { passive: true });

  // Pause autoplay on hover
  element.addEventListener('mouseenter', () => pauseAutoplay(id));
  element.addEventListener('mouseleave', () => {
    if (instance.autoplay) {
      startAutoplay(id);
    }
  });

  // Update on resize
  let resizeTimer: number;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = window.setTimeout(() => {
      // Recalculate and reinitialize
      const newSlidesPerView = getSlidesPerViewAtBreakpoint(instance);
      const maxIndex = Math.max(0, instance.slides.length - newSlidesPerView);
      // Clamp current index
      if (instance.currentIndex > maxIndex) {
        instance.currentIndex = maxIndex;
      }
      initializeSlides(id);
    }, 100);
  });
}

/**
 * Get slides per view based on current breakpoint
 */
function getSlidesPerViewAtBreakpoint(instance: CarouselInstance): number {
  const width = window.innerWidth;
  const configuredSlides = instance.slidesPerView;

  // Mobile: always 1
  if (width < 768) return 1;

  // Tablet: max 2 or configured
  if (width < 1024) return Math.min(configuredSlides, 2);

  // Desktop: use configured value
  return configuredSlides;
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
 * Get step value adjusted for current breakpoint (never exceeds slidesPerView)
 */
function getStepAtBreakpoint(instance: CarouselInstance): number {
  const slidesPerView = getSlidesPerViewAtBreakpoint(instance);
  // Step can never exceed slidesPerView
  return Math.min(instance.step, slidesPerView);
}

/**
 * Go to previous slide
 */
export function prev(id: string): void {
  const instance = instances.get(id);
  if (!instance || instance.isAnimating) return;

  // If already at the start and not looping, do nothing
  if (instance.currentIndex === 0 && !instance.loop) {
    return;
  }

  const slidesPerView = getSlidesPerViewAtBreakpoint(instance);
  const step = getStepAtBreakpoint(instance);
  const maxIndex = Math.max(0, instance.slides.length - slidesPerView);

  let newIndex = instance.currentIndex - step;

  if (newIndex < 0) {
    newIndex = instance.loop ? maxIndex : 0;
  }

  navigateTo(id, newIndex, 'right');
}

/**
 * Go to next slide
 */
export function next(id: string): void {
  const instance = instances.get(id);
  if (!instance || instance.isAnimating) return;

  const slidesPerView = getSlidesPerViewAtBreakpoint(instance);
  const maxIndex = Math.max(0, instance.slides.length - slidesPerView);

  // If already at the end and not looping, do nothing
  if (instance.currentIndex >= maxIndex && !instance.loop) {
    return;
  }

  const step = getStepAtBreakpoint(instance);
  let newIndex = instance.currentIndex + step;

  if (newIndex > maxIndex) {
    newIndex = instance.loop ? 0 : maxIndex;
  }

  navigateTo(id, newIndex, 'left');
}

/**
 * Go to a specific slide index
 */
export function goTo(id: string, index: number): void {
  const instance = instances.get(id);
  if (!instance || instance.isAnimating) return;

  const slidesPerView = getSlidesPerViewAtBreakpoint(instance);
  const maxIndex = Math.max(0, instance.slides.length - slidesPerView);
  const clampedIndex = Math.max(0, Math.min(index, maxIndex));

  if (clampedIndex === instance.currentIndex) return;

  const direction = clampedIndex > instance.currentIndex ? 'left' : 'right';
  navigateTo(id, clampedIndex, direction);
}

/**
 * Navigate to a specific index with direction
 */
function navigateTo(id: string, newIndex: number, direction: 'left' | 'right'): void {
  const instance = instances.get(id);
  if (!instance) return;

  const slidesPerView = getSlidesPerViewAtBreakpoint(instance);

  instance.previousIndex = instance.currentIndex;
  instance.currentIndex = newIndex;

  // Set direction on carousel element
  instance.element.setAttribute('data-carousel-direction', direction);

  if (slidesPerView === 1) {
    // Single slide mode: use enter/exit animations
    instance.isAnimating = true;
    animateSingleSlide(id, direction);
  } else {
    // Multi-slide mode: use track transform
    updateTrackPosition(id);
    // Clear direction after transition
    setTimeout(() => {
      instance.element.removeAttribute('data-carousel-direction');
    }, ANIMATION_DURATION);
  }

  instance.options.onSlideChange?.(instance.element, instance.currentIndex);
}

/**
 * Animate single slide transition (enter/exit animations)
 */
function animateSingleSlide(id: string, direction: 'left' | 'right'): void {
  const instance = instances.get(id);
  if (!instance) return;

  const { previousIndex, currentIndex, slides } = instance;

  // Process each slide
  slides.forEach((slide, index) => {
    if (index === previousIndex) {
      // Exiting slide
      slide.setAttribute('data-slide-state', 'exiting');
      removeClass(slide, 'carousel__slide--active', 'carousel__slide--entering');
      addClass(slide, 'carousel__slide--exiting');
    } else if (index === currentIndex) {
      // Entering slide
      slide.setAttribute('data-slide-state', 'entering');
      removeClass(slide, 'carousel__slide--active', 'carousel__slide--exiting');
      addClass(slide, 'carousel__slide--entering');
    }
  });

  // After animation completes
  setTimeout(() => {
    finishSingleSlideAnimation(id);
  }, ANIMATION_DURATION);
}

/**
 * Finish single slide animation and clean up states
 */
function finishSingleSlideAnimation(id: string): void {
  const instance = instances.get(id);
  if (!instance) return;

  const { currentIndex, slides } = instance;

  // Update final states
  slides.forEach((slide, index) => {
    if (index === currentIndex) {
      // Set to active state
      slide.setAttribute('data-slide-state', 'active');
      removeClass(slide, 'carousel__slide--entering', 'carousel__slide--exiting');
      addClass(slide, 'carousel__slide--active');
    } else {
      // Hide inactive slides
      slide.removeAttribute('data-slide-state');
      removeClass(slide, 'carousel__slide--active', 'carousel__slide--entering', 'carousel__slide--exiting');
    }
  });

  // Clear direction
  instance.element.removeAttribute('data-carousel-direction');
  instance.isAnimating = false;

  updateDots(id);
  updateNavButtons(id);
}

/**
 * Update track position for multi-slide mode (translateX)
 */
function updateTrackPosition(id: string): void {
  const instance = instances.get(id);
  if (!instance) return;

  const slidesPerView = getSlidesPerViewAtBreakpoint(instance);
  const slideWidth = 100 / slidesPerView;
  const offset = instance.currentIndex * slideWidth;

  instance.track.style.transform = `translateX(-${offset}%)`;

  updateDots(id);
  updateNavButtons(id);
}

/**
 * Update dot states
 */
function updateDots(id: string): void {
  const instance = instances.get(id);
  if (!instance) return;

  const slidesPerView = getSlidesPerViewAtBreakpoint(instance);
  const activeDotIndex = Math.floor(instance.currentIndex / slidesPerView);

  instance.dots.forEach((dot, i) => {
    if (i === activeDotIndex) {
      addClass(dot, 'carousel__dot--active');
      dot.setAttribute('aria-selected', 'true');
    } else {
      removeClass(dot, 'carousel__dot--active');
      dot.setAttribute('aria-selected', 'false');
    }
  });
}

/**
 * Update navigation button states
 */
function updateNavButtons(id: string): void {
  const instance = instances.get(id);
  if (!instance) return;

  const slidesPerView = getSlidesPerViewAtBreakpoint(instance);
  const maxIndex = Math.max(0, instance.slides.length - slidesPerView);

  const prevBtn = $<HTMLButtonElement>('[data-carousel-prev]', instance.element);
  const nextBtn = $<HTMLButtonElement>('[data-carousel-next]', instance.element);

  if (!instance.loop) {
    if (prevBtn) {
      prevBtn.disabled = instance.currentIndex === 0;
    }
    if (nextBtn) {
      nextBtn.disabled = instance.currentIndex >= maxIndex;
    }
  }
}

/**
 * Start autoplay
 */
export function startAutoplay(id: string): void {
  const instance = instances.get(id);
  if (!instance) return;

  pauseAutoplay(id);

  instance.autoplayTimer = window.setInterval(() => {
    const slidesPerView = getSlidesPerViewAtBreakpoint(instance);
    const maxIndex = Math.max(0, instance.slides.length - slidesPerView);

    // If at the end and not looping, stop autoplay
    if (instance.currentIndex >= maxIndex && !instance.loop) {
      pauseAutoplay(id);
      return;
    }

    next(id);
  }, instance.autoplayInterval);
}

/**
 * Pause autoplay
 */
export function pauseAutoplay(id: string): void {
  const instance = instances.get(id);
  if (!instance || instance.autoplayTimer === null) return;

  clearInterval(instance.autoplayTimer);
  instance.autoplayTimer = null;
}

/**
 * Destroy a carousel instance
 */
export function destroy(id: string): void {
  pauseAutoplay(id);
  instances.delete(id);
}
