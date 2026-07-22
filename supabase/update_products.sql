-- ==============================================================================
-- GODAROLLA RUCHULU — DATABASE UPDATE SCRIPT
-- Run this script in the Supabase SQL Editor to update Best Sellers & Image URLs.
-- ==============================================================================

-- STEP 1: Reset all products to NOT be best sellers first
UPDATE public.products 
SET is_best_seller = false;

-- STEP 2: Mark the 10 scattered products across all 5 categories as Best Sellers
UPDATE public.products 
SET is_best_seller = true 
WHERE slug IN (
    'avakaya',
    'gongura',
    'chicken-pickle-boneless',
    'prawn-pickle',
    'dhaniyalu-karam-podi',
    'kandi-podi',
    'pumpkin-seeds',
    'flax-seeds',
    'bellam-mamidi-thandra',
    'sugar-mamidi-thandra'
);

-- STEP 3: Update image_url mappings for key products to ensure correct local asset links
UPDATE public.products SET image_url = '/images/products/avakaya.jpg' WHERE slug = 'avakaya';
UPDATE public.products SET image_url = '/images/products/gongura.jpg' WHERE slug = 'gongura';
UPDATE public.products SET image_url = '/images/products/tomato.jpg' WHERE slug = 'tomato';
UPDATE public.products SET image_url = '/images/products/magai.jpg' WHERE slug = 'magai';
UPDATE public.products SET image_url = '/images/products/nimmakaya-lemon.jpg' WHERE slug = 'nimmakaya-lemon';
UPDATE public.products SET image_url = '/images/products/villulli-garlic.jpg' WHERE slug = 'villulli-garlic';
UPDATE public.products SET image_url = '/images/products/chicken-pickle-boneless.jpg' WHERE slug = 'chicken-pickle-boneless';
UPDATE public.products SET image_url = '/images/products/prawn-pickle.jpg' WHERE slug = 'prawn-pickle';
UPDATE public.products SET image_url = '/images/products/mutton-pickle.jpg' WHERE slug = 'mutton-pickle';
UPDATE public.products SET image_url = '/images/products/vanjaram-pickle.jpg' WHERE slug = 'vanjaram-pickle';
UPDATE public.products SET image_url = '/images/products/pandu-mirchi.jpg' WHERE slug = 'pandu-mirchi';
UPDATE public.products SET image_url = '/images/products/dhaniyalu-karam-podi.jpg' WHERE slug = 'dhaniyalu-karam-podi';
UPDATE public.products SET image_url = '/images/products/kandi-podi.jpg' WHERE slug = 'kandi-podi';
UPDATE public.products SET image_url = '/images/products/pumpkin-seeds.jpg' WHERE slug = 'pumpkin-seeds';
UPDATE public.products SET image_url = '/images/products/flax-seeds.jpg' WHERE slug = 'flax-seeds';
UPDATE public.products SET image_url = '/images/products/bellam-mamidi-thandra.jpg' WHERE slug = 'bellam-mamidi-thandra';
UPDATE public.products SET image_url = '/images/products/sugar-mamidi-thandra.jpg' WHERE slug = 'sugar-mamidi-thandra';
