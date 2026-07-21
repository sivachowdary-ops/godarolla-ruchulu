/**
 * Shared validation rules for the application.
 */

export function validateProductData(formData: FormData) {
  const name = formData.get('name') as string;
  if (!name || name.trim() === '') throw new Error('Product name is required');
  
  const price250gStr = formData.get('price250g') as string;
  const price500gStr = formData.get('price500g') as string;
  const price1kgStr = formData.get('price1kg') as string;
  
  const isPriceTBD = formData.get('is_price_tbd') === 'true';

  let price250g = null;
  let price500g = null;
  let price1kg = null;

  if (!isPriceTBD) {
    price250g = parseFloat(price250gStr);
    price500g = parseFloat(price500gStr);
    price1kg = parseFloat(price1kgStr);
    if (isNaN(price250g) || price250g < 0) throw new Error('250g Price must be a positive number');
    if (isNaN(price500g) || price500g < 0) throw new Error('500g Price must be a positive number');
    if (isNaN(price1kg) || price1kg < 0) throw new Error('1kg Price must be a positive number');
  }

  return { name, price250g, price500g, price1kg, isPriceTBD };
}

export function validateImage(imageFile: File | null) {
  if (!imageFile) return;
  const MAX_SIZE = 5 * 1024 * 1024; // 5MB
  if (imageFile.size > MAX_SIZE) {
    throw new Error('Image size must be less than 5MB');
  }
  if (!imageFile.type.startsWith('image/')) {
    throw new Error('File must be an image');
  }
}
