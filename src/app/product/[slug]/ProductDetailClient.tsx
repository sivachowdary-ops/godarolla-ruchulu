'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { useCart } from '@/context/CartContext';
import { Product, WeightTier } from '@/types';
import { buildWhatsAppInquiryUrl, formatCurrency, getPrice, formatPriceString as formatPrice } from '@/lib/utils';
import { siteConfig } from '@/config/site';
import {
  ShoppingCart,
  Check,
  ArrowLeft,
  ShieldCheck,
  Plane,
  Plus,
  Minus,
  AlertTriangle,
} from 'lucide-react';
import { WhatsAppIcon } from '@/components/ui/WhatsAppIcon';

interface ProductDetailClientProps {
  product: Product | null;
  relatedProducts: Product[];
}

export function ProductDetailClient({ product, relatedProducts }: ProductDetailClientProps) {
  const router = useRouter();
  const { addToCart } = useCart();

  const [selectedWeight, setSelectedWeight] = useState<WeightTier>('250g');
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);
  const [imageError, setImageError] = useState(false);

  // Redirect if product not found
  useEffect(() => {
    if (!product) {
      router.push('/products');
    }
  }, [product, router]);

  if (!product) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-red mx-auto mb-4" />
        <p className="text-text-muted">Loading product details...</p>
      </div>
    );
  }

  const price = getPrice(product, selectedWeight);
  const totalItemPrice = price ? price * quantity : null;

  const handleQuantityChange = (val: number) => {
    if (val < 1) return;
    setQuantity(val);
  };

  const handleAddToCart = () => {
    if (product.isPriceTBD || price === null) return;
    addToCart(product, selectedWeight, quantity);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  const handleWhatsAppInquiry = () => {
    const url = buildWhatsAppInquiryUrl(product.name);
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const weights: WeightTier[] = ['250g', '500g', '1kg'];

  return (
    <div className="bg-bg-cream/20 py-10 font-body">
      {/* Dynamic SEO JSON-LD Schema */}
      {!product.isPriceTBD && price && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'Product',
              name: product.name,
              image: `${siteConfig.url}${product.image}`,
              description: product.description,
              category: product.category === 'veg' ? 'Vegetarian' : 'Non-Vegetarian',
              brand: {
                '@type': 'Brand',
                name: siteConfig.name,
              },
              offers: {
                '@type': 'Offer',
                price: price,
                priceCurrency: 'INR',
                availability: 'https://schema.org/InStock',
                url: `${siteConfig.url}/product/${product.slug}`,
              },
            }),
          }}
        />
      )}

      <div className="container mx-auto px-4 md:px-8">
        {/* Back Link */}
        <Link
          href="/products"
          className="inline-flex items-center gap-2 text-sm font-semibold text-text-muted hover:text-primary-red transition-colors mb-8 cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Catalog</span>
        </Link>

        {/* Product Details Section */}
        <div className="bg-white rounded-2xl border border-border-warm shadow-sm overflow-hidden p-4 md:p-8 max-w-5xl mx-auto mb-16">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
            
            {/* Col 1: Product Image */}
            <div className="relative aspect-square w-full rounded-xl overflow-hidden bg-bg-cream-dark border border-border-warm">
              {imageError ? (
                <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-bg-cream to-accent-gold/25 text-text-charcoal p-4 text-center">
                  <span className="text-6xl mb-3">🌶️</span>
                  <h3 className="font-heading font-extrabold text-xl">{product.name}</h3>
                  <p className="font-telugu text-sm text-text-muted mt-1">{product.nameTelugu}</p>
                </div>
              ) : (
                <Image
                  src={product.image}
                  alt={product.name}
                  fill
                  priority
                  className="object-cover"
                  onError={() => setImageError(true)}
                />
              )}
            </div>

            {/* Col 2: Product Actions / Description */}
            <div className="flex flex-col justify-between">
              <div>
                {/* Veg / Non-veg Badge */}
                <div className="mb-3 flex items-center gap-2">
                  {product.isVeg ? (
                    <span className="badge-veg">🌿 Vegetarian</span>
                  ) : (
                    <span className="badge-nonveg">🍖 Non-Vegetarian</span>
                  )}
                  {product.isBestSeller && (
                    <span className="bg-accent-gold/25 text-accent-gold-dark text-xs font-bold px-2 py-0.5 rounded-full">
                      ⭐ Best Seller
                    </span>
                  )}
                </div>

                {/* Heading */}
                <h1 className="font-heading font-extrabold text-3xl md:text-4xl text-text-charcoal leading-tight">
                  {product.name}
                </h1>
                {product.nameTelugu && (
                  <p className="font-telugu text-lg text-primary-green font-bold mt-1">
                    {product.nameTelugu}
                  </p>
                )}

                {/* Description */}
                <div className="mt-6">
                  <h4 className="font-bold text-xs uppercase text-text-muted tracking-wider mb-2">Description</h4>
                  <p className="text-text-charcoal text-sm leading-relaxed">
                    {product.description}
                  </p>
                </div>

                {/* Ingredients & Details */}
                <div className="mt-6 flex flex-wrap gap-y-3 gap-x-6 text-xs text-text-muted">
                  <div className="flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4 text-primary-green" />
                    <span>No Artificial Preservatives</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Plane className="w-4 h-4 text-primary-green" />
                    <span>Abroad Packing Safe</span>
                  </div>
                </div>
              </div>

              {/* Action Box */}
              <div className="mt-8 pt-6 border-t border-border-warm">
                {product.isPriceTBD ? (
                  /* Pricing unconfirmed placeholder */
                  <div className="bg-bg-cream border border-border-warm rounded-xl p-4 flex flex-col gap-3">
                    <div className="flex gap-2 text-primary-red">
                      <AlertTriangle className="w-5 h-5 shrink-0" />
                      <div>
                        <p className="font-bold text-sm">Pricing to be confirmed</p>
                        <p className="text-xs text-text-muted mt-0.5">We are updating the price for this item. Contact us below to order or enquire.</p>
                      </div>
                    </div>
                    <button
                      onClick={handleWhatsAppInquiry}
                      className="flex items-center justify-center gap-2 w-full py-3 bg-whatsapp hover:bg-whatsapp-dark text-white rounded-lg font-bold text-sm shadow transition-colors cursor-pointer"
                    >
                      <WhatsAppIcon className="w-4 h-4" />
                      Inquire via WhatsApp
                    </button>
                  </div>
                ) : (
                  /* Standard product pricing and checkout selectors */
                  <div className="flex flex-col gap-5">
                    {/* Weight selector */}
                    <div className="flex flex-col gap-2">
                      <span className="text-xs font-bold uppercase text-text-muted tracking-wider">Select Weight Pack</span>
                      <div className="flex gap-3 max-w-sm">
                        {weights.map((w) => {
                          const isSelected = selectedWeight === w;
                          return (
                            <button
                              key={w}
                              type="button"
                              onClick={() => setSelectedWeight(w)}
                              className={`flex-1 py-2.5 rounded-lg text-sm font-bold border transition-all cursor-pointer min-h-[42px] ${
                                isSelected
                                  ? 'bg-primary-red border-primary-red text-white shadow-md'
                                  : 'bg-bg-cream border-border-warm text-text-charcoal hover:bg-bg-cream-dark'
                              }`}
                            >
                              {w}
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* Quantity Selector & Price Summary */}
                    <div className="flex flex-wrap items-center justify-between gap-4 py-3 border-t border-b border-bg-cream-dark">
                      {/* Quantity stepper */}
                      <div className="flex flex-col gap-1.5">
                        <span className="text-xs font-bold uppercase text-text-muted tracking-wider">Quantity</span>
                        <div className="flex items-center gap-1 bg-bg-cream border border-border-warm rounded-lg p-1">
                          <button
                            onClick={() => handleQuantityChange(quantity - 1)}
                            disabled={quantity <= 1}
                            className="qty-btn text-text-charcoal hover:bg-bg-cream-dark disabled:opacity-30"
                          >
                            <Minus className="w-4 h-4" />
                          </button>
                          <span className="w-12 text-center text-sm font-bold text-text-charcoal">
                            {quantity}
                          </span>
                          <button
                            onClick={() => handleQuantityChange(quantity + 1)}
                            className="qty-btn text-text-charcoal hover:bg-bg-cream-dark"
                          >
                            <Plus className="w-4 h-4" />
                          </button>
                        </div>
                      </div>

                      {/* Summary Price */}
                      <div className="text-right">
                        <span className="text-xs text-text-muted uppercase font-bold tracking-wider block">Price per pack</span>
                        <span className="text-2xl font-extrabold text-primary-red block leading-tight">
                          {formatPrice(price)}
                        </span>
                        {quantity > 1 && totalItemPrice && (
                          <span className="text-xs text-text-muted block mt-1">
                            Total: <strong className="text-text-charcoal">{formatCurrency(totalItemPrice)}</strong>
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Action buttons */}
                    <div className="flex flex-col sm:flex-row gap-3">
                      <button
                        onClick={handleAddToCart}
                        className={`flex items-center justify-center gap-2 flex-grow py-3.5 rounded-lg font-bold text-sm shadow-md transition-all duration-300 cursor-pointer min-h-[48px] ${
                          added
                            ? 'bg-primary-green text-white scale-95 shadow-inner'
                            : 'bg-primary-red hover:bg-primary-red-dark text-white hover:shadow-lg'
                        }`}
                      >
                        {added ? (
                          <>
                            <Check className="w-5 h-5" />
                            <span>Added to Cart!</span>
                          </>
                        ) : (
                          <>
                            <ShoppingCart className="w-5 h-5" />
                            <span>Add to Cart</span>
                          </>
                        )}
                      </button>

                      <button
                        onClick={handleWhatsAppInquiry}
                        className="flex items-center justify-center gap-2 sm:px-6 py-3.5 bg-bg-cream hover:bg-bg-cream-dark text-text-charcoal rounded-lg font-bold text-sm transition-colors border border-border-warm min-h-[48px] cursor-pointer"
                      >
                        <WhatsAppIcon className="w-5 h-5 text-primary-green" />
                        Ask Questions
                      </button>
                    </div>

                    <div className="text-[10px] text-text-muted text-center sm:text-left flex flex-col gap-0.5">
                      <p className="font-semibold text-primary-red">{siteConfig.packingChargesNote}</p>
                      <p>{siteConfig.abroadPackingNote}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>

          </div>
        </div>

        {/* Related Pickles Section */}
        {relatedProducts.length > 0 && (
          <div className="max-w-5xl mx-auto">
            <h3 className="font-heading font-extrabold text-2xl text-text-charcoal mb-6 border-b border-border-warm pb-3">
              You May Also Like
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {relatedProducts.map((p) => {
                const rPrice = p.price250g;
                return (
                  <Link
                    key={p.id}
                    href={`/product/${p.slug}`}
                    className="bg-white rounded-xl overflow-hidden shadow-sm card-hover border border-border-warm p-2.5 flex flex-col justify-between"
                  >
                    <div className="relative aspect-square w-full rounded-lg overflow-hidden bg-bg-cream-dark">
                      <Image
                        src={p.image}
                        alt={p.name}
                        fill
                        sizes="150px"
                        className="object-cover img-zoom"
                      />
                    </div>
                    <div className="mt-2 text-center">
                      <h4 className="font-heading font-bold text-xs md:text-sm text-text-charcoal truncate">{p.name}</h4>
                      {p.nameTelugu && <p className="text-[10px] text-text-muted line-clamp-1">{p.nameTelugu}</p>}
                      <p className="text-xs font-bold text-primary-red mt-1">
                        {p.isPriceTBD ? 'TBD' : `From ${formatPrice(rPrice)}`}
                      </p>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
