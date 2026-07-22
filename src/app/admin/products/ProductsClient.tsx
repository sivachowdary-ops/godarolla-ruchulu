'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Product } from '@/types';
import { DBCategory } from '@/lib/services/categoriesService';
import { createProductAction, updateProductAction, deleteProductAction } from '@/app/actions/admin-mutations';
import { Database, Plus, Search, Edit, Trash2, X, Save, Image as ImageIcon, Check, AlertTriangle } from 'lucide-react';
import Image from 'next/image';
import imageCompression from 'browser-image-compression';
import { formatCurrency } from '@/lib/utils';
import { AdminProductCard } from '@/components/admin/AdminProductCard';

interface ProductsClientProps {
  initialProducts: Product[];
  categories: DBCategory[];
}

export default function ProductsClient({ initialProducts, categories }: ProductsClientProps) {
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [search, setSearch] = useState('');
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState<Product | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  
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
      });
  
  const [weights, setWeights] = useState<{ weight: string; price: string }[]>([]);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Derive preview product for live preview
  const raw250gStr = weights.find(w => w.weight === '250g')?.price;
  const raw500gStr = weights.find(w => w.weight === '500g')?.price;
  const raw1kgStr = weights.find(w => w.weight === '1kg')?.price;

  const basePrice250g = raw250gStr ? Number(raw250gStr) : null;
  const price500g = (raw500gStr && raw500gStr.trim() !== '') ? Number(raw500gStr) : (basePrice250g ? basePrice250g * 2 : null);
  const price1kg = (raw1kgStr && raw1kgStr.trim() !== '') ? Number(raw1kgStr) : (basePrice250g ? basePrice250g * 4 : null);

  const previewProduct: Product = {
    id: editingId || 'preview-id',
    slug: 'preview-slug',
    name: formData.name || 'Pickle Name',
    nameTelugu: formData.name_telugu || undefined,
    category: categories.find(c => c.id === formData.category_id)?.slug as any || 'veg',
    description: formData.description || 'Description...',
    price250g: basePrice250g,
    price500g: price500g,
    price1kg: price1kg,
    image: imagePreview || '/images/products/placeholder.webp',
    isVeg: formData.is_veg,
    isActive: true,
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
        useWebWorker: true,
        fileType: 'image/webp'
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
    if (!formData.name) { showToast('Please enter a product name.', 'error'); return; }
    if (!formData.category_id) { showToast('Please select a category.', 'error'); return; }
    if (!formData.description) { showToast('Please enter a product description.', 'error'); return; }
    if (!editingId && !imageFile) {
      showToast('Please upload a product image.', 'error');
      return;
    }
    
    // Check prices
    let has250g = false;
    for (const w of weights) {
      if (w.weight === '250g') {
        has250g = true;
        if (!w.price || w.price.trim() === '') {
          showToast('Please enter a 250g price.', 'error');
          return;
        }
      }
      
      if (w.price && w.price.trim() !== '') {
        if (Number(w.price) < 0) {
          showToast(`Price for ${w.weight} must be a valid positive number.`, 'error');
          return;
        }
      }
    }
    
    if (weights.length > 0 && !has250g) {
      showToast('Please enter a 250g price.', 'error');
      return;
    }

    setIsSubmitting(true);
    try {
      const fd = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        fd.append(key, String(value));
      });
      fd.append('is_active', 'true');
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

  const requestDelete = (product: Product) => {
    setProductToDelete(product);
    setDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (!productToDelete) return;
    setIsDeleting(true);
    try {
      const res = await deleteProductAction(productToDelete.id);
      if (res.success) {
        showToast('Product permanently deleted', 'success');
        setDeleteModalOpen(false);
        setTimeout(() => window.location.reload(), 500);
      } else {
        showToast(res.error || 'Failed to delete product', 'error');
      }
    } catch (err: any) {
      showToast(err.message || 'An error occurred', 'error');
    } finally {
      setIsDeleting(false);
    }
  };

  const filteredProducts = products.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(search.toLowerCase()) || 
                          (p.nameTelugu && p.nameTelugu.includes(search));
    return matchesSearch;
  });

  return (
    <div className="space-y-8 font-body">
      {toast && (
        <div className={`fixed top-4 right-4 p-4 rounded-lg shadow-lg z-[9999] text-white font-bold flex items-center gap-2 ${toast.type === 'success' ? 'bg-primary-green' : 'bg-primary-red'}`}>
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
        
        
      </div>

      {/* Products Table */}
      <div className="bg-white rounded-2xl border border-border-warm shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm block md:table">
            <thead className="hidden md:table-header-group bg-bg-cream/40 border-b border-border-warm text-text-muted text-xs uppercase font-semibold text-left">
              <tr>
                <th className="py-3 px-4">Product Details</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4">Pricing</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="block md:table-row-group divide-y divide-bg-cream-dark">
              {filteredProducts.length === 0 ? (
                <tr className="block md:table-row">
                  <td colSpan={4} className="block md:table-cell py-12 text-center text-text-muted">
                    No products found.
                  </td>
                </tr>
              ) : (
                filteredProducts.map(p => (
                  <tr key={p.id} className="block md:table-row hover:bg-bg-cream/10 transition-colors p-4 md:p-0">
                    <td className="block md:table-cell py-2 md:py-3 px-0 md:px-4 flex items-center gap-4">
                      <div className="relative w-12 h-12 md:w-12 md:h-12 rounded overflow-hidden shrink-0 border border-border-warm bg-bg-cream-dark">
                        <Image src={p.image} alt={p.name} fill className="object-cover" />
                      </div>
                      <div>
                        <p className="font-bold text-text-charcoal text-base md:text-sm">{p.name}</p>
                        {p.nameTelugu && <p className="font-telugu text-xs text-text-muted mt-0.5">{p.nameTelugu}</p>}
                      </div>
                    </td>
                    <td className="block md:table-cell py-1 md:py-3 px-0 md:px-4 font-semibold text-text-muted md:text-text-charcoal uppercase text-xs">
                      <span className="md:hidden mr-2">Category:</span>
                      {categories.find(c => c.slug === p.category)?.name || p.category}
                    </td>
                    <td className="block md:table-cell py-2 md:py-3 px-0 md:px-4">
                      <div className="flex flex-wrap gap-2 text-xs">
                        {p.price250g && <span className="bg-bg-cream px-2 py-1 rounded border border-border-warm">250g: {formatCurrency(p.price250g)}</span>}
                        {p.price500g && <span className="bg-bg-cream px-2 py-1 rounded border border-border-warm">500g: {formatCurrency(p.price500g)}</span>}
                        {p.price1kg && <span className="bg-bg-cream px-2 py-1 rounded border border-border-warm">1kg: {formatCurrency(p.price1kg)}</span>}
                      </div>
                    </td>
                    <td className="block md:table-cell py-3 px-0 md:px-4 border-t border-border-warm md:border-t-0 mt-2 md:mt-0">
                      <div className="flex items-center justify-start md:justify-end gap-2">
                        <button 
                          onClick={() => openEditModal(p)}
                          className="flex items-center gap-1.5 px-3 py-1.5 md:p-2 text-accent-gold-dark border border-accent-gold-dark/30 md:border-transparent hover:bg-accent-gold/10 rounded transition-colors"
                          title="Edit"
                        >
                          <Edit className="w-4 h-4" />
                          <span className="md:hidden text-xs font-bold">Edit</span>
                        </button>
                        <button 
                          onClick={() => requestDelete(p)}
                          className="flex items-center gap-1.5 px-3 py-1.5 md:p-2 border border-primary-red/30 md:border-transparent rounded transition-colors text-primary-red hover:bg-primary-red/10"
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4" />
                          <span className="md:hidden text-xs font-bold">Delete</span>
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
                      className="text-xs font-bold text-accent-gold-dark hover:text-accent-gold flex items-center justify-center gap-1 min-h-[44px] w-full sm:w-auto border border-accent-gold-dark/30 sm:border-transparent rounded-lg sm:rounded-none py-2 sm:py-0"
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
                      <button onClick={() => fileInputRef.current?.click()} className="text-sm font-semibold px-4 py-2 border border-border-warm rounded bg-white hover:bg-bg-cream min-h-[44px]">
                        Choose Image
                      </button>
                      <p className="text-[10px] text-text-muted mt-1">JPEG/PNG, max 1MB (auto-compressed)</p>
                      <input type="file" ref={fileInputRef} onChange={handleImageChange} accept="image/*" className="hidden" />
                    </div>
                  </div>
                </div>

                {/* Submit */}
                <div className="pt-4 border-t border-border-warm flex flex-col sm:flex-row justify-end gap-3 mt-6">
                  <button onClick={closeModal} className="w-full sm:w-auto px-4 py-3 font-bold text-sm border border-border-warm rounded-lg hover:bg-bg-cream transition-colors min-h-[44px]">
                    Cancel
                  </button>
                  <button 
                    onClick={handleSave} 
                    disabled={isSubmitting}
                    className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3 bg-primary-red hover:bg-primary-red-dark text-white font-bold text-sm rounded-lg shadow disabled:opacity-50 transition-colors min-h-[44px]"
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
                <AdminProductCard product={previewProduct} />
              </div>
            </div>

          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteModalOpen && productToDelete && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white rounded-2xl w-full max-w-md p-6 shadow-2xl animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-center w-12 h-12 rounded-full bg-primary-red/10 mb-4 mx-auto">
              <AlertTriangle className="w-6 h-6 text-primary-red" />
            </div>
            
            <h3 className="text-xl font-heading font-extrabold text-center text-text-charcoal mb-2">
              Delete Product
            </h3>
            
            <p className="text-center text-text-muted text-sm mb-6">
              Are you sure you want to permanently delete <span className="font-bold text-text-charcoal">"{productToDelete.name}"</span>?
              <br/><br/>
              This action cannot be undone.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-3 w-full">
              <button 
                onClick={() => setDeleteModalOpen(false)}
                disabled={isDeleting}
                className="w-full sm:w-auto flex-1 py-3 bg-bg-cream/50 hover:bg-bg-cream border border-border-warm text-text-charcoal font-bold text-sm rounded-lg transition-colors min-h-[44px]"
              >
                Cancel
              </button>
              <button 
                onClick={confirmDelete}
                disabled={isDeleting}
                className="w-full sm:w-auto flex-1 py-3 bg-primary-red hover:bg-primary-red-dark text-white font-bold text-sm rounded-lg transition-colors flex items-center justify-center gap-2 disabled:opacity-50 min-h-[44px]"
              >
                {isDeleting ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
