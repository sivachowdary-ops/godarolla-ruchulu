// ============================================
// Godarolla Ruchulu — Type Definitions
// ============================================

export type ProductCategory = 'veg' | 'nonveg' | 'podulu' | 'seeds' | 'jellies';

export type OrderStatus = 'new' | 'confirmed' | 'packed' | 'shipped' | 'delivered' | 'cancelled';

export type WeightTier = '250g' | '500g' | '1kg';

export interface Product {
  id: string;
  slug: string;
  name: string;
  nameTelugu?: string;
  category: ProductCategory;
  description: string;
  price250g: number | null;   // null = price TBD
  price500g: number | null;
  price1kg: number | null;
  image: string;
  isVeg: boolean;
  isActive: boolean;
  isPriceTBD: boolean;
  isBestSeller?: boolean;
  ingredients?: string[];
  spiceLevel?: 'mild' | 'medium' | 'hot' | 'extra-hot';
}

export interface CartItem {
  product: Product;
  weight: WeightTier;
  quantity: number;
  price: number;  // price per unit for the selected weight
}

export interface CheckoutFormData {
  fullName: string;
  whatsappNumber: string;
  deliveryAddress: string;
  state: string;
  pincode: string;
  orderNotes?: string;
}

export interface Order {
  id: string;
  orderDate: string;
  customerName: string;
  whatsappNumber: string;
  deliveryAddress: string;
  state: string;
  pincode: string;
  orderNotes?: string;
  items: OrderItem[];
  totalAmount: number;
  status: OrderStatus;
}

export interface OrderItem {
  productId: string;
  productName: string;
  weight: WeightTier;
  quantity: number;
  unitPrice: number;
  subtotal: number;
}

export interface SiteConfig {
  name: string;
  nameTelugu: string;
  tagline: string;
  description: string;
  url: string;
  whatsappNumber: string;
  email: string;
  phone: string;
  businessAddress: string;
  founderName: string;
  founderQuote: string;
  founderPhoto: string;
  minimumOrder: number | null;
  packingChargesNote: string;
  abroadPackingNote: string;
}

export interface FAQItem {
  question: string;
  answer: string;
}

export interface TestimonialItem {
  name: string;
  location: string;
  quote: string;
  rating: number;
  image?: string;
}
