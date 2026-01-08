/**
 * Header Components Barrel Export
 *
 * Note: Astro components are imported directly from their .astro files.
 * TypeScript barrel exports don't work with .astro files.
 *
 * Usage:
 * import HeaderStandard from '@components/layout/headers/HeaderStandard.astro';
 * import type { HeaderProps } from '@components/layout/headers';
 */

// Types only - components must be imported directly from .astro files
export * from './types';
