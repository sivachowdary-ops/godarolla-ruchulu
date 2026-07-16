'use client';

import { trustBadges } from '@/config/site';

export function AnnouncementBar() {
  return (
    <div className="w-full bg-primary-green text-bg-cream py-2 overflow-hidden border-b border-accent-gold/20 text-xs md:text-sm font-semibold relative z-50">
      <div className="flex whitespace-nowrap animate-marquee">
        {/* Render twice for continuous loop */}
        <div className="flex justify-around min-w-full shrink-0 gap-8">
          {trustBadges.map((badge, idx) => (
            <span key={`badge-1-${idx}`} className="flex items-center gap-2">
              <span>{badge}</span>
              <span className="text-accent-gold">•</span>
            </span>
          ))}
        </div>
        <div className="flex justify-around min-w-full shrink-0 gap-8">
          {trustBadges.map((badge, idx) => (
            <span key={`badge-2-${idx}`} className="flex items-center gap-2">
              <span>{badge}</span>
              <span className="text-accent-gold">•</span>
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
