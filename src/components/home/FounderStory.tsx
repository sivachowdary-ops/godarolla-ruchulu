import Image from 'next/image';
import { Quote } from 'lucide-react';
import { siteConfig } from '@/config/site';

export function FounderStory() {
  // Check if founder info has been provided
  const isPlaceholder = siteConfig.founderName.includes('[PLACEHOLDER');

  return (
    <section className="py-16 md:py-20 bg-bg-cream">
      <div className="container mx-auto px-4 md:px-8">
        <div className="max-w-5xl mx-auto">
          {/* Section Header */}
          <div className="text-center mb-12">
            <span className="ribbon rounded mb-4 inline-block">Our Heritage</span>
            <h2 className="font-heading text-3xl md:text-4xl font-bold text-text-charcoal mt-4">
              The Story Behind the Taste
            </h2>
            <div className="section-divider mt-6" />
          </div>

          {isPlaceholder ? (
            /* Placeholder state — shown until founder info is provided */
            <div className="bg-card-bg border border-border-warm rounded-2xl p-8 md:p-12 text-center">
              <div className="w-24 h-24 rounded-full bg-bg-cream-dark mx-auto mb-6 flex items-center justify-center">
                <Quote className="w-10 h-10 text-accent-gold" />
              </div>
              <p className="text-text-muted italic text-lg max-w-2xl mx-auto leading-relaxed">
                &ldquo;Our family has been crafting pickles with the same love, dedication, and
                traditional recipes for generations. Every jar of Godarolla Ruchulu carries the
                authentic taste of the Godavari region.&rdquo;
              </p>
              <div className="mt-6 pt-6 border-t border-border-warm">
                <p className="text-text-muted text-sm">
                  {/* PLACEHOLDER: Founder name and photo will be added when supplied */}
                  — The Family Behind Godarolla Ruchulu
                </p>
                <p className="text-accent-gold-dark text-xs mt-1 font-semibold">VSM 1969</p>
              </div>
            </div>
          ) : (
            /* Real founder info — displayed when data is supplied */
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 items-center">
              <div className="relative aspect-[4/5] rounded-2xl overflow-hidden shadow-xl">
                <Image
                  src={siteConfig.founderPhoto}
                  alt={`${siteConfig.founderName} — Founder of Godarolla Ruchulu`}
                  fill
                  className="object-cover"
                />
              </div>
              <div>
                <Quote className="w-10 h-10 text-accent-gold mb-4" />
                <blockquote className="text-lg md:text-xl text-text-charcoal leading-relaxed italic mb-6">
                  &ldquo;{siteConfig.founderQuote}&rdquo;
                </blockquote>
                <div className="border-t border-border-warm pt-4">
                  <p className="font-heading text-xl font-bold text-text-charcoal">
                    {siteConfig.founderName}
                  </p>
                  <p className="text-text-muted text-sm">Founder, Godarolla Ruchulu</p>
                  <p className="text-accent-gold-dark text-xs mt-1 font-semibold">VSM 1969</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
