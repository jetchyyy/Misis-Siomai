import React from 'react';
import { Plus, Save, ImageIcon, Upload, Loader2, Trash2 } from 'lucide-react';

export default function AdminProductsTab({ 
  cmsProducts, 
  setCmsProducts, 
  handleSaveProducts, 
  handleProductImageUpload, 
  uploadingIdx 
}) {

  const handleAddProduct = () => {
    const newProd = {
      id: `prod-${Date.now()}`,
      name: 'New Siomai Flavor',
      category: 'Steamed Siomai',
      price: '₱45 / 4 pcs',
      description: 'Juicy 100% pork & beef dimsum cooked fresh daily.',
      image_url: 'https://images.unsplash.com/photo-1541696432-82c6da8ce7bf?auto=format&fit=crop&q=80&w=600',
      is_popular: false
    };
    setCmsProducts(prev => [newProd, ...prev]);
  };

  const handleRemoveProduct = (idx) => {
    setCmsProducts(prev => prev.filter((_, i) => i !== idx));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-heading font-extrabold text-3xl text-zinc-900 dark:text-white">Products & Images CMS</h1>
          <p className="text-xs text-zinc-500 dark:text-zinc-400">Manage dimsum menu items, categories, pricing, and upload product images</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={handleAddProduct}
            className="px-4 py-2.5 rounded-xl bg-gray-100 dark:bg-zinc-800 hover:bg-zinc-700 text-zinc-900 dark:text-white font-bold text-xs flex items-center gap-1.5 cursor-pointer"
          >
            <Plus className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            <span>Add Product</span>
          </button>
          <button
            onClick={handleSaveProducts}
            className="px-5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs flex items-center gap-2 shadow-lg shadow-rose-900/40 cursor-pointer"
          >
            <Save className="w-4 h-4" />
            <span>Save Products</span>
          </button>
        </div>
      </div>

      <div className="space-y-6">
        {cmsProducts.map((prod, idx) => (
          <div key={prod.id || idx} className="p-6 rounded-2xl bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 space-y-4">
            <div className="flex flex-col md:flex-row gap-6 items-start">

              {/* Image Preview & Upload Box */}
              <div className="w-full md:w-48 shrink-0 space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400 block">Product Image</label>
                <div className="relative h-36 rounded-xl overflow-hidden bg-gray-50 dark:bg-zinc-950 border border-gray-200 dark:border-zinc-800 flex items-center justify-center group">
                  {prod.image_url ? (
                    <img
                      src={prod.image_url}
                      alt={prod.name}
                      className="w-full h-full object-cover cursor-zoom-in hover:scale-105 transition-transform"
                      onClick={() => setFullScreenImage && setFullScreenImage(prod.image_url)}
                    />
                  ) : (
                    <div className="text-center p-3 text-zinc-600">
                      <ImageIcon className="w-8 h-8 mx-auto mb-1" />
                      <span className="text-[10px]">No image set</span>
                    </div>
                  )}

                  {uploadingIdx === idx && (
                    <div className="absolute inset-0 bg-gray-50 dark:bg-zinc-950/80 flex items-center justify-center">
                      <Loader2 className="w-6 h-6 text-rose-500 animate-spin" />
                    </div>
                  )}
                </div>

                {/* File Upload Button */}
                <label className={`w-full py-2 px-3 rounded-xl text-zinc-800 dark:text-zinc-200 font-bold text-xs flex items-center justify-center gap-1.5 cursor-pointer transition-colors border ${uploadingIdx === idx ? 'bg-zinc-700 border-zinc-600 opacity-60 cursor-not-allowed' : 'bg-gray-100 dark:bg-zinc-800 hover:bg-zinc-700 border-gray-300 dark:border-zinc-700'}`}>
                  {uploadingIdx === idx ? (
                    <><Loader2 className="w-3.5 h-3.5 animate-spin text-rose-600 dark:text-rose-400" /><span>Compressing...</span></>
                  ) : (
                    <><Upload className="w-3.5 h-3.5 text-rose-600 dark:text-rose-400" /><span>Upload Image (WebP)</span></>
                  )}
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    disabled={uploadingIdx === idx}
                    onChange={(e) => {
                      if (e.target.files && e.target.files[0]) {
                        handleProductImageUpload(idx, e.target.files[0]);
                      }
                    }}
                  />
                </label>
              </div>

              {/* Form Controls */}
              <div className="flex-1 space-y-3 w-full">
                <div className="flex items-center justify-between gap-4">
                  <div className="flex-1 space-y-1">
                    <label className="text-xs font-bold text-zinc-500 dark:text-zinc-400">Item Name</label>
                    <input
                      type="text"
                      value={prod.name}
                      onChange={(e) => {
                        const updated = [...cmsProducts];
                        updated[idx].name = e.target.value;
                        setCmsProducts(updated);
                      }}
                      className="w-full px-3 py-2 rounded-xl bg-gray-50 dark:bg-zinc-950 border border-gray-200 dark:border-zinc-800 text-xs text-zinc-900 dark:text-white"
                    />
                  </div>

                  <button
                    onClick={() => handleRemoveProduct(idx)}
                    className="p-2 rounded-xl bg-rose-500/10 hover:bg-rose-500 text-rose-600 dark:text-rose-400 hover:text-zinc-900 dark:hover:text-white transition-colors cursor-pointer self-end"
                    title="Delete Product"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-zinc-500 dark:text-zinc-400">Category</label>
                    <input
                      type="text"
                      value={prod.category}
                      onChange={(e) => {
                        const updated = [...cmsProducts];
                        updated[idx].category = e.target.value;
                        setCmsProducts(updated);
                      }}
                      className="w-full px-3 py-2 rounded-xl bg-gray-50 dark:bg-zinc-950 border border-gray-200 dark:border-zinc-800 text-xs text-zinc-900 dark:text-white"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-zinc-500 dark:text-zinc-400">Price</label>
                    <input
                      type="text"
                      value={prod.price}
                      onChange={(e) => {
                        const updated = [...cmsProducts];
                        updated[idx].price = e.target.value;
                        setCmsProducts(updated);
                      }}
                      className="w-full px-3 py-2 rounded-xl bg-gray-50 dark:bg-zinc-950 border border-gray-200 dark:border-zinc-800 text-xs text-amber-600 dark:text-amber-300 font-bold"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-zinc-500 dark:text-zinc-400">Image URL (or paste link)</label>
                  <input
                    type="text"
                    value={prod.image_url || ''}
                    onChange={(e) => {
                      const updated = [...cmsProducts];
                      updated[idx].image_url = e.target.value;
                      setCmsProducts(updated);
                    }}
                    placeholder="https://..."
                    className="w-full px-3 py-2 rounded-xl bg-gray-50 dark:bg-zinc-950 border border-gray-200 dark:border-zinc-800 text-xs text-zinc-500 dark:text-zinc-400 font-mono"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-zinc-500 dark:text-zinc-400">Description</label>
                  <input
                    type="text"
                    value={prod.description || ''}
                    onChange={(e) => {
                      const updated = [...cmsProducts];
                      updated[idx].description = e.target.value;
                      setCmsProducts(updated);
                    }}
                    className="w-full px-3 py-2 rounded-xl bg-gray-50 dark:bg-zinc-950 border border-gray-200 dark:border-zinc-800 text-xs text-zinc-900 dark:text-white"
                  />
                </div>

                <div className="flex items-center gap-2 pt-1">
                  <input
                    type="checkbox"
                    id={`bestseller-${idx}`}
                    checked={Boolean(prod.is_popular)}
                    onChange={(e) => {
                      const updated = [...cmsProducts];
                      updated[idx].is_popular = e.target.checked;
                      setCmsProducts(updated);
                    }}
                    className="rounded border-gray-300 dark:border-zinc-700 bg-gray-50 dark:bg-zinc-950 text-rose-600 focus:ring-rose-500"
                  />
                  <label htmlFor={`bestseller-${idx}`} className="text-xs text-zinc-700 dark:text-zinc-300 font-semibold cursor-pointer">
                    Mark as Bestseller / Featured Tag
                  </label>
                </div>

              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
