'use client';

import { useCart } from '@/context/CartContext';
import { ShoppingCart } from 'lucide-react';

export function FloatingCartButton() {
  const { getItemCount, setIsCartOpen } = useCart();
  const cartCount = getItemCount();

  return (
    <div className="fixed bottom-24 right-6 z-40">
      <button
        onClick={() => setIsCartOpen(true)}
        className="w-14 h-14 bg-primary-red hover:bg-primary-red-dark text-white rounded-full flex items-center justify-center shadow-2xl hover:shadow-primary-red/50 transition-all duration-300 hover:scale-110 cursor-pointer relative"
        aria-label="Open Cart"
      >
        <ShoppingCart className="w-6 h-6" />
        {cartCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-primary-green text-white text-xs font-bold w-5.5 h-5.5 rounded-full flex items-center justify-center border-2 border-white animate-pulse">
            {cartCount}
          </span>
        )}
      </button>
    </div>
  );
}
