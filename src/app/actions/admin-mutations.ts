'use server';

import { getAdminSupabase } from '@/lib/supabase';
import { revalidatePath } from 'next/cache';
import { checkAuth } from '@/lib/services/authService';
import { logAction } from '@/lib/services/auditService';
import { validateProductData, validateImage } from '@/lib/utils/validation';
import { invalidateCache, CACHE_TAGS } from '@/lib/cache/cacheService';
import fs from 'fs/promises';
import path from 'path';

function generateSlug(name: string): string {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
}

async function ensureUniqueSlug(supabase: any, baseSlug: string, existingId?: string): Promise<string> {
  let slug = baseSlug;
  let counter = 2;
  
  while (true) {
    let query = supabase.from('products').select('id').eq('slug', slug);
    if (existingId) query = query.neq('id', existingId);
    
    const { data } = await query.single();
    if (!data) return slug;
    
    slug = `${baseSlug}-${counter}`;
    counter++;
  }
}



export async function createProductAction(formData: FormData) {
  await checkAuth();
  const supabase = getAdminSupabase();

  try {
    const { name, price250g, price500g, price1kg, isPriceTBD } = validateProductData(formData);
    const name_telugu = formData.get('name_telugu') as string || null;
    const category_id = formData.get('category_id') as string;
    const description = formData.get('description') as string;
    const is_veg = formData.get('is_veg') === 'true';
    const is_best_seller = formData.get('is_best_seller') === 'true';
    const is_active = formData.get('is_active') === 'true';
    const imageFile = formData.get('image') as File | null;

    if (!imageFile || imageFile.size === 0) throw new Error('Image is required');
    validateImage(imageFile);

    const baseSlug = generateSlug(name);
    const uniqueSlug = await ensureUniqueSlug(supabase, baseSlug);

    // 1. Upload Image Locally
    let imageUrl = '';
    const fileName = `${uniqueSlug}.webp`;
    const filePath = path.join(process.cwd(), 'public', 'images', 'products', fileName);
    const buffer = Buffer.from(await imageFile.arrayBuffer());
    
    try {
      await fs.writeFile(filePath, buffer);
      imageUrl = `/images/products/${fileName}`;
    } catch (uploadError) {
      console.error('Image upload failed', uploadError);
      return { success: false, error: 'Failed to upload image' };
    }
    await logAction(supabase, 'IMAGE_UPLOAD', { fileName, imageUrl });

    // 2. Insert Database Record
    const { data: newProduct, error: dbError } = await supabase
      .from('products')
      .insert({
        slug: uniqueSlug,
        name,
        name_telugu,
        category_id: category_id || null,
        description,
        price_250g: price250g,
        price_500g: price500g,
        price_1kg: price1kg,
        is_veg,
        is_active,
        is_best_seller,
        is_price_tbd: isPriceTBD,
        image_url: imageUrl
      })
      .select()
      .single();

    if (dbError) {
      // COMPENSATING ROLLBACK: Delete the uploaded image if DB fails
      await fs.unlink(filePath).catch(() => {});
      console.error('Database insert failed, rolled back image', dbError);
      if (dbError.code === '23505') return { success: false, error: 'A product with this name/slug already exists' };
      return { success: false, error: 'Failed to create product in database' };
    }

    await logAction(supabase, 'CREATE_PRODUCT', { productId: newProduct.id, name: newProduct.name });
    
    revalidatePath('/');
    revalidatePath('/products');
    invalidateCache(CACHE_TAGS.PRODUCTS);
    invalidateCache(CACHE_TAGS.CATEGORIES);
    return { success: true, product: newProduct };
  } catch (err: any) {
    return { success: false, error: err.message || 'An error occurred' };
  }
}

export async function updateProductAction(id: string, formData: FormData) {
  await checkAuth();
  const supabase = getAdminSupabase();

  try {
    const { name, price250g, price500g, price1kg, isPriceTBD } = validateProductData(formData);
    const name_telugu = formData.get('name_telugu') as string || null;
    const category_id = formData.get('category_id') as string;
    const description = formData.get('description') as string;
    const is_veg = formData.get('is_veg') === 'true';
    const is_best_seller = formData.get('is_best_seller') === 'true';
    const is_active = formData.get('is_active') === 'true';
    const imageFile = formData.get('image') as File | null;

    validateImage(imageFile);

    const baseSlug = generateSlug(name);
    const uniqueSlug = await ensureUniqueSlug(supabase, baseSlug, id);

    let newImageUrl = null;
    let newFileName = null;

    if (imageFile && imageFile.size > 0) {
      newFileName = `${uniqueSlug}.webp`;
      const filePath = path.join(process.cwd(), 'public', 'images', 'products', newFileName);
      const buffer = Buffer.from(await imageFile.arrayBuffer());

      try {
        await fs.writeFile(filePath, buffer);
        newImageUrl = `/images/products/${newFileName}`;
      } catch (uploadError) {
        console.error('Image upload failed', uploadError);
        return { success: false, error: 'Failed to upload image' };
      }
      
      await logAction(supabase, 'IMAGE_UPLOAD', { fileName: newFileName, imageUrl: newImageUrl });
    }

    // Update product table
    const updateData: any = {
      slug: uniqueSlug,
      name,
      name_telugu,
      category_id: category_id || null,
      description,
      price_250g: price250g,
      price_500g: price500g,
      price_1kg: price1kg,
      is_veg,
      is_active,
      is_best_seller,
      is_price_tbd: isPriceTBD
    };

    if (newImageUrl) updateData.image_url = newImageUrl;

    const { data: updatedProduct, error: updateError } = await supabase
      .from('products')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (updateError) {
      if (newFileName) {
        const filePath = path.join(process.cwd(), 'public', 'images', 'products', newFileName);
        await fs.unlink(filePath).catch(() => {});
      }
      if (updateError.code === '23505') return { success: false, error: 'A product with this name/slug already exists' };
      return { success: false, error: 'Failed to update product details' };
    }

    // No longer deleting old Supabase storage images since they are local and slug-based

    await logAction(supabase, 'UPDATE_PRODUCT', { productId: id, name });
    
    revalidatePath('/');
    revalidatePath('/products');
    invalidateCache(CACHE_TAGS.PRODUCTS);
    invalidateCache(CACHE_TAGS.CATEGORIES);
    return { success: true, product: updatedProduct };
  } catch (err: any) {
    return { success: false, error: err.message || 'An error occurred' };
  }
}

export async function deleteProductAction(id: string) {
  await checkAuth();
  const supabase = getAdminSupabase();
  
  try {
    // 1. Fetch product to get image url and name
    const { data: product, error: fetchError } = await supabase
      .from('products')
      .select('name, image_url')
      .eq('id', id)
      .single();
      
    if (fetchError || !product) {
      return { success: false, error: 'Product not found' };
    }

    // 2. Delete the product from DB
    const { error: deleteError } = await supabase
      .from('products')
      .delete()
      .eq('id', id);

    if (deleteError) {
      return { success: false, error: 'Failed to delete product from database' };
    }

    // 3. Check if image is stored in Supabase and delete if true
    if (product.image_url && product.image_url.includes('/storage/v1/object/public/product_images/')) {
      const pathMatch = product.image_url.match(/product_images\/(.+)$/);
      if (pathMatch) {
        const imagePath = pathMatch[1];
        await supabase.storage.from('product_images').remove([imagePath]);
      }
    }

    await logAction(supabase, 'DELETE_PRODUCT', { productId: id, name: product.name });
    
    revalidatePath('/');
    revalidatePath('/products');
    invalidateCache(CACHE_TAGS.PRODUCTS);
    invalidateCache(CACHE_TAGS.CATEGORIES);
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message || 'An error occurred during deletion' };
  }
}

export async function getDashboardStats() {
  await checkAuth();
  const supabase = getAdminSupabase();

  const { count: activeCount } = await supabase.from('products').select('*', { count: 'exact', head: true });
  const { count: categoriesCount } = await supabase.from('categories').select('*', { count: 'exact', head: true });
  const { count: totalProducts } = await supabase.from('products').select('*', { count: 'exact', head: true });

  return {
    activeProducts: activeCount || 0,
    totalCategories: categoriesCount || 0,
    totalProducts: totalProducts || 0,
  };
}
