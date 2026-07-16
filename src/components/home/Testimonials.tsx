import { Quote, MessageSquare } from 'lucide-react';

export function Testimonials() {
  return (
    <section className="py-16 md:py-20 bg-bg-cream/50">
      <div className="container mx-auto px-4 md:px-8">
        {/* Section Header */}
        <div className="text-center mb-12">
          <span className="ribbon rounded mb-4 inline-block">Testimonials</span>
          <h2 className="font-heading text-3xl md:text-4xl font-bold text-text-charcoal mt-4">
            What Our Customers Say
          </h2>
          <div className="section-divider mt-6" />
        </div>

        {/* Placeholder review card */}
        <div className="max-w-xl mx-auto bg-white border border-border-warm rounded-2xl p-8 text-center shadow-sm">
          <div className="w-16 h-16 rounded-full bg-bg-cream flex items-center justify-center mb-4 mx-auto text-text-muted">
            <MessageSquare className="w-7 h-7" />
          </div>
          <p className="text-text-muted italic text-sm md:text-base leading-relaxed mb-4">
            &ldquo;We are in the process of gathering feedback from our lovely customers. Real, verified reviews from pickle lovers will be listed here soon!&rdquo;
          </p>
          <div className="border-t border-border-warm pt-4">
            <p className="text-xs text-text-muted font-bold uppercase tracking-wider">
              Reviews Coming Soon
            </p>
            <p className="text-[10px] text-accent-gold-dark mt-1 font-semibold">Godarolla Ruchulu — VSM 1969</p>
          </div>
        </div>
      </div>
    </section>
  );
}
