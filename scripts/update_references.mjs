import fs from 'fs';

const filesToUpdate = [
  'd:/Work/Projects/godarolla-ruchulu/godarolla-ruchulu/supabase/schema.sql',
  'd:/Work/Projects/godarolla-ruchulu/godarolla-ruchulu/src/data/products.ts',
  'd:/Work/Projects/godarolla-ruchulu/godarolla-ruchulu/src/lib/utils/mapper.ts',
  'd:/Work/Projects/godarolla-ruchulu/godarolla-ruchulu/src/app/admin/products/ProductsClient.tsx'
];

for (const filePath of filesToUpdate) {
  let content = fs.readFileSync(filePath, 'utf8');
  // Replace .jpg and .png specifically in /images/products/ paths
  content = content.replace(/\/images\/products\/([^'"]+)\.(jpg|jpeg|png)/gi, '/images/products/$1.webp');
  fs.writeFileSync(filePath, content, 'utf8');
  console.log(`Updated ${filePath}`);
}
