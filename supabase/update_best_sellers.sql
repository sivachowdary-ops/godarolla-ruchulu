-- ==============================================================================
-- UPDATE BEST SELLERS LIST FOR GODAROLLA RUCHULU
-- This query resets all best sellers and sets the new 10 scattered best sellers.
-- Run this in the Supabase SQL Editor.
-- ==============================================================================

-- 1. Reset all products to NOT be best sellers first
UPDATE public.products 
SET is_best_seller = false;

-- 2. Mark the 10 scattered products across Veg, Non-Veg, Powders, Seeds, and Jellies as best sellers
UPDATE public.products 
SET is_best_seller = true 
WHERE slug IN (
    -- Veg Pickles
    'avakaya',
    'gongura',
    
    -- Non-Veg Pickles
    'chicken-pickle-boneless',
    'prawn-pickle',
    
    -- Podulu (Powders)
    'dhaniyalu-karam-podi',
    'kandi-podi',
    
    -- Seeds
    'pumpkin-seeds',
    'flax-seeds',
    
    -- Jellies
    'bellam-mamidi-thandra',
    'sugar-mamidi-thandra'
);

-- 3. Confirm count of updated products (should return exactly 10 rows)
SELECT name, slug, is_best_seller 
FROM public.products 
WHERE is_best_seller = true;
