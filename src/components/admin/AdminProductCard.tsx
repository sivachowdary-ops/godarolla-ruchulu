import { useState } from 'react';
import Image from 'next/image';
import { Product, WeightTier } from '@/types';
import { getPrice, formatPriceString as formatPrice } from '@/lib/utils';
import { ShieldAlert } from 'lucide-react';

interface AdminProductCardProps {
  product: Product;
}

export function AdminProductCard({ product }: AdminProductCardProps) {
  const [selectedWeight, setSelectedWeight] = useState<WeightTier>('250g');
  const [imageError, setImageError] = useState(false);

  const price = getPrice(product, selectedWeight);
  const weights: WeightTier[] = ['250g', '500g', '1kg'];

  return (
    <div className="bg-white rounded-xl overflow-hidden shadow-sm border border-border-warm flex flex-col h-full p-3 md:p-4">
      {/* Product Image */}
      <div className="relative aspect-square w-full overflow-hidden rounded-lg bg-bg-cream-dark">
        {imageError ? (
          <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-bg-cream to-accent-gold/10 text-text-charcoal p-4 text-center">
            <span className="text-4xl mb-2">🌶️</span>
            <span className="text-xs font-semibold">{product.name}</span>
          </div>
        ) : (
          <Image
            src={product.image || `/images/products/${product.slug}.jpg`}
            alt={product.name}
            fill
            sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
            className="object-cover"
            onError={() => setImageError(true)}
            priority={product.isBestSeller}
          />
        )}

        {/* Best seller ribbon */}
        {product.isBestSeller && (
          <div className="absolute top-2 left-2 bg-accent-gold text-text-charcoal text-[10px] font-bold px-2 py-1 rounded shadow-sm uppercase tracking-wider">
            Best Seller ⭐
          </div>
        )}
      </div>

      {/* Product Info */}
      <div className="flex flex-col flex-grow mt-3">
        {/* Veg/Non-Veg Badges */}
        <div className="mb-2">
          {product.isVeg ? (
            <span className="badge-veg">🌿 Veg</span>
          ) : (
            <span className="badge-nonveg">🍖 Non-Veg</span>
          )}
        </div>

        {/* Title */}
        <div>
          <h3 className="font-heading font-extrabold text-base md:text-lg text-text-charcoal line-clamp-1 leading-snug">
            {product.name}
          </h3>
          {product.nameTelugu && (
            <p className="font-telugu text-xs text-text-muted mt-0.5 line-clamp-1">
              {product.nameTelugu}
            </p>
          )}
        </div>

        {/* Description */}
        <p className="text-xs text-text-muted mt-2 line-clamp-2 leading-relaxed flex-grow">
          {product.description}
        </p>

        {/* Pricing Section (Preview Only) */}
        <div className="mt-4 pt-3 border-t border-border-warm">
          {product.isPriceTBD ? (
            <div className="flex flex-col gap-2">
              <span className="text-xs text-primary-red font-semibold flex items-center gap-1">
                <ShieldAlert className="w-3.5 h-3.5" /> Price coming soon
              </span>
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              {/* Weight Selector */}
              <div className="flex gap-1.5 justify-between">
                {weights.map((w) => {
                  const isSelected = selectedWeight === w;
                  return (
                    <div
                      key={w}
                      onClick={() => setSelectedWeight(w)}
                      className={`flex-1 py-1 rounded-md text-xs font-bold transition-all cursor-pointer text-center flex items-center justify-center min-h-[44px] md:min-h-[36px] border ${isSelected
                        ? 'bg-primary-red border-primary-red text-white'
                        : 'bg-bg-cream border-border-warm text-text-charcoal'
                        }`}
                    >
                      {w}
                    </div>
                  );
                })}
              </div>

              {/* Price Display */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-2 mt-2">
                <div className="flex flex-col">
                  <span className="text-[10px] text-text-muted uppercase font-bold tracking-wider">Price</span>
                  <span className="price-tag text-lg md:text-xl font-extrabold leading-none">
                    {formatPrice(price)}
                  </span>
                </div>
                
                {/* Visual purely for preview */}
                <div className="w-full sm:w-auto px-4 py-2.5 rounded-lg text-sm md:text-xs font-bold bg-gray-200 text-gray-500 cursor-not-allowed text-center">
                  Preview Mode
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
