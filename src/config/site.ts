// ============================================
// Godarolla Ruchulu — Site Configuration
// ============================================
// All placeholder values are marked with [PLACEHOLDER] or [PLACEHOLDER_*]
// Replace with real values before production deployment.

import { SiteConfig, FAQItem } from '@/types';

export const siteConfig: SiteConfig = {
  name: 'Godarolla Ruchulu',
  nameTelugu: 'గోదారోళ్ల రుచులు',
  tagline: 'VSM 1969',
  description: 'Authentic Andhra Pickles, Straight from the Godavari Kitchen',
  url: 'https://godarolla-ruchulu.vercel.app', // Update with final domain
  whatsappNumber: '918885559508', // Real WhatsApp number (with country code, no + or spaces)
  email: 'contact@godarollaruchulu.com', // [PLACEHOLDER] — Replace with real email
  phone: '+91 88855 59508', // Real phone number
  businessAddress: '[PLACEHOLDER — Supply business address for footer, contact page, and Google Maps]',
  founderName: '[PLACEHOLDER — Supply founder name]',
  founderQuote: '[PLACEHOLDER — Supply founder quote about pickle-making heritage]',
  founderPhoto: '/images/founder.jpg', // [PLACEHOLDER] — Drop founder photo into public/images/
  minimumOrder: null, // [PLACEHOLDER] — Set minimum order value in ₹ (e.g., 200) or null for no minimum
  packingChargesNote: '*Packing Charges Extra',
  abroadPackingNote: '✈️ Abroad-safe packing available — packing charges extra',
};

export const trustBadges = [
  '100% Homemade',
  'No Preservatives',
  'Pan India Shipping',
  'Traditional Recipes',
  'Abroad Packing Available',
  'Authentic Godavari Taste',
];

export const faqData: FAQItem[] = [
  {
    question: 'What is the shelf life of your pickles?',
    answer: 'Our pickles are made with traditional recipes using pure oil and spices. Veg pickles last up to 12 months and non-veg pickles last up to 6 months when stored properly in a cool, dry place. Always use a dry spoon to scoop out the pickle.',
  },
  {
    question: 'Do you ship across India?',
    answer: 'Yes! We ship pan-India. Our pickles are carefully packed to ensure they reach you fresh and without spills. Shipping charges depend on weight and destination.',
  },
  {
    question: 'Is abroad (international) shipping available?',
    answer: 'Yes, we offer special abroad-safe packing for international shipments. Packing charges are extra. Please contact us on WhatsApp for international shipping rates and packaging details.',
  },
  {
    question: 'Is Cash on Delivery (COD) available?',
    answer: 'Payment options will be discussed on WhatsApp after placing your order. We support UPI, bank transfer, and other convenient payment methods.', // [PLACEHOLDER — Update once COD policy is confirmed]
  },
  {
    question: 'Can I place a bulk order for events or gifts?',
    answer: 'Absolutely! We welcome bulk orders for weddings, festivals, corporate gifting, and events. Please reach out to us on WhatsApp to discuss quantities, pricing, and custom packing options.',
  },
  {
    question: 'Are your pickles homemade without preservatives?',
    answer: 'Yes, all our pickles are 100% homemade using traditional Andhra recipes. We use no artificial preservatives, colors, or flavors. Only pure ingredients — fresh vegetables, meat, premium spices, and cold-pressed oil.',
  },
  {
    question: 'How does packing charges work?',
    answer: 'Packing charges are extra and vary based on the order size and shipping destination. We use high-quality, leak-proof containers. Abroad shipments require special packing. Exact charges will be shared on WhatsApp during order confirmation.',
  },
  {
    question: 'Can I customize the spice level?',
    answer: 'We prepare our pickles in the authentic Andhra style with traditional spice levels. If you have a specific preference, mention it in the order notes and we will do our best to accommodate it.',
  },
];

export const howToOrderSteps = [
  {
    step: 1,
    title: 'Choose Your Pickle',
    description: 'Browse our collection of authentic veg and non-veg Andhra pickles.',
    icon: 'search',
  },
  {
    step: 2,
    title: 'Select Weight',
    description: 'Pick your preferred pack size — 250g, 500g, or 1kg.',
    icon: 'weight',
  },
  {
    step: 3,
    title: 'Add to Cart',
    description: 'Add your favorite pickles to the cart and review your order.',
    icon: 'shoppingCart',
  },
  {
    step: 4,
    title: 'Fill Delivery Details',
    description: 'Enter your name, WhatsApp number, and delivery address.',
    icon: 'mapPin',
  },
  {
    step: 5,
    title: 'Order via WhatsApp',
    description: 'Your order is sent to us on WhatsApp. We confirm and ship!',
    icon: 'messageCircle',
  },
];

export const indianStates = [
  'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh',
  'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand',
  'Karnataka', 'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Manipur',
  'Meghalaya', 'Mizoram', 'Nagaland', 'Odisha', 'Punjab',
  'Rajasthan', 'Sikkim', 'Tamil Nadu', 'Telangana', 'Tripura',
  'Uttar Pradesh', 'Uttarakhand', 'West Bengal',
  'Andaman and Nicobar Islands', 'Chandigarh', 'Dadra and Nagar Haveli and Daman and Diu',
  'Delhi', 'Jammu and Kashmir', 'Ladakh', 'Lakshadweep', 'Puducherry',
];
