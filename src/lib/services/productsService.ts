import { supabase } from '@/lib/supabase';
import { Product } from '@/types';
import { withDataCache, CACHE_TAGS } from '../cache/cacheService';
import { mapSupabaseToProduct } from '../utils/mapper';
import { DBCategory, getActiveCategorySlugs } from './categoriesService';
import { products as staticProducts } from '@/data/products';

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
  const isMissingKeys = !process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (isMissingKeys) {
    console.log('Using static products catalog (Supabase keys not configured).');
    return staticProducts;
  }

  try {
    const { data: productsData, error: productsError } = await supabase
      .from('products')
      .select('*, categories(*)');

    if (productsError) {
      console.error('Failed to fetch products from Supabase, falling back to static:', productsError);
      return staticProducts;
    }

    // If database exists but has no products, return static products as base
    if (!productsData || productsData.length === 0) {
      console.log('No products found in database, falling back to static products.');
      return staticProducts;
    }

    const activeSlugs = await getActiveCategorySlugs();

    return productsData.map((row: any) => {
      return mapSupabaseToProduct(
        row as DBProduct, 
        row.categories as DBCategory,
        activeSlugs
      );
    });
  } catch (error) {
    console.error('Failed to fetch products, falling back to static:', error);
    return staticProducts;
  }
}

/**
 * Gets all products, cached.
 */
export const getProducts = withDataCache(
  fetchProducts,
  ['all_products'],
  [CACHE_TAGS.PRODUCTS],
  60
);

/**
 * Internal fetcher for a single product by slug
 */
async function fetchProductBySlug(slug: string): Promise<Product | undefined> {
  const isMissingKeys = !process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (isMissingKeys) {
    return staticProducts.find((p) => p.slug === slug);
  }

  try {
    const { data: productsData, error: productsError } = await supabase
      .from('products')
      .select('*, categories(*)')
      .eq('slug', slug)
      .single();

    if (productsError) {
      console.error(`Failed to fetch product ${slug} from Supabase, falling back to static:`, productsError);
      return staticProducts.find((p) => p.slug === slug);
    }
    if (!productsData) {
      return staticProducts.find((p) => p.slug === slug);
    }

    const activeSlugs = await getActiveCategorySlugs();

    return mapSupabaseToProduct(
      productsData as DBProduct, 
      productsData.categories as DBCategory,
      activeSlugs
    );
  } catch (error) {
    console.error(`Failed to fetch product ${slug}, falling back to static:`, error);
    return staticProducts.find((p) => p.slug === slug);
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
    60
  );
  return cachedFetcher();
}
