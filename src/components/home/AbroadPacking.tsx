import { Plane, Package, Globe, Shield } from 'lucide-react';

export function AbroadPacking() {
  return (
    <section className="py-16 md:py-20 bg-gradient-to-br from-primary-green to-primary-green-dark relative overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-32 translate-x-32" />
      <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full translate-y-24 -translate-x-24" />

      <div className="container mx-auto px-4 md:px-8 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          {/* Airplane Icon */}
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-accent-gold/20 mb-6">
            <Plane className="w-8 h-8 text-accent-gold" />
          </div>

          <h2 className="font-heading text-3xl md:text-4xl font-bold text-white mb-4">
            Abroad Packing Available ✈️
          </h2>
          <p className="text-white/80 text-lg mb-10 max-w-2xl mx-auto leading-relaxed">
            Missing the taste of home? We ship our authentic Andhra pickles internationally with special
            leak-proof, abroad-safe packaging so you can enjoy Godavari flavors anywhere in the world.
          </p>

          {/* Features Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {[
              { icon: Package, title: 'Leak-Proof Packing', desc: 'Triple-sealed containers for safe transit' },
              { icon: Globe, title: 'Worldwide Shipping', desc: 'We deliver to your doorstep globally' },
              { icon: Shield, title: 'Quality Guaranteed', desc: 'Freshness maintained across continents' },
            ].map((feature) => {
              const Icon = feature.icon;
              return (
                <div key={feature.title} className="bg-white/10 backdrop-blur-sm rounded-xl p-5 border border-white/10">
                  <Icon className="w-6 h-6 text-accent-gold mx-auto mb-3" />
                  <h3 className="font-semibold text-white text-sm mb-1">{feature.title}</h3>
                  <p className="text-white/60 text-xs">{feature.desc}</p>
                </div>
              );
            })}
          </div>

          <p className="text-white/50 text-sm mt-8 italic">
            * Packing charges extra for international shipments. Contact us on WhatsApp for rates.
          </p>
        </div>
      </div>
    </section>
  );
}
