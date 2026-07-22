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

-- STEP 3: Update image_url mappings for Veg & Non-Veg Pickles to point to dedicated photography
UPDATE public.products SET image_url = '/images/products/avakaya.jpg' WHERE slug = 'avakaya';
UPDATE public.products SET image_url = '/images/products/bellam-avakaya.jpg' WHERE slug = 'bellam-avakaya';
UPDATE public.products SET image_url = '/images/products/magai.jpg' WHERE slug = 'magai';
UPDATE public.products SET image_url = '/images/products/allam-ginger.jpg' WHERE slug = 'allam-ginger';
UPDATE public.products SET image_url = '/images/products/villulli-garlic.jpg' WHERE slug = 'villulli-garlic';
UPDATE public.products SET image_url = '/images/products/chinthakaya.jpg' WHERE slug = 'chinthakaya';
UPDATE public.products SET image_url = '/images/products/tomato.jpg' WHERE slug = 'tomato';
UPDATE public.products SET image_url = '/images/products/dabbakaya.jpg' WHERE slug = 'dabbakaya';
UPDATE public.products SET image_url = '/images/products/gongura.jpg' WHERE slug = 'gongura';
UPDATE public.products SET image_url = '/images/products/kothimeera.jpg' WHERE slug = 'kothimeera';
UPDATE public.products SET image_url = '/images/products/pudina.jpg' WHERE slug = 'pudina';
UPDATE public.products SET image_url = '/images/products/karivepaku.jpg' WHERE slug = 'karivepaku';
UPDATE public.products SET image_url = '/images/products/kakarakaya.jpg' WHERE slug = 'kakarakaya';
UPDATE public.products SET image_url = '/images/products/nimmakaya-lemon.jpg' WHERE slug = 'nimmakaya-lemon';
UPDATE public.products SET image_url = '/images/products/chitrannam-paste.jpg' WHERE slug = 'chitrannam-paste';
UPDATE public.products SET image_url = '/images/products/pulihora-paste.jpg' WHERE slug = 'pulihora-paste';
UPDATE public.products SET image_url = '/images/products/pandu-mirchi.jpg' WHERE slug = 'pandu-mirchi';
UPDATE public.products SET image_url = '/images/products/pachi-mirchi.jpg' WHERE slug = 'pachi-mirchi';
UPDATE public.products SET image_url = '/images/products/usirikaya-amla.jpg' WHERE slug = 'usirikaya-amla';
UPDATE public.products SET image_url = '/images/products/avakaya-biryani-masala.jpg' WHERE slug = 'avakaya-biryani-masala';
UPDATE public.products SET image_url = '/images/products/avakaya-telangana-style.jpg' WHERE slug = 'avakaya-telangana-style';
UPDATE public.products SET image_url = '/images/products/cabbage-pickle.jpg' WHERE slug = 'cabbage-pickle';

-- Non-Veg Pickles
UPDATE public.products SET image_url = '/images/products/chicken-pickle-bone.jpg' WHERE slug = 'chicken-pickle-bone';
UPDATE public.products SET image_url = '/images/products/chicken-pickle-boneless.jpg' WHERE slug = 'chicken-pickle-boneless';
UPDATE public.products SET image_url = '/images/products/prawn-pickle.jpg' WHERE slug = 'prawn-pickle';
UPDATE public.products SET image_url = '/images/products/mutton-pickle.jpg' WHERE slug = 'mutton-pickle';
UPDATE public.products SET image_url = '/images/products/vanjaram-pickle.jpg' WHERE slug = 'vanjaram-pickle';
UPDATE public.products SET image_url = '/images/products/dry-prawns.jpg' WHERE slug = 'dry-prawns';
UPDATE public.products SET image_url = '/images/products/dry-methallu.jpg' WHERE slug = 'dry-methallu';
