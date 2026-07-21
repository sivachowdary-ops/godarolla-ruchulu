'use client';

import React, { useState } from 'react';
import { useCart } from '@/context/CartContext';
import { CheckoutFormData } from '@/types';
import {
  generateOrderId,
  formatWhatsAppOrderMessage,
  buildWhatsAppUrl,
  formatCurrency,
  isValidMobile,
  isValidPincode,
} from '@/lib/utils';
import { X, ClipboardCheck, Sparkles, AlertCircle } from 'lucide-react';
import { WhatsAppIcon } from '../ui/WhatsAppIcon';
import { siteConfig, indianStates } from '@/config/site';

export function CheckoutModal() {
  const {
    items,
    isCheckoutOpen,
    setIsCheckoutOpen,
    getCartTotal,
    clearCart,
  } = useCart();

  const [formData, setFormData] = useState<CheckoutFormData>({
    fullName: '',
    whatsappNumber: '',
    deliveryAddress: '',
    state: 'Andhra Pradesh',
    pincode: '',
    orderNotes: '',
  });

  const [errors, setErrors] = useState<Partial<Record<keyof CheckoutFormData, string>>>({});
  const [successOrderInfo, setSuccessOrderInfo] = useState<{ id: string; msgUrl: string } | null>(null);

  if (!isCheckoutOpen) return null;

  const total = getCartTotal();

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear error on change
    if (errors[name as keyof CheckoutFormData]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof CheckoutFormData, string>> = {};

    if (!formData.fullName.trim()) {
      newErrors.fullName = 'Full Name is required';
    }

    if (!formData.whatsappNumber.trim()) {
      newErrors.whatsappNumber = 'WhatsApp Number is required';
    } else if (!isValidMobile(formData.whatsappNumber)) {
      newErrors.whatsappNumber = 'Please enter a valid 10-digit mobile number';
    }

    if (!formData.deliveryAddress.trim()) {
      newErrors.deliveryAddress = 'Delivery Address is required';
    }

    if (!formData.state) {
      newErrors.state = 'State is required';
    }

    if (!formData.pincode.trim()) {
      newErrors.pincode = 'Pincode is required';
    } else if (!isValidPincode(formData.pincode)) {
      newErrors.pincode = 'Please enter a valid 6-digit Indian pincode';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    const orderId = generateOrderId();
    const formattedMessage = formatWhatsAppOrderMessage(items, formData, total, orderId);
    const redirectUrl = buildWhatsAppUrl(formattedMessage);

    // Save order data to local history for administrative/dashboard tracking if needed
    try {
      const existingOrders = JSON.parse(localStorage.getItem('godarolla-orders') || '[]');
      const newOrder = {
        id: orderId,
        orderDate: new Date().toISOString(),
        customerName: formData.fullName,
        whatsappNumber: formData.whatsappNumber,
        deliveryAddress: formData.deliveryAddress,
        state: formData.state,
        pincode: formData.pincode,
        orderNotes: formData.orderNotes,
        items: items.map((item) => ({
          productId: item.product.id,
          productName: item.product.name,
          weight: item.weight,
          quantity: item.quantity,
          unitPrice: item.price,
          subtotal: item.price * item.quantity,
        })),
        totalAmount: total,
        status: 'new',
      };
      localStorage.setItem('godarolla-orders', JSON.stringify([newOrder, ...existingOrders]));
    } catch {
      // Local storage full or private browsing
    }

    // Set success state
    setSuccessOrderInfo({ id: orderId, msgUrl: redirectUrl });

    // Open WhatsApp redirect immediately
    window.open(redirectUrl, '_blank', 'noopener,noreferrer');
  };

  const handleClose = () => {
    setIsCheckoutOpen(false);
    setSuccessOrderInfo(null);
  };

  const handleSuccessClose = () => {
    clearCart();
    handleClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-text-charcoal/60 backdrop-blur-sm flex items-center justify-center p-4">
      {/* Modal Card */}
      <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl border border-border-warm overflow-hidden max-h-[90vh] flex flex-col scale-100 transition-all duration-300">
        
        {/* Modal Header */}
        <div className="p-4 md:p-6 border-b border-border-warm flex items-center justify-between bg-bg-cream/30">
          <h2 className="font-heading font-extrabold text-xl text-text-charcoal">
            {successOrderInfo ? 'Order Processed!' : 'Checkout Details'}
          </h2>
          <button
            onClick={successOrderInfo ? handleSuccessClose : handleClose}
            className="p-1 rounded-full hover:bg-bg-cream-dark transition-colors cursor-pointer text-text-charcoal hover:text-primary-red"
            aria-label="Close Modal"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex-grow overflow-y-auto p-4 md:p-6">
          {successOrderInfo ? (
            /* Success confirmation screen */
            <div className="text-center py-6 flex flex-col items-center">
              <div className="w-20 h-20 rounded-full bg-primary-green/10 flex items-center justify-center text-primary-green mb-6 animate-pulse">
                <ClipboardCheck className="w-10 h-10" />
              </div>
              
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-accent-gold/20 text-accent-gold-dark text-xs font-bold mb-4">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Order ID: {successOrderInfo.id}</span>
              </div>

              <h3 className="font-heading font-extrabold text-2xl text-text-charcoal mb-3">
                Order Placed Successfully!
              </h3>
              <p className="text-text-muted text-sm leading-relaxed max-w-sm mb-6">
                Your order summary has been prepared and opened in WhatsApp. Please send the message to us to confirm and complete your order.
              </p>

              <div className="w-full bg-bg-cream border border-border-warm rounded-xl p-4 mb-8 text-left text-xs md:text-sm font-body">
                <p className="font-bold text-text-charcoal mb-2">Next Steps:</p>
                <ol className="list-decimal pl-4 flex flex-col gap-1.5 text-text-muted">
                  <li>Send the pre-filled message in the WhatsApp window.</li>
                  <li>We will reply with payment details (UPI/Transfer) and packaging fees.</li>
                  <li>Once payment is confirmed, your pickles will be freshly packed and shipped!</li>
                </ol>
              </div>

              <div className="flex flex-col gap-3 w-full">
                <a
                  href={successOrderInfo.msgUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 w-full py-3.5 bg-whatsapp hover:bg-whatsapp-dark text-white rounded-lg font-bold text-sm shadow-md transition-colors"
                >
                  <WhatsAppIcon className="w-5 h-5" />
                  Resend WhatsApp Message
                </a>
                <button
                  onClick={handleSuccessClose}
                  className="w-full py-3 bg-text-charcoal hover:bg-text-charcoal/90 text-white rounded-lg font-bold text-sm transition-colors cursor-pointer"
                >
                  Continue Shopping
                </button>
              </div>
            </div>
          ) : (
            /* Checkout Form */
            <form onSubmit={handleSubmit} className="flex flex-col gap-6">
              
              {/* Order Summary Summary */}
              <div className="bg-bg-cream/40 border border-border-warm rounded-xl p-4 font-body">
                <h4 className="font-bold text-xs uppercase text-text-muted tracking-wider mb-2">Order Summary</h4>
                <div className="max-h-28 overflow-y-auto mb-3 flex flex-col gap-2 border-b border-border-warm pb-3">
                  {items.map((item) => (
                    <div key={`${item.product.id}-${item.weight}`} className="flex justify-between text-xs md:text-sm text-text-charcoal">
                      <span className="truncate max-w-[70%]">
                        {item.product.name} ({item.weight}) × {item.quantity}
                      </span>
                      <span className="font-semibold text-text-muted shrink-0">
                        {formatCurrency(item.price * item.quantity)}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="flex justify-between items-baseline mb-2">
                  <span className="text-sm font-bold text-text-charcoal">Total Amount:</span>
                  <span className="text-xl font-extrabold text-primary-red">
                    {formatCurrency(total)}
                  </span>
                </div>

                <div className="text-[11px] text-text-muted flex flex-col gap-1">
                  <p className="font-bold text-primary-red">{siteConfig.packingChargesNote}</p>
                  <p>{siteConfig.abroadPackingNote}</p>
                </div>
              </div>

              {/* Form Fields */}
              <div className="flex flex-col gap-4">
                
                {/* Full Name */}
                <div className="flex flex-col gap-1.5">
                  <label htmlFor="fullName" className="text-xs font-bold uppercase text-text-charcoal tracking-wide flex items-center justify-between">
                    <span>Full Name *</span>
                    {errors.fullName && <span className="text-primary-red flex items-center gap-0.5 lowercase font-normal text-[10px]"><AlertCircle className="w-3 h-3" /> {errors.fullName}</span>}
                  </label>
                  <input
                    type="text"
                    id="fullName"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleInputChange}
                    placeholder="Enter your full name"
                    autoComplete="name"
                    className={`px-3 py-2.5 rounded-lg border text-sm focus:outline-none transition-all ${
                      errors.fullName ? 'border-primary-red bg-primary-red/5' : 'border-border-warm focus:border-accent-gold'
                    }`}
                  />
                </div>

                {/* WhatsApp Number */}
                <div className="flex flex-col gap-1.5">
                  <label htmlFor="whatsappNumber" className="text-xs font-bold uppercase text-text-charcoal tracking-wide flex items-center justify-between">
                    <span>WhatsApp Number *</span>
                    {errors.whatsappNumber && <span className="text-primary-red flex items-center gap-0.5 lowercase font-normal text-[10px]"><AlertCircle className="w-3 h-3" /> {errors.whatsappNumber}</span>}
                  </label>
                  <input
                    type="tel"
                    id="whatsappNumber"
                    name="whatsappNumber"
                    value={formData.whatsappNumber}
                    onChange={handleInputChange}
                    placeholder="E.g., 9876543210 (10-digit)"
                    inputMode="tel"
                    autoComplete="tel"
                    className={`px-3 py-2.5 rounded-lg border text-sm focus:outline-none transition-all ${
                      errors.whatsappNumber ? 'border-primary-red bg-primary-red/5' : 'border-border-warm focus:border-accent-gold'
                    }`}
                  />
                </div>

                {/* State & Pincode Row */}
                <div className="grid grid-cols-2 gap-4">
                  
                  {/* State */}
                  <div className="flex flex-col gap-1.5">
                    <label htmlFor="state" className="text-xs font-bold uppercase text-text-charcoal tracking-wide flex items-center justify-between">
                      <span>State *</span>
                    </label>
                    <select
                      id="state"
                      name="state"
                      value={formData.state}
                      onChange={handleInputChange}
                      autoComplete="address-level1"
                      className="px-3 py-2.5 rounded-lg border border-border-warm text-sm focus:outline-none focus:border-accent-gold bg-white"
                    >
                      {indianStates.map((state) => (
                        <option key={state} value={state}>
                          {state}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Pincode */}
                  <div className="flex flex-col gap-1.5">
                    <label htmlFor="pincode" className="text-xs font-bold uppercase text-text-charcoal tracking-wide flex items-center justify-between">
                      <span>Pincode *</span>
                      {errors.pincode && <span className="text-primary-red flex items-center gap-0.5 lowercase font-normal text-[10px]"><AlertCircle className="w-3 h-3" /> {errors.pincode}</span>}
                    </label>
                    <input
                      type="text"
                      id="pincode"
                      name="pincode"
                      value={formData.pincode}
                      onChange={handleInputChange}
                      placeholder="6-digit pincode"
                      maxLength={6}
                      inputMode="numeric"
                      autoComplete="postal-code"
                      className={`px-3 py-2.5 rounded-lg border text-sm focus:outline-none transition-all ${
                        errors.pincode ? 'border-primary-red bg-primary-red/5' : 'border-border-warm focus:border-accent-gold'
                      }`}
                    />
                  </div>
                </div>

                {/* Delivery Address */}
                <div className="flex flex-col gap-1.5">
                  <label htmlFor="deliveryAddress" className="text-xs font-bold uppercase text-text-charcoal tracking-wide flex items-center justify-between">
                    <span>Delivery Address *</span>
                    {errors.deliveryAddress && <span className="text-primary-red flex items-center gap-0.5 lowercase font-normal text-[10px]"><AlertCircle className="w-3 h-3" /> {errors.deliveryAddress}</span>}
                  </label>
                  <textarea
                    id="deliveryAddress"
                    name="deliveryAddress"
                    value={formData.deliveryAddress}
                    onChange={handleInputChange}
                    placeholder="Enter complete shipping address (House No, Street, Landmark, City)"
                    rows={3}
                    autoComplete="street-address"
                    className={`px-3 py-2.5 rounded-lg border text-sm focus:outline-none transition-all resize-none ${
                      errors.deliveryAddress ? 'border-primary-red bg-primary-red/5' : 'border-border-warm focus:border-accent-gold'
                    }`}
                  />
                </div>

                {/* Order Notes */}
                <div className="flex flex-col gap-1.5">
                  <label htmlFor="orderNotes" className="text-xs font-bold uppercase text-text-charcoal tracking-wide">
                    <span>Order Notes (Optional)</span>
                  </label>
                  <textarea
                    id="orderNotes"
                    name="orderNotes"
                    value={formData.orderNotes}
                    onChange={handleInputChange}
                    placeholder="E.g., Spice level preference, custom quantity, special instructions"
                    rows={2}
                    className="px-3 py-2.5 rounded-lg border border-border-warm text-sm focus:outline-none focus:border-accent-gold resize-none"
                  />
                </div>
              </div>

              {/* Submit CTA */}
              <button
                type="submit"
                className="flex items-center justify-center gap-2 w-full py-4 bg-primary-green hover:bg-primary-green-dark text-white rounded-lg font-bold text-sm shadow-md hover:shadow-lg transition-all cursor-pointer min-h-[48px]"
              >
                <WhatsAppIcon className="w-5 h-5" />
                Place Order via WhatsApp
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
