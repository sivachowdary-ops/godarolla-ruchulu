'use client';

import React, { useEffect, useState } from 'react';
import { useAdmin } from '@/context/AdminContext';
import { useRouter } from 'next/navigation';
import { Product } from '@/types';
import { products as staticProducts } from '@/data/products';
import { Database, Edit, Save, X, ToggleLeft, ToggleRight, Sparkles, Check } from 'lucide-react';
import { formatCurrency } from '@/lib/utils';
import Image from 'next/image';

export default function AdminProductsPage() {
  const { isAuthenticated } = useAdmin();
  const router = useRouter();

  const [products, setProducts] = useState<Product[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<{
    price250g: string;
    price500g: string;
    price1kg: string;
  }>({
    price250g: '',
    price500g: '',
    price1kg: '',
  });

  const [saveSuccess, setSaveSuccess] = useState(false);

  // Auth check
  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/admin/login');
    }
  }, [isAuthenticated, router]);

  // Load products (local storage overrides static if edited previously)
  useEffect(() => {
    if (!isAuthenticated) return;

    try {
      const stored = localStorage.getItem('godarolla-products');
      if (stored) {
        setProducts(JSON.parse(stored));
      } else {
        setProducts(staticProducts);
      }
    } catch {
      setProducts(staticProducts);
    }
  }, [isAuthenticated]);

  if (!isAuthenticated) return null;

  const handleToggleActive = (productId: string) => {
    const updated = products.map((p) => {
      if (p.id === productId) {
        return { ...p, isActive: !p.isActive };
      }
      return p;
    });
    setProducts(updated);
    localStorage.setItem('godarolla-products', JSON.stringify(updated));
  };

  const handleStartEdit = (product: Product) => {
    setEditingId(product.id);
    setEditForm({
      price250g: product.price250g !== null ? String(product.price250g) : '',
      price500g: product.price500g !== null ? String(product.price500g) : '',
      price1kg: product.price1kg !== null ? String(product.price1kg) : '',
    });
  };

  const handleCancelEdit = () => {
    setEditingId(null);
  };

  const handleSaveEdit = (productId: string) => {
    const p250 = editForm.price250g.trim() === '' ? null : Number(editForm.price250g);
    const p500 = editForm.price500g.trim() === '' ? null : Number(editForm.price500g);
    const p1kg = editForm.price1kg.trim() === '' ? null : Number(editForm.price1kg);

    if (
      (p250 !== null && isNaN(p250)) ||
      (p500 !== null && isNaN(p500)) ||
      (p1kg !== null && isNaN(p1kg))
    ) {
      alert('Prices must be valid numbers or empty.');
      return;
    }

    const updated = products.map((p) => {
      if (p.id === productId) {
        return {
          ...p,
          price250g: p250,
          price500g: p500,
          price1kg: p1kg,
          // If pricing is added, remove TBD marker
          isPriceTBD: p250 === null && p500 === null && p1kg === null,
        };
      }
      return p;
    });

    setProducts(updated);
    localStorage.setItem('godarolla-products', JSON.stringify(updated));
    setEditingId(null);

    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 2000);
  };

  return (
    <div className="space-y-8 font-body">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-heading font-extrabold text-2xl md:text-3xl text-text-charcoal flex items-center gap-2.5">
            <Database className="w-8 h-8 text-primary-red" />
            <span>Product & Price Management</span>
          </h1>
          <p className="text-text-muted text-sm mt-1">
            Toggle pickle visibility and edit pricing details for 250g, 500g, and 1kg sizes.
          </p>
        </div>

        {/* Success toast */}
        {saveSuccess && (
          <div className="flex items-center gap-2 px-4 py-2 bg-primary-green/10 border border-primary-green/20 text-primary-green text-xs font-bold rounded-lg shadow-sm animate-pulse">
            <Check className="w-4 h-4" />
            <span>Changes Saved!</span>
          </div>
        )}
      </div>

      {/* Products table list */}
      <div className="bg-white rounded-2xl border border-border-warm shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead className="bg-bg-cream/40 border-b border-border-warm text-text-muted text-xs uppercase font-semibold">
              <tr>
                <th className="py-3 px-4 text-left">Pickle Details</th>
                <th className="py-3 px-4 text-center">Category</th>
                <th className="py-3 px-4 text-center">Active Status</th>
                <th className="py-3 px-4 text-center">Price (250g)</th>
                <th className="py-3 px-4 text-center">Price (500g)</th>
                <th className="py-3 px-4 text-center">Price (1kg)</th>
                <th className="py-3 px-4 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-bg-cream-dark">
              {products.map((p) => {
                const isEditing = editingId === p.id;
                return (
                  <tr key={p.id} className="hover:bg-bg-cream/10 text-text-charcoal">
                    {/* Details */}
                    <td className="py-3.5 px-4 flex items-center gap-3">
                      <div className="relative w-10 h-10 rounded overflow-hidden shrink-0 border border-border-warm bg-bg-cream-dark">
                        <Image
                          src={p.image}
                          alt={p.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div>
                        <p className="font-bold">{p.name}</p>
                        {p.nameTelugu && (
                          <p className="font-telugu text-xs text-text-muted">{p.nameTelugu}</p>
                        )}
                      </div>
                    </td>

                    {/* Category */}
                    <td className="py-3.5 px-4 text-center">
                      {p.isVeg ? (
                        <span className="badge-veg">🌿 Veg</span>
                      ) : (
                        <span className="badge-nonveg">🍖 Non-Veg</span>
                      )}
                    </td>

                    {/* Active */}
                    <td className="py-3.5 px-4 text-center">
                      <button
                        onClick={() => handleToggleActive(p.id)}
                        className="cursor-pointer text-text-muted hover:text-text-charcoal transition-colors p-1"
                        aria-label="Toggle active status"
                      >
                        {p.isActive ? (
                          <ToggleRight className="w-8 h-8 text-primary-green" />
                        ) : (
                          <ToggleLeft className="w-8 h-8 text-text-muted" />
                        )}
                      </button>
                    </td>

                    {/* Price 250g */}
                    <td className="py-3.5 px-4 text-center">
                      {isEditing ? (
                        <input
                          type="text"
                          value={editForm.price250g}
                          onChange={(e) => setEditForm({ ...editForm, price250g: e.target.value })}
                          placeholder="TBD"
                          className="w-16 px-1.5 py-1 text-center text-xs border border-border-warm rounded focus:outline-none focus:border-accent-gold"
                        />
                      ) : p.price250g !== null ? (
                        <span className="font-semibold">{formatCurrency(p.price250g)}</span>
                      ) : (
                        <span className="text-xs text-primary-red font-semibold italic">TBD</span>
                      )}
                    </td>

                    {/* Price 500g */}
                    <td className="py-3.5 px-4 text-center">
                      {isEditing ? (
                        <input
                          type="text"
                          value={editForm.price500g}
                          onChange={(e) => setEditForm({ ...editForm, price500g: e.target.value })}
                          placeholder="TBD"
                          className="w-16 px-1.5 py-1 text-center text-xs border border-border-warm rounded focus:outline-none focus:border-accent-gold"
                        />
                      ) : p.price500g !== null ? (
                        <span className="font-semibold">{formatCurrency(p.price500g)}</span>
                      ) : (
                        <span className="text-xs text-primary-red font-semibold italic">TBD</span>
                      )}
                    </td>

                    {/* Price 1kg */}
                    <td className="py-3.5 px-4 text-center">
                      {isEditing ? (
                        <input
                          type="text"
                          value={editForm.price1kg}
                          onChange={(e) => setEditForm({ ...editForm, price1kg: e.target.value })}
                          placeholder="TBD"
                          className="w-16 px-1.5 py-1 text-center text-xs border border-border-warm rounded focus:outline-none focus:border-accent-gold"
                        />
                      ) : p.price1kg !== null ? (
                        <span className="font-semibold">{formatCurrency(p.price1kg)}</span>
                      ) : (
                        <span className="text-xs text-primary-red font-semibold italic">TBD</span>
                      )}
                    </td>

                    {/* Actions */}
                    <td className="py-3.5 px-4 text-center flex items-center justify-center gap-1.5">
                      {isEditing ? (
                        <>
                          <button
                            onClick={() => handleSaveEdit(p.id)}
                            className="p-1.5 bg-primary-green/10 text-primary-green hover:bg-primary-green hover:text-white rounded border border-primary-green/20 transition-all cursor-pointer"
                            title="Save Prices"
                          >
                            <Save className="w-4 h-4" />
                          </button>
                          <button
                            onClick={handleCancelEdit}
                            className="p-1.5 bg-text-charcoal/10 text-text-charcoal hover:bg-text-charcoal hover:text-white rounded border border-border-warm transition-all cursor-pointer"
                            title="Cancel Edit"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </>
                      ) : (
                        <button
                          onClick={() => handleStartEdit(p)}
                          className="p-1.5 bg-accent-gold/15 text-accent-gold-dark hover:bg-accent-gold hover:text-white rounded border border-accent-gold/20 transition-all cursor-pointer"
                          title="Edit Prices"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
