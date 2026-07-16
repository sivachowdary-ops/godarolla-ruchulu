// ============================================
// Godarolla Ruchulu — Utility Functions
// ============================================

import { CartItem, CheckoutFormData } from '@/types';
import { siteConfig } from '@/config/site';

/**
 * Generate a unique order ID
 */
export function generateOrderId(): string {
  const timestamp = Date.now().toString(36).toUpperCase();
  const random = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `GR-${timestamp}-${random}`;
}

/**
 * Format cart items into a WhatsApp order message
 */
export function formatWhatsAppOrderMessage(
  items: CartItem[],
  formData: CheckoutFormData,
  totalAmount: number,
  orderId: string
): string {
  const itemLines = items.map((item, index) => {
    const subtotal = item.price * item.quantity;
    return `${index + 1}. ${item.product.name} — ${item.weight} × ${item.quantity} = ₹${subtotal}`;
  }).join('\n');

  const message = `🛒 *New Order — ${siteConfig.name}*
Order ID: *${orderId}*

${itemLines}

💰 *Total: ₹${totalAmount}*
_(${siteConfig.packingChargesNote})_

👤 *Name:* ${formData.fullName}
📱 *WhatsApp:* ${formData.whatsappNumber}
📍 *Address:* ${formData.deliveryAddress}
🏛️ *State:* ${formData.state}
📮 *Pincode:* ${formData.pincode}${formData.orderNotes ? `\n📝 *Notes:* ${formData.orderNotes}` : ''}

Please confirm my order. Thank you! 🙏`;

  return message;
}

/**
 * Build the WhatsApp redirect URL
 */
export function buildWhatsAppUrl(message: string): string {
  const encoded = encodeURIComponent(message);
  return `https://wa.me/${siteConfig.whatsappNumber}?text=${encoded}`;
}

/**
 * Build a general WhatsApp inquiry URL
 */
export function buildWhatsAppInquiryUrl(productName?: string): string {
  const message = productName
    ? `Hello ${siteConfig.name}! I'd like to know more about ${productName}. I visited your website.`
    : `Hello ${siteConfig.name}! I have visited your website and I would like to make an order/inquiry.`;
  const encoded = encodeURIComponent(message);
  return `https://wa.me/${siteConfig.whatsappNumber}?text=${encoded}`;
}

/**
 * Calculate cart total
 */
export function calculateCartTotal(items: CartItem[]): number {
  return items.reduce((total, item) => total + item.price * item.quantity, 0);
}

/**
 * Format currency in INR
 */
export function formatCurrency(amount: number): string {
  return `₹${amount.toLocaleString('en-IN')}`;
}

/**
 * Validate Indian pincode
 */
export function isValidPincode(pincode: string): boolean {
  return /^[1-9][0-9]{5}$/.test(pincode);
}

/**
 * Validate Indian mobile number
 */
export function isValidMobile(number: string): boolean {
  const cleaned = number.replace(/\D/g, '');
  return /^[6-9]\d{9}$/.test(cleaned) || /^91[6-9]\d{9}$/.test(cleaned);
}

/**
 * Classnames utility (lightweight cn alternative)
 */
export function cn(...classes: (string | boolean | undefined | null)[]): string {
  return classes.filter(Boolean).join(' ');
}
