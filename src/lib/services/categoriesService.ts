import { supabase } from '@/lib/supabase';
import { withDataCache, CACHE_TAGS } from '../cache/cacheService';

export interface DBCategory {
  id: string;
  name: string;
  slug: string;
  image_url: string | null;
  display_order: number;
  is_active: boolean;
}

/**
 * Internal fetcher for categories
 */
async function fetchCategories(): Promise<DBCategory[]> {
  try {
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .order('display_order', { ascending: true });

    if (error) {
      console.error('Failed to fetch categories:', error);
      return [];
    }
    return data || [];
  } catch (error) {
    console.error('Failed to fetch categories:', error);
    return [];
  }
}

/**
 * Gets all categories from the database, cached.
 */
export const getCategories = withDataCache(
  fetchCategories,
  ['all_categories'],
  [CACHE_TAGS.CATEGORIES],
  false // Revalidate on tag invalidation rather than time
);

/**
 * Gets just the active category slugs for validation purposes.
 */
export async function getActiveCategorySlugs(): Promise<string[]> {
  const categories = await getCategories();
  return categories.filter(c => c.is_active).map(c => c.slug);
}
