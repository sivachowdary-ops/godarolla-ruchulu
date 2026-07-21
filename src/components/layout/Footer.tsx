import Link from 'next/link';
import Image from 'next/image';
import { siteConfig } from '@/config/site';
import { Shield, Sparkles, MessageCircle, MapPin, Phone, Mail } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-[#1A1210] text-white pt-16 pb-8 border-t-4 border-accent-gold">
      <div className="container mx-auto px-4 md:px-8">
        {/* Core Multi-column Footer */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-8 mb-12">
          {/* Col 1: Brand Info */}
          <div className="flex flex-col gap-4">
            <Link href="/" className="flex items-center gap-3">
              <div className="relative w-12 h-12 rounded-full overflow-hidden border border-accent-gold bg-white">
                <Image
                  src="/images/logo.jpeg"
                  alt={siteConfig.name}
                  fill
                  sizes="48px"
                  className="object-cover"
                />
              </div>
              <div className="flex flex-col">
                <h3 className="font-heading font-extrabold text-lg text-white leading-tight">
                  {siteConfig.name}
                </h3>
                <span className="text-xs text-accent-gold font-bold tracking-widest">{siteConfig.tagline}</span>
              </div>
            </Link>
            <p className="text-sm text-white/70 leading-relaxed font-body">
              Bringing you the authentic, rich taste of Andhra pickles. Handcrafted using traditional heritage recipes from the Godavari region. 100% homemade, zero preservatives.
            </p>
          </div>

          {/* Col 2: Quick Links */}
          <div>
            <h4 className="font-heading font-bold text-accent-gold text-lg mb-4 border-b border-white/10 pb-2">
              Quick Links
            </h4>
            <ul className="flex flex-col gap-2.5 font-body text-sm text-white/70">
              <li>
                <Link href="/" className="hover:text-accent-gold transition-colors block py-2">Home</Link>
              </li>
              <li>
                <Link href="/products" className="hover:text-accent-gold transition-colors block py-2">Pickles Catalog</Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-accent-gold transition-colors block py-2">Contact Us</Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Pickle Categories */}
          <div>
            <h4 className="font-heading font-bold text-accent-gold text-lg mb-4 border-b border-white/10 pb-2">
              Our Pickles
            </h4>
            <ul className="flex flex-col gap-2.5 font-body text-sm text-white/70">
              <li>
                <Link href="/products?category=veg" className="hover:text-accent-gold transition-colors flex items-center gap-2 py-2">
                  <span>🌿</span> Veg Pickles (వెజ్)
                </Link>
              </li>
              <li>
                <Link href="/products?category=nonveg" className="hover:text-accent-gold transition-colors flex items-center gap-2 py-2">
                  <span>🍖</span> Non-Veg Pickles (నాన్వెజ్)
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 4: Contact Info */}
          <div>
            <h4 className="font-heading font-bold text-accent-gold text-lg mb-4 border-b border-white/10 pb-2">
              Get in Touch
            </h4>
            <ul className="flex flex-col gap-3.5 font-body text-sm text-white/70">
              <li className="flex items-start gap-2.5">
                <MapPin className="w-5 h-5 text-accent-gold shrink-0 mt-0.5" />
                <span>{siteConfig.businessAddress}</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Phone className="w-5 h-5 text-accent-gold shrink-0" />
                <a href={`tel:${siteConfig.phone}`} className="hover:text-accent-gold transition-colors block py-2">
                  {siteConfig.phone}
                </a>
              </li>
              <li className="flex items-center gap-2.5">
                <Mail className="w-5 h-5 text-accent-gold shrink-0" />
                <a href={`mailto:${siteConfig.email}`} className="hover:text-accent-gold transition-colors break-all block py-2">
                  {siteConfig.email}
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Brand Promises Row */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 py-8 border-t border-b border-white/10 mb-8 text-center sm:text-left">
          <div className="flex flex-col sm:flex-row items-center gap-3">
            <div className="p-2.5 bg-white/5 rounded-full border border-white/10">
              <Sparkles className="w-5 h-5 text-accent-gold" />
            </div>
            <div>
              <h5 className="font-bold text-sm text-white">100% Traditional Recipe</h5>
              <p className="text-xs text-white/50">Passed down through generations</p>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row items-center gap-3">
            <div className="p-2.5 bg-white/5 rounded-full border border-white/10">
              <Shield className="w-5 h-5 text-accent-gold" />
            </div>
            <div>
              <h5 className="font-bold text-sm text-white">Zero Preservatives</h5>
              <p className="text-xs text-white/50">Pure oil, spices & fresh ingredients</p>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row items-center gap-3">
            <div className="p-2.5 bg-white/5 rounded-full border border-white/10">
              <MessageCircle className="w-5 h-5 text-accent-gold" />
            </div>
            <div>
              <h5 className="font-bold text-sm text-white">Order via WhatsApp</h5>
              <p className="text-xs text-white/50">Personal touch & customized shipping</p>
            </div>
          </div>
        </div>

        {/* Disclaimer & Copyright */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-white/40 font-body">
          <div className="flex flex-col md:flex-row items-center gap-2 md:gap-4">
            <span className="text-accent-gold font-bold">{siteConfig.packingChargesNote}</span>
            <span>•</span>
            <span>{siteConfig.abroadPackingNote}</span>
          </div>
          <div className="text-center md:text-right">
            <p>&copy; {new Date().getFullYear()} {siteConfig.name}. All rights reserved.</p>
            <p className="text-[10px] mt-1 text-white/20">Tagline & Design inspired by VSM 1969 Heritage.</p>
          </div>
        </div>
      </div>
    </footer>
  );
}
