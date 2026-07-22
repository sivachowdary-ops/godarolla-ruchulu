import { Suspense } from 'react';
import { getProducts } from '@/lib/services/productsService';
import { ProductsPageClient } from './ProductsPageClient';

export default async function ProductsPage() {
  const products = await getProducts();

  return (
    <Suspense fallback={
      <div className="container mx-auto px-4 py-20 text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-red mx-auto mb-4" />
        <p className="text-text-muted font-semibold">Loading Catalog...</p>
      </div>
    }>
      <ProductsPageClient products={products} />
    </Suspense>
  );
}
