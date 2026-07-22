import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

async function run() {
  const { data: products, error } = await supabase
    .from('products')
    .select('id, slug, image_url');

  if (error) {
    console.error('Error fetching products:', error);
    return;
  }

  let count = 0;
  for (const product of products) {
    if (product.image_url && (product.image_url.endsWith('.jpg') || product.image_url.endsWith('.jpeg') || product.image_url.endsWith('.png'))) {
      const newUrl = product.image_url.replace(/\.(jpg|jpeg|png)$/i, '.webp');
      
      const { error: updateError } = await supabase
        .from('products')
        .update({ image_url: newUrl })
        .eq('id', product.id);
        
      if (updateError) {
        console.error(`Failed to update ${product.slug}:`, updateError);
      } else {
        console.log(`Updated ${product.slug}: ${product.image_url} -> ${newUrl}`);
        count++;
      }
    }
  }
  console.log(`Successfully updated ${count} products.`);
}

run().catch(console.error);
