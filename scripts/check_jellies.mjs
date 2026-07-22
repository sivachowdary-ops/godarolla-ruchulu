import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

async function run() {
  const { data: products, error } = await supabase
    .from('products')
    .select('slug, image_url')
    .in('slug', ['guava-jelly', 'strawberry-jelly', 'green-mango-jelly', 'mixed-jelly-box', 'thati-thandra']);
    
  console.log(products);
}

run().catch(console.error);
