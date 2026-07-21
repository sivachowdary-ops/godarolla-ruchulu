import React from 'react';
import { getProducts } from '@/lib/services/productsService';
import { getCategories } from '@/lib/services/categoriesService';
import ProductsClient from './ProductsClient';

export const dynamic = 'force-dynamic'; // Ensure fresh data on admin side

export default async function AdminProductsPage() {
  const [products, categories] = await Promise.all([
    getProducts(),
    getCategories()
  ]);

  return <ProductsClient initialProducts={products} categories={categories} />;
}
