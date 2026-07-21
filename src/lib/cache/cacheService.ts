import { unstable_cache, revalidateTag } from 'next/cache';
import { cache } from 'react';

/**
 * cacheService.ts
 * 
 * Centralized caching abstraction for the application.
 * Wraps Next.js caching APIs so they can be easily updated or swapped out in the future
 * without changing the service layer implementation.
 */

/**
 * Cache Tags used for revalidation.
 */
export const CACHE_TAGS = {
  PRODUCTS: 'products',
  CATEGORIES: 'categories',
} as const;

/**
 * Wraps a database fetcher function with Next.js Data Cache.
 * 
 * @param fetcher The async function to cache
 * @param keyParts Array of strings defining the unique cache key
 * @param tags Array of strings defining the cache tags for revalidation
 * @param revalidate Time in seconds to revalidate the cache (optional)
 * @returns The cached version of the fetcher
 */
export function withDataCache<T, Args extends any[]>(
  fetcher: (...args: Args) => Promise<T>,
  keyParts: string[],
  tags: string[],
  revalidate?: number | false
): (...args: Args) => Promise<T> {
  // Wrap with React's `cache` to memoize requests within the same render pass
  // and Next.js `unstable_cache` for persistent cross-request data caching.
  return cache(
    unstable_cache(fetcher, keyParts, {
      tags,
      revalidate,
    })
  );
}

/**
 * Revalidates the cache for a specific tag.
 * 
 * @param tag The tag to revalidate
 */
export function invalidateCache(tag: string): void {
  revalidateTag(tag, 'default');
}
