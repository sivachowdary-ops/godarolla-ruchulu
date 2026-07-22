/**
 * Shared validation rules for the application.
 */

export function validateProductData(formData: FormData) {
  const name = formData.get('name') as string;
  if (!name || name.trim() === '') throw new Error('Please enter a product name.');
  
  const category_id = formData.get('category_id') as string;
  if (!category_id || category_id.trim() === '') throw new Error('Please select a category.');

  const description = formData.get('description') as string;
  if (!description || description.trim() === '') throw new Error('Please enter a product description.');

  const price250gStr = formData.get('price250g') as string;
  const price500gStr = formData.get('price500g') as string;
  const price1kgStr = formData.get('price1kg') as string;
  
  const isPriceTBD = formData.get('is_price_tbd') === 'true';

  let price250g = null;
  let price500g = null;
  let price1kg = null;

  if (!isPriceTBD) {
    if (!price250gStr || price250gStr.trim() === '') {
      throw new Error('Please enter a 250g price.');
    }
    price250g = parseFloat(price250gStr);
    if (isNaN(price250g) || price250g < 0) throw new Error('250g price must be a valid positive number.');

    // 500g is optional, automatically calculate if not provided
    if (price500gStr && price500gStr.trim() !== '') {
      price500g = parseFloat(price500gStr);
      if (isNaN(price500g) || price500g < 0) throw new Error('500g price must be a valid positive number.');
    } else {
      price500g = price250g * 2;
    }

    // 1kg is optional, automatically calculate if not provided
    if (price1kgStr && price1kgStr.trim() !== '') {
      price1kg = parseFloat(price1kgStr);
      if (isNaN(price1kg) || price1kg < 0) throw new Error('1kg price must be a valid positive number.');
    } else {
      price1kg = price250g * 4;
    }
  }

  return { name, category_id, description, price250g, price500g, price1kg, isPriceTBD };
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
