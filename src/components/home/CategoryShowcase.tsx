'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Leaf, Drumstick, ArrowRight } from 'lucide-react';

const categories = [
  {
    title: 'Veg Pickles',
    titleTelugu: 'వెజ్ ఊరగాయలు',
    description: 'Traditional vegetarian pickles — Avakaya, Gongura, Tomato, Lemon & 15+ more varieties',
    href: '/products?category=veg',
    icon: Leaf,
    gradient: 'from-primary-green/10 to-primary-green/5',
    borderColor: 'border-primary-green/20',
    iconBg: 'bg-primary-green/10',
    iconColor: 'text-primary-green',
    count: '19+',
  },
  {
    title: 'Non-Veg Pickles',
    titleTelugu: 'నాన్వెజ్ ఊరగాయలు',
    description: 'Premium meat & seafood pickles — Chicken, Mutton, Prawn, Vanjaram & more',
    href: '/products?category=nonveg',
    icon: Drumstick,
    gradient: 'from-primary-red/10 to-primary-red/5',
    borderColor: 'border-primary-red/20',
    iconBg: 'bg-primary-red/10',
    iconColor: 'text-primary-red',
    count: '5+',
  },
  {
    title: 'Podulu',
    titleTelugu: 'పొడులు',
    description: 'Authentic spiced powders — Dhaniyalu, Palli, Kandi, Kakarakaya & more',
    href: '/products?category=podulu',
    icon: Leaf,
    gradient: 'from-accent-gold/10 to-accent-gold/5',
    borderColor: 'border-accent-gold/20',
    iconBg: 'bg-accent-gold/10',
    iconColor: 'text-accent-gold-dark',
    count: '19+',
  },
  {
    title: 'Seeds',
    titleTelugu: 'విత్తనాలు',
    description: 'Nutritious seeds for your daily health — Pumpkin, Sunflower, Sabja, Chia & Flax',
    href: '/products?category=seeds',
    icon: Leaf,
    gradient: 'from-primary-green/10 to-primary-green/5',
    borderColor: 'border-primary-green/20',
    iconBg: 'bg-primary-green/10',
    iconColor: 'text-primary-green',
    count: '5+',
  },
  {
    title: 'Jellies',
    titleTelugu: 'జెల్లీలు',
    description: 'Traditional sweet treats — Bellam Mamidi Thandra, Guava, Strawberry & more',
    href: '/products?category=jellies',
    icon: Leaf,
    gradient: 'from-primary-red/10 to-primary-red/5',
    borderColor: 'border-primary-red/20',
    iconBg: 'bg-primary-red/10',
    iconColor: 'text-primary-red',
    count: '7+',
  },
];

export function CategoryShowcase() {
  return (
    <section className="py-16 md:py-20 bg-bg-cream">
      <div className="container mx-auto px-4 md:px-8">
        {/* Section Header */}
        <div className="text-center mb-12">
          <span className="ribbon rounded mb-4 inline-block">Explore</span>
          <h2 className="font-heading text-3xl md:text-4xl font-bold text-text-charcoal mt-4">
            Our Pickle Categories
          </h2>
          <p className="text-text-muted mt-3 max-w-lg mx-auto">
            Choose from our wide range of authentic Andhra pickles, crafted with love in our Godavari kitchen.
          </p>
          <div className="section-divider mt-6" />
        </div>

        {/* Category Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 max-w-4xl mx-auto">
          {categories.map((cat) => {
            const Icon = cat.icon;
            return (
              <Link
                key={cat.title}
                href={cat.href}
                className={`group relative bg-gradient-to-br ${cat.gradient} border ${cat.borderColor} rounded-2xl p-6 md:p-8 card-hover overflow-hidden`}
              >
                {/* Count badge */}
                <div className="absolute top-4 right-4 px-3 py-1 bg-accent-gold/20 rounded-full">
                  <span className="text-sm font-bold text-accent-gold-dark">{cat.count} varieties</span>
                </div>

                {/* Icon */}
                <div className={`inline-flex items-center justify-center w-14 h-14 rounded-xl ${cat.iconBg} mb-4`}>
                  <Icon className={`w-7 h-7 ${cat.iconColor}`} />
                </div>

                {/* Content */}
                <h3 className="font-heading text-xl md:text-2xl font-bold text-text-charcoal mb-1">
                  {cat.title}
                </h3>
                <p className="font-telugu text-sm text-text-muted mb-3">{cat.titleTelugu}</p>
                <p className="text-text-muted text-sm leading-relaxed mb-4">{cat.description}</p>

                {/* CTA */}
                <span className={`inline-flex items-center gap-2 font-semibold ${cat.iconColor} text-sm group-hover:gap-3 transition-all`}>
                  Browse Collection
                  <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                </span>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
