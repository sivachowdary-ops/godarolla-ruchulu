'use client';

import Image from 'next/image';
import Link from 'next/link';

const categories = [
  {
    title: 'Veg Pickles',
    titleTelugu: 'వెజ్ ఊరగాయలు',
    href: '/products?category=veg',
    image: '/images/categories/veg.jpg',
    accentColor: 'border-primary-green hover:shadow-primary-green/30',
  },
  {
    title: 'Non-Veg Pickles',
    titleTelugu: 'నాన్వెజ్ ఊరగాయలు',
    href: '/products?category=nonveg',
    image: '/images/categories/nonveg.jpg',
    accentColor: 'border-primary-red hover:shadow-primary-red/30',
  },
  {
    title: 'Podulu',
    titleTelugu: 'పొడులు',
    href: '/products?category=podulu',
    image: '/images/categories/podulu.jpg',
    accentColor: 'border-accent-gold-dark hover:shadow-accent-gold/30',
  },
  {
    title: 'Seeds',
    titleTelugu: 'విత్తనాలు',
    href: '/products?category=seeds',
    image: '/images/categories/seeds.jpg',
    accentColor: 'border-primary-green hover:shadow-primary-green/30',
  },
  {
    title: 'Jellies',
    titleTelugu: 'జెల్లీలు',
    href: '/products?category=jellies',
    image: '/images/categories/jellies.jpg',
    accentColor: 'border-primary-red hover:shadow-primary-red/30',
  },
];

export function CategoryShowcase() {
  return (
    <section id="categories" className="py-16 md:py-20 bg-bg-cream">
      <div className="container mx-auto px-4 md:px-8">
        {/* Section Header */}
        <div className="text-center mb-12">
          <span className="ribbon rounded mb-4 inline-block">Explore</span>
          <h2 className="font-heading text-3xl md:text-4xl font-bold text-text-charcoal mt-4">
            Our Categories
          </h2>
          <p className="text-text-muted mt-3 max-w-lg mx-auto text-sm md:text-base">
            Choose from our wide range of authentic Andhra pickles, spice powders, healthy seeds, and sweet jellies.
          </p>
          <div className="section-divider mt-6" />
        </div>

        {/* Circular Scrollable Categories Grid */}
        <div className="max-w-5xl mx-auto">
          <div className="flex overflow-x-auto md:overflow-x-visible md:justify-center gap-6 md:gap-10 pb-6 md:pb-0 scrollbar-none snap-x snap-mandatory px-4">
            {categories.map((cat) => (
              <Link
                key={cat.title}
                href={cat.href}
                className="flex flex-col items-center shrink-0 snap-center group cursor-pointer"
              >
                {/* Circular image container */}
                <div className={`relative w-28 h-28 md:w-36 md:h-36 rounded-full overflow-hidden border-4 bg-white shadow-md transition-all duration-300 group-hover:scale-105 group-hover:shadow-lg ${cat.accentColor}`}>
                  <Image
                    src={cat.image}
                    alt={cat.title}
                    fill
                    sizes="(max-width: 768px) 112px, 144px"
                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                </div>

                {/* Text titles */}
                <h3 className="font-heading font-extrabold text-sm md:text-base text-text-charcoal mt-4 group-hover:text-primary-red transition-colors text-center">
                  {cat.title}
                </h3>
                <p className="font-telugu text-[10px] md:text-xs text-text-muted mt-0.5 text-center">
                  {cat.titleTelugu}
                </p>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
