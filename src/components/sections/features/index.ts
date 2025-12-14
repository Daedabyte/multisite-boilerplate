/**
 * Features Section Components Barrel Export
 *
 * Note: Astro components are imported directly from their .astro files.
 * TypeScript barrel exports don't work with .astro files.
 *
 * Usage:
 * import FeaturesGrid from '@components/sections/features/FeaturesGrid.astro';
 * import type { FeaturesProps } from '@components/sections/features';
 */

// Types only - components must be imported directly from .astro files
export * from './types';
