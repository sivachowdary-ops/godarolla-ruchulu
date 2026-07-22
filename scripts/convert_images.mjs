import fs from 'fs';
import path from 'path';
import sharp from 'sharp';

const dir = 'd:/Work/Projects/godarolla-ruchulu/godarolla-ruchulu/public/images/products';

async function main() {
  const files = fs.readdirSync(dir);
  console.log(`Found ${files.length} files in ${dir}`);
  let count = 0;
  for (const file of files) {
    if (file.match(/\.(jpg|jpeg|png)$/i)) {
      const filePath = path.join(dir, file);
      const parsed = path.parse(file);
      const outPath = path.join(dir, parsed.name + '.webp');
      console.log(`Converting ${file} to ${parsed.name}.webp...`);
      await sharp(filePath)
        .webp({ quality: 85 })
        .toFile(outPath);
      count++;
    }
  }
  console.log(`Conversion complete. Converted ${count} files.`);
}

main().catch(console.error);
