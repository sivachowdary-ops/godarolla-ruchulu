'use client';

import React, { useEffect, useState } from 'react';
import { useAdmin } from '@/context/AdminContext';
import { useRouter } from 'next/navigation';
import { Order, OrderStatus } from '@/types';
import { formatCurrency } from '@/lib/utils';
import { siteConfig } from '@/config/site';
import {
  ShoppingBag,
  Printer,
  ChevronDown,
  ChevronUp,
  Trash2,
  AlertCircle,
  FileSpreadsheet,
} from 'lucide-react';

export default function AdminOrdersPage() {
  const { isAuthenticated } = useAdmin();
  const router = useRouter();

  const [orders, setOrders] = useState<Order[]>([]);
  const [expandedOrderId, setExpandedOrderId] = useState<string | null>(null);
  const [selectedOrderForInvoice, setSelectedOrderForInvoice] = useState<Order | null>(null);

  // Auth redirect
  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/admin/login');
    }
  }, [isAuthenticated, router]);

  // Load orders
  useEffect(() => {
    if (!isAuthenticated) return;
    try {
      const stored: Order[] = JSON.parse(localStorage.getItem('godarolla-orders') || '[]');
      setOrders(stored);
    } catch {
      // LocalStorage access issues
    }
  }, [isAuthenticated]);

  if (!isAuthenticated) return null;

  const toggleExpand = (id: string) => {
    setExpandedOrderId(expandedOrderId === id ? null : id);
  };

  const handleStatusChange = (orderId: string, newStatus: OrderStatus) => {
    const updated = orders.map((order) => {
      if (order.id === orderId) {
        return { ...order, status: newStatus };
      }
      return order;
    });
    setOrders(updated);
    localStorage.setItem('godarolla-orders', JSON.stringify(updated));
  };

  const handleDeleteOrder = (orderId: string) => {
    if (!window.confirm('Are you sure you want to delete this order from history?')) return;
    const updated = orders.filter((order) => order.id !== orderId);
    setOrders(updated);
    localStorage.setItem('godarolla-orders', JSON.stringify(updated));
    if (expandedOrderId === orderId) setExpandedOrderId(null);
  };

  const handleTriggerInvoice = (order: Order) => {
    setSelectedOrderForInvoice(order);
    // Set timeout to let DOM render print layout, then open print dialog
    setTimeout(() => {
      window.print();
    }, 150);
  };

  const statusColors: Record<OrderStatus, string> = {
    new: 'bg-blue-100 text-blue-800 border-blue-200',
    confirmed: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    packed: 'bg-orange-100 text-orange-800 border-orange-200',
    shipped: 'bg-purple-100 text-purple-800 border-purple-200',
    delivered: 'bg-green-100 text-green-800 border-green-200',
    cancelled: 'bg-red-100 text-red-800 border-red-200',
  };

  return (
    <div className="space-y-8 font-body">
      {/* Header */}
      <div>
        <h1 className="font-heading font-extrabold text-2xl md:text-3xl text-text-charcoal flex items-center gap-2.5">
          <ShoppingBag className="w-8 h-8 text-primary-red" />
          <span>Order Management</span>
        </h1>
        <p className="text-text-muted text-sm mt-1">
          Review, update statuses, and generate thermal receipts for customer orders.
        </p>
      </div>

      {orders.length === 0 ? (
        <div className="bg-white text-center py-16 px-4 border border-border-warm rounded-2xl shadow-sm max-w-xl mx-auto">
          <span className="text-5xl block mb-4">🛒</span>
          <h3 className="font-heading font-extrabold text-lg text-text-charcoal">No Orders Received</h3>
          <p className="text-text-muted text-xs md:text-sm mt-1">
            Orders placed via the WhatsApp checkout flow will appear here automatically.
          </p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-border-warm shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead className="bg-bg-cream/40 border-b border-border-warm text-text-muted text-xs uppercase font-semibold">
                <tr>
                  <th className="py-3 px-4 text-left">Order Details</th>
                  <th className="py-3 px-4 text-left">Customer Info</th>
                  <th className="py-3 px-4 text-center">Status</th>
                  <th className="py-3 px-4 text-right">Total Amount</th>
                  <th className="py-3 px-4 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-bg-cream-dark">
                {orders.map((order) => {
                  const isExpanded = expandedOrderId === order.id;
                  return (
                    <React.Fragment key={order.id}>
                      {/* Main Table Row */}
                      <tr className="hover:bg-bg-cream/10 text-text-charcoal">
                        <td className="py-4 px-4">
                          <button
                            onClick={() => toggleExpand(order.id)}
                            className="flex items-center gap-2 font-semibold text-primary-red text-left cursor-pointer"
                          >
                            {isExpanded ? <ChevronUp className="w-4 h-4 shrink-0" /> : <ChevronDown className="w-4 h-4 shrink-0" />}
                            <span>#{order.id.slice(0, 10)}...</span>
                          </button>
                          <span className="text-[10px] text-text-muted block mt-1">
                            {new Date(order.orderDate).toLocaleString('en-IN', {
                              dateStyle: 'medium',
                              timeStyle: 'short',
                            })}
                          </span>
                        </td>
                        <td className="py-4 px-4">
                          <p className="font-bold">{order.customerName}</p>
                          <p className="text-xs text-text-muted">{order.whatsappNumber}</p>
                        </td>
                        <td className="py-4 px-4 text-center">
                          <select
                            value={order.status}
                            onChange={(e) => handleStatusChange(order.id, e.target.value as OrderStatus)}
                            className={`px-2.5 py-1 text-xs font-bold rounded-full border bg-white focus:outline-none ${statusColors[order.status]}`}
                          >
                            <option value="new">New</option>
                            <option value="confirmed">Confirmed</option>
                            <option value="packed">Packed</option>
                            <option value="shipped">Shipped</option>
                            <option value="delivered">Delivered</option>
                            <option value="cancelled">Cancelled</option>
                          </select>
                        </td>
                        <td className="py-4 px-4 text-right font-extrabold text-text-charcoal">
                          {formatCurrency(order.totalAmount)}
                        </td>
                        <td className="py-4 px-4 text-center flex items-center justify-center gap-2">
                          <button
                            onClick={() => handleTriggerInvoice(order)}
                            className="p-2 bg-accent-gold/15 text-accent-gold-dark hover:bg-accent-gold hover:text-white rounded-lg border border-accent-gold/20 transition-all cursor-pointer"
                            title="Generate Thermal Invoice"
                          >
                            <Printer className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteOrder(order.id)}
                            className="p-2 bg-primary-red/5 text-primary-red hover:bg-primary-red hover:text-white rounded-lg border border-primary-red/10 transition-all cursor-pointer"
                            title="Delete Order"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>

                      {/* Expanded Details Row */}
                      {isExpanded && (
                        <tr className="bg-bg-cream/10 border-b border-border-warm">
                          <td colSpan={5} className="py-4 px-8 text-xs md:text-sm">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
                              {/* Customer Address Details */}
                              <div className="space-y-2 bg-white p-4 border border-border-warm rounded-xl shadow-sm">
                                <h4 className="font-bold text-xs uppercase text-text-muted tracking-wider">Shipping Details</h4>
                                <p><strong>Name:</strong> {order.customerName}</p>
                                <p><strong>WhatsApp:</strong> <a href={`https://wa.me/${order.whatsappNumber}`} target="_blank" rel="noreferrer" className="text-primary-green hover:underline font-semibold">{order.whatsappNumber}</a></p>
                                <p><strong>Address:</strong> {order.deliveryAddress}</p>
                                <p><strong>Location:</strong> {order.state} — Pincode: {order.pincode}</p>
                                {order.orderNotes && (
                                  <div className="mt-3 p-2 bg-primary-red/5 border border-primary-red/10 text-primary-red rounded text-xs flex gap-1.5 items-start">
                                    <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                                    <span><strong>Customer Notes:</strong> {order.orderNotes}</span>
                                  </div>
                                )}
                              </div>

                              {/* Item Details */}
                              <div className="bg-white p-4 border border-border-warm rounded-xl shadow-sm">
                                <h4 className="font-bold text-xs uppercase text-text-muted tracking-wider mb-2">Products Ordered</h4>
                                <div className="divide-y divide-bg-cream-dark max-h-40 overflow-y-auto pr-2">
                                  {order.items.map((item, idx) => (
                                    <div key={idx} className="flex justify-between py-2">
                                      <div>
                                        <p className="font-bold">{item.productName}</p>
                                        <p className="text-xs text-text-muted">{item.weight} × {item.quantity}</p>
                                      </div>
                                      <p className="font-semibold text-text-charcoal shrink-0 mt-2">{formatCurrency(item.subtotal)}</p>
                                    </div>
                                  ))}
                                </div>
                                <div className="border-t border-border-warm pt-3 mt-2 flex justify-between items-baseline">
                                  <span className="font-bold">Estimated Subtotal:</span>
                                  <span className="text-base font-extrabold text-primary-red">{formatCurrency(order.totalAmount)}</span>
                                </div>
                              </div>
                            </div>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ========================================================
          THERMAL RECEIPT PRINT TEMPLATE (Hidden from normal UI view)
          Using absolute units and @media print to layout exactly 
          as a thermal invoice size ~79mm x auto.
          ======================================================== */}
      {selectedOrderForInvoice && (
        <div className="hidden-print-invoice-layout bg-white text-black p-4 font-mono w-[79mm] border border-gray-300 mx-auto leading-tight text-xs">
          {/* Header */}
          <div className="text-center pb-3 border-b border-dashed border-black">
            <h2 className="font-bold text-base uppercase leading-none">{siteConfig.name}</h2>
            <p className="text-[10px] uppercase font-bold mt-1 tracking-wider">{siteConfig.tagline}</p>
            <p className="text-[8px] text-gray-500 mt-1">{siteConfig.phone}</p>
            <p className="text-[8px] text-gray-500">{siteConfig.email}</p>
          </div>

          {/* Metadata */}
          <div className="py-2 border-b border-dashed border-black text-[9px] space-y-1">
            <p><strong>ORDER ID :</strong> {selectedOrderForInvoice.id.slice(0, 15)}</p>
            <p><strong>DATE     :</strong> {new Date(selectedOrderForInvoice.orderDate).toLocaleString('en-IN')}</p>
            <p><strong>STATUS   :</strong> {selectedOrderForInvoice.status.toUpperCase()}</p>
          </div>

          {/* Customer */}
          <div className="py-2 border-b border-dashed border-black text-[9px] space-y-1">
            <p><strong>BILL TO:</strong></p>
            <p className="font-bold uppercase">{selectedOrderForInvoice.customerName}</p>
            <p>TEL: {selectedOrderForInvoice.whatsappNumber}</p>
            <p className="break-all">{selectedOrderForInvoice.deliveryAddress}</p>
            <p>{selectedOrderForInvoice.state} - {selectedOrderForInvoice.pincode}</p>
          </div>

          {/* Items Table */}
          <div className="py-3 border-b border-dashed border-black">
            <div className="grid grid-cols-12 font-bold text-[9px] pb-1 border-b border-dashed border-gray-400">
              <span className="col-span-6">ITEM</span>
              <span className="col-span-2 text-center">QTY</span>
              <span className="col-span-4 text-right">PRICE</span>
            </div>
            <div className="divide-y divide-dashed divide-gray-300">
              {selectedOrderForInvoice.items.map((item, idx) => (
                <div key={idx} className="grid grid-cols-12 text-[9px] py-1">
                  <div className="col-span-6">
                    <span className="font-bold block uppercase">{item.productName}</span>
                    <span className="text-[7px] text-gray-500">PACK: {item.weight}</span>
                  </div>
                  <span className="col-span-2 text-center mt-1">{item.quantity}</span>
                  <span className="col-span-4 text-right mt-1 font-bold">{formatCurrency(item.subtotal)}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Totals */}
          <div className="py-2 text-[10px] space-y-1">
            <div className="flex justify-between font-bold">
              <span>SUBTOTAL:</span>
              <span>{formatCurrency(selectedOrderForInvoice.totalAmount)}</span>
            </div>
            <div className="text-[8px] text-gray-500 text-center italic pt-1 pb-1">
              * Packaging & Delivery Charges Extra
            </div>
          </div>

          {/* Footer */}
          <div className="pt-4 border-t border-dashed border-black text-center text-[9px] space-y-1">
            <p className="font-bold">THANK YOU FOR ORDERING! 🙏</p>
            <p className="text-[7px]">Authentic Godavari Andhra Taste.</p>
          </div>
        </div>
      )}

      {/* Global CSS Styles for printing thermal receipts */}
      <style jsx global>{`
        /* Hide invoice print block during normal browser viewing */
        .hidden-print-invoice-layout {
          display: none;
        }

        @media print {
          /* Hide standard dashboard header, body, sidebar, footer and other elements */
          body * {
            visibility: hidden;
          }

          /* Render only the receipt layout centered */
          .hidden-print-invoice-layout,
          .hidden-print-invoice-layout * {
            visibility: visible;
          }

          .hidden-print-invoice-layout {
            display: block !important;
            position: absolute;
            left: 0;
            top: 0;
            width: 79mm;
            padding: 8px;
            font-family: monospace;
            background: white !important;
            color: black !important;
          }

          /* Force browser page sizes to print receipt size */
          @page {
            size: 79mm auto;
            margin: 0;
          }
        }
      `}</style>
    </div>
  );
}
