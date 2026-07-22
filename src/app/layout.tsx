import type { Metadata } from 'next';
import { Playfair_Display, Inter, Noto_Sans_Telugu } from 'next/font/google';
import './globals.css';


const playfairDisplay = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-heading',
  display: 'swap',
  weight: ['400', '500', '600', '700', '800', '900'],
});

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-body',
  display: 'swap',
});

const notoSansTelugu = Noto_Sans_Telugu({
  subsets: ['telugu'],
  variable: '--font-telugu',
  display: 'swap',
  weight: ['400', '500', '600', '700'],
});

export const viewport = {
  themeColor: '#e3d5ca',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  viewportFit: 'cover',
};

export const metadata: Metadata = {
  metadataBase: new URL('https://godarolla-ruchulu.vercel.app'),
  title: {
    default: 'Godarolla Ruchulu — Authentic Andhra Pickles Online | VSM 1969',
    template: '%s | Godarolla Ruchulu',
  },
  description:
    'Order authentic Andhra pickles online from Godarolla Ruchulu (VSM 1969). Homemade avakaya, gongura, chicken pickle, prawn pickle & more. Traditional Godavari recipes, no preservatives. Pan India & abroad shipping.',
  keywords: [
    'Andhra pickles online',
    'Godavari pickle',
    'buy avakaya online',
    'chicken pickle online',
    'mutton pickle online',
    'prawn pickle Andhra',
    'gongura pickle',
    'homemade pickles India',
    'Telugu pickles',
    'Godarolla Ruchulu',
    'VSM 1969',
    'traditional Andhra pickle',
    'no preservatives pickle',
  ],
  authors: [{ name: 'Godarolla Ruchulu' }],
  creator: 'Godarolla Ruchulu',
  openGraph: {
    type: 'website',
    locale: 'en_IN',
    url: 'https://godarolla-ruchulu.vercel.app',
    siteName: 'Godarolla Ruchulu',
    title: 'Godarolla Ruchulu — Authentic Andhra Pickles Online | VSM 1969',
    description:
      'Order authentic homemade Andhra pickles from Godarolla Ruchulu. Traditional Godavari recipes — Avakaya, Gongura, Chicken, Prawn & more. No preservatives. Pan India shipping.',
    images: [
      {
        url: '/images/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Godarolla Ruchulu — Authentic Andhra Pickles',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Godarolla Ruchulu — Authentic Andhra Pickles Online',
    description:
      'Homemade Andhra pickles from the Godavari kitchen. Order Avakaya, Gongura, Chicken Pickle & more online.',
    images: ['/images/og-image.jpg'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      data-scroll-behavior="smooth"
      className={`${playfairDisplay.variable} ${inter.variable} ${notoSansTelugu.variable}`}
    >
      <body className="font-body bg-bg-cream text-text-charcoal antialiased">
        {children}
      </body>
    </html>
  );
}
