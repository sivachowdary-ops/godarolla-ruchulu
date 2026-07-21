'use client';

import { useState, useEffect } from 'react';
import { WhatsAppIcon } from './WhatsAppIcon';
import { buildWhatsAppInquiryUrl } from '@/lib/utils';

export function WhatsAppButton() {
  const [showTooltip, setShowTooltip] = useState(false);

  useEffect(() => {
    // Show tooltip 3 seconds after load to engage user
    const timer = setTimeout(() => {
      setShowTooltip(true);
    }, 3000);

    // Hide tooltip after 8 seconds
    const hideTimer = setTimeout(() => {
      setShowTooltip(false);
    }, 8000);

    return () => {
      clearTimeout(timer);
      clearTimeout(hideTimer);
    };
  }, []);

  const handleClick = () => {
    const url = buildWhatsAppInquiryUrl();
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="fixed bottom-6 right-6 z-40 flex items-center gap-3">
      {/* Tooltip */}
      {showTooltip && (
        <div className="bg-text-charcoal text-white text-xs font-semibold px-3 py-2 rounded-lg shadow-xl relative animate-fade-in border border-border-warm hidden md:block">
          <span>Need help? Chat with us! 🌶️</span>
          <div className="absolute right-[-6px] top-1/2 -translate-y-1/2 w-3 h-3 bg-text-charcoal rotate-45 border-r border-t border-border-warm" />
        </div>
      )}

      {/* Floating Button */}
      <button
        onClick={handleClick}
        className="w-14 h-14 bg-whatsapp hover:bg-whatsapp-dark text-white rounded-full flex items-center justify-center shadow-2xl hover:shadow-whatsapp/50 transition-all duration-300 hover:scale-110 cursor-pointer whatsapp-pulse"
        aria-label="Chat on WhatsApp"
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
      >
        <WhatsAppIcon className="w-7 h-7" />
      </button>
    </div>
  );
}
