import { Product, ProductCategory } from '@/types';

import { DBProduct } from '../services/productsService';
import { DBCategory } from '../services/categoriesService';

/**
 * Transforms a Supabase DB product row into the frontend Product type.
 * Ensures data integrity like proper numeric casting for prices and category validation.
 * 
 * @param product The raw database product
 * @param category The joined category from the database
 * @param activeCategorySlugs A list of currently valid/active category slugs
 * @returns A safe frontend Product object
 */
export function mapSupabaseToProduct(
  product: DBProduct, 
  category: DBCategory | null,
  activeCategorySlugs: string[]
): Product {
  const primaryImage = product.image_url || `/images/products/${product.slug}.jpg`;
  // Validate category slug dynamically
  let safeCategorySlug = category?.slug || 'veg';
  if (!activeCategorySlugs.includes(safeCategorySlug)) {
    console.warn(`Invalid category slug '${safeCategorySlug}' found for product '${product.slug}'. Falling back to 'veg'.`);
    safeCategorySlug = 'veg';
  }
  
  return {
    id: product.id,
    slug: product.slug,
    name: product.name,
    nameTelugu: product.name_telugu || undefined,
    category: safeCategorySlug as ProductCategory,
    description: product.description,
    
    // Postgres NUMERIC might be returned as string, parse it safely
    price250g: product.price_250g ? Number(product.price_250g) : null,
    price500g: product.price_500g ? Number(product.price_500g) : null,
    price1kg: product.price_1kg ? Number(product.price_1kg) : null,
    
    image: primaryImage,
    isVeg: product.is_veg,
    isActive: product.is_active,
    isPriceTBD: product.is_price_tbd,
    isBestSeller: product.is_best_seller,
    spiceLevel: undefined, // removed from schema
  };
}
