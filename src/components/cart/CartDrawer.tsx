'use client';

import { useCart } from '@/context/CartContext';
import { formatCurrency } from '@/lib/utils';
import { siteConfig } from '@/config/site';
import { X, Trash2, ShoppingCart, Plus, Minus, ShieldAlert } from 'lucide-react';
import Link from 'next/link';

export function CartDrawer() {
  const {
    items,
    isCartOpen,
    setIsCartOpen,
    removeFromCart,
    updateQuantity,
    getCartTotal,
    getItemCount,
    setIsCheckoutOpen,
  } = useCart();

  if (!isCartOpen) return null;

  const total = getCartTotal();
  const itemCount = getItemCount();

  const handleCheckoutClick = () => {
    // Check for minimum order restriction if set
    if (siteConfig.minimumOrder !== null && total < siteConfig.minimumOrder) {
      alert(`Minimum order value is ${formatCurrency(siteConfig.minimumOrder)}. Your current order total is ${formatCurrency(total)}.`);
      return;
    }
    setIsCheckoutOpen(true);
    setIsCartOpen(false);
  };

  return (
    <>
      {/* Drawer Overlay */}
      <div
        className="drawer-overlay"
        onClick={() => setIsCartOpen(false)}
      />

      {/* Slide-in Drawer Container */}
      <div className="fixed top-0 right-0 h-full w-full max-w-md bg-white shadow-2xl z-50 flex flex-col slide-in-right border-l border-border-warm">
        {/* Drawer Header */}
        <div className="p-4 md:p-6 border-b border-border-warm flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShoppingCart className="w-5 h-5 text-primary-red" />
            <h2 className="font-heading font-extrabold text-lg md:text-xl text-text-charcoal">
              Your Cart
            </h2>
            <span className="bg-primary-red/10 text-primary-red text-xs font-bold px-2 py-0.5 rounded-full">
              {itemCount}
            </span>
          </div>
          <button
            onClick={() => setIsCartOpen(false)}
            className="p-1 rounded-full hover:bg-bg-cream-dark transition-colors cursor-pointer text-text-charcoal hover:text-primary-red"
            aria-label="Close Cart"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Drawer Body (Scrollable items) */}
        <div className="flex-grow overflow-y-auto p-4 md:p-6 bg-bg-cream/30">
          {items.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center p-8">
              <div className="w-16 h-16 rounded-full bg-bg-cream-dark flex items-center justify-center mb-4 text-text-muted">
                <ShoppingCart className="w-8 h-8" />
              </div>
              <h3 className="font-heading font-bold text-lg text-text-charcoal mb-2">Your cart is empty</h3>
              <p className="text-text-muted text-sm leading-relaxed mb-6">
                Add some authentic, homemade pickles to satisfy your spicy cravings!
              </p>
              <Link
                href="/products"
                onClick={() => setIsCartOpen(false)}
                className="px-6 py-2.5 bg-primary-red hover:bg-primary-red-dark text-white font-bold rounded-lg shadow-sm transition-colors text-sm"
              >
                Browse Pickles Catalog
              </Link>
            </div>
          ) : (
            <div className="flex flex-col gap-4">
              {items.map((item) => (
                <div
                  key={`${item.product.id}-${item.weight}`}
                  className="flex gap-4 p-3 bg-white rounded-xl border border-border-warm shadow-sm hover:border-accent-gold/30 transition-colors"
                >
                  {/* Thumbnail / Info */}
                  <div className="flex-grow flex flex-col">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <h4 className="font-heading font-extrabold text-sm text-text-charcoal leading-snug">
                          {item.product.name}
                        </h4>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-[10px] font-bold uppercase px-1.5 py-0.5 rounded bg-bg-cream-dark text-text-charcoal border border-border-warm">
                            {item.weight}
                          </span>
                          {item.product.isVeg ? (
                            <span className="text-[10px] text-primary-green font-bold">🌿 Veg</span>
                          ) : (
                            <span className="text-[10px] text-primary-red font-bold">🍖 Non-Veg</span>
                          )}
                        </div>
                      </div>
                      <button
                        onClick={() => removeFromCart(item.product.id, item.weight)}
                        className="p-1 rounded hover:bg-bg-cream-dark text-text-muted hover:text-primary-red transition-colors cursor-pointer"
                        aria-label="Remove item"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="flex items-center justify-between mt-3 pt-3 border-t border-bg-cream-dark">
                      {/* Quantity Stepper */}
                      <div className="flex items-center gap-1 bg-bg-cream border border-border-warm rounded-md p-0.5">
                        <button
                          type="button"
                          onClick={() => updateQuantity(item.product.id, item.weight, item.quantity - 1)}
                          disabled={item.quantity <= 1}
                          className="qty-btn text-text-charcoal hover:bg-bg-cream-dark disabled:opacity-30"
                        >
                          <Minus className="w-3.5 h-3.5" />
                        </button>
                        <span className="w-8 text-center text-xs font-bold font-body text-text-charcoal">
                          {item.quantity}
                        </span>
                        <button
                          type="button"
                          onClick={() => updateQuantity(item.product.id, item.weight, item.quantity + 1)}
                          className="qty-btn text-text-charcoal hover:bg-bg-cream-dark"
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      {/* Item Total */}
                      <div className="text-right">
                        <span className="text-[10px] text-text-muted block leading-none">Subtotal</span>
                        <span className="font-bold text-text-charcoal text-sm font-body">
                          {formatCurrency(item.price * item.quantity)}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Drawer Footer (Sticky bottom) */}
        {items.length > 0 && (
          <div className="p-4 md:p-6 border-t border-border-warm bg-white flex flex-col gap-4">
            {/* Disclaimer & Details */}
            <div className="flex flex-col gap-1.5 text-xs text-text-muted bg-bg-cream p-3 rounded-lg border border-border-warm">
              <p className="font-semibold text-primary-red flex items-center gap-1.5">
                <ShieldAlert className="w-3.5 h-3.5" /> {siteConfig.packingChargesNote}
              </p>
              <p className="text-[11px] leading-relaxed">
                {siteConfig.abroadPackingNote}
              </p>
              {siteConfig.minimumOrder !== null && (
                <p className="text-[11px] font-bold text-primary-green mt-1">
                  💡 Minimum order value is {formatCurrency(siteConfig.minimumOrder)}
                </p>
              )}
            </div>

            {/* Subtotal & Action */}
            <div className="flex items-center justify-between">
              <div className="flex flex-col">
                <span className="text-xs text-text-muted uppercase font-bold tracking-wider">Subtotal</span>
                <span className="text-2xl font-extrabold text-primary-red leading-none font-body">
                  {formatCurrency(total)}
                </span>
              </div>

              <button
                onClick={handleCheckoutClick}
                className="px-6 py-3.5 bg-primary-red hover:bg-primary-red-dark text-white rounded-lg font-bold text-sm shadow-md hover:shadow-lg transition-all cursor-pointer min-h-[48px]"
              >
                Proceed to Checkout
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
