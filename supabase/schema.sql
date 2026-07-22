-- ==========================================
-- GODAROLLA RUCHULU SUPABASE SCHEMA & SEED
-- ==========================================

-- 1. Create tables
CREATE TABLE IF NOT EXISTS categories (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  image_url TEXT,
  display_order INTEGER DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS products (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  category_id UUID NOT NULL REFERENCES categories(id),
  slug TEXT UNIQUE NOT NULL,
  name TEXT UNIQUE NOT NULL,
  name_telugu TEXT,
  description TEXT,
  weights JSONB NOT NULL DEFAULT '[]'::jsonb,
  is_veg BOOLEAN NOT NULL DEFAULT true,
  status TEXT NOT NULL DEFAULT 'ACTIVE',
  is_featured BOOLEAN NOT NULL DEFAULT false,
  spice_level TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS product_images (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  image_url TEXT NOT NULL,
  sort_order INTEGER DEFAULT 0,
  is_primary BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS admin_logs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  action_type TEXT NOT NULL,
  entity_id UUID,
  details JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS admins (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'admin',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 2. Trigger for updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
   NEW.updated_at = NOW();
   RETURN NEW;
END;
$$ language 'plpgsql';

DROP TRIGGER IF EXISTS set_categories_timestamp ON categories;
CREATE TRIGGER set_categories_timestamp
BEFORE UPDATE ON categories
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS set_products_timestamp ON products;
CREATE TRIGGER set_products_timestamp
BEFORE UPDATE ON products
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- 3. Enable RLS
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_logs ENABLE ROW LEVEL SECURITY;

-- 4. RLS Policies
DROP POLICY IF EXISTS "Public Read Active Categories" ON categories;
CREATE POLICY "Public Read Active Categories" ON categories FOR SELECT USING (is_active = true);

DROP POLICY IF EXISTS "Public Read Active Products" ON products;
CREATE POLICY "Public Read Active Products" ON products FOR SELECT USING (status = 'ACTIVE');

DROP POLICY IF EXISTS "Public Read Product Images" ON product_images;
CREATE POLICY "Public Read Product Images" ON product_images FOR SELECT USING (
  product_id IN (SELECT id FROM products WHERE status = 'ACTIVE')
);

-- Note: Admin operations bypass RLS via Service Role Key.

-- 5. Storage configuration
INSERT INTO storage.buckets (id, name, public) VALUES ('product-images', 'product-images', true) ON CONFLICT (id) DO NOTHING;
ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Public View Images" ON storage.objects;
CREATE POLICY "Public View Images" ON storage.objects FOR SELECT USING (bucket_id = 'product-images');

-- 6. Seed Categories

-- Seed Categories
INSERT INTO categories (name, slug, display_order) VALUES ('Veg', 'veg', 0) ON CONFLICT (slug) DO NOTHING;
INSERT INTO categories (name, slug, display_order) VALUES ('Non-Veg', 'nonveg', 1) ON CONFLICT (slug) DO NOTHING;
INSERT INTO categories (name, slug, display_order) VALUES ('Podulu', 'podulu', 2) ON CONFLICT (slug) DO NOTHING;
INSERT INTO categories (name, slug, display_order) VALUES ('Seeds', 'seeds', 3) ON CONFLICT (slug) DO NOTHING;
INSERT INTO categories (name, slug, display_order) VALUES ('Jellies', 'jellies', 4) ON CONFLICT (slug) DO NOTHING;

-- Seed Products and Images

DO $$
DECLARE
  cat_id UUID;
  new_product_id UUID;
BEGIN
  SELECT id INTO cat_id FROM categories WHERE slug = 'veg';
  
  INSERT INTO products (slug, name, name_telugu, category_id, description, weights, is_veg, status, is_featured, spice_level)
  VALUES (
    'avakaya', 
    'Avakaya', 
    'ఆవకాయ', 
    cat_id, 
    'The iconic Andhra mango pickle made with raw mangoes, red chilli powder, mustard, and cold-pressed sesame oil. Bold, tangy, and fiery — the king of Telugu pickles.', 
    '[{"weight":"250g","price":100},{"weight":"500g","price":200},{"weight":"1kg","price":400}]'::jsonb, 
    true, 
    'ACTIVE', 
    true, 
    'hot'
  ) ON CONFLICT (slug) DO NOTHING RETURNING id INTO new_product_id;

  IF new_product_id IS NOT NULL THEN
    INSERT INTO product_images (product_id, image_url, sort_order, is_primary)
    VALUES (new_product_id, '/images/products/avakaya.webp', 0, true);
  END IF;
END $$;

DO $$
DECLARE
  cat_id UUID;
  new_product_id UUID;
BEGIN
  SELECT id INTO cat_id FROM categories WHERE slug = 'veg';
  
  INSERT INTO products (slug, name, name_telugu, category_id, description, weights, is_veg, status, is_featured, spice_level)
  VALUES (
    'bellam-avakaya', 
    'Bellam Avakaya', 
    'బెల్లం ఆవకాయ', 
    cat_id, 
    'A unique sweet-and-spicy twist on the classic Avakaya, made with jaggery (bellam). The perfect balance of tangy mango, fiery spice, and caramel sweetness.', 
    '[{"weight":"250g","price":110},{"weight":"500g","price":220},{"weight":"1kg","price":440}]'::jsonb, 
    true, 
    'ACTIVE', 
    false, 
    'medium'
  ) ON CONFLICT (slug) DO NOTHING RETURNING id INTO new_product_id;

  IF new_product_id IS NOT NULL THEN
    INSERT INTO product_images (product_id, image_url, sort_order, is_primary)
    VALUES (new_product_id, '/images/products/bellam-avakaya.webp', 0, true);
  END IF;
END $$;

DO $$
DECLARE
  cat_id UUID;
  new_product_id UUID;
BEGIN
  SELECT id INTO cat_id FROM categories WHERE slug = 'veg';
  
  INSERT INTO products (slug, name, name_telugu, category_id, description, weights, is_veg, status, is_featured, spice_level)
  VALUES (
    'magai', 
    'Magai', 
    'మాగాయ', 
    cat_id, 
    'Sun-dried mango pieces pickled with aromatic spices and oil. A beloved Andhra classic with intense flavor that deepens with age.', 
    '[{"weight":"250g","price":120},{"weight":"500g","price":240},{"weight":"1kg","price":480}]'::jsonb, 
    true, 
    'ACTIVE', 
    false, 
    'hot'
  ) ON CONFLICT (slug) DO NOTHING RETURNING id INTO new_product_id;

  IF new_product_id IS NOT NULL THEN
    INSERT INTO product_images (product_id, image_url, sort_order, is_primary)
    VALUES (new_product_id, '/images/products/magai.webp', 0, true);
  END IF;
END $$;

DO $$
DECLARE
  cat_id UUID;
  new_product_id UUID;
BEGIN
  SELECT id INTO cat_id FROM categories WHERE slug = 'veg';
  
  INSERT INTO products (slug, name, name_telugu, category_id, description, weights, is_veg, status, is_featured, spice_level)
  VALUES (
    'allam-ginger', 
    'Allam (Ginger)', 
    'అల్లం', 
    cat_id, 
    'Fresh ginger pickle with a warming, spicy kick. Made with tender ginger root, tangy tamarind, and traditional spices.', 
    '[{"weight":"250g","price":110},{"weight":"500g","price":220},{"weight":"1kg","price":440}]'::jsonb, 
    true, 
    'ACTIVE', 
    false, 
    'medium'
  ) ON CONFLICT (slug) DO NOTHING RETURNING id INTO new_product_id;

  IF new_product_id IS NOT NULL THEN
    INSERT INTO product_images (product_id, image_url, sort_order, is_primary)
    VALUES (new_product_id, '/images/products/allam-ginger.webp', 0, true);
  END IF;
END $$;

DO $$
DECLARE
  cat_id UUID;
  new_product_id UUID;
BEGIN
  SELECT id INTO cat_id FROM categories WHERE slug = 'veg';
  
  INSERT INTO products (slug, name, name_telugu, category_id, description, weights, is_veg, status, is_featured, spice_level)
  VALUES (
    'villulli-garlic', 
    'Villulli (Garlic)', 
    'వెల్లుల్లి', 
    cat_id, 
    'Whole garlic cloves pickled in spiced oil with a rich, pungent flavor. A powerhouse of taste that pairs perfectly with hot rice and ghee.', 
    '[{"weight":"250g","price":150},{"weight":"500g","price":300},{"weight":"1kg","price":600}]'::jsonb, 
    true, 
    'ACTIVE', 
    false, 
    'medium'
  ) ON CONFLICT (slug) DO NOTHING RETURNING id INTO new_product_id;

  IF new_product_id IS NOT NULL THEN
    INSERT INTO product_images (product_id, image_url, sort_order, is_primary)
    VALUES (new_product_id, '/images/products/villulli-garlic.webp', 0, true);
  END IF;
END $$;

DO $$
DECLARE
  cat_id UUID;
  new_product_id UUID;
BEGIN
  SELECT id INTO cat_id FROM categories WHERE slug = 'veg';
  
  INSERT INTO products (slug, name, name_telugu, category_id, description, weights, is_veg, status, is_featured, spice_level)
  VALUES (
    'chinthakaya', 
    'Chinthakaya', 
    'చింతకాయ', 
    cat_id, 
    'Raw tamarind pickle with a sharp, sour punch balanced by red chilli and mustard. A tangy delight from the Godavari kitchen.', 
    '[{"weight":"250g","price":110},{"weight":"500g","price":220},{"weight":"1kg","price":440}]'::jsonb, 
    true, 
    'ACTIVE', 
    false, 
    'hot'
  ) ON CONFLICT (slug) DO NOTHING RETURNING id INTO new_product_id;

  IF new_product_id IS NOT NULL THEN
    INSERT INTO product_images (product_id, image_url, sort_order, is_primary)
    VALUES (new_product_id, '/images/products/chinthakaya.webp', 0, true);
  END IF;
END $$;

DO $$
DECLARE
  cat_id UUID;
  new_product_id UUID;
BEGIN
  SELECT id INTO cat_id FROM categories WHERE slug = 'veg';
  
  INSERT INTO products (slug, name, name_telugu, category_id, description, weights, is_veg, status, is_featured, spice_level)
  VALUES (
    'tomato', 
    'Tomato', 
    'టొమాటో', 
    cat_id, 
    'Ripe tomato pickle with a sweet-tangy taste and rich red color. A mild, versatile pickle loved by all ages.', 
    '[{"weight":"250g","price":110},{"weight":"500g","price":220},{"weight":"1kg","price":440}]'::jsonb, 
    true, 
    'ACTIVE', 
    false, 
    'mild'
  ) ON CONFLICT (slug) DO NOTHING RETURNING id INTO new_product_id;

  IF new_product_id IS NOT NULL THEN
    INSERT INTO product_images (product_id, image_url, sort_order, is_primary)
    VALUES (new_product_id, '/images/products/tomato.webp', 0, true);
  END IF;
END $$;

DO $$
DECLARE
  cat_id UUID;
  new_product_id UUID;
BEGIN
  SELECT id INTO cat_id FROM categories WHERE slug = 'veg';
  
  INSERT INTO products (slug, name, name_telugu, category_id, description, weights, is_veg, status, is_featured, spice_level)
  VALUES (
    'dabbakaya', 
    'Dabbakaya', 
    'దబ్బకాయ', 
    cat_id, 
    'Citron (dabbakaya) pickle with a distinctive citrusy flavor. A traditional Andhra specialty with a bright, refreshing taste.', 
    '[{"weight":"250g","price":110},{"weight":"500g","price":220},{"weight":"1kg","price":440}]'::jsonb, 
    true, 
    'ACTIVE', 
    false, 
    'medium'
  ) ON CONFLICT (slug) DO NOTHING RETURNING id INTO new_product_id;

  IF new_product_id IS NOT NULL THEN
    INSERT INTO product_images (product_id, image_url, sort_order, is_primary)
    VALUES (new_product_id, '/images/products/dabbakaya.webp', 0, true);
  END IF;
END $$;

DO $$
DECLARE
  cat_id UUID;
  new_product_id UUID;
BEGIN
  SELECT id INTO cat_id FROM categories WHERE slug = 'veg';
  
  INSERT INTO products (slug, name, name_telugu, category_id, description, weights, is_veg, status, is_featured, spice_level)
  VALUES (
    'gongura', 
    'Gongura', 
    'గోంగూర', 
    cat_id, 
    'Sorrel leaf (gongura) pickle — the pride of Andhra cuisine. Tangy, slightly sour leaves ground with red chillies and tempered with mustard.', 
    '[{"weight":"250g","price":110},{"weight":"500g","price":220},{"weight":"1kg","price":440}]'::jsonb, 
    true, 
    'ACTIVE', 
    true, 
    'hot'
  ) ON CONFLICT (slug) DO NOTHING RETURNING id INTO new_product_id;

  IF new_product_id IS NOT NULL THEN
    INSERT INTO product_images (product_id, image_url, sort_order, is_primary)
    VALUES (new_product_id, '/images/products/gongura.webp', 0, true);
  END IF;
END $$;

DO $$
DECLARE
  cat_id UUID;
  new_product_id UUID;
BEGIN
  SELECT id INTO cat_id FROM categories WHERE slug = 'veg';
  
  INSERT INTO products (slug, name, name_telugu, category_id, description, weights, is_veg, status, is_featured, spice_level)
  VALUES (
    'kothimeera', 
    'Kothimeera', 
    'కొత్తిమీర', 
    cat_id, 
    'Fresh coriander (kothimeera) pickle bursting with herbal, green flavors. A vibrant, aromatic pickle that adds freshness to any meal.', 
    '[{"weight":"250g","price":110},{"weight":"500g","price":220},{"weight":"1kg","price":440}]'::jsonb, 
    true, 
    'ACTIVE', 
    false, 
    'medium'
  ) ON CONFLICT (slug) DO NOTHING RETURNING id INTO new_product_id;

  IF new_product_id IS NOT NULL THEN
    INSERT INTO product_images (product_id, image_url, sort_order, is_primary)
    VALUES (new_product_id, '/images/products/kothimeera.webp', 0, true);
  END IF;
END $$;

DO $$
DECLARE
  cat_id UUID;
  new_product_id UUID;
BEGIN
  SELECT id INTO cat_id FROM categories WHERE slug = 'veg';
  
  INSERT INTO products (slug, name, name_telugu, category_id, description, weights, is_veg, status, is_featured, spice_level)
  VALUES (
    'pudina', 
    'Pudina', 
    'పుదీన', 
    cat_id, 
    'Mint (pudina) pickle with a cool, refreshing flavor layered with spice. Perfect as a side or spread.', 
    '[{"weight":"250g","price":120},{"weight":"500g","price":240},{"weight":"1kg","price":480}]'::jsonb, 
    true, 
    'ACTIVE', 
    false, 
    'medium'
  ) ON CONFLICT (slug) DO NOTHING RETURNING id INTO new_product_id;

  IF new_product_id IS NOT NULL THEN
    INSERT INTO product_images (product_id, image_url, sort_order, is_primary)
    VALUES (new_product_id, '/images/products/pudina.webp', 0, true);
  END IF;
END $$;

DO $$
DECLARE
  cat_id UUID;
  new_product_id UUID;
BEGIN
  SELECT id INTO cat_id FROM categories WHERE slug = 'veg';
  
  INSERT INTO products (slug, name, name_telugu, category_id, description, weights, is_veg, status, is_featured, spice_level)
  VALUES (
    'karivepaku', 
    'Karivepaku', 
    'కరివేపాకు', 
    cat_id, 
    'Curry leaf (karivepaku) pickle with a deep, aromatic flavor. Made with fresh curry leaves, tamarind, and a rich spice blend.', 
    '[{"weight":"250g","price":120},{"weight":"500g","price":240},{"weight":"1kg","price":480}]'::jsonb, 
    true, 
    'ACTIVE', 
    false, 
    'medium'
  ) ON CONFLICT (slug) DO NOTHING RETURNING id INTO new_product_id;

  IF new_product_id IS NOT NULL THEN
    INSERT INTO product_images (product_id, image_url, sort_order, is_primary)
    VALUES (new_product_id, '/images/products/karivepaku.webp', 0, true);
  END IF;
END $$;

DO $$
DECLARE
  cat_id UUID;
  new_product_id UUID;
BEGIN
  SELECT id INTO cat_id FROM categories WHERE slug = 'veg';
  
  INSERT INTO products (slug, name, name_telugu, category_id, description, weights, is_veg, status, is_featured, spice_level)
  VALUES (
    'kakarakaya', 
    'Kakarakaya', 
    'కాకరకాయ', 
    cat_id, 
    'Bitter gourd (kakarakaya) pickle that transforms bitterness into an addictive, spicy-tangy flavor. A healthy, unique pickle.', 
    '[{"weight":"250g","price":120},{"weight":"500g","price":240},{"weight":"1kg","price":480}]'::jsonb, 
    true, 
    'ACTIVE', 
    false, 
    'hot'
  ) ON CONFLICT (slug) DO NOTHING RETURNING id INTO new_product_id;

  IF new_product_id IS NOT NULL THEN
    INSERT INTO product_images (product_id, image_url, sort_order, is_primary)
    VALUES (new_product_id, '/images/products/kakarakaya.webp', 0, true);
  END IF;
END $$;

DO $$
DECLARE
  cat_id UUID;
  new_product_id UUID;
BEGIN
  SELECT id INTO cat_id FROM categories WHERE slug = 'veg';
  
  INSERT INTO products (slug, name, name_telugu, category_id, description, weights, is_veg, status, is_featured, spice_level)
  VALUES (
    'nimmakaya-lemon', 
    'Nimmakaya (Lemon)', 
    'నిమ్మకాయ', 
    cat_id, 
    'Lemon pickle with bright, citrusy tang and warm spices. Whole lemons soaked in salt, chilli, and turmeric — a South Indian staple.', 
    '[{"weight":"250g","price":110},{"weight":"500g","price":220},{"weight":"1kg","price":440}]'::jsonb, 
    true, 
    'ACTIVE', 
    false, 
    'medium'
  ) ON CONFLICT (slug) DO NOTHING RETURNING id INTO new_product_id;

  IF new_product_id IS NOT NULL THEN
    INSERT INTO product_images (product_id, image_url, sort_order, is_primary)
    VALUES (new_product_id, '/images/products/nimmakaya-lemon.webp', 0, true);
  END IF;
END $$;

DO $$
DECLARE
  cat_id UUID;
  new_product_id UUID;
BEGIN
  SELECT id INTO cat_id FROM categories WHERE slug = 'veg';
  
  INSERT INTO products (slug, name, name_telugu, category_id, description, weights, is_veg, status, is_featured, spice_level)
  VALUES (
    'chitrannam-paste', 
    'Chitrannam Paste', 
    'చిత్రాన్నం పేస్ట్', 
    cat_id, 
    'Ready-to-mix lemon rice paste. Just mix with hot rice for instant, flavorful Chitrannam — perfect for lunchboxes and quick meals.', 
    '[{"weight":"250g","price":100},{"weight":"500g","price":200},{"weight":"1kg","price":400}]'::jsonb, 
    true, 
    'ACTIVE', 
    false, 
    'mild'
  ) ON CONFLICT (slug) DO NOTHING RETURNING id INTO new_product_id;

  IF new_product_id IS NOT NULL THEN
    INSERT INTO product_images (product_id, image_url, sort_order, is_primary)
    VALUES (new_product_id, '/images/products/chitrannam-paste.webp', 0, true);
  END IF;
END $$;

DO $$
DECLARE
  cat_id UUID;
  new_product_id UUID;
BEGIN
  SELECT id INTO cat_id FROM categories WHERE slug = 'veg';
  
  INSERT INTO products (slug, name, name_telugu, category_id, description, weights, is_veg, status, is_featured, spice_level)
  VALUES (
    'pulihora-paste', 
    'Pulihora Paste', 
    'పులిహోర పేస్ట్', 
    cat_id, 
    'Traditional tamarind rice paste. Mix with hot rice for authentic Pulihora — tangy, spicy, and deeply flavorful. A temple-prasadam favorite.', 
    '[{"weight":"250g","price":100},{"weight":"500g","price":200},{"weight":"1kg","price":400}]'::jsonb, 
    true, 
    'ACTIVE', 
    false, 
    'mild'
  ) ON CONFLICT (slug) DO NOTHING RETURNING id INTO new_product_id;

  IF new_product_id IS NOT NULL THEN
    INSERT INTO product_images (product_id, image_url, sort_order, is_primary)
    VALUES (new_product_id, '/images/products/pulihora-paste.webp', 0, true);
  END IF;
END $$;

DO $$
DECLARE
  cat_id UUID;
  new_product_id UUID;
BEGIN
  SELECT id INTO cat_id FROM categories WHERE slug = 'veg';
  
  INSERT INTO products (slug, name, name_telugu, category_id, description, weights, is_veg, status, is_featured, spice_level)
  VALUES (
    'pandu-mirchi', 
    'Pandu Mirchi', 
    'పండు మిర్చి', 
    cat_id, 
    'Ripe red chilli pickle with deep, smoky heat. Whole dried red chillies pickled in oil with a potent spice paste.', 
    '[{"weight":"250g","price":120},{"weight":"500g","price":240},{"weight":"1kg","price":480}]'::jsonb, 
    true, 
    'ACTIVE', 
    false, 
    'extra-hot'
  ) ON CONFLICT (slug) DO NOTHING RETURNING id INTO new_product_id;

  IF new_product_id IS NOT NULL THEN
    INSERT INTO product_images (product_id, image_url, sort_order, is_primary)
    VALUES (new_product_id, '/images/products/pandu-mirchi.webp', 0, true);
  END IF;
END $$;

DO $$
DECLARE
  cat_id UUID;
  new_product_id UUID;
BEGIN
  SELECT id INTO cat_id FROM categories WHERE slug = 'veg';
  
  INSERT INTO products (slug, name, name_telugu, category_id, description, weights, is_veg, status, is_featured, spice_level)
  VALUES (
    'pachi-mirchi', 
    'Pachi Mirchi', 
    'పచ్చి మిర్చి', 
    cat_id, 
    'Fresh green chilli pickle with a sharp, fiery bite. Young green chillies pickled with mustard and lemon for a vibrant kick.', 
    '[{"weight":"250g","price":110},{"weight":"500g","price":220},{"weight":"1kg","price":440}]'::jsonb, 
    true, 
    'ACTIVE', 
    false, 
    'extra-hot'
  ) ON CONFLICT (slug) DO NOTHING RETURNING id INTO new_product_id;

  IF new_product_id IS NOT NULL THEN
    INSERT INTO product_images (product_id, image_url, sort_order, is_primary)
    VALUES (new_product_id, '/images/products/pachi-mirchi.webp', 0, true);
  END IF;
END $$;

DO $$
DECLARE
  cat_id UUID;
  new_product_id UUID;
BEGIN
  SELECT id INTO cat_id FROM categories WHERE slug = 'veg';
  
  INSERT INTO products (slug, name, name_telugu, category_id, description, weights, is_veg, status, is_featured, spice_level)
  VALUES (
    'usirikaya-amla', 
    'Usirikaya (Amla)', 
    'ఉసిరికాయ', 
    cat_id, 
    'Indian gooseberry (amla) pickle — tangy, crunchy, and packed with Vitamin C. A healthy, flavorful pickle from the Godavari kitchen.', 
    '[{"weight":"250g","price":110},{"weight":"500g","price":220},{"weight":"1kg","price":440}]'::jsonb, 
    true, 
    'ACTIVE', 
    false, 
    'medium'
  ) ON CONFLICT (slug) DO NOTHING RETURNING id INTO new_product_id;

  IF new_product_id IS NOT NULL THEN
    INSERT INTO product_images (product_id, image_url, sort_order, is_primary)
    VALUES (new_product_id, '/images/products/usirikaya-amla.webp', 0, true);
  END IF;
END $$;

DO $$
DECLARE
  cat_id UUID;
  new_product_id UUID;
BEGIN
  SELECT id INTO cat_id FROM categories WHERE slug = 'veg';
  
  INSERT INTO products (slug, name, name_telugu, category_id, description, weights, is_veg, status, is_featured, spice_level)
  VALUES (
    'avakaya-biryani-masala', 
    'Avakaya Biryani Masala', 
    'ఆవకాయ బిర్యానీ మసాలా', 
    cat_id, 
    'A special masala blend inspired by Avakaya flavors, designed for biryani preparation.', 
    '[{"weight":"250g","price":120},{"weight":"500g","price":240},{"weight":"1kg","price":480}]'::jsonb, 
    true, 
    'ACTIVE', 
    false, 
    'hot'
  ) ON CONFLICT (slug) DO NOTHING RETURNING id INTO new_product_id;

  IF new_product_id IS NOT NULL THEN
    INSERT INTO product_images (product_id, image_url, sort_order, is_primary)
    VALUES (new_product_id, '/images/products/avakaya-biryani-masala.webp', 0, true);
  END IF;
END $$;

DO $$
DECLARE
  cat_id UUID;
  new_product_id UUID;
BEGIN
  SELECT id INTO cat_id FROM categories WHERE slug = 'veg';
  
  INSERT INTO products (slug, name, name_telugu, category_id, description, weights, is_veg, status, is_featured, spice_level)
  VALUES (
    'avakaya-telangana-style', 
    'Avakaya Telangana Style', 
    'ఆవకాయ తెలంగాణ స్టైల్', 
    cat_id, 
    'Avakaya prepared in the Telangana tradition — a distinct regional variation with its own unique spice profile and preparation method.', 
    '[{"weight":"250g","price":120},{"weight":"500g","price":240},{"weight":"1kg","price":480}]'::jsonb, 
    true, 
    'ACTIVE', 
    false, 
    'hot'
  ) ON CONFLICT (slug) DO NOTHING RETURNING id INTO new_product_id;

  IF new_product_id IS NOT NULL THEN
    INSERT INTO product_images (product_id, image_url, sort_order, is_primary)
    VALUES (new_product_id, '/images/products/avakaya-telangana-style.webp', 0, true);
  END IF;
END $$;

DO $$
DECLARE
  cat_id UUID;
  new_product_id UUID;
BEGIN
  SELECT id INTO cat_id FROM categories WHERE slug = 'veg';
  
  INSERT INTO products (slug, name, name_telugu, category_id, description, weights, is_veg, status, is_featured, spice_level)
  VALUES (
    'cabbage-pickle', 
    'Cabbage Pickle', 
    'క్యాబేజ్ ఊరగాయ', 
    cat_id, 
    'Crunchy cabbage pickled with mustard, chilli, and spices. A lighter, refreshing pickle with a satisfying crunch.', 
    '[{"weight":"250g","price":120},{"weight":"500g","price":240},{"weight":"1kg","price":480}]'::jsonb, 
    true, 
    'ACTIVE', 
    false, 
    'medium'
  ) ON CONFLICT (slug) DO NOTHING RETURNING id INTO new_product_id;

  IF new_product_id IS NOT NULL THEN
    INSERT INTO product_images (product_id, image_url, sort_order, is_primary)
    VALUES (new_product_id, '/images/products/cabbage-pickle.webp', 0, true);
  END IF;
END $$;

DO $$
DECLARE
  cat_id UUID;
  new_product_id UUID;
BEGIN
  SELECT id INTO cat_id FROM categories WHERE slug = 'nonveg';
  
  INSERT INTO products (slug, name, name_telugu, category_id, description, weights, is_veg, status, is_featured, spice_level)
  VALUES (
    'chicken-pickle-bone', 
    'Chicken Pickle (Bone)', 
    'చికెన్ ఊరగాయ (బోన్)', 
    cat_id, 
    'Tender chicken pieces with bone, slow-cooked in aromatic spices and oil. Rich, meaty, and deeply flavorful — a non-veg pickle classic.', 
    '[{"weight":"250g","price":225},{"weight":"500g","price":450},{"weight":"1kg","price":900}]'::jsonb, 
    false, 
    'ACTIVE', 
    false, 
    'hot'
  ) ON CONFLICT (slug) DO NOTHING RETURNING id INTO new_product_id;

  IF new_product_id IS NOT NULL THEN
    INSERT INTO product_images (product_id, image_url, sort_order, is_primary)
    VALUES (new_product_id, '/images/products/chicken-pickle-bone.webp', 0, true);
  END IF;
END $$;

DO $$
DECLARE
  cat_id UUID;
  new_product_id UUID;
BEGIN
  SELECT id INTO cat_id FROM categories WHERE slug = 'nonveg';
  
  INSERT INTO products (slug, name, name_telugu, category_id, description, weights, is_veg, status, is_featured, spice_level)
  VALUES (
    'chicken-pickle-boneless', 
    'Chicken Pickle (Boneless)', 
    'చికెన్ ఊరగాయ (బోన్‌లెస్)', 
    cat_id, 
    'Premium boneless chicken pieces pickled in a fiery spice blend. Convenience meets authentic taste — no bones, all flavor.', 
    '[{"weight":"250g","price":300},{"weight":"500g","price":600},{"weight":"1kg","price":1200}]'::jsonb, 
    false, 
    'ACTIVE', 
    true, 
    'hot'
  ) ON CONFLICT (slug) DO NOTHING RETURNING id INTO new_product_id;

  IF new_product_id IS NOT NULL THEN
    INSERT INTO product_images (product_id, image_url, sort_order, is_primary)
    VALUES (new_product_id, '/images/products/chicken-pickle-boneless.webp', 0, true);
  END IF;
END $$;

DO $$
DECLARE
  cat_id UUID;
  new_product_id UUID;
BEGIN
  SELECT id INTO cat_id FROM categories WHERE slug = 'nonveg';
  
  INSERT INTO products (slug, name, name_telugu, category_id, description, weights, is_veg, status, is_featured, spice_level)
  VALUES (
    'prawn-pickle', 
    'Prawn Pickle', 
    'రొయ్యల ఊరగాయ', 
    cat_id, 
    'Fresh prawns pickled with Godavari-style spices. The coastal Andhra influence shines through in every bite — tangy, spicy, and seafood-rich.', 
    '[{"weight":"250g","price":350},{"weight":"500g","price":700},{"weight":"1kg","price":1400}]'::jsonb, 
    false, 
    'ACTIVE', 
    true, 
    'hot'
  ) ON CONFLICT (slug) DO NOTHING RETURNING id INTO new_product_id;

  IF new_product_id IS NOT NULL THEN
    INSERT INTO product_images (product_id, image_url, sort_order, is_primary)
    VALUES (new_product_id, '/images/products/prawn-pickle.webp', 0, true);
  END IF;
END $$;

DO $$
DECLARE
  cat_id UUID;
  new_product_id UUID;
BEGIN
  SELECT id INTO cat_id FROM categories WHERE slug = 'nonveg';
  
  INSERT INTO products (slug, name, name_telugu, category_id, description, weights, is_veg, status, is_featured, spice_level)
  VALUES (
    'mutton-pickle', 
    'Mutton Pickle', 
    'మటన్ ఊరగాయ', 
    cat_id, 
    'Succulent mutton pieces slow-cooked in a rich, spicy pickle masala. A premium, hearty pickle with deep, complex flavors.', 
    '[{"weight":"250g","price":350},{"weight":"500g","price":700},{"weight":"1kg","price":1400}]'::jsonb, 
    false, 
    'ACTIVE', 
    false, 
    'hot'
  ) ON CONFLICT (slug) DO NOTHING RETURNING id INTO new_product_id;

  IF new_product_id IS NOT NULL THEN
    INSERT INTO product_images (product_id, image_url, sort_order, is_primary)
    VALUES (new_product_id, '/images/products/mutton-pickle.webp', 0, true);
  END IF;
END $$;

DO $$
DECLARE
  cat_id UUID;
  new_product_id UUID;
BEGIN
  SELECT id INTO cat_id FROM categories WHERE slug = 'nonveg';
  
  INSERT INTO products (slug, name, name_telugu, category_id, description, weights, is_veg, status, is_featured, spice_level)
  VALUES (
    'sea-fish-vanjaram-pickle', 
    'Sea Fish (Vanjaram Pickle)', 
    'వంజరం ఊరగాయ', 
    cat_id, 
    'King fish (vanjaram) pickle — the prized catch of the Andhra coast, pickled with bold spices. A seafood lover''s premium choice.', 
    '[{"weight":"250g","price":300},{"weight":"500g","price":600},{"weight":"1kg","price":1200}]'::jsonb, 
    false, 
    'ACTIVE', 
    false, 
    'hot'
  ) ON CONFLICT (slug) DO NOTHING RETURNING id INTO new_product_id;

  IF new_product_id IS NOT NULL THEN
    INSERT INTO product_images (product_id, image_url, sort_order, is_primary)
    VALUES (new_product_id, '/images/products/vanjaram-pickle.webp', 0, true);
  END IF;
END $$;

DO $$
DECLARE
  cat_id UUID;
  new_product_id UUID;
BEGIN
  SELECT id INTO cat_id FROM categories WHERE slug = 'nonveg';
  
  INSERT INTO products (slug, name, name_telugu, category_id, description, weights, is_veg, status, is_featured, spice_level)
  VALUES (
    'dry-prawns', 
    'Dry Prawns', 
    'ఎండు రొయ్యలు', 
    cat_id, 
    'Sun-dried prawns pickle with intense, concentrated seafood flavor and Andhra spices.', 
    '[]'::jsonb, 
    false, 
    'ARCHIVED', 
    false, 
    'hot'
  ) ON CONFLICT (slug) DO NOTHING RETURNING id INTO new_product_id;

  IF new_product_id IS NOT NULL THEN
    INSERT INTO product_images (product_id, image_url, sort_order, is_primary)
    VALUES (new_product_id, '/images/products/dry-prawns.webp', 0, true);
  END IF;
END $$;

DO $$
DECLARE
  cat_id UUID;
  new_product_id UUID;
BEGIN
  SELECT id INTO cat_id FROM categories WHERE slug = 'nonveg';
  
  INSERT INTO products (slug, name, name_telugu, category_id, description, weights, is_veg, status, is_featured, spice_level)
  VALUES (
    'dry-methallu', 
    'Dry Methallu', 
    'ఎండు మేతళ్ళు', 
    cat_id, 
    'Dried fish (methallu) pickle — a traditional coastal Andhra delicacy with deep, savory flavors.', 
    '[]'::jsonb, 
    false, 
    'ARCHIVED', 
    false, 
    'hot'
  ) ON CONFLICT (slug) DO NOTHING RETURNING id INTO new_product_id;

  IF new_product_id IS NOT NULL THEN
    INSERT INTO product_images (product_id, image_url, sort_order, is_primary)
    VALUES (new_product_id, '/images/products/dry-methallu.webp', 0, true);
  END IF;
END $$;

DO $$
DECLARE
  cat_id UUID;
  new_product_id UUID;
BEGIN
  SELECT id INTO cat_id FROM categories WHERE slug = 'podulu';
  
  INSERT INTO products (slug, name, name_telugu, category_id, description, weights, is_veg, status, is_featured, spice_level)
  VALUES (
    'dhaniyalu-karam-podi', 
    'Dhaniyalu Karam Podi (200g)', 
    NULL, 
    cat_id, 
    'Authentic Dhaniyalu Karam Podi made with traditional Godavari recipe.', 
    '[{"weight":"250g","price":110},{"weight":"500g","price":220},{"weight":"1kg","price":440}]'::jsonb, 
    true, 
    'ACTIVE', 
    true, 
    NULL
  ) ON CONFLICT (slug) DO NOTHING RETURNING id INTO new_product_id;

  IF new_product_id IS NOT NULL THEN
    INSERT INTO product_images (product_id, image_url, sort_order, is_primary)
    VALUES (new_product_id, '/images/products/dhaniyalu-karam-podi.webp', 0, true);
  END IF;
END $$;

DO $$
DECLARE
  cat_id UUID;
  new_product_id UUID;
BEGIN
  SELECT id INTO cat_id FROM categories WHERE slug = 'podulu';
  
  INSERT INTO products (slug, name, name_telugu, category_id, description, weights, is_veg, status, is_featured, spice_level)
  VALUES (
    'palli-karam-podi', 
    'Palli Karam Podi (200g)', 
    NULL, 
    cat_id, 
    'Authentic Palli Karam Podi made with traditional Godavari recipe.', 
    '[{"weight":"250g","price":110},{"weight":"500g","price":220},{"weight":"1kg","price":440}]'::jsonb, 
    true, 
    'ACTIVE', 
    false, 
    NULL
  ) ON CONFLICT (slug) DO NOTHING RETURNING id INTO new_product_id;

  IF new_product_id IS NOT NULL THEN
    INSERT INTO product_images (product_id, image_url, sort_order, is_primary)
    VALUES (new_product_id, '/images/products/palli-karam-podi.webp', 0, true);
  END IF;
END $$;

DO $$
DECLARE
  cat_id UUID;
  new_product_id UUID;
BEGIN
  SELECT id INTO cat_id FROM categories WHERE slug = 'podulu';
  
  INSERT INTO products (slug, name, name_telugu, category_id, description, weights, is_veg, status, is_featured, spice_level)
  VALUES (
    'kandi-podi', 
    'Kandi Podi (200g)', 
    NULL, 
    cat_id, 
    'Authentic Kandi Podi made with traditional Godavari recipe.', 
    '[{"weight":"250g","price":120},{"weight":"500g","price":240},{"weight":"1kg","price":480}]'::jsonb, 
    true, 
    'ACTIVE', 
    true, 
    NULL
  ) ON CONFLICT (slug) DO NOTHING RETURNING id INTO new_product_id;

  IF new_product_id IS NOT NULL THEN
    INSERT INTO product_images (product_id, image_url, sort_order, is_primary)
    VALUES (new_product_id, '/images/products/kandi-podi.webp', 0, true);
  END IF;
END $$;

DO $$
DECLARE
  cat_id UUID;
  new_product_id UUID;
BEGIN
  SELECT id INTO cat_id FROM categories WHERE slug = 'podulu';
  
  INSERT INTO products (slug, name, name_telugu, category_id, description, weights, is_veg, status, is_featured, spice_level)
  VALUES (
    'kakarakaya-podi', 
    'Kakarakaya Podi (200g)', 
    NULL, 
    cat_id, 
    'Authentic Kakarakaya Podi made with traditional Godavari recipe.', 
    '[{"weight":"250g","price":110},{"weight":"500g","price":220},{"weight":"1kg","price":440}]'::jsonb, 
    true, 
    'ACTIVE', 
    false, 
    NULL
  ) ON CONFLICT (slug) DO NOTHING RETURNING id INTO new_product_id;

  IF new_product_id IS NOT NULL THEN
    INSERT INTO product_images (product_id, image_url, sort_order, is_primary)
    VALUES (new_product_id, '/images/products/kakarakaya-podi.webp', 0, true);
  END IF;
END $$;

DO $$
DECLARE
  cat_id UUID;
  new_product_id UUID;
BEGIN
  SELECT id INTO cat_id FROM categories WHERE slug = 'podulu';
  
  INSERT INTO products (slug, name, name_telugu, category_id, description, weights, is_veg, status, is_featured, spice_level)
  VALUES (
    'usirikaya-podi', 
    'Usirikaya Podi (200g)', 
    NULL, 
    cat_id, 
    'Authentic Usirikaya Podi made with traditional Godavari recipe.', 
    '[{"weight":"250g","price":110},{"weight":"500g","price":220},{"weight":"1kg","price":440}]'::jsonb, 
    true, 
    'ACTIVE', 
    false, 
    NULL
  ) ON CONFLICT (slug) DO NOTHING RETURNING id INTO new_product_id;

  IF new_product_id IS NOT NULL THEN
    INSERT INTO product_images (product_id, image_url, sort_order, is_primary)
    VALUES (new_product_id, '/images/products/usirikaya-podi.webp', 0, true);
  END IF;
END $$;

DO $$
DECLARE
  cat_id UUID;
  new_product_id UUID;
BEGIN
  SELECT id INTO cat_id FROM categories WHERE slug = 'podulu';
  
  INSERT INTO products (slug, name, name_telugu, category_id, description, weights, is_veg, status, is_featured, spice_level)
  VALUES (
    'karivepaku-podi', 
    'Karivepaku Podi (200g)', 
    NULL, 
    cat_id, 
    'Authentic Karivepaku Podi made with traditional Godavari recipe.', 
    '[{"weight":"250g","price":110},{"weight":"500g","price":220},{"weight":"1kg","price":440}]'::jsonb, 
    true, 
    'ACTIVE', 
    false, 
    NULL
  ) ON CONFLICT (slug) DO NOTHING RETURNING id INTO new_product_id;

  IF new_product_id IS NOT NULL THEN
    INSERT INTO product_images (product_id, image_url, sort_order, is_primary)
    VALUES (new_product_id, '/images/products/karivepaku-podi.webp', 0, true);
  END IF;
END $$;

DO $$
DECLARE
  cat_id UUID;
  new_product_id UUID;
BEGIN
  SELECT id INTO cat_id FROM categories WHERE slug = 'podulu';
  
  INSERT INTO products (slug, name, name_telugu, category_id, description, weights, is_veg, status, is_featured, spice_level)
  VALUES (
    'nalla-karam-podi', 
    'Nalla Karam Podi (200g)', 
    NULL, 
    cat_id, 
    'Authentic Nalla Karam Podi made with traditional Godavari recipe.', 
    '[{"weight":"250g","price":110},{"weight":"500g","price":220},{"weight":"1kg","price":440}]'::jsonb, 
    true, 
    'ACTIVE', 
    false, 
    NULL
  ) ON CONFLICT (slug) DO NOTHING RETURNING id INTO new_product_id;

  IF new_product_id IS NOT NULL THEN
    INSERT INTO product_images (product_id, image_url, sort_order, is_primary)
    VALUES (new_product_id, '/images/products/nalla-karam-podi.webp', 0, true);
  END IF;
END $$;

DO $$
DECLARE
  cat_id UUID;
  new_product_id UUID;
BEGIN
  SELECT id INTO cat_id FROM categories WHERE slug = 'podulu';
  
  INSERT INTO products (slug, name, name_telugu, category_id, description, weights, is_veg, status, is_featured, spice_level)
  VALUES (
    'munagaku-podi', 
    'Munagaku Podi (200g)', 
    NULL, 
    cat_id, 
    'Authentic Munagaku Podi made with traditional Godavari recipe.', 
    '[{"weight":"250g","price":110},{"weight":"500g","price":220},{"weight":"1kg","price":440}]'::jsonb, 
    true, 
    'ACTIVE', 
    false, 
    NULL
  ) ON CONFLICT (slug) DO NOTHING RETURNING id INTO new_product_id;

  IF new_product_id IS NOT NULL THEN
    INSERT INTO product_images (product_id, image_url, sort_order, is_primary)
    VALUES (new_product_id, '/images/products/munagaku-podi.webp', 0, true);
  END IF;
END $$;

DO $$
DECLARE
  cat_id UUID;
  new_product_id UUID;
BEGIN
  SELECT id INTO cat_id FROM categories WHERE slug = 'podulu';
  
  INSERT INTO products (slug, name, name_telugu, category_id, description, weights, is_veg, status, is_featured, spice_level)
  VALUES (
    'kothimera-podi', 
    'Kothimera Podi (200g)', 
    NULL, 
    cat_id, 
    'Authentic Kothimera Podi made with traditional Godavari recipe.', 
    '[{"weight":"250g","price":110},{"weight":"500g","price":220},{"weight":"1kg","price":440}]'::jsonb, 
    true, 
    'ACTIVE', 
    false, 
    NULL
  ) ON CONFLICT (slug) DO NOTHING RETURNING id INTO new_product_id;

  IF new_product_id IS NOT NULL THEN
    INSERT INTO product_images (product_id, image_url, sort_order, is_primary)
    VALUES (new_product_id, '/images/products/kothimera-podi.webp', 0, true);
  END IF;
END $$;

DO $$
DECLARE
  cat_id UUID;
  new_product_id UUID;
BEGIN
  SELECT id INTO cat_id FROM categories WHERE slug = 'podulu';
  
  INSERT INTO products (slug, name, name_telugu, category_id, description, weights, is_veg, status, is_featured, spice_level)
  VALUES (
    'avisa-ginjalu-podi', 
    'Avisa Ginjalu Podi (200g)', 
    NULL, 
    cat_id, 
    'Authentic Avisa Ginjalu Podi made with traditional Godavari recipe.', 
    '[{"weight":"250g","price":110},{"weight":"500g","price":220},{"weight":"1kg","price":440}]'::jsonb, 
    true, 
    'ACTIVE', 
    false, 
    NULL
  ) ON CONFLICT (slug) DO NOTHING RETURNING id INTO new_product_id;

  IF new_product_id IS NOT NULL THEN
    INSERT INTO product_images (product_id, image_url, sort_order, is_primary)
    VALUES (new_product_id, '/images/products/avisa-ginjalu-podi.webp', 0, true);
  END IF;
END $$;

DO $$
DECLARE
  cat_id UUID;
  new_product_id UUID;
BEGIN
  SELECT id INTO cat_id FROM categories WHERE slug = 'podulu';
  
  INSERT INTO products (slug, name, name_telugu, category_id, description, weights, is_veg, status, is_featured, spice_level)
  VALUES (
    'sonti-podi', 
    'Sonti Podi (200g)', 
    NULL, 
    cat_id, 
    'Authentic Sonti Podi made with traditional Godavari recipe.', 
    '[{"weight":"250g","price":120},{"weight":"500g","price":240},{"weight":"1kg","price":480}]'::jsonb, 
    true, 
    'ACTIVE', 
    false, 
    NULL
  ) ON CONFLICT (slug) DO NOTHING RETURNING id INTO new_product_id;

  IF new_product_id IS NOT NULL THEN
    INSERT INTO product_images (product_id, image_url, sort_order, is_primary)
    VALUES (new_product_id, '/images/products/sonti-podi.webp', 0, true);
  END IF;
END $$;

DO $$
DECLARE
  cat_id UUID;
  new_product_id UUID;
BEGIN
  SELECT id INTO cat_id FROM categories WHERE slug = 'podulu';
  
  INSERT INTO products (slug, name, name_telugu, category_id, description, weights, is_veg, status, is_featured, spice_level)
  VALUES (
    'pudina-podi', 
    'Pudina Podi (200g)', 
    NULL, 
    cat_id, 
    'Authentic Pudina Podi made with traditional Godavari recipe.', 
    '[{"weight":"250g","price":110},{"weight":"500g","price":220},{"weight":"1kg","price":440}]'::jsonb, 
    true, 
    'ACTIVE', 
    false, 
    NULL
  ) ON CONFLICT (slug) DO NOTHING RETURNING id INTO new_product_id;

  IF new_product_id IS NOT NULL THEN
    INSERT INTO product_images (product_id, image_url, sort_order, is_primary)
    VALUES (new_product_id, '/images/products/pudina-podi.webp', 0, true);
  END IF;
END $$;

DO $$
DECLARE
  cat_id UUID;
  new_product_id UUID;
BEGIN
  SELECT id INTO cat_id FROM categories WHERE slug = 'podulu';
  
  INSERT INTO products (slug, name, name_telugu, category_id, description, weights, is_veg, status, is_featured, spice_level)
  VALUES (
    'sanagapappu-podi', 
    'Sanagapappu Podi (200g)', 
    NULL, 
    cat_id, 
    'Authentic Sanagapappu Podi made with traditional Godavari recipe.', 
    '[{"weight":"250g","price":110},{"weight":"500g","price":220},{"weight":"1kg","price":440}]'::jsonb, 
    true, 
    'ACTIVE', 
    false, 
    NULL
  ) ON CONFLICT (slug) DO NOTHING RETURNING id INTO new_product_id;

  IF new_product_id IS NOT NULL THEN
    INSERT INTO product_images (product_id, image_url, sort_order, is_primary)
    VALUES (new_product_id, '/images/products/sanagapappu-podi.webp', 0, true);
  END IF;
END $$;

DO $$
DECLARE
  cat_id UUID;
  new_product_id UUID;
BEGIN
  SELECT id INTO cat_id FROM categories WHERE slug = 'podulu';
  
  INSERT INTO products (slug, name, name_telugu, category_id, description, weights, is_veg, status, is_featured, spice_level)
  VALUES (
    'idly-karam-podi', 
    'Idly Karam Podi (200g)', 
    NULL, 
    cat_id, 
    'Authentic Idly Karam Podi made with traditional Godavari recipe.', 
    '[{"weight":"250g","price":110},{"weight":"500g","price":220},{"weight":"1kg","price":440}]'::jsonb, 
    true, 
    'ACTIVE', 
    false, 
    NULL
  ) ON CONFLICT (slug) DO NOTHING RETURNING id INTO new_product_id;

  IF new_product_id IS NOT NULL THEN
    INSERT INTO product_images (product_id, image_url, sort_order, is_primary)
    VALUES (new_product_id, '/images/products/idly-karam-podi.webp', 0, true);
  END IF;
END $$;

DO $$
DECLARE
  cat_id UUID;
  new_product_id UUID;
BEGIN
  SELECT id INTO cat_id FROM categories WHERE slug = 'podulu';
  
  INSERT INTO products (slug, name, name_telugu, category_id, description, weights, is_veg, status, is_featured, spice_level)
  VALUES (
    'kobbari-podi', 
    'Kobbari Podi (200g)', 
    NULL, 
    cat_id, 
    'Authentic Kobbari Podi made with traditional Godavari recipe.', 
    '[{"weight":"250g","price":100},{"weight":"500g","price":200},{"weight":"1kg","price":400}]'::jsonb, 
    true, 
    'ACTIVE', 
    false, 
    NULL
  ) ON CONFLICT (slug) DO NOTHING RETURNING id INTO new_product_id;

  IF new_product_id IS NOT NULL THEN
    INSERT INTO product_images (product_id, image_url, sort_order, is_primary)
    VALUES (new_product_id, '/images/products/kobbari-podi.webp', 0, true);
  END IF;
END $$;

DO $$
DECLARE
  cat_id UUID;
  new_product_id UUID;
BEGIN
  SELECT id INTO cat_id FROM categories WHERE slug = 'podulu';
  
  INSERT INTO products (slug, name, name_telugu, category_id, description, weights, is_veg, status, is_featured, spice_level)
  VALUES (
    'ulli-karam-podi', 
    'Ulli Karam Podi (200g)', 
    NULL, 
    cat_id, 
    'Authentic Ulli Karam Podi made with traditional Godavari recipe.', 
    '[{"weight":"250g","price":110},{"weight":"500g","price":220},{"weight":"1kg","price":440}]'::jsonb, 
    true, 
    'ACTIVE', 
    false, 
    NULL
  ) ON CONFLICT (slug) DO NOTHING RETURNING id INTO new_product_id;

  IF new_product_id IS NOT NULL THEN
    INSERT INTO product_images (product_id, image_url, sort_order, is_primary)
    VALUES (new_product_id, '/images/products/ulli-karam-podi.webp', 0, true);
  END IF;
END $$;

DO $$
DECLARE
  cat_id UUID;
  new_product_id UUID;
BEGIN
  SELECT id INTO cat_id FROM categories WHERE slug = 'podulu';
  
  INSERT INTO products (slug, name, name_telugu, category_id, description, weights, is_veg, status, is_featured, spice_level)
  VALUES (
    'ulavacharu', 
    'Ulavacharu', 
    NULL, 
    cat_id, 
    'Authentic Ulavacharu made with traditional Godavari recipe.', 
    '[{"weight":"250g","price":110},{"weight":"500g","price":220},{"weight":"1kg","price":440}]'::jsonb, 
    true, 
    'ACTIVE', 
    false, 
    NULL
  ) ON CONFLICT (slug) DO NOTHING RETURNING id INTO new_product_id;

  IF new_product_id IS NOT NULL THEN
    INSERT INTO product_images (product_id, image_url, sort_order, is_primary)
    VALUES (new_product_id, '/images/products/ulavacharu.webp', 0, true);
  END IF;
END $$;

DO $$
DECLARE
  cat_id UUID;
  new_product_id UUID;
BEGIN
  SELECT id INTO cat_id FROM categories WHERE slug = 'podulu';
  
  INSERT INTO products (slug, name, name_telugu, category_id, description, weights, is_veg, status, is_featured, spice_level)
  VALUES (
    'nuvvulu-karam-podi', 
    'Nuvvulu Karam Podi (200g)', 
    NULL, 
    cat_id, 
    'Authentic Nuvvulu Karam Podi made with traditional Godavari recipe.', 
    '[{"weight":"250g","price":110},{"weight":"500g","price":220},{"weight":"1kg","price":440}]'::jsonb, 
    true, 
    'ACTIVE', 
    false, 
    NULL
  ) ON CONFLICT (slug) DO NOTHING RETURNING id INTO new_product_id;

  IF new_product_id IS NOT NULL THEN
    INSERT INTO product_images (product_id, image_url, sort_order, is_primary)
    VALUES (new_product_id, '/images/products/nuvvulu-karam-podi.webp', 0, true);
  END IF;
END $$;

DO $$
DECLARE
  cat_id UUID;
  new_product_id UUID;
BEGIN
  SELECT id INTO cat_id FROM categories WHERE slug = 'podulu';
  
  INSERT INTO products (slug, name, name_telugu, category_id, description, weights, is_veg, status, is_featured, spice_level)
  VALUES (
    'junnu-powder', 
    'Junnu Powder (100g)', 
    NULL, 
    cat_id, 
    'Authentic Junnu Powder made with traditional Godavari recipe.', 
    '[{"weight":"250g","price":80},{"weight":"500g","price":160},{"weight":"1kg","price":320}]'::jsonb, 
    true, 
    'ACTIVE', 
    false, 
    NULL
  ) ON CONFLICT (slug) DO NOTHING RETURNING id INTO new_product_id;

  IF new_product_id IS NOT NULL THEN
    INSERT INTO product_images (product_id, image_url, sort_order, is_primary)
    VALUES (new_product_id, '/images/products/junnu-powder.webp', 0, true);
  END IF;
END $$;

DO $$
DECLARE
  cat_id UUID;
  new_product_id UUID;
BEGIN
  SELECT id INTO cat_id FROM categories WHERE slug = 'seeds';
  
  INSERT INTO products (slug, name, name_telugu, category_id, description, weights, is_veg, status, is_featured, spice_level)
  VALUES (
    'pumpkin-seeds', 
    'Pumpkin Seeds', 
    NULL, 
    cat_id, 
    'Premium quality Pumpkin Seeds packed with nutrients.', 
    '[{"weight":"250g","price":160},{"weight":"500g","price":320},{"weight":"1kg","price":640}]'::jsonb, 
    true, 
    'ACTIVE', 
    true, 
    NULL
  ) ON CONFLICT (slug) DO NOTHING RETURNING id INTO new_product_id;

  IF new_product_id IS NOT NULL THEN
    INSERT INTO product_images (product_id, image_url, sort_order, is_primary)
    VALUES (new_product_id, '/images/products/pumpkin-seeds.webp', 0, true);
  END IF;
END $$;

DO $$
DECLARE
  cat_id UUID;
  new_product_id UUID;
BEGIN
  SELECT id INTO cat_id FROM categories WHERE slug = 'seeds';
  
  INSERT INTO products (slug, name, name_telugu, category_id, description, weights, is_veg, status, is_featured, spice_level)
  VALUES (
    'sunflower-seeds', 
    'Sunflower Seeds', 
    NULL, 
    cat_id, 
    'Premium quality Sunflower Seeds packed with nutrients.', 
    '[{"weight":"250g","price":125},{"weight":"500g","price":250},{"weight":"1kg","price":500}]'::jsonb, 
    true, 
    'ACTIVE', 
    false, 
    NULL
  ) ON CONFLICT (slug) DO NOTHING RETURNING id INTO new_product_id;

  IF new_product_id IS NOT NULL THEN
    INSERT INTO product_images (product_id, image_url, sort_order, is_primary)
    VALUES (new_product_id, '/images/products/sunflower-seeds.webp', 0, true);
  END IF;
END $$;

DO $$
DECLARE
  cat_id UUID;
  new_product_id UUID;
BEGIN
  SELECT id INTO cat_id FROM categories WHERE slug = 'seeds';
  
  INSERT INTO products (slug, name, name_telugu, category_id, description, weights, is_veg, status, is_featured, spice_level)
  VALUES (
    'sabja-seeds', 
    'Sabja Seeds', 
    NULL, 
    cat_id, 
    'Premium quality Sabja Seeds packed with nutrients.', 
    '[{"weight":"250g","price":150},{"weight":"500g","price":300},{"weight":"1kg","price":600}]'::jsonb, 
    true, 
    'ACTIVE', 
    false, 
    NULL
  ) ON CONFLICT (slug) DO NOTHING RETURNING id INTO new_product_id;

  IF new_product_id IS NOT NULL THEN
    INSERT INTO product_images (product_id, image_url, sort_order, is_primary)
    VALUES (new_product_id, '/images/products/sabja-seeds.webp', 0, true);
  END IF;
END $$;

DO $$
DECLARE
  cat_id UUID;
  new_product_id UUID;
BEGIN
  SELECT id INTO cat_id FROM categories WHERE slug = 'seeds';
  
  INSERT INTO products (slug, name, name_telugu, category_id, description, weights, is_veg, status, is_featured, spice_level)
  VALUES (
    'chia-seeds', 
    'Chia Seeds', 
    NULL, 
    cat_id, 
    'Premium quality Chia Seeds packed with nutrients.', 
    '[{"weight":"250g","price":150},{"weight":"500g","price":300},{"weight":"1kg","price":600}]'::jsonb, 
    true, 
    'ACTIVE', 
    false, 
    NULL
  ) ON CONFLICT (slug) DO NOTHING RETURNING id INTO new_product_id;

  IF new_product_id IS NOT NULL THEN
    INSERT INTO product_images (product_id, image_url, sort_order, is_primary)
    VALUES (new_product_id, '/images/products/chia-seeds.webp', 0, true);
  END IF;
END $$;

DO $$
DECLARE
  cat_id UUID;
  new_product_id UUID;
BEGIN
  SELECT id INTO cat_id FROM categories WHERE slug = 'seeds';
  
  INSERT INTO products (slug, name, name_telugu, category_id, description, weights, is_veg, status, is_featured, spice_level)
  VALUES (
    'flax-seeds', 
    'Flax Seeds', 
    NULL, 
    cat_id, 
    'Premium quality Flax Seeds packed with nutrients.', 
    '[{"weight":"250g","price":125},{"weight":"500g","price":250},{"weight":"1kg","price":500}]'::jsonb, 
    true, 
    'ACTIVE', 
    true, 
    NULL
  ) ON CONFLICT (slug) DO NOTHING RETURNING id INTO new_product_id;

  IF new_product_id IS NOT NULL THEN
    INSERT INTO product_images (product_id, image_url, sort_order, is_primary)
    VALUES (new_product_id, '/images/products/flax-seeds.webp', 0, true);
  END IF;
END $$;

DO $$
DECLARE
  cat_id UUID;
  new_product_id UUID;
BEGIN
  SELECT id INTO cat_id FROM categories WHERE slug = 'jellies';
  
  INSERT INTO products (slug, name, name_telugu, category_id, description, weights, is_veg, status, is_featured, spice_level)
  VALUES (
    'bellam-mamidi-thandra', 
    'Bellam Mamidi Thandra', 
    NULL, 
    cat_id, 
    'Traditional and sweet Bellam Mamidi Thandra.', 
    '[{"weight":"250g","price":90},{"weight":"500g","price":180},{"weight":"1kg","price":360}]'::jsonb, 
    true, 
    'ACTIVE', 
    true, 
    NULL
  ) ON CONFLICT (slug) DO NOTHING RETURNING id INTO new_product_id;

  IF new_product_id IS NOT NULL THEN
    INSERT INTO product_images (product_id, image_url, sort_order, is_primary)
    VALUES (new_product_id, '/images/products/bellam-mamidi-thandra.webp', 0, true);
  END IF;
END $$;

DO $$
DECLARE
  cat_id UUID;
  new_product_id UUID;
BEGIN
  SELECT id INTO cat_id FROM categories WHERE slug = 'jellies';
  
  INSERT INTO products (slug, name, name_telugu, category_id, description, weights, is_veg, status, is_featured, spice_level)
  VALUES (
    'sugar-mamidi-thandra', 
    'Sugar Mamidi Thandra', 
    NULL, 
    cat_id, 
    'Traditional and sweet Sugar Mamidi Thandra.', 
    '[{"weight":"250g","price":90},{"weight":"500g","price":180},{"weight":"1kg","price":360}]'::jsonb, 
    true, 
    'ACTIVE', 
    true, 
    NULL
  ) ON CONFLICT (slug) DO NOTHING RETURNING id INTO new_product_id;

  IF new_product_id IS NOT NULL THEN
    INSERT INTO product_images (product_id, image_url, sort_order, is_primary)
    VALUES (new_product_id, '/images/products/sugar-mamidi-thandra.webp', 0, true);
  END IF;
END $$;

DO $$
DECLARE
  cat_id UUID;
  new_product_id UUID;
BEGIN
  SELECT id INTO cat_id FROM categories WHERE slug = 'jellies';
  
  INSERT INTO products (slug, name, name_telugu, category_id, description, weights, is_veg, status, is_featured, spice_level)
  VALUES (
    'guava-jelly', 
    'Guava Jelly', 
    NULL, 
    cat_id, 
    'Traditional and sweet Guava Jelly.', 
    '[{"weight":"250g","price":120},{"weight":"500g","price":240},{"weight":"1kg","price":480}]'::jsonb, 
    true, 
    'ACTIVE', 
    false, 
    NULL
  ) ON CONFLICT (slug) DO NOTHING RETURNING id INTO new_product_id;

  IF new_product_id IS NOT NULL THEN
    INSERT INTO product_images (product_id, image_url, sort_order, is_primary)
    VALUES (new_product_id, '/images/products/guava-jelly.webp', 0, true);
  END IF;
END $$;

DO $$
DECLARE
  cat_id UUID;
  new_product_id UUID;
BEGIN
  SELECT id INTO cat_id FROM categories WHERE slug = 'jellies';
  
  INSERT INTO products (slug, name, name_telugu, category_id, description, weights, is_veg, status, is_featured, spice_level)
  VALUES (
    'strawberry-jelly', 
    'Strawberry Jelly', 
    NULL, 
    cat_id, 
    'Traditional and sweet Strawberry Jelly.', 
    '[{"weight":"250g","price":120},{"weight":"500g","price":240},{"weight":"1kg","price":480}]'::jsonb, 
    true, 
    'ACTIVE', 
    false, 
    NULL
  ) ON CONFLICT (slug) DO NOTHING RETURNING id INTO new_product_id;

  IF new_product_id IS NOT NULL THEN
    INSERT INTO product_images (product_id, image_url, sort_order, is_primary)
    VALUES (new_product_id, '/images/products/strawberry-jelly.webp', 0, true);
  END IF;
END $$;

DO $$
DECLARE
  cat_id UUID;
  new_product_id UUID;
BEGIN
  SELECT id INTO cat_id FROM categories WHERE slug = 'jellies';
  
  INSERT INTO products (slug, name, name_telugu, category_id, description, weights, is_veg, status, is_featured, spice_level)
  VALUES (
    'green-mango-jelly', 
    'Green Mango Jelly', 
    NULL, 
    cat_id, 
    'Traditional and sweet Green Mango Jelly.', 
    '[{"weight":"250g","price":120},{"weight":"500g","price":240},{"weight":"1kg","price":480}]'::jsonb, 
    true, 
    'ACTIVE', 
    false, 
    NULL
  ) ON CONFLICT (slug) DO NOTHING RETURNING id INTO new_product_id;

  IF new_product_id IS NOT NULL THEN
    INSERT INTO product_images (product_id, image_url, sort_order, is_primary)
    VALUES (new_product_id, '/images/products/green-mango-jelly.webp', 0, true);
  END IF;
END $$;

DO $$
DECLARE
  cat_id UUID;
  new_product_id UUID;
BEGIN
  SELECT id INTO cat_id FROM categories WHERE slug = 'jellies';
  
  INSERT INTO products (slug, name, name_telugu, category_id, description, weights, is_veg, status, is_featured, spice_level)
  VALUES (
    'mixed-jelly-box', 
    'Mixed Jelly Box (500g)', 
    NULL, 
    cat_id, 
    'Traditional and sweet Mixed Jelly Box.', 
    '[{"weight":"500g","price":240},{"weight":"1kg","price":480}]'::jsonb, 
    true, 
    'ACTIVE', 
    false, 
    NULL
  ) ON CONFLICT (slug) DO NOTHING RETURNING id INTO new_product_id;

  IF new_product_id IS NOT NULL THEN
    INSERT INTO product_images (product_id, image_url, sort_order, is_primary)
    VALUES (new_product_id, '/images/products/mixed-jelly-box.webp', 0, true);
  END IF;
END $$;

DO $$
DECLARE
  cat_id UUID;
  new_product_id UUID;
BEGIN
  SELECT id INTO cat_id FROM categories WHERE slug = 'jellies';
  
  INSERT INTO products (slug, name, name_telugu, category_id, description, weights, is_veg, status, is_featured, spice_level)
  VALUES (
    'thati-thandra', 
    'Thati Thandra', 
    NULL, 
    cat_id, 
    'Traditional and sweet Thati Thandra.', 
    '[{"weight":"250g","price":130},{"weight":"500g","price":260},{"weight":"1kg","price":520}]'::jsonb, 
    true, 
    'ACTIVE', 
    false, 
    NULL
  ) ON CONFLICT (slug) DO NOTHING RETURNING id INTO new_product_id;

  IF new_product_id IS NOT NULL THEN
    INSERT INTO product_images (product_id, image_url, sort_order, is_primary)
    VALUES (new_product_id, '/images/products/thati-thandra.webp', 0, true);
  END IF;
END $$;
