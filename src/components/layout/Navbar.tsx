'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useCart } from '@/context/CartContext';
import { ShoppingCart, Menu, X, ChevronDown } from 'lucide-react';
import { siteConfig } from '@/config/site';

export function Navbar() {
  const { getItemCount, setIsCartOpen } = useCart();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMobileCategoriesOpen, setIsMobileCategoriesOpen] = useState(false);

  const cartCount = getItemCount();

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
    setIsMobileCategoriesOpen(false);
  };

  const categoryItems = [
    { label: 'Veg Pickles 🌿', href: '/products?category=veg' },
    { label: 'Non-Veg Pickles 🍖', href: '/products?category=nonveg' },
    { label: 'Podulu 🥣', href: '/products?category=podulu' },
    { label: 'Seeds 🌻', href: '/products?category=seeds' },
    { label: 'Jellies 🍬', href: '/products?category=jellies' },
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
          <Link
            href="/"
            className="text-text-charcoal font-semibold hover:text-primary-red transition-colors text-sm uppercase tracking-wider cursor-pointer"
          >
            Home
          </Link>

          {/* Hover Categories Dropdown */}
          <div className="relative group py-2">
            <button className="flex items-center gap-1 text-text-charcoal font-semibold hover:text-primary-red transition-colors text-sm uppercase tracking-wider cursor-pointer focus:outline-none">
              <span>Categories</span>
              <ChevronDown className="w-4 h-4 transition-transform group-hover:rotate-180" />
            </button>

            {/* Dropdown Box */}
            <div className="absolute left-0 mt-2 w-52 bg-white border border-border-warm rounded-xl shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50 overflow-hidden">
              <div className="py-1">
                {categoryItems.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="block px-5 py-3 text-xs md:text-sm text-text-charcoal hover:bg-bg-cream-dark hover:text-primary-red transition-colors font-medium border-b last:border-0 border-border-warm/20"
                  >
                    {item.label}
                  </Link>
                ))}
              </div>
            </div>
          </div>

          <Link
            href="/contact"
            className="text-text-charcoal font-semibold hover:text-primary-red transition-colors text-sm uppercase tracking-wider cursor-pointer"
          >
            Contact
          </Link>
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

      {/* Mobile Dropdown Menu (Drops down below the header, NOT full-screen overlay) */}
      {isMobileMenuOpen && (
        <div className="md:hidden absolute top-20 left-0 w-full bg-white border-b border-border-warm shadow-md z-40 transition-all duration-300">
          <nav className="flex flex-col py-4 px-6 gap-3">
            <Link
              href="/"
              className="text-text-charcoal font-semibold py-2.5 hover:text-primary-red transition-colors border-b border-bg-cream-dark"
              onClick={closeMobileMenu}
            >
              Home
            </Link>

            {/* Mobile Expandable Categories */}
            <div className="border-b border-bg-cream-dark py-1">
              <button
                onClick={() => setIsMobileCategoriesOpen(!isMobileCategoriesOpen)}
                className="flex items-center justify-between w-full text-text-charcoal font-semibold py-2 hover:text-primary-red transition-colors focus:outline-none"
              >
                <span>Categories</span>
                <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${isMobileCategoriesOpen ? 'rotate-180' : ''}`} />
              </button>
              
              {isMobileCategoriesOpen && (
                <div className="flex flex-col pl-4 gap-2.5 py-2 animate-fade-in">
                  {categoryItems.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      className="text-text-muted hover:text-primary-red text-sm py-1 transition-colors"
                      onClick={closeMobileMenu}
                    >
                      {item.label}
                    </Link>
                  ))}
                </div>
              )}
            </div>

            <Link
              href="/contact"
              className="text-text-charcoal font-semibold py-2.5 hover:text-primary-red transition-colors border-b border-bg-cream-dark last:border-0"
              onClick={closeMobileMenu}
            >
              Contact
            </Link>

            <button
              onClick={() => {
                closeMobileMenu();
                setIsCartOpen(true);
              }}
              className="flex items-center justify-center gap-2 mt-3 w-full py-3 bg-primary-green hover:bg-primary-green-dark text-white rounded-lg font-semibold transition-colors cursor-pointer"
            >
              <ShoppingCart className="w-5 h-5" />
              View Cart ({cartCount})
            </button>
          </nav>
        </div>
      )}
    </header>
  );
}
