'use client';

import { siteConfig } from '@/config/site';
import { buildWhatsAppInquiryUrl } from '@/lib/utils';
import { MapPin, Phone, Mail, Clock, MessageCircle, Send } from 'lucide-react';
import React, { useState } from 'react';

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleWhatsAppRedirect = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.message.trim()) {
      alert('Please enter your name and message');
      return;
    }
    const fullMessage = `Hello ${siteConfig.name}! My name is ${formData.name}.\n\nMessage: ${formData.message}`;
    const encoded = encodeURIComponent(fullMessage);
    const redirectUrl = `https://wa.me/${siteConfig.whatsappNumber}?text=${encoded}`;
    
    setSubmitted(true);
    window.open(redirectUrl, '_blank', 'noopener,noreferrer');
  };

  const isAddressPlaceholder = siteConfig.businessAddress.includes('[PLACEHOLDER');

  return (
    <div className="bg-bg-cream/20 py-12 font-body">
      <div className="container mx-auto px-4 md:px-8">
        
        {/* Page Header */}
        <div className="text-center max-w-xl mx-auto mb-12">
          <h1 className="font-heading font-extrabold text-3xl md:text-4xl text-text-charcoal">
            Contact Us
          </h1>
          <p className="text-text-muted text-sm md:text-base mt-2">
            Have questions about bulk orders, shipping charges, or customization? Get in touch with us!
          </p>
          <div className="section-divider mt-4" />
        </div>

        <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 md:gap-12 items-start">
          
          {/* Col 1: Contact Details (lg:col-span-5) */}
          <div className="lg:col-span-5 flex flex-col gap-6">
            <h3 className="font-heading font-bold text-2xl text-text-charcoal border-b border-border-warm pb-3">
              Reach Out Directly
            </h3>

            {/* Info Cards */}
            <div className="flex flex-col gap-4">
              
              {/* Address */}
              <div className="flex items-start gap-4 p-4 bg-white rounded-xl border border-border-warm shadow-sm">
                <div className="p-3 bg-primary-green/10 text-primary-green rounded-lg">
                  <MapPin className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="font-bold text-sm text-text-charcoal">Our Kitchen Location</h4>
                  <p className="text-xs md:text-sm text-text-muted mt-1 leading-relaxed">
                    {isAddressPlaceholder ? (
                      <span className="italic text-primary-red font-semibold">Location address coming soon (Godavari, AP)</span>
                    ) : (
                      siteConfig.businessAddress
                    )}
                  </p>
                </div>
              </div>

              {/* Phone */}
              <div className="flex items-start gap-4 p-4 bg-white rounded-xl border border-border-warm shadow-sm">
                <div className="p-3 bg-primary-red/10 text-primary-red rounded-lg">
                  <Phone className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="font-bold text-sm text-text-charcoal">Call Us</h4>
                  <a href={`tel:${siteConfig.phone}`} className="text-xs md:text-sm text-text-muted hover:text-primary-red transition-colors block mt-1">
                    {siteConfig.phone}
                  </a>
                </div>
              </div>

              {/* Email */}
              <div className="flex items-start gap-4 p-4 bg-white rounded-xl border border-border-warm shadow-sm">
                <div className="p-3 bg-accent-gold/10 text-accent-gold-dark rounded-lg">
                  <Mail className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="font-bold text-sm text-text-charcoal">Email Address</h4>
                  <a href={`mailto:${siteConfig.email}`} className="text-xs md:text-sm text-text-muted hover:text-primary-red transition-colors block mt-1 break-all">
                    {siteConfig.email}
                  </a>
                </div>
              </div>

              {/* Timings */}
              <div className="flex items-start gap-4 p-4 bg-white rounded-xl border border-border-warm shadow-sm">
                <div className="p-3 bg-text-charcoal/10 text-text-charcoal rounded-lg">
                  <Clock className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="font-bold text-sm text-text-charcoal">Working Hours</h4>
                  <p className="text-xs md:text-sm text-text-muted mt-1">
                    Monday to Sunday: 9:00 AM — 9:00 PM (IST)
                  </p>
                </div>
              </div>

            </div>
          </div>

          {/* Col 2: Interactive message form via WhatsApp (lg:col-span-7) */}
          <div className="lg:col-span-7 bg-white rounded-2xl border border-border-warm shadow-sm p-6 md:p-8">
            <h3 className="font-heading font-bold text-2xl text-text-charcoal border-b border-border-warm pb-3 mb-6">
              Send a Quick Message
            </h3>

            {submitted ? (
              <div className="text-center py-10">
                <div className="w-16 h-16 rounded-full bg-primary-green/10 text-primary-green flex items-center justify-center mx-auto mb-4 animate-bounce">
                  <Send className="w-8 h-8" />
                </div>
                <h4 className="font-heading font-bold text-xl text-text-charcoal mb-2">Message Prepared!</h4>
                <p className="text-text-muted text-sm max-w-sm mx-auto mb-6">
                  We have prepared your message and launched WhatsApp in a new tab. Please send the message there for a quick response!
                </p>
                <button
                  onClick={() => setSubmitted(false)}
                  className="px-6 py-2 bg-text-charcoal hover:bg-text-charcoal/90 text-white rounded-lg font-bold text-xs transition-colors cursor-pointer"
                >
                  Write Another Message
                </button>
              </div>
            ) : (
              <form onSubmit={handleWhatsAppRedirect} className="flex flex-col gap-4">
                <div className="flex flex-col gap-1.5">
                  <label htmlFor="name" className="text-xs font-bold uppercase text-text-charcoal">
                    Your Name *
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    required
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="Enter your name"
                    className="px-3 py-2.5 rounded-lg border border-border-warm text-sm focus:outline-none focus:border-accent-gold"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label htmlFor="email" className="text-xs font-bold uppercase text-text-charcoal">
                    Email Address (Optional)
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="Enter your email"
                    className="px-3 py-2.5 rounded-lg border border-border-warm text-sm focus:outline-none focus:border-accent-gold"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label htmlFor="message" className="text-xs font-bold uppercase text-text-charcoal">
                    Your Message *
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    required
                    rows={4}
                    value={formData.message}
                    onChange={handleInputChange}
                    placeholder="Write your questions or inquiry details here..."
                    className="px-3 py-2.5 rounded-lg border border-border-warm text-sm focus:outline-none focus:border-accent-gold resize-none"
                  />
                </div>

                <button
                  type="submit"
                  className="flex items-center justify-center gap-2 w-full py-3.5 bg-whatsapp hover:bg-whatsapp-dark text-white rounded-lg font-bold text-sm shadow transition-colors cursor-pointer min-h-[48px]"
                >
                  <MessageCircle className="w-5 h-5 fill-white" />
                  Send Inquiry on WhatsApp
                </button>
              </form>
            )}
          </div>

        </div>

        {/* Embedded Map placeholder */}
        <div className="max-w-5xl mx-auto mt-16">
          <h3 className="font-heading font-bold text-2xl text-text-charcoal mb-6 border-b border-border-warm pb-3">
            Find Us on the Map
          </h3>
          <div className="w-full h-80 rounded-2xl border border-border-warm bg-white overflow-hidden shadow-sm flex items-center justify-center relative">
            <div className="absolute inset-0 bg-bg-cream/40 flex flex-col items-center justify-center text-center p-6">
              <span className="text-5xl mb-3">🗺️</span>
              <h4 className="font-heading font-extrabold text-lg text-text-charcoal">Google Maps Integration</h4>
              <p className="text-text-muted text-xs md:text-sm mt-1 max-w-sm leading-relaxed">
                Google Maps iframe embed will appear here once the business address and coordinates are supplied by the client.
              </p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
