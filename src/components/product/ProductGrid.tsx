'use client';

import { Product } from '@/types';
import { ProductCard } from './ProductCard';

interface ProductGridProps {
  products: Product[];
}

export function ProductGrid({ products }: ProductGridProps) {
  if (products.length === 0) {
    return (
      <div className="w-full text-center py-16 px-4 bg-white rounded-2xl border border-border-warm max-w-xl mx-auto shadow-sm">
        <span className="text-5xl block mb-4">🌶️</span>
        <h3 className="font-heading font-extrabold text-xl text-text-charcoal mb-2">
          No Pickles Found
        </h3>
        <p className="text-text-muted text-sm leading-relaxed">
          We couldn't find any pickles matching your filter selection. Try selecting a different category or check back later!
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
      {products.map((product, index) => (
        <div
          key={product.id}
          className="fade-in-up"
          style={{ animationDelay: `${index * 50}ms` }}
        >
          <ProductCard product={product} />
        </div>
      ))}
    </div>
  );
}
