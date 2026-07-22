import fs from 'fs';
import path from 'path';

const dir = 'd:/Work/Projects/godarolla-ruchulu/godarolla-ruchulu/public/images/products';
const files = fs.readdirSync(dir);
let deletedCount = 0;

for (const file of files) {
  if (file.match(/\.(jpg|jpeg|png)$/i)) {
    const filePath = path.join(dir, file);
    fs.unlinkSync(filePath);
    deletedCount++;
  }
}
console.log(`Successfully deleted ${deletedCount} obsolete image files.`);
