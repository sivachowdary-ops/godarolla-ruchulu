import { getProducts } from '@/lib/services/productsService';
import { ProductCard } from '@/components/product/ProductCard';
import Link from 'next/link';
import { ArrowRight, Sparkles } from 'lucide-react';

export async function BestSellers() {
  const allProducts = await getProducts();
  const bestSellers = allProducts.filter(p => p.isActive && p.isBestSeller);

  return (
    <section className="py-16 md:py-20 bg-white">
      <div className="container mx-auto px-4 md:px-8">
        {/* Section Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 mb-4">
            <Sparkles className="w-5 h-5 text-accent-gold" />
            <span className="ribbon rounded">Popular</span>
            <Sparkles className="w-5 h-5 text-accent-gold" />
          </div>
          <h2 className="font-heading text-3xl md:text-4xl font-bold text-text-charcoal mt-4">
            Our Best Sellers
          </h2>
          <p className="text-text-muted mt-3 max-w-lg mx-auto">
            The most loved items from our collection — tried, tasted, and adored by our customers.
          </p>
          <div className="section-divider mt-6" />
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {bestSellers.map((product, index) => (
            <div
              key={product.id}
              className="fade-in-up"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <ProductCard product={product} />
            </div>
          ))}
        </div>

        {/* View All CTA */}
        <div className="text-center mt-10">
          <Link
            href="/products"
            className="inline-flex items-center gap-2 px-8 py-3.5 bg-text-charcoal text-white font-semibold rounded-lg hover:bg-text-charcoal/90 transition-all duration-300 shadow-lg hover:shadow-xl hover:-translate-y-0.5"
          >
            View All Products
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
