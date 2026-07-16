'use client';

import { useState } from 'react';
import { faqData } from '@/config/site';
import { ChevronDown, HelpCircle } from 'lucide-react';

export function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="py-16 md:py-20 bg-white">
      <div className="container mx-auto px-4 md:px-8">
        {/* Section Header */}
        <div className="text-center mb-12">
          <span className="ribbon rounded mb-4 inline-block">Help & Support</span>
          <h2 className="font-heading text-3xl md:text-4xl font-bold text-text-charcoal mt-4">
            Frequently Asked Questions
          </h2>
          <p className="text-text-muted mt-3 max-w-lg mx-auto">
            Got questions about our pickles, ordering process, or packing? We have got you covered.
          </p>
          <div className="section-divider mt-6" />
        </div>

        {/* FAQ List */}
        <div className="max-w-3xl mx-auto flex flex-col gap-4">
          {faqData.map((item, index) => {
            const isOpen = openIndex === index;
            return (
              <div
                key={index}
                className="bg-bg-cream/40 border border-border-warm rounded-xl overflow-hidden transition-all duration-300 shadow-sm"
              >
                {/* Question Header */}
                <button
                  type="button"
                  onClick={() => toggleFAQ(index)}
                  className="w-full flex items-center justify-between p-4 md:p-5 text-left font-heading font-extrabold text-sm md:text-base text-text-charcoal hover:bg-bg-cream/80 transition-colors cursor-pointer"
                >
                  <div className="flex items-center gap-3 pr-4">
                    <HelpCircle className="w-5 h-5 text-accent-gold-dark shrink-0" />
                    <span>{item.question}</span>
                  </div>
                  <ChevronDown
                    className={`w-5 h-5 text-text-muted shrink-0 transition-transform duration-300 ${
                      isOpen ? 'rotate-180 text-primary-red' : ''
                    }`}
                  />
                </button>

                {/* Answer Area */}
                <div
                  className={`accordion-content border-t border-border-warm bg-white font-body text-xs md:text-sm text-text-muted transition-all duration-300 ${
                    isOpen ? 'max-h-60 p-4 md:p-5 opacity-100' : 'max-h-0 opacity-0 py-0 px-4 pointer-events-none'
                  }`}
                >
                  <p className="leading-relaxed">{item.answer}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
