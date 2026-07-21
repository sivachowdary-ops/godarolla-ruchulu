-- ==============================================================================
-- GODAROLLA RUCHULU - DATABASE SCHEMA
-- This file contains all necessary tables, triggers, and storage configurations.
-- It can be executed top to bottom in the Supabase SQL Editor.
-- ==============================================================================

-- 1. Create Categories Table
CREATE TABLE IF NOT EXISTS public.categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    image_url TEXT,
    display_order INTEGER DEFAULT 0 CHECK (display_order >= 0),
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Create Products Table
CREATE TABLE IF NOT EXISTS public.products (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    category_id UUID REFERENCES public.categories(id) ON DELETE SET NULL,
    name TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    name_telugu TEXT,
    description TEXT,
    image_url TEXT,
    
    price_250g NUMERIC(10,2) CHECK (price_250g >= 0),
    price_500g NUMERIC(10,2) CHECK (price_500g >= 0),
    price_1kg NUMERIC(10,2) CHECK (price_1kg >= 0),
    
    is_active BOOLEAN DEFAULT true,
    is_best_seller BOOLEAN DEFAULT false,
    is_veg BOOLEAN DEFAULT true,
    is_price_tbd BOOLEAN DEFAULT false,
    
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Create Admin Logs Table
CREATE TABLE IF NOT EXISTS public.admin_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    admin_email TEXT NOT NULL,
    action TEXT NOT NULL,
    details JSONB,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Automatically update 'updated_at' triggers
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

DROP TRIGGER IF EXISTS update_categories_updated_at ON public.categories;
CREATE TRIGGER update_categories_updated_at
    BEFORE UPDATE ON public.categories
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_products_updated_at ON public.products;
CREATE TRIGGER update_products_updated_at
    BEFORE UPDATE ON public.products
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- 5. Row Level Security (RLS)
-- Enable RLS on all tables
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admin_logs ENABLE ROW LEVEL SECURITY;

-- Public can read active categories and products
CREATE POLICY "Allow public read access to active categories" ON public.categories FOR SELECT USING (is_active = true);
CREATE POLICY "Allow public read access to active products" ON public.products FOR SELECT USING (is_active = true);

-- Note: Service Role (Admin) automatically bypasses RLS, so explicit policies are not needed.

-- 6. Indexes for Performance
CREATE INDEX IF NOT EXISTS idx_products_slug ON public.products(slug);
CREATE INDEX IF NOT EXISTS idx_products_category_id ON public.products(category_id);
CREATE INDEX IF NOT EXISTS idx_products_is_active ON public.products(is_active);
CREATE INDEX IF NOT EXISTS idx_products_is_best_seller ON public.products(is_best_seller);
CREATE INDEX IF NOT EXISTS idx_products_created_at ON public.products(created_at);

CREATE INDEX IF NOT EXISTS idx_categories_slug ON public.categories(slug);
CREATE INDEX IF NOT EXISTS idx_categories_display_order ON public.categories(display_order);
CREATE INDEX IF NOT EXISTS idx_categories_is_active ON public.categories(is_active);

-- 7. Storage Bucket for Product Images
INSERT INTO storage.buckets (id, name, public) 
VALUES ('product_images', 'product_images', true)
ON CONFLICT (id) DO NOTHING;

-- Storage RLS Policies
-- Allow public to view images
CREATE POLICY "Public Access" 
ON storage.objects FOR SELECT 
USING (bucket_id = 'product_images');

-- Note: Service Role automatically bypasses Storage RLS, so explicit admin write policies are not needed.

-- ==============================================================================
-- 8. SEED SCRIPT (Initial Data)
-- ==============================================================================

-- Seed Categories
INSERT INTO public.categories (id, name, slug, display_order, is_active) VALUES
    ('00000000-0000-0000-0000-000000000001', 'Vegetarian Pickles', 'veg', 1, true),
    ('00000000-0000-0000-0000-000000000002', 'Non-Vegetarian Pickles', 'nonveg', 2, true),
    ('00000000-0000-0000-0000-000000000003', 'Podulu', 'podulu', 3, true),
    ('00000000-0000-0000-0000-000000000004', 'Seeds', 'seeds', 4, true),
    ('00000000-0000-0000-0000-000000000005', 'Jellies', 'jellies', 5, true)
ON CONFLICT (slug) DO NOTHING;

-- Seed Products (Migrated from static data)
INSERT INTO public.products (category_id, name, slug, name_telugu, description, image_url, price_250g, price_500g, price_1kg, is_active, is_best_seller, is_veg, is_price_tbd) VALUES
    ('00000000-0000-0000-0000-000000000001', 'Avakaya', 'avakaya', 'ఆవకాయ', 'The iconic Andhra mango pickle made with raw mangoes, red chilli powder, mustard, and cold-pressed sesame oil. Bold, tangy, and fiery — the king of Telugu pickles.', '/images/products/avakaya.jpg', 100.00, 200.00, 400.00, true, true, true, false),
    ('00000000-0000-0000-0000-000000000001', 'Bellam Avakaya', 'bellam-avakaya', 'బెల్లం ఆవకాయ', 'A unique sweet-and-spicy twist on the classic Avakaya, made with jaggery (bellam). The perfect balance of tangy mango, fiery spice, and caramel sweetness.', '/images/products/bellam-avakaya.jpg', 110.00, 220.00, 440.00, true, false, true, false),
    ('00000000-0000-0000-0000-000000000001', 'Magai', 'magai', 'మాగాయ', 'Sun-dried mango pieces pickled with aromatic spices and oil. A beloved Andhra classic with intense flavor that deepens with age.', '/images/products/magai.jpg', 120.00, 240.00, 480.00, true, false, true, false),
    ('00000000-0000-0000-0000-000000000001', 'Allam (Ginger)', 'allam-ginger', 'అల్లం', 'Fresh ginger pickle with a warming, spicy kick. Made with tender ginger root, tangy tamarind, and traditional spices.', '/images/products/allam-ginger.jpg', 110.00, 220.00, 440.00, true, false, true, false),
    ('00000000-0000-0000-0000-000000000001', 'Villulli (Garlic)', 'villulli-garlic', 'వెల్లుల్లి', 'Whole garlic cloves pickled in spiced oil with a rich, pungent flavor. A powerhouse of taste that pairs perfectly with hot rice and ghee.', '/images/products/villulli-garlic.jpg', 150.00, 300.00, 600.00, true, false, true, false),
    ('00000000-0000-0000-0000-000000000001', 'Chinthakaya', 'chinthakaya', 'చింతకాయ', 'Raw tamarind pickle with a sharp, sour punch balanced by red chilli and mustard. A tangy delight from the Godavari kitchen.', '/images/products/chinthakaya.jpg', 110.00, 220.00, 440.00, true, false, true, false),
    ('00000000-0000-0000-0000-000000000001', 'Tomato', 'tomato', 'టొమాటో', 'Ripe tomato pickle with a sweet-tangy taste and rich red color. A mild, versatile pickle loved by all ages.', '/images/products/tomato.jpg', 110.00, 220.00, 440.00, true, false, true, false),
    ('00000000-0000-0000-0000-000000000001', 'Dabbakaya', 'dabbakaya', 'దబ్బకాయ', 'Citron (dabbakaya) pickle with a distinctive citrusy flavor. A traditional Andhra specialty with a bright, refreshing taste.', '/images/products/dabbakaya.jpg', 110.00, 220.00, 440.00, true, false, true, false),
    ('00000000-0000-0000-0000-000000000001', 'Gongura', 'gongura', 'గోంగూర', 'Sorrel leaf (gongura) pickle — the pride of Andhra cuisine. Tangy, slightly sour leaves ground with red chillies and tempered with mustard.', '/images/products/gongura.jpg', 110.00, 220.00, 440.00, true, true, true, false),
    ('00000000-0000-0000-0000-000000000001', 'Kothimeera', 'kothimeera', 'కొత్తిమీర', 'Fresh coriander (kothimeera) pickle bursting with herbal, green flavors. A vibrant, aromatic pickle that adds freshness to any meal.', '/images/products/kothimeera.jpg', 110.00, 220.00, 440.00, true, false, true, false),
    ('00000000-0000-0000-0000-000000000001', 'Pudina', 'pudina', 'పుదీన', 'Mint (pudina) pickle with a cool, refreshing flavor layered with spice. Perfect as a side or spread.', '/images/products/pudina.jpg', 120.00, 240.00, 480.00, true, false, true, false),
    ('00000000-0000-0000-0000-000000000001', 'Karivepaku', 'karivepaku', 'కరివేపాకు', 'Curry leaf (karivepaku) pickle with a deep, aromatic flavor. Made with fresh curry leaves, tamarind, and a rich spice blend.', '/images/products/karivepaku.jpg', 120.00, 240.00, 480.00, true, false, true, false),
    ('00000000-0000-0000-0000-000000000001', 'Kakarakaya', 'kakarakaya', 'కాకరకాయ', 'Bitter gourd (kakarakaya) pickle that transforms bitterness into an addictive, spicy-tangy flavor. A healthy, unique pickle.', '/images/products/kakarakaya.jpg', 120.00, 240.00, 480.00, true, false, true, false),
    ('00000000-0000-0000-0000-000000000001', 'Nimmakaya (Lemon)', 'nimmakaya-lemon', 'నిమ్మకాయ', 'Lemon pickle with bright, citrusy tang and warm spices. Whole lemons soaked in salt, chilli, and turmeric — a South Indian staple.', '/images/products/nimmakaya-lemon.jpg', 110.00, 220.00, 440.00, true, false, true, false),
    ('00000000-0000-0000-0000-000000000001', 'Chitrannam Paste', 'chitrannam-paste', 'చిత్రాన్నం పేస్ట్', 'Ready-to-mix lemon rice paste. Just mix with hot rice for instant, flavorful Chitrannam — perfect for lunchboxes and quick meals.', '/images/products/chitrannam-paste.jpg', 100.00, 200.00, 400.00, true, false, true, false),
    ('00000000-0000-0000-0000-000000000001', 'Pulihora Paste', 'pulihora-paste', 'పులిహోర పేస్ట్', 'Traditional tamarind rice paste. Mix with hot rice for authentic Pulihora — tangy, spicy, and deeply flavorful. A temple-prasadam favorite.', '/images/products/pulihora-paste.jpg', 100.00, 200.00, 400.00, true, false, true, false),
    ('00000000-0000-0000-0000-000000000001', 'Pandu Mirchi', 'pandu-mirchi', 'పండు మిర్చి', 'Ripe red chilli pickle with deep, smoky heat. Whole dried red chillies pickled in oil with a potent spice paste.', '/images/products/pandu-mirchi.jpg', 120.00, 240.00, 480.00, true, false, true, false),
    ('00000000-0000-0000-0000-000000000001', 'Pachi Mirchi', 'pachi-mirchi', 'పచ్చి మిర్చి', 'Fresh green chilli pickle with a sharp, fiery bite. Young green chillies pickled with mustard and lemon for a vibrant kick.', '/images/products/pachi-mirchi.jpg', 110.00, 220.00, 440.00, true, false, true, false),
    ('00000000-0000-0000-0000-000000000001', 'Usirikaya (Amla)', 'usirikaya-amla', 'ఉసిరికాయ', 'Indian gooseberry (amla) pickle — tangy, crunchy, and packed with Vitamin C. A healthy, flavorful pickle from the Godavari kitchen.', '/images/products/usirikaya-amla.jpg', 110.00, 220.00, 440.00, true, false, true, false),
    ('00000000-0000-0000-0000-000000000001', 'Avakaya Biryani Masala', 'avakaya-biryani-masala', 'ఆవకాయ బిర్యానీ మసాలా', 'A special masala blend inspired by Avakaya flavors, designed for biryani preparation.', '/images/products/avakaya-biryani-masala.jpg', 120.00, 240.00, 480.00, true, false, true, true),
    ('00000000-0000-0000-0000-000000000001', 'Avakaya Telangana Style', 'avakaya-telangana-style', 'ఆవకాయ తెలంగాణ స్టైల్', 'Avakaya prepared in the Telangana tradition — a distinct regional variation with its own unique spice profile and preparation method.', '/images/products/avakaya-telangana-style.jpg', 120.00, 240.00, 480.00, true, false, true, true),
    ('00000000-0000-0000-0000-000000000001', 'Cabbage Pickle', 'cabbage-pickle', 'క్యాబేజ్ ఊరగాయ', 'Crunchy cabbage pickled with mustard, chilli, and spices. A lighter, refreshing pickle with a satisfying crunch.', '/images/products/cabbage-pickle.jpg', 120.00, 240.00, 480.00, true, false, true, true),
    ('00000000-0000-0000-0000-000000000002', 'Chicken Pickle (Bone)', 'chicken-pickle-bone', 'చికెన్ ఊరగాయ (బోన్)', 'Tender chicken pieces with bone, slow-cooked in aromatic spices and oil. Rich, meaty, and deeply flavorful — a non-veg pickle classic.', '/images/products/chicken-pickle-bone.jpg', 225.00, 450.00, 900.00, true, false, false, false),
    ('00000000-0000-0000-0000-000000000002', 'Chicken Pickle (Boneless)', 'chicken-pickle-boneless', 'చికెన్ ఊరగాయ (బోన్‌లెస్)', 'Premium boneless chicken pieces pickled in a fiery spice blend. Convenience meets authentic taste — no bones, all flavor.', '/images/products/chicken-pickle-boneless.jpg', 300.00, 600.00, 1200.00, true, true, false, false),
    ('00000000-0000-0000-0000-000000000002', 'Prawn Pickle', 'prawn-pickle', 'రొయ్యల ఊరగాయ', 'Fresh prawns pickled with Godavari-style spices. The coastal Andhra influence shines through in every bite — tangy, spicy, and seafood-rich.', '/images/products/prawn-pickle.jpg', 350.00, 700.00, 1400.00, true, true, false, false),
    ('00000000-0000-0000-0000-000000000002', 'Mutton Pickle', 'mutton-pickle', 'మటన్ ఊరగాయ', 'Succulent mutton pieces slow-cooked in a rich, spicy pickle masala. A premium, hearty pickle with deep, complex flavors.', '/images/products/mutton-pickle.jpg', 350.00, 700.00, 1400.00, true, false, false, false),
    ('00000000-0000-0000-0000-000000000002', 'Sea Fish (Vanjaram Pickle)', 'sea-fish-vanjaram-pickle', 'వంజరం ఊరగాయ', 'King fish (vanjaram) pickle — the prized catch of the Andhra coast, pickled with bold spices. A seafood lover''s premium choice.', '/images/products/vanjaram-pickle.jpg', 300.00, 600.00, 1200.00, true, false, false, false),
    ('00000000-0000-0000-0000-000000000002', 'Dry Prawns', 'dry-prawns', 'ఎండు రొయ్యలు', 'Sun-dried prawns pickle with intense, concentrated seafood flavor and Andhra spices.', '/images/products/dry-prawns.jpg', null, null, null, false, false, false, true),
    ('00000000-0000-0000-0000-000000000002', 'Dry Methallu', 'dry-methallu', 'ఎండు మేతళ్ళు', 'Dried fish (methallu) pickle — a traditional coastal Andhra delicacy with deep, savory flavors.', '/images/products/dry-methallu.jpg', null, null, null, false, false, false, true),
    ('00000000-0000-0000-0000-000000000003', 'Dhaniyalu Karam Podi (200g)', 'dhaniyalu-karam-podi', null, 'Authentic Dhaniyalu Karam Podi made with traditional Godavari recipe.', '/images/products/dhaniyalu-karam-podi.jpg', 110.00, 220.00, 440.00, true, true, true, false),
    ('00000000-0000-0000-0000-000000000003', 'Palli Karam Podi (200g)', 'palli-karam-podi', null, 'Authentic Palli Karam Podi made with traditional Godavari recipe.', '/images/products/palli-karam-podi.jpg', 110.00, 220.00, 440.00, true, false, true, false),
    ('00000000-0000-0000-0000-000000000003', 'Kandi Podi (200g)', 'kandi-podi', null, 'Authentic Kandi Podi made with traditional Godavari recipe.', '/images/products/kandi-podi.jpg', 120.00, 240.00, 480.00, true, true, true, false),
    ('00000000-0000-0000-0000-000000000003', 'Kakarakaya Podi (200g)', 'kakarakaya-podi', null, 'Authentic Kakarakaya Podi made with traditional Godavari recipe.', '/images/products/kakarakaya-podi.jpg', 110.00, 220.00, 440.00, true, false, true, false),
    ('00000000-0000-0000-0000-000000000003', 'Usirikaya Podi (200g)', 'usirikaya-podi', null, 'Authentic Usirikaya Podi made with traditional Godavari recipe.', '/images/products/usirikaya-podi.jpg', 110.00, 220.00, 440.00, true, false, true, false),
    ('00000000-0000-0000-0000-000000000003', 'Karivepaku Podi (200g)', 'karivepaku-podi', null, 'Authentic Karivepaku Podi made with traditional Godavari recipe.', '/images/products/karivepaku-podi.jpg', 110.00, 220.00, 440.00, true, false, true, false),
    ('00000000-0000-0000-0000-000000000003', 'Nalla Karam Podi (200g)', 'nalla-karam-podi', null, 'Authentic Nalla Karam Podi made with traditional Godavari recipe.', '/images/products/nalla-karam-podi.jpg', 110.00, 220.00, 440.00, true, false, true, false),
    ('00000000-0000-0000-0000-000000000003', 'Munagaku Podi (200g)', 'munagaku-podi', null, 'Authentic Munagaku Podi made with traditional Godavari recipe.', '/images/products/munagaku-podi.jpg', 110.00, 220.00, 440.00, true, false, true, false),
    ('00000000-0000-0000-0000-000000000003', 'Kothimera Podi (200g)', 'kothimera-podi', null, 'Authentic Kothimera Podi made with traditional Godavari recipe.', '/images/products/kothimera-podi.jpg', 110.00, 220.00, 440.00, true, false, true, false),
    ('00000000-0000-0000-0000-000000000003', 'Avisa Ginjalu Podi (200g)', 'avisa-ginjalu-podi', null, 'Authentic Avisa Ginjalu Podi made with traditional Godavari recipe.', '/images/products/avisa-ginjalu-podi.jpg', 110.00, 220.00, 440.00, true, false, true, false),
    ('00000000-0000-0000-0000-000000000003', 'Sonti Podi (200g)', 'sonti-podi', null, 'Authentic Sonti Podi made with traditional Godavari recipe.', '/images/products/sonti-podi.jpg', 120.00, 240.00, 480.00, true, false, true, false),
    ('00000000-0000-0000-0000-000000000003', 'Pudina Podi (200g)', 'pudina-podi', null, 'Authentic Pudina Podi made with traditional Godavari recipe.', '/images/products/pudina-podi.jpg', 110.00, 220.00, 440.00, true, false, true, false),
    ('00000000-0000-0000-0000-000000000003', 'Sanagapappu Podi (200g)', 'sanagapappu-podi', null, 'Authentic Sanagapappu Podi made with traditional Godavari recipe.', '/images/products/sanagapappu-podi.jpg', 110.00, 220.00, 440.00, true, false, true, false),
    ('00000000-0000-0000-0000-000000000003', 'Idly Karam Podi (200g)', 'idly-karam-podi', null, 'Authentic Idly Karam Podi made with traditional Godavari recipe.', '/images/products/idly-karam-podi.jpg', 110.00, 220.00, 440.00, true, false, true, false),
    ('00000000-0000-0000-0000-000000000003', 'Kobbari Podi (200g)', 'kobbari-podi', null, 'Authentic Kobbari Podi made with traditional Godavari recipe.', '/images/products/kobbari-podi.jpg', 100.00, 200.00, 400.00, true, false, true, false),
    ('00000000-0000-0000-0000-000000000003', 'Ulli Karam Podi (200g)', 'ulli-karam-podi', null, 'Authentic Ulli Karam Podi made with traditional Godavari recipe.', '/images/products/ulli-karam-podi.jpg', 110.00, 220.00, 440.00, true, false, true, false),
    ('00000000-0000-0000-0000-000000000003', 'Ulavacharu', 'ulavacharu', null, 'Authentic Ulavacharu made with traditional Godavari recipe.', '/images/products/ulavacharu.jpg', 110.00, 220.00, 440.00, true, false, true, false),
    ('00000000-0000-0000-0000-000000000003', 'Nuvvulu Karam Podi (200g)', 'nuvvulu-karam-podi', null, 'Authentic Nuvvulu Karam Podi made with traditional Godavari recipe.', '/images/products/nuvvulu-karam-podi.jpg', 110.00, 220.00, 440.00, true, false, true, false),
    ('00000000-0000-0000-0000-000000000003', 'Junnu Powder (100g)', 'junnu-powder', null, 'Authentic Junnu Powder made with traditional Godavari recipe.', '/images/products/junnu-powder.jpg', 80.00, 160.00, 320.00, true, false, true, false),
    ('00000000-0000-0000-0000-000000000004', 'Pumpkin Seeds', 'pumpkin-seeds', null, 'Premium quality Pumpkin Seeds packed with nutrients.', '/images/products/pumpkin-seeds.jpg', 160.00, 320.00, 640.00, true, true, true, false),
    ('00000000-0000-0000-0000-000000000004', 'Sunflower Seeds', 'sunflower-seeds', null, 'Premium quality Sunflower Seeds packed with nutrients.', '/images/products/sunflower-seeds.jpg', 125.00, 250.00, 500.00, true, false, true, false),
    ('00000000-0000-0000-0000-000000000004', 'Sabja Seeds', 'sabja-seeds', null, 'Premium quality Sabja Seeds packed with nutrients.', '/images/products/sabja-seeds.jpg', 150.00, 300.00, 600.00, true, false, true, false),
    ('00000000-0000-0000-0000-000000000004', 'Chia Seeds', 'chia-seeds', null, 'Premium quality Chia Seeds packed with nutrients.', '/images/products/chia-seeds.jpg', 150.00, 300.00, 600.00, true, false, true, false),
    ('00000000-0000-0000-0000-000000000004', 'Flax Seeds', 'flax-seeds', null, 'Premium quality Flax Seeds packed with nutrients.', '/images/products/flax-seeds.jpg', 125.00, 250.00, 500.00, true, true, true, false),
    ('00000000-0000-0000-0000-000000000005', 'Bellam Mamidi Thandra', 'bellam-mamidi-thandra', null, 'Traditional and sweet Bellam Mamidi Thandra.', '/images/products/bellam-mamidi-thandra.jpg', 90.00, 180.00, 360.00, true, true, true, false),
    ('00000000-0000-0000-0000-000000000005', 'Sugar Mamidi Thandra', 'sugar-mamidi-thandra', null, 'Traditional and sweet Sugar Mamidi Thandra.', '/images/products/sugar-mamidi-thandra.jpg', 90.00, 180.00, 360.00, true, true, true, false),
    ('00000000-0000-0000-0000-000000000005', 'Guava Jelly', 'guava-jelly', null, 'Traditional and sweet Guava Jelly.', '/images/products/guava-jelly.jpg', 120.00, 240.00, 480.00, true, false, true, false),
    ('00000000-0000-0000-0000-000000000005', 'Strawberry Jelly', 'strawberry-jelly', null, 'Traditional and sweet Strawberry Jelly.', '/images/products/strawberry-jelly.jpg', 120.00, 240.00, 480.00, true, false, true, false),
    ('00000000-0000-0000-0000-000000000005', 'Green Mango Jelly', 'green-mango-jelly', null, 'Traditional and sweet Green Mango Jelly.', '/images/products/green-mango-jelly.jpg', 120.00, 240.00, 480.00, true, false, true, false),
    ('00000000-0000-0000-0000-000000000005', 'Mixed Jelly Box (500g)', 'mixed-jelly-box', null, 'Traditional and sweet Mixed Jelly Box.', '/images/products/mixed-jelly-box.jpg', null, 240.00, 480.00, true, false, true, false),
    ('00000000-0000-0000-0000-000000000005', 'Thati Thandra', 'thati-thandra', null, 'Traditional and sweet Thati Thandra.', '/images/products/thati-thandra.jpg', 130.00, 260.00, 520.00, true, false, true, false)
ON CONFLICT (slug) DO NOTHING;
