'use client';

import React, { useEffect, useState } from 'react';
import { useAdmin } from '@/context/AdminContext';
import { useRouter } from 'next/navigation';
import { products } from '@/data/products';
import { Order } from '@/types';
import { formatCurrency } from '@/lib/utils';
import { LayoutDashboard, ShoppingBag, Database, ArrowRight, ShieldCheck } from 'lucide-react';
import Link from 'next/link';

export default function AdminDashboardPage() {
  const { isAuthenticated } = useAdmin();
  const router = useRouter();

  const [orders, setOrders] = useState<Order[]>([]);
  const [stats, setStats] = useState({
    activeProducts: 0,
    totalOrders: 0,
    totalRevenue: 0,
  });

  // Redirect check
  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/admin/login');
    }
  }, [isAuthenticated, router]);

  // Load orders and calculate metrics
  useEffect(() => {
    if (!isAuthenticated) return;

    try {
      const activeCount = products.filter((p) => p.isActive).length;
      const storedOrders: Order[] = JSON.parse(localStorage.getItem('godarolla-orders') || '[]');
      
      const totalRev = storedOrders
        .filter((o) => o.status !== 'cancelled')
        .reduce((sum, o) => sum + o.totalAmount, 0);

      setOrders(storedOrders.slice(0, 5)); // show top 5 recent
      setStats({
        activeProducts: activeCount,
        totalOrders: storedOrders.length,
        totalRevenue: totalRev,
      });
    } catch {
      // LocalStorage access issues
    }
  }, [isAuthenticated]);

  if (!isAuthenticated) return null;

  const cardItems = [
    {
      title: 'Active Products',
      value: stats.activeProducts,
      desc: 'Pickles active in catalog',
      icon: Database,
      color: 'bg-primary-green/10 text-primary-green',
    },
    {
      title: 'Total Orders',
      value: stats.totalOrders,
      desc: 'Placed via WhatsApp checkout',
      icon: ShoppingBag,
      color: 'bg-primary-red/10 text-primary-red',
    },
    {
      title: 'Total Revenue',
      value: formatCurrency(stats.totalRevenue),
      desc: 'Estimated storefront total',
      icon: ShieldCheck,
      color: 'bg-accent-gold/25 text-accent-gold-dark',
    },
  ];

  return (
    <div className="space-y-8 font-body">
      {/* Header */}
      <div>
        <h1 className="font-heading font-extrabold text-2xl md:text-3xl text-text-charcoal flex items-center gap-2.5">
          <LayoutDashboard className="w-8 h-8 text-primary-red" />
          <span>Dashboard Overview</span>
        </h1>
        <p className="text-text-muted text-sm mt-1">
          Store statistics and summary metrics for Godarolla Ruchulu.
        </p>
      </div>

      {/* Metrics Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {cardItems.map((card) => {
          const Icon = card.icon;
          return (
            <div key={card.title} className="bg-white p-6 border border-border-warm rounded-2xl shadow-sm flex items-center gap-5">
              <div className={`p-4 rounded-xl shrink-0 ${card.color}`}>
                <Icon className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-xs uppercase font-bold text-text-muted tracking-wider">{card.title}</h3>
                <p className="text-2xl font-extrabold text-text-charcoal mt-1 leading-none">{card.value}</p>
                <p className="text-[10px] text-text-muted mt-2">{card.desc}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Main Panel grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Recent orders (Col span 2) */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-border-warm p-6 shadow-sm flex flex-col justify-between">
          <div>
            <h3 className="font-heading font-bold text-xl text-text-charcoal border-b border-border-warm pb-3 mb-4 flex justify-between items-center">
              <span>Recent Orders</span>
              <Link href="/admin/orders" className="text-xs font-semibold text-primary-red hover:text-primary-red-dark flex items-center gap-1">
                View All <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </h3>

            {orders.length === 0 ? (
              <div className="text-center py-12">
                <span className="text-4xl block mb-2">🛒</span>
                <p className="text-text-muted text-sm">No orders received yet.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full text-sm">
                  <thead>
                    <tr className="border-b border-border-warm text-text-muted text-xs uppercase text-left font-semibold">
                      <th className="py-2.5">Order ID</th>
                      <th className="py-2.5">Customer</th>
                      <th className="py-2.5">Date</th>
                      <th className="py-2.5 text-right">Total</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-bg-cream-dark">
                    {orders.map((order) => (
                      <tr key={order.id} className="text-text-charcoal hover:bg-bg-cream/10">
                        <td className="py-3 font-semibold text-xs text-primary-red">{order.id.slice(0, 10)}...</td>
                        <td className="py-3">{order.customerName}</td>
                        <td className="py-3 text-text-muted">{new Date(order.orderDate).toLocaleDateString()}</td>
                        <td className="py-3 text-right font-bold">{formatCurrency(order.totalAmount)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>

        {/* Quick actions panel */}
        <div className="bg-white rounded-2xl border border-border-warm p-6 shadow-sm">
          <h3 className="font-heading font-bold text-xl text-text-charcoal border-b border-border-warm pb-3 mb-4">
            Quick Shortcuts
          </h3>
          <div className="flex flex-col gap-3 font-body">
            <Link
              href="/admin/orders"
              className="flex items-center justify-between p-3.5 bg-bg-cream/30 hover:bg-bg-cream border border-border-warm rounded-xl text-xs md:text-sm font-semibold transition-all group"
            >
              <span>Manage Pending Orders</span>
              <ArrowRight className="w-4 h-4 text-text-muted group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              href="/admin/products"
              className="flex items-center justify-between p-3.5 bg-bg-cream/30 hover:bg-bg-cream border border-border-warm rounded-xl text-xs md:text-sm font-semibold transition-all group"
            >
              <span>Edit Pickle Prices</span>
              <ArrowRight className="w-4 h-4 text-text-muted group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              href="/products"
              className="flex items-center justify-between p-3.5 bg-bg-cream/30 hover:bg-bg-cream border border-border-warm rounded-xl text-xs md:text-sm font-semibold transition-all group"
            >
              <span>Visit Storefront Catalog</span>
              <ArrowRight className="w-4 h-4 text-text-muted group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
}
