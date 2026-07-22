import { CartProvider } from '@/context/CartContext';
import { Navbar } from '@/components/layout/Navbar';
import { AnnouncementBar } from '@/components/layout/AnnouncementBar';
import { Footer } from '@/components/layout/Footer';
import { WhatsAppButton } from '@/components/ui/WhatsAppButton';
import { CartDrawer } from '@/components/cart/CartDrawer';
import { CheckoutModal } from '@/components/checkout/CheckoutModal';
import { FloatingCartButton } from '@/components/ui/FloatingCartButton';

export default function StorefrontLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <CartProvider>
      <div className="sticky top-0 z-50 w-full flex flex-col">
        <AnnouncementBar />
        <Navbar />
      </div>
      <main className="min-h-screen">{children}</main>
      <Footer />
      <WhatsAppButton />
      <FloatingCartButton />
      <CartDrawer />
      <CheckoutModal />
    </CartProvider>
  );
}
