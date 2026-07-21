import fs from 'fs';
import { products } from '../src/data/products';

function escapeString(str: string | undefined): string {
  if (!str) return 'NULL';
  return `'${str.replace(/'/g, "''")}'`;
}

function generateSQL() {
  let sql = `-- ==========================================
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
`;

  const uniqueCategories = Array.from(new Set(products.map(p => p.category)));
  
  // Seed categories
  sql += `\n-- Seed Categories\n`;
  uniqueCategories.forEach((catSlug, index) => {
    let catName = catSlug.charAt(0).toUpperCase() + catSlug.slice(1);
    if (catSlug === 'nonveg') catName = 'Non-Veg';
    if (catSlug === 'veg') catName = 'Veg';
    
    sql += `INSERT INTO categories (name, slug, display_order) VALUES (${escapeString(catName)}, ${escapeString(catSlug)}, ${index}) ON CONFLICT (slug) DO NOTHING;\n`;
  });

  // Seed products
  sql += `\n-- Seed Products and Images\n`;
  products.forEach(p => {
    const weights: any[] = [];
    if (p.price250g !== null) weights.push({ weight: '250g', price: p.price250g });
    if (p.price500g !== null) weights.push({ weight: '500g', price: p.price500g });
    if (p.price1kg !== null) weights.push({ weight: '1kg', price: p.price1kg });

    const status = p.isActive ? 'ACTIVE' : 'ARCHIVED';
    const isFeatured = p.isBestSeller ? true : false;
    
    sql += `
DO $$
DECLARE
  cat_id UUID;
  new_product_id UUID;
BEGIN
  SELECT id INTO cat_id FROM categories WHERE slug = ${escapeString(p.category)};
  
  INSERT INTO products (slug, name, name_telugu, category_id, description, weights, is_veg, status, is_featured, spice_level)
  VALUES (
    ${escapeString(p.slug)}, 
    ${escapeString(p.name)}, 
    ${escapeString(p.nameTelugu)}, 
    cat_id, 
    ${escapeString(p.description)}, 
    ${escapeString(JSON.stringify(weights))}::jsonb, 
    ${p.isVeg}, 
    ${escapeString(status)}, 
    ${isFeatured}, 
    ${escapeString(p.spiceLevel)}
  ) ON CONFLICT (slug) DO NOTHING RETURNING id INTO new_product_id;

  IF new_product_id IS NOT NULL THEN
    INSERT INTO product_images (product_id, image_url, sort_order, is_primary)
    VALUES (new_product_id, ${escapeString(p.image)}, 0, true);
  END IF;
END $$;
`;
  });

  fs.writeFileSync('supabase/schema.sql', sql);
  console.log('supabase/schema.sql generated successfully.');
}

generateSQL();
