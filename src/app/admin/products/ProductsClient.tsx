'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Product } from '@/types';
import { DBCategory } from '@/lib/services/categoriesService';
import { createProductAction, updateProductAction, setProductStatusAction } from '@/app/actions/admin-mutations';
import { Database, Plus, Search, Edit, Archive, RefreshCw, X, Save, Image as ImageIcon, Check } from 'lucide-react';
import Image from 'next/image';
import imageCompression from 'browser-image-compression';
import { formatCurrency } from '@/lib/utils';
import { ProductCard } from '@/components/product/ProductCard';

interface ProductsClientProps {
  initialProducts: Product[];
  categories: DBCategory[];
}

export default function ProductsClient({ initialProducts, categories }: ProductsClientProps) {
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [search, setSearch] = useState('');
  const [showArchived, setShowArchived] = useState(false);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  const [formData, setFormData] = useState({
    name: '',
    name_telugu: '',
    category_id: '',
    description: '',
    is_veg: true,
    is_featured: false,
    status: 'ACTIVE'
  });
  
  const [weights, setWeights] = useState<{ weight: string; price: string }[]>([]);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Derive preview product for live preview
  const previewProduct: Product = {
    id: editingId || 'preview-id',
    slug: 'preview-slug',
    name: formData.name || 'Pickle Name',
    nameTelugu: formData.name_telugu || undefined,
    category: categories.find(c => c.id === formData.category_id)?.slug as any || 'veg',
    description: formData.description || 'Description...',
    price250g: weights.find(w => w.weight === '250g')?.price ? Number(weights.find(w => w.weight === '250g')?.price) : null,
    price500g: weights.find(w => w.weight === '500g')?.price ? Number(weights.find(w => w.weight === '500g')?.price) : null,
    price1kg: weights.find(w => w.weight === '1kg')?.price ? Number(weights.find(w => w.weight === '1kg')?.price) : null,
    image: imagePreview || '/images/products/placeholder.jpg',
    isVeg: formData.is_veg,
    isActive: formData.status === 'ACTIVE',
    isPriceTBD: weights.length === 0,
    isBestSeller: formData.is_featured,
  };

  const showToast = (message: string, type: 'success' | 'error') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const resetForm = () => {
    setFormData({
      name: '',
      name_telugu: '',
      category_id: categories.length > 0 ? categories[0].id : '',
      description: '',
      is_veg: true,
      is_featured: false,
      status: 'ACTIVE'
    });
    setWeights([]);
    setImageFile(null);
    setImagePreview(null);
    setEditingId(null);
  };

  const openAddModal = () => {
    resetForm();
    setIsModalOpen(true);
  };

  const openEditModal = (product: Product) => {
    const catId = categories.find(c => c.slug === product.category)?.id || '';
    setFormData({
      name: product.name,
      name_telugu: product.nameTelugu || '',
      category_id: catId,
      description: product.description,
      is_veg: product.isVeg,
      is_featured: product.isBestSeller || false,
      status: product.isActive ? 'ACTIVE' : 'ARCHIVED'
    });
    
    const initialWeights = [];
    if (product.price250g !== null) initialWeights.push({ weight: '250g', price: String(product.price250g) });
    if (product.price500g !== null) initialWeights.push({ weight: '500g', price: String(product.price500g) });
    if (product.price1kg !== null) initialWeights.push({ weight: '1kg', price: String(product.price1kg) });
    setWeights(initialWeights);
    
    setImagePreview(product.image);
    setEditingId(product.id);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    if (formData.name !== '' && !window.confirm('You have unsaved changes. Are you sure you want to close?')) {
      return;
    }
    setIsModalOpen(false);
  };

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      showToast('Please select a valid image file', 'error');
      return;
    }

    try {
      const options = {
        maxSizeMB: 1,
        maxWidthOrHeight: 1024,
        useWebWorker: true
      };
      const compressedFile = await imageCompression(file, options);
      setImageFile(compressedFile);
      setImagePreview(URL.createObjectURL(compressedFile));
    } catch (error) {
      console.error(error);
      showToast('Error compressing image', 'error');
    }
  };

  const handleSave = async () => {
    if (!formData.name || !formData.category_id || !formData.description) {
      showToast('Please fill all required fields', 'error');
      return;
    }
    if (!editingId && !imageFile) {
      showToast('Please select an image for new products', 'error');
      return;
    }
    
    // Check positive prices
    for (const w of weights) {
      if (Number(w.price) <= 0) {
        showToast('Prices must be positive numbers', 'error');
        return;
      }
    }

    setIsSubmitting(true);
    try {
      const fd = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        if (key === 'status') {
          fd.append('is_active', String(value === 'ACTIVE'));
        } else {
          fd.append(key, String(value));
        }
      });
      fd.append('is_price_tbd', String(weights.length === 0));
      weights.forEach(w => {
        if (w.weight === '250g') fd.append('price250g', w.price);
        if (w.weight === '500g') fd.append('price500g', w.price);
        if (w.weight === '1kg') fd.append('price1kg', w.price);
      });

      if (imageFile) {
        fd.append('image', imageFile);
      }

      let res;
      if (editingId) {
        res = await updateProductAction(editingId, fd);
      } else {
        res = await createProductAction(fd);
      }

      if (res.success) {
        showToast('Product saved successfully!', 'success');
        setIsModalOpen(false);
        // Optimistically update
        setTimeout(() => window.location.reload(), 1000);
      } else {
        showToast(res.error || 'Failed to save', 'error');
      }
    } catch (error: any) {
      showToast(error.message || 'An error occurred', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleArchiveStatus = async (id: string, currentActive: boolean) => {
    const action = currentActive ? 'Archive' : 'Restore';
    if (!window.confirm(`Are you sure you want to ${action} this product?`)) return;
    
    const newStatus = !currentActive;
    const res = await setProductStatusAction(id, newStatus);
    if (res.success) {
      showToast(`Product ${action}d successfully`, 'success');
      setTimeout(() => window.location.reload(), 500);
    } else {
      showToast(`Failed to ${action} product`, 'error');
    }
  };

  const filteredProducts = products.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(search.toLowerCase()) || 
                          (p.nameTelugu && p.nameTelugu.includes(search));
    const matchesStatus = showArchived ? !p.isActive : p.isActive;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-8 font-body">
      {toast && (
        <div className={`fixed top-4 right-4 p-4 rounded-lg shadow-lg z-50 text-white font-bold flex items-center gap-2 ${toast.type === 'success' ? 'bg-primary-green' : 'bg-primary-red'}`}>
          {toast.type === 'success' ? <Check className="w-5 h-5" /> : <X className="w-5 h-5" />}
          {toast.message}
        </div>
      )}

      {/* Header & Controls */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="font-heading font-extrabold text-2xl md:text-3xl text-text-charcoal flex items-center gap-2.5">
            <Database className="w-8 h-8 text-primary-red" />
            <span>Product Management</span>
          </h1>
          <p className="text-text-muted text-sm mt-1">
            Manage your catalog, edit details, and add new products.
          </p>
        </div>
        
        <button 
          onClick={openAddModal}
          className="flex items-center gap-2 px-4 py-2.5 bg-primary-red hover:bg-primary-red-dark text-white text-sm font-bold rounded-lg shadow transition-colors"
        >
          <Plus className="w-4 h-4" />
          Add New Product
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4 justify-between bg-white p-4 rounded-xl border border-border-warm shadow-sm">
        <div className="relative w-full md:w-96">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
          <input 
            type="text" 
            placeholder="Search products..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-bg-cream/30 border border-border-warm rounded-lg text-sm focus:outline-none focus:border-accent-gold"
          />
        </div>
        
        <label className="flex items-center gap-2 text-sm font-semibold text-text-charcoal cursor-pointer">
          <input 
            type="checkbox" 
            checked={showArchived}
            onChange={(e) => setShowArchived(e.target.checked)}
            className="rounded border-border-warm text-primary-red focus:ring-primary-red"
          />
          Show Archived Only
        </label>
      </div>

      {/* Products Table */}
      <div className="bg-white rounded-2xl border border-border-warm shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead className="bg-bg-cream/40 border-b border-border-warm text-text-muted text-xs uppercase font-semibold text-left">
              <tr>
                <th className="py-3 px-4">Product Details</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4">Pricing</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-bg-cream-dark">
              {filteredProducts.length === 0 ? (
                <tr>
                  <td colSpan={4} className="py-12 text-center text-text-muted">
                    No products found.
                  </td>
                </tr>
              ) : (
                filteredProducts.map(p => (
                  <tr key={p.id} className={`hover:bg-bg-cream/10 transition-colors ${!p.isActive ? 'opacity-60' : ''}`}>
                    <td className="py-3 px-4 flex items-center gap-4">
                      <div className="relative w-12 h-12 rounded overflow-hidden shrink-0 border border-border-warm bg-bg-cream-dark">
                        <Image src={p.image} alt={p.name} fill className="object-cover" />
                      </div>
                      <div>
                        <p className="font-bold text-text-charcoal">{p.name}</p>
                        {p.nameTelugu && <p className="font-telugu text-xs text-text-muted mt-0.5">{p.nameTelugu}</p>}
                      </div>
                    </td>
                    <td className="py-3 px-4 font-semibold text-text-charcoal uppercase text-xs">
                      {categories.find(c => c.slug === p.category)?.name || p.category}
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex gap-2 text-xs">
                        {p.price250g && <span className="bg-bg-cream px-2 py-1 rounded border border-border-warm">250g: {formatCurrency(p.price250g)}</span>}
                        {p.price500g && <span className="bg-bg-cream px-2 py-1 rounded border border-border-warm">500g: {formatCurrency(p.price500g)}</span>}
                        {p.price1kg && <span className="bg-bg-cream px-2 py-1 rounded border border-border-warm">1kg: {formatCurrency(p.price1kg)}</span>}
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center justify-end gap-2">
                        <button 
                          onClick={() => openEditModal(p)}
                          className="p-2 text-accent-gold-dark hover:bg-accent-gold/10 rounded transition-colors"
                          title="Edit"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => handleArchiveStatus(p.id, p.isActive)}
                          className={`p-2 rounded transition-colors ${p.isActive ? 'text-primary-red hover:bg-primary-red/10' : 'text-primary-green hover:bg-primary-green/10'}`}
                          title={p.isActive ? "Archive" : "Restore"}
                        >
                          {p.isActive ? <Archive className="w-4 h-4" /> : <RefreshCw className="w-4 h-4" />}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white rounded-2xl w-full max-w-5xl max-h-[90vh] overflow-y-auto shadow-2xl flex flex-col md:flex-row">
            
            {/* Form Section */}
            <div className="w-full md:w-2/3 p-6 border-r border-border-warm">
              <div className="flex justify-between items-center border-b border-border-warm pb-4 mb-6">
                <h2 className="font-heading font-bold text-xl text-text-charcoal">
                  {editingId ? 'Edit Product' : 'Add New Product'}
                </h2>
                <button onClick={closeModal} className="text-text-muted hover:text-text-charcoal p-1">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-xs font-bold uppercase text-text-charcoal mb-1">Product Name *</label>
                    <input 
                      type="text" required
                      value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})}
                      className="w-full px-3 py-2 border border-border-warm rounded-lg text-sm bg-bg-cream/20 focus:outline-none focus:border-accent-gold"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase text-text-charcoal mb-1">Telugu Name</label>
                    <input 
                      type="text" 
                      value={formData.name_telugu} onChange={e => setFormData({...formData, name_telugu: e.target.value})}
                      className="w-full px-3 py-2 border border-border-warm rounded-lg text-sm bg-bg-cream/20 font-telugu focus:outline-none focus:border-accent-gold"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-xs font-bold uppercase text-text-charcoal mb-1">Category *</label>
                    <select 
                      value={formData.category_id} onChange={e => setFormData({...formData, category_id: e.target.value})}
                      className="w-full px-3 py-2 border border-border-warm rounded-lg text-sm bg-bg-cream/20 focus:outline-none focus:border-accent-gold"
                    >
                      {categories.map(c => (
                        <option key={c.id} value={c.id}>{c.name}</option>
                      ))}
                    </select>
                  </div>

                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-text-charcoal mb-1">Description *</label>
                  <textarea 
                    required rows={3}
                    value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})}
                    className="w-full px-3 py-2 border border-border-warm rounded-lg text-sm bg-bg-cream/20 focus:outline-none focus:border-accent-gold"
                  />
                </div>

                {/* Dynamic Weights */}
                <div>
                  <label className="block text-xs font-bold uppercase text-text-charcoal mb-2">Pricing & Weights</label>
                  <div className="space-y-2">
                    {weights.map((w, index) => (
                      <div key={index} className="flex gap-2 items-center">
                        <input 
                          type="text" placeholder="e.g. 250g" 
                          value={w.weight} onChange={e => {
                            const newW = [...weights]; newW[index].weight = e.target.value; setWeights(newW);
                          }}
                          className="w-24 px-3 py-2 border border-border-warm rounded-lg text-sm"
                        />
                        <input 
                          type="number" placeholder="Price (₹)" 
                          value={w.price} onChange={e => {
                            const newW = [...weights]; newW[index].price = e.target.value; setWeights(newW);
                          }}
                          className="w-32 px-3 py-2 border border-border-warm rounded-lg text-sm"
                        />
                        <button onClick={() => setWeights(weights.filter((_, i) => i !== index))} className="text-primary-red p-1"><X className="w-4 h-4"/></button>
                      </div>
                    ))}
                    <button 
                      onClick={() => setWeights([...weights, { weight: '', price: '' }])}
                      className="text-xs font-bold text-accent-gold-dark hover:text-accent-gold flex items-center gap-1"
                    >
                      <Plus className="w-3 h-3" /> Add Weight Option
                    </button>
                  </div>
                </div>

                {/* Toggles */}
                <div className="flex gap-6">
                  <label className="flex items-center gap-2 text-sm font-semibold cursor-pointer">
                    <input type="checkbox" checked={formData.is_veg} onChange={e => setFormData({...formData, is_veg: e.target.checked})} className="rounded text-primary-green" />
                    Vegetarian
                  </label>
                  <label className="flex items-center gap-2 text-sm font-semibold cursor-pointer">
                    <input type="checkbox" checked={formData.is_featured} onChange={e => setFormData({...formData, is_featured: e.target.checked})} className="rounded text-accent-gold" />
                    Featured
                  </label>
                  <label className="flex items-center gap-2 text-sm font-semibold cursor-pointer">
                    <input type="checkbox" checked={formData.status === 'ACTIVE'} onChange={e => setFormData({...formData, status: e.target.checked ? 'ACTIVE' : 'ARCHIVED'})} className="rounded text-primary-red" />
                    Active
                  </label>
                </div>

                {/* Image Upload */}
                <div>
                  <label className="block text-xs font-bold uppercase text-text-charcoal mb-1">Product Image {editingId ? '' : '*'}</label>
                  <div className="flex items-center gap-4">
                    <div 
                      onClick={() => fileInputRef.current?.click()}
                      className="w-20 h-20 border-2 border-dashed border-border-warm rounded-lg flex items-center justify-center cursor-pointer hover:border-accent-gold bg-bg-cream overflow-hidden relative"
                    >
                      {imagePreview ? (
                        <Image src={imagePreview} alt="Preview" fill className="object-cover" />
                      ) : (
                        <ImageIcon className="w-6 h-6 text-text-muted" />
                      )}
                    </div>
                    <div>
                      <button onClick={() => fileInputRef.current?.click()} className="text-sm font-semibold px-3 py-1.5 border border-border-warm rounded bg-white hover:bg-bg-cream">
                        Choose Image
                      </button>
                      <p className="text-[10px] text-text-muted mt-1">JPEG/PNG, max 1MB (auto-compressed)</p>
                      <input type="file" ref={fileInputRef} onChange={handleImageChange} accept="image/*" className="hidden" />
                    </div>
                  </div>
                </div>

                {/* Submit */}
                <div className="pt-4 border-t border-border-warm flex justify-end gap-3">
                  <button onClick={closeModal} className="px-4 py-2 font-bold text-sm border border-border-warm rounded-lg hover:bg-bg-cream transition-colors">
                    Cancel
                  </button>
                  <button 
                    onClick={handleSave} 
                    disabled={isSubmitting}
                    className="flex items-center gap-2 px-6 py-2 bg-primary-red hover:bg-primary-red-dark text-white font-bold text-sm rounded-lg shadow disabled:opacity-50 transition-colors"
                  >
                    <Save className="w-4 h-4" />
                    {isSubmitting ? 'Saving...' : 'Save Product'}
                  </button>
                </div>
              </div>
            </div>

            {/* Live Preview Section */}
            <div className="w-full md:w-1/3 p-6 bg-bg-cream-dark flex flex-col">
              <h3 className="font-heading font-bold text-lg text-text-charcoal mb-6 border-b border-border-warm pb-2">Live Preview</h3>
              <div className="flex-grow flex items-center justify-center bg-white border border-border-warm rounded-xl p-4 shadow-sm scale-90 md:scale-100 origin-top">
                <ProductCard product={previewProduct} />
              </div>
            </div>

          </div>
        </div>
      )}
    </div>
  );
}
