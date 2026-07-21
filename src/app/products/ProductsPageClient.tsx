'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { Product } from '@/types';
import { CategoryTabs } from '@/components/product/CategoryTabs';
import { ProductGrid } from '@/components/product/ProductGrid';
import { ShieldCheck, Info } from 'lucide-react';
import { siteConfig } from '@/config/site';

interface ProductsPageClientProps {
  products: Product[];
}

export function ProductsPageClient({ products }: ProductsPageClientProps) {
  const searchParams = useSearchParams();
  const [activeCategory, setActiveCategory] = useState<string>('all');

  // Sync tab with URL query parameter
  useEffect(() => {
    const categoryQuery = searchParams.get('category');
    if (categoryQuery) {
      setActiveCategory(categoryQuery as string);
    } else {
      setActiveCategory('all');
    }
  }, [searchParams]);

  // Filter products based on active category
  const filteredProducts = products.filter((product) => {
    // Basic active check (hide TBD products that are inactive until pricing is confirmed)
    if (!product.isActive && product.isPriceTBD) return false;

    if (activeCategory === 'veg') return product.category === 'veg';
    if (activeCategory === 'nonveg') return product.category === 'nonveg';
    if (activeCategory === 'podulu') return product.category === 'podulu';
    if (activeCategory === 'seeds') return product.category === 'seeds';
    if (activeCategory === 'jellies') return product.category === 'jellies';
    return true;
  });

  return (
    <div className="container mx-auto px-4 md:px-8 py-10">
      {/* Page Header */}
      <div className="text-center max-w-xl mx-auto mb-8">
        <h1 className="font-heading font-extrabold text-3xl md:text-4xl text-text-charcoal">
          Pickles Catalog
        </h1>
        <p className="text-text-muted text-sm md:text-base mt-2">
          Explore our traditional Andhra pickles. Pick from raw mango, garlic, sorrel leaf, spiced chicken, prawn, and more.
        </p>
        <div className="section-divider mt-4" />
      </div>

      {/* Category Tabs */}
      <CategoryTabs
        activeCategory={activeCategory}
        onCategoryChange={setActiveCategory}
      />

      {/* Disclaimers strip */}
      <div className="max-w-4xl mx-auto mb-8 grid grid-cols-1 sm:grid-cols-2 gap-3 p-4 bg-bg-cream rounded-xl border border-border-warm text-xs md:text-sm font-body text-text-muted">
        <div className="flex items-start gap-2">
          <ShieldCheck className="w-4 h-4 text-primary-green shrink-0 mt-0.5" />
          <span>
            <strong>Fresh & Homemade:</strong> Made in small batches using traditional Godavari recipes. No artificial preservatives or colors.
          </span>
        </div>
        <div className="flex items-start gap-2">
          <Info className="w-4 h-4 text-primary-red shrink-0 mt-0.5" />
          <span>
            <strong>Order confirmation:</strong> {siteConfig.packingChargesNote}. Prices updated live. Packaging & delivery charges will be confirmed on WhatsApp.
          </span>
        </div>
      </div>

      {/* Product Grid */}
      <div className="max-w-6xl mx-auto">
        <ProductGrid products={filteredProducts} />
      </div>
    </div>
  );
}
