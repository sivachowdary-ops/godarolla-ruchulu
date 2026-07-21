import React from 'react';
import Link from 'next/link';
import { getDashboardStats } from '@/app/actions/admin-mutations';
import { LayoutDashboard, ShoppingBag, Database, ArrowRight, ShieldCheck, Box } from 'lucide-react';

export default async function AdminDashboardPage() {
  const stats = await getDashboardStats().catch(() => ({
    activeProducts: 0,
    inactiveProducts: 0,
    totalCategories: 0,
    totalProducts: 0,
  }));

  const cardItems = [
    {
      title: 'Active Products',
      value: stats.activeProducts,
      desc: 'Pickles active in catalog',
      icon: Database,
      color: 'bg-primary-green/10 text-primary-green',
    },
    {
      title: 'Inactive Products',
      value: stats.inactiveProducts,
      desc: 'Archived pickles',
      icon: Box,
      color: 'bg-text-muted/10 text-text-muted',
    },
    {
      title: 'Categories',
      value: stats.totalCategories,
      desc: 'Product categories',
      icon: LayoutDashboard,
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

      {/* Quick actions panel */}
      <div className="bg-white rounded-2xl border border-border-warm p-6 shadow-sm max-w-md">
        <h3 className="font-heading font-bold text-xl text-text-charcoal border-b border-border-warm pb-3 mb-4">
          Quick Shortcuts
        </h3>
        <div className="flex flex-col gap-3 font-body">
          <Link
            href="/admin/products"
            className="flex items-center justify-between p-3.5 bg-bg-cream/30 hover:bg-bg-cream border border-border-warm rounded-xl text-xs md:text-sm font-semibold transition-all group"
          >
            <span>Manage Products</span>
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
  );
}
