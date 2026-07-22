import { HeroSection } from '@/components/home/HeroSection';
import { CategoryShowcase } from '@/components/home/CategoryShowcase';
import { BestSellers } from '@/components/home/BestSellers';
import { AbroadPacking } from '@/components/home/AbroadPacking';
import { FounderStory } from '@/components/home/FounderStory';
import { HowToOrder } from '@/components/home/HowToOrder';
import { Testimonials } from '@/components/home/Testimonials';
import { FAQ } from '@/components/home/FAQ';

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* 1. Hero banner section */}
      <HeroSection />

      {/* 2. Explore Categories (Veg / Non-Veg tiles) */}
      <CategoryShowcase />

      {/* 3. Best Sellers grid */}
      <BestSellers />

      {/* 4. Abroad Packing Callout */}
      <AbroadPacking />

      {/* 5. How to Order (Numbered Steps) */}
      <HowToOrder />

      {/* 6. Founder Heritage story */}
      <FounderStory />

      {/* 7. Testimonials placeholder */}
      <Testimonials />

      {/* 8. FAQ accordion */}
      <FAQ />
    </div>
  );
}
