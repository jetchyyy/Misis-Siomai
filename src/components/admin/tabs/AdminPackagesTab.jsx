import React from 'react';
import { Package, Plus, Save, Trash2, X } from 'lucide-react';

export default function AdminPackagesTab({ cmsPackages, setCmsPackages, handleSavePackages }) {

  const handleAddPackage = () => {
    const newPkg = {
      id: `pkg-${Date.now()}`,
      name: 'New Franchise Package',
      price: '₱150,000',
      description: 'Complete turnkey package for neighborhood hubs or food parks.',
      badge: 'New Package',
      is_popular: false,
      features: [
        'Heavy Duty Stainless Food Cart / Kiosk',
        'Complete Cooking & Steaming Equipment',
        'Initial Product Inventory Worth ₱15,000',
        'Crew Operations Training & Manual'
      ]
    };
    setCmsPackages(prev => [newPkg, ...prev]);
  };

  const handleRemovePackage = (idx) => {
    setCmsPackages(prev => prev.filter((_, i) => i !== idx));
  };

  const handleAddPackageFeature = (pkgIdx) => {
    const updated = [...cmsPackages];
    if (!updated[pkgIdx].features) updated[pkgIdx].features = [];
    updated[pkgIdx].features.push('New Package Inclusion');
    setCmsPackages(updated);
  };

  const handleRemovePackageFeature = (pkgIdx, featureIdx) => {
    const updated = [...cmsPackages];
    updated[pkgIdx].features = (updated[pkgIdx].features || []).filter((_, i) => i !== featureIdx);
    setCmsPackages(updated);
  };

  const handleUpdatePackageFeature = (pkgIdx, featureIdx, val) => {
    const updated = [...cmsPackages];
    if (!updated[pkgIdx].features) updated[pkgIdx].features = [];
    updated[pkgIdx].features[featureIdx] = val;
    setCmsPackages(updated);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-heading font-extrabold text-3xl text-zinc-900 dark:text-white">Franchise Packages CMS</h1>
          <p className="text-xs text-zinc-500 dark:text-zinc-400">Manage packages, prices, inclusions, and popular highlights</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={handleAddPackage}
            className="px-4 py-2.5 rounded-xl bg-gray-100 dark:bg-zinc-800 hover:bg-zinc-700 text-zinc-900 dark:text-white font-bold text-xs flex items-center gap-1.5 cursor-pointer transition-colors"
          >
            <Plus className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            <span>Add Package</span>
          </button>
          <button
            onClick={handleSavePackages}
            className="px-5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs flex items-center gap-2 shadow-lg shadow-rose-900/40 cursor-pointer transition-colors"
          >
            <Save className="w-4 h-4" />
            <span>Save Packages</span>
          </button>
        </div>
      </div>

      {cmsPackages.length === 0 ? (
        <div className="p-12 rounded-2xl bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 text-center space-y-4">
          <Package className="w-12 h-12 text-zinc-600 mx-auto" />
          <div className="space-y-1">
            <h3 className="text-lg font-bold text-zinc-900 dark:text-white">No Packages Added Yet</h3>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 max-w-sm mx-auto">
              Click the button below to add your first franchise package.
            </p>
          </div>
          <button
            onClick={handleAddPackage}
            className="px-5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs inline-flex items-center gap-2 shadow-lg shadow-rose-900/40 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Add First Package</span>
          </button>
        </div>
      ) : (
        <div className="space-y-6">
          {cmsPackages.map((pkg, idx) => (
            <div key={pkg.id || idx} className="p-6 rounded-2xl bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 space-y-4">
              
              {/* Card Header */}
              <div className="flex items-center justify-between pb-3 border-b border-gray-200 dark:border-zinc-800">
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded-md bg-amber-500/10 text-amber-400 font-extrabold text-[10px] uppercase tracking-wider">
                    Package #{cmsPackages.length - idx}
                  </span>
                  <h3 className="font-bold text-sm text-zinc-900 dark:text-white truncate max-w-xs">{pkg.name || 'Unnamed Package'}</h3>
                </div>
                <button
                  onClick={() => handleRemovePackage(idx)}
                  className="p-2 rounded-xl bg-rose-500/10 hover:bg-rose-500 text-rose-600 dark:text-rose-400 hover:text-zinc-900 dark:hover:text-white transition-colors cursor-pointer"
                  title="Delete Package"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-zinc-500 dark:text-zinc-400">Package Name</label>
                  <input
                    type="text"
                    value={pkg.name || ''}
                    onChange={(e) => {
                      const updated = [...cmsPackages];
                      updated[idx].name = e.target.value;
                      setCmsPackages(updated);
                    }}
                    placeholder="e.g. Food Cart Package"
                    className="w-full px-3 py-2 rounded-xl bg-gray-50 dark:bg-zinc-950 border border-gray-200 dark:border-zinc-800 text-xs text-zinc-900 dark:text-white focus:border-rose-500 focus:outline-none"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-zinc-500 dark:text-zinc-400">Price</label>
                  <input
                    type="text"
                    value={pkg.price || ''}
                    onChange={(e) => {
                      const updated = [...cmsPackages];
                      updated[idx].price = e.target.value;
                      setCmsPackages(updated);
                    }}
                    placeholder="e.g. ₱99,000"
                    className="w-full px-3 py-2 rounded-xl bg-gray-50 dark:bg-zinc-950 border border-gray-200 dark:border-zinc-800 text-xs text-amber-600 dark:text-amber-300 font-bold focus:border-rose-500 focus:outline-none"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-zinc-500 dark:text-zinc-400">Badge / Tagline</label>
                  <input
                    type="text"
                    value={pkg.badge || ''}
                    onChange={(e) => {
                      const updated = [...cmsPackages];
                      updated[idx].badge = e.target.value;
                      setCmsPackages(updated);
                    }}
                    placeholder="e.g. Starter Choice, Most Popular"
                    className="w-full px-3 py-2 rounded-xl bg-gray-50 dark:bg-zinc-950 border border-gray-200 dark:border-zinc-800 text-xs text-zinc-900 dark:text-white focus:border-rose-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-zinc-500 dark:text-zinc-400">Description</label>
                <input
                  type="text"
                  value={pkg.description || ''}
                  onChange={(e) => {
                    const updated = [...cmsPackages];
                    updated[idx].description = e.target.value;
                    setCmsPackages(updated);
                  }}
                  placeholder="Brief overview of ideal location or business model"
                  className="w-full px-3 py-2 rounded-xl bg-gray-50 dark:bg-zinc-950 border border-gray-200 dark:border-zinc-800 text-xs text-zinc-900 dark:text-white focus:border-rose-500 focus:outline-none"
                />
              </div>

              {/* Features / Inclusions List */}
              <div className="space-y-2 pt-2 border-t border-gray-200 dark:border-zinc-800/60">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-zinc-700 dark:text-zinc-300">Package Inclusions & Features</label>
                  <button
                    type="button"
                    onClick={() => handleAddPackageFeature(idx)}
                    className="px-2.5 py-1 rounded-lg bg-gray-100 dark:bg-zinc-800 hover:bg-zinc-700 text-xs text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1 cursor-pointer transition-colors"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add Inclusion</span>
                  </button>
                </div>

                <div className="space-y-2">
                  {(pkg.features || []).map((feat, fIdx) => (
                    <div key={fIdx} className="flex items-center gap-2">
                      <input
                        type="text"
                        value={feat}
                        onChange={(e) => handleUpdatePackageFeature(idx, fIdx, e.target.value)}
                        className="flex-1 px-3 py-1.5 rounded-xl bg-gray-50 dark:bg-zinc-950 border border-gray-200 dark:border-zinc-800 text-xs text-zinc-800 dark:text-zinc-200 focus:border-rose-500 focus:outline-none"
                        placeholder="e.g. Free crew training"
                      />
                      <button
                        type="button"
                        onClick={() => handleRemovePackageFeature(idx, fIdx)}
                        className="p-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500 text-rose-600 dark:text-rose-400 hover:text-zinc-900 dark:hover:text-white transition-colors cursor-pointer"
                        title="Remove inclusion"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                  {(!pkg.features || pkg.features.length === 0) && (
                    <p className="text-xs text-zinc-500 italic p-2">No inclusions added for this package.</p>
                  )}
                </div>
              </div>

              {/* Popular Checkbox Toggle */}
              <div className="pt-2 flex items-center justify-between border-t border-gray-200 dark:border-zinc-800/60">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={Boolean(pkg.is_popular)}
                    onChange={(e) => {
                      const updated = [...cmsPackages];
                      updated[idx].is_popular = e.target.checked;
                      setCmsPackages(updated);
                    }}
                    className="rounded border-gray-300 dark:border-zinc-700 bg-gray-50 dark:bg-zinc-950 text-rose-600 focus:ring-rose-500"
                  />
                  <span className="text-xs text-zinc-700 dark:text-zinc-300 font-semibold">
                    Mark as Most Popular / Featured Highlight
                  </span>
                </label>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
