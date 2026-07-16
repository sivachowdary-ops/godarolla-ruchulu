import { Search, Weight, ShoppingCart, MapPin, MessageCircle } from 'lucide-react';
import { howToOrderSteps } from '@/config/site';

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  search: Search,
  weight: Weight,
  shoppingCart: ShoppingCart,
  mapPin: MapPin,
  messageCircle: MessageCircle,
};

export function HowToOrder() {
  return (
    <section className="py-16 md:py-20 bg-white">
      <div className="container mx-auto px-4 md:px-8">
        {/* Section Header */}
        <div className="text-center mb-12">
          <span className="ribbon rounded mb-4 inline-block">Easy Ordering</span>
          <h2 className="font-heading text-3xl md:text-4xl font-bold text-text-charcoal mt-4">
            How to Order
          </h2>
          <p className="text-text-muted mt-3 max-w-lg mx-auto">
            Get your favorite Andhra pickles delivered in 5 simple steps.
          </p>
          <div className="section-divider mt-6" />
        </div>

        {/* Steps */}
        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6 md:gap-4">
            {howToOrderSteps.map((step, index) => {
              const Icon = iconMap[step.icon] || Search;
              return (
                <div key={step.step} className="text-center relative">
                  {/* Connector line (desktop only) */}
                  {index < howToOrderSteps.length - 1 && (
                    <div className="hidden lg:block absolute top-8 left-[60%] w-[80%] h-0.5 bg-gradient-to-r from-accent-gold to-accent-gold/30" />
                  )}

                  {/* Step Number */}
                  <div className="relative inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-primary-red to-primary-red-dark text-white font-heading font-bold text-lg mb-4 shadow-lg">
                    {step.step}
                  </div>

                  {/* Icon */}
                  <div className="inline-flex items-center justify-center w-10 h-10 rounded-lg bg-accent-gold/10 mb-3 mx-auto block">
                    <Icon className="w-5 h-5 text-accent-gold-dark" />
                  </div>

                  {/* Content */}
                  <h3 className="font-heading font-bold text-text-charcoal text-sm md:text-base mb-1">
                    {step.title}
                  </h3>
                  <p className="text-text-muted text-xs md:text-sm leading-relaxed">
                    {step.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
