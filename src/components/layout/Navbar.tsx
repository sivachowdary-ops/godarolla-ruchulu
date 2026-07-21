'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useCart } from '@/context/CartContext';
import { ShoppingCart, Menu, X } from 'lucide-react';
import { siteConfig } from '@/config/site';

export function Navbar() {
  const { getItemCount, setIsCartOpen } = useCart();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const cartCount = getItemCount();

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isMobileMenuOpen]);

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  const navLinks = [
    { label: 'Home', href: '/' },
    { label: 'Pickles Catalog', href: '/products' },
    { label: 'Podulu', href: '/products?category=podulu' },
    { label: 'Seeds', href: '/products?category=seeds' },
    { label: 'Jellies', href: '/products?category=jellies' },
    { label: 'Contact', href: '/contact' },
  ];

  return (
    <header className="sticky top-0 z-50 w-full bg-white/90 backdrop-blur-md border-b border-border-warm shadow-sm">
      <div className="container mx-auto px-4 md:px-8 h-20 flex items-center justify-between">
        {/* Brand Logo & Name */}
        <Link href="/" className="flex items-center gap-3 group" onClick={closeMobileMenu}>
          <div className="relative w-12 h-12 rounded-full overflow-hidden border-2 border-accent-gold shadow-sm group-hover:border-primary-red transition-colors">
            <Image
              src="/images/logo.jpeg"
              alt={siteConfig.name}
              fill
              sizes="48px"
              className="object-cover"
            />
          </div>
          <div className="flex flex-col">
            <h1 className="font-heading font-extrabold text-lg md:text-xl text-primary-red leading-tight flex items-center gap-1.5">
              <span>{siteConfig.name}</span>
              <span className="font-telugu text-sm text-primary-green hidden md:inline">({siteConfig.nameTelugu})</span>
            </h1>
            <span className="text-xs text-accent-gold-dark font-bold tracking-widest">{siteConfig.tagline}</span>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-text-charcoal font-semibold hover:text-primary-red transition-colors text-sm uppercase tracking-wider"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Right Actions */}
        <div className="flex items-center gap-4">
          {/* Cart Icon */}
          <button
            onClick={() => setIsCartOpen(true)}
            className="relative p-2.5 rounded-full hover:bg-bg-cream-dark transition-colors cursor-pointer text-text-charcoal hover:text-primary-red"
            aria-label="Open Cart"
          >
            <ShoppingCart className="w-6 h-6" />
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-primary-red text-white text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center border-2 border-white animate-pulse">
                {cartCount}
              </span>
            )}
          </button>

          {/* Mobile Menu Button */}
          <button
            onClick={toggleMobileMenu}
            className="md:hidden p-2.5 rounded-full hover:bg-bg-cream-dark transition-colors cursor-pointer text-text-charcoal hover:text-primary-red"
            aria-label="Toggle Menu"
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Sidebar Overlay */}
      {isMobileMenuOpen && (
        <div 
          className="md:hidden fixed inset-0 bg-black/60 backdrop-blur-sm z-[60] transition-opacity duration-300"
          onClick={closeMobileMenu}
        />
      )}

      {/* Mobile Drawer (Slide in from right) */}
      <div 
        className={`md:hidden fixed top-0 right-0 h-full w-4/5 max-w-sm bg-white shadow-2xl z-[70] transform transition-transform duration-300 ease-in-out flex flex-col ${isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full'}`}
      >
        <div className="flex items-center justify-between p-4 border-b border-border-warm">
          <span className="font-heading font-extrabold text-lg text-primary-red">Menu</span>
          <button 
            onClick={closeMobileMenu}
            className="p-3 rounded-full hover:bg-bg-cream-dark transition-colors"
            aria-label="Close Menu"
          >
            <X className="w-6 h-6" />
          </button>
        </div>
        
        <nav className="flex-grow flex flex-col py-4 px-6 gap-2 overflow-y-auto">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-text-charcoal font-semibold py-4 hover:text-primary-red transition-colors border-b border-bg-cream-dark last:border-0 text-lg flex items-center justify-between"
              onClick={closeMobileMenu}
            >
              {link.label}
            </Link>
          ))}
        </nav>
        
        <div className="p-6 border-t border-border-warm bg-bg-cream/30">
          <button
            onClick={() => {
              closeMobileMenu();
              setIsCartOpen(true);
            }}
            className="flex items-center justify-center gap-2 w-full py-4 bg-primary-green hover:bg-primary-green-dark text-white rounded-xl font-bold transition-colors min-h-[56px]"
          >
            <ShoppingCart className="w-5 h-5" />
            View Cart ({cartCount})
          </button>
        </div>
      </div>
    </header>
  );
}
