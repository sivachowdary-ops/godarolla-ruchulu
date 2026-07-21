'use client';

import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

export function HeroSection() {
  return (
    <section className="relative min-h-[340px] md:min-h-[420px] flex items-center overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0">
        <Image
          src="/images/hero-bg.jpg"
          alt="Traditional Andhra pickles spread"
          fill
          sizes="100vw"
          className="object-cover"
          priority
        />
        {/* Dark overlay for text readability */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#1A1210]/90 via-[#1A1210]/75 to-[#1A1210]/50" />
      </div>

      <div className="container mx-auto px-4 md:px-8 relative z-10 py-10 md:py-14">
        <div className="max-w-2xl">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-accent-gold/20 border border-accent-gold/30 mb-5">
            <span className="w-2 h-2 rounded-full bg-accent-gold animate-pulse" />
            <span className="text-accent-gold text-xs md:text-sm font-semibold tracking-wide">VSM 1969 — Since Generations</span>
          </div>

          {/* Heading */}
          <h1 className="font-heading text-3xl md:text-4xl lg:text-5xl font-bold text-white leading-tight mb-3">
            <span className="font-telugu text-accent-gold block text-2xl md:text-3xl mb-1">
              గోదారోళ్ల రుచులు
            </span>
            Authentic Andhra Pickles,{' '}
            <span className="text-accent-gold">Straight from Godavari</span>
          </h1>

          {/* Subtitle */}
          <p className="text-base md:text-lg text-white/80 mb-6 max-w-xl leading-relaxed">
            Handcrafted with traditional recipes, premium spices, and cold-pressed oil.
            100% homemade, zero preservatives.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row flex-wrap gap-3 w-full mt-2">
            <Link
              href="/products?category=veg"
              className="inline-flex justify-center items-center gap-2 px-5 py-3.5 bg-primary-green text-white font-semibold rounded-lg hover:bg-primary-green-dark transition-all duration-300 shadow-lg hover:shadow-xl hover:-translate-y-0.5 text-sm w-full sm:w-auto"
            >
              🌿 Shop Veg Pickles
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/products?category=nonveg"
              className="inline-flex justify-center items-center gap-2 px-5 py-3.5 bg-primary-red text-white font-semibold rounded-lg hover:bg-primary-red-dark transition-all duration-300 shadow-lg hover:shadow-xl hover:-translate-y-0.5 text-sm w-full sm:w-auto"
            >
              🍖 Shop Non-Veg Pickles
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {/* Trust badges */}
          <div className="flex flex-wrap gap-4 mt-6 pt-6 border-t border-white/10">
            {['100% Homemade', 'No Preservatives', 'Pan India Shipping'].map((badge) => (
              <span key={badge} className="flex items-center gap-2 text-white/70 text-xs md:text-sm">
                <span className="w-1.5 h-1.5 rounded-full bg-accent-gold" />
                {badge}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
