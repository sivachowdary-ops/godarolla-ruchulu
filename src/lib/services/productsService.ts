import { supabase } from '@/lib/supabase';
import { Product } from '@/types';
import { withDataCache, CACHE_TAGS } from '../cache/cacheService';
import { mapSupabaseToProduct } from '../utils/mapper';
import { DBCategory, getActiveCategorySlugs } from './categoriesService';

export interface DBProduct {
  id: string;
  category_id: string;
  slug: string;
  name: string;
  name_telugu: string | null;
  description: string;
  image_url: string | null;
  price_250g: number | null;
  price_500g: number | null;
  price_1kg: number | null;
  is_veg: boolean;
  is_active: boolean;
  is_best_seller: boolean;
  is_price_tbd: boolean;
  categories?: DBCategory;
}

/**
 * Internal fetcher for products
 */
async function fetchProducts(): Promise<Product[]> {
  try {
    const { data: productsData, error: productsError } = await supabase
      .from('products')
      .select('*, categories(*)');

    if (productsError) {
      console.error('Failed to fetch products from Supabase:', productsError);
      return [];
    }

    const activeSlugs = await getActiveCategorySlugs();

    return (productsData || []).map((row: any) => {
      return mapSupabaseToProduct(
        row as DBProduct, 
        row.categories as DBCategory,
        activeSlugs
      );
    });
  } catch (error) {
    console.error('Failed to fetch products:', error);
    return [];
  }
}

/**
 * Gets all products, cached.
 */
export const getProducts = withDataCache(
  fetchProducts,
  ['all_products'],
  [CACHE_TAGS.PRODUCTS],
  false
);

/**
 * Internal fetcher for a single product by slug
 */
async function fetchProductBySlug(slug: string): Promise<Product | undefined> {
  try {
    const { data: productsData, error: productsError } = await supabase
      .from('products')
      .select('*, categories(*)')
      .eq('slug', slug)
      .single();

    if (productsError) {
      console.error(`Failed to fetch product ${slug} from Supabase:`, productsError);
      return undefined;
    }
    if (!productsData) return undefined;

    const activeSlugs = await getActiveCategorySlugs();

    return mapSupabaseToProduct(
      productsData as DBProduct, 
      productsData.categories as DBCategory,
      activeSlugs
    );
  } catch (error) {
    console.error(`Failed to fetch product ${slug}:`, error);
    return undefined;
  }
}

/**
 * Gets a product by slug, cached.
 */
export async function getProductBySlug(slug: string): Promise<Product | undefined> {
  const cachedFetcher = withDataCache(
    () => fetchProductBySlug(slug),
    ['product', slug],
    [CACHE_TAGS.PRODUCTS, `product-${slug}`],
    false
  );
  return cachedFetcher();
}
