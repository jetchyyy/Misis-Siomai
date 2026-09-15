import React, { useState } from 'react';
import { MapPin, Plus, Save, Search, Trash2, X } from 'lucide-react';

export default function AdminBranchesTab({ cmsBranches, setCmsBranches, handleSaveBranches }) {
  const [adminBranchSearch, setAdminBranchSearch] = useState('');
  const [adminBranchCityFilter, setAdminBranchCityFilter] = useState('All');
  const [adminBranchStatusFilter, setAdminBranchStatusFilter] = useState('all');
  const [adminBranchVisibleCount, setAdminBranchVisibleCount] = useState(10);

  // Branch Add / Remove
  const handleAddBranch = () => {
    const newBranch = {
      id: `br-${Date.now()}`,
      name: 'New Misis Siomai Branch',
      city: 'Cebu City',
      address: 'Enter location / street address',
      phone: '0932 2329484',
      hours: '8:00 AM - 8:00 PM',
      is_active: true
    };
    setCmsBranches(prev => [newBranch, ...prev]);
  };

  const handleRemoveBranch = (idx) => {
    setCmsBranches(prev => prev.filter((_, i) => i !== idx));
  };

  // Compute cities for admin filter
  const adminCities = ['All', ...Array.from(new Set(cmsBranches.map(b => b.city?.trim()).filter(Boolean)))];

  // Filter branches
  const filteredAdminBranches = cmsBranches.filter((br) => {
    if (adminBranchCityFilter !== 'All' && br.city !== adminBranchCityFilter) return false;
    if (adminBranchStatusFilter === 'active' && br.is_active === false) return false;
    if (adminBranchStatusFilter === 'inactive' && br.is_active !== false) return false;
    if (!adminBranchSearch.trim()) return true;
    const term = adminBranchSearch.toLowerCase();
    return (
      (br.name && br.name.toLowerCase().includes(term)) ||
      (br.address && br.address.toLowerCase().includes(term)) ||
      (br.city && br.city.toLowerCase().includes(term)) ||
      (br.phone && br.phone.toLowerCase().includes(term))
    );
  });

  // Paginated view
  const visibleAdminBranches = filteredAdminBranches.slice(0, adminBranchVisibleCount);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-heading font-extrabold text-3xl text-zinc-900 dark:text-white">Branches CMS</h1>
          <p className="text-xs text-zinc-500 dark:text-zinc-400">
            Configure franchise locations, addresses, contact details, and operating hours ({cmsBranches.length} total)
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={handleAddBranch}
            className="px-4 py-2.5 rounded-xl bg-gray-100 dark:bg-zinc-800 hover:bg-zinc-700 text-zinc-900 dark:text-white font-bold text-xs flex items-center gap-1.5 cursor-pointer transition-colors"
          >
            <Plus className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            <span>Add Branch</span>
          </button>
          <button
            onClick={handleSaveBranches}
            className="px-5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs flex items-center gap-2 shadow-lg shadow-rose-900/40 cursor-pointer transition-colors"
          >
            <Save className="w-4 h-4" />
            <span>Save Branches</span>
          </button>
        </div>
      </div>

      {/* Admin Search & Filter Controls */}
      {cmsBranches.length > 0 && (
        <div className="p-4 rounded-2xl bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 space-y-3">
          <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
            
            {/* Search Input */}
            <div className="relative flex-1 max-w-md">
              <Search className="w-4 h-4 text-zinc-500 dark:text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                placeholder="Search by branch name, address, or city..."
                value={adminBranchSearch}
                onChange={(e) => {
                  setAdminBranchSearch(e.target.value);
                  setAdminBranchVisibleCount(10);
                }}
                className="w-full pl-9 pr-8 py-2 rounded-xl bg-gray-50 dark:bg-zinc-950 border border-gray-200 dark:border-zinc-800 text-xs text-zinc-900 dark:text-white placeholder:text-zinc-500 focus:border-rose-500 focus:outline-none"
              />
              {adminBranchSearch && (
                <button
                  onClick={() => setAdminBranchSearch('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 p-0.5 rounded-full text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Status filter dropdown / pills */}
            <div className="flex items-center gap-2">
              <select
                value={adminBranchStatusFilter}
                onChange={(e) => {
                  setAdminBranchStatusFilter(e.target.value);
                  setAdminBranchVisibleCount(10);
                }}
                className="px-3 py-2 rounded-xl bg-gray-50 dark:bg-zinc-950 border border-gray-200 dark:border-zinc-800 text-xs text-zinc-700 dark:text-zinc-300 font-semibold focus:border-rose-500 focus:outline-none cursor-pointer"
              >
                <option value="all">All Statuses</option>
                <option value="active">Active Only</option>
                <option value="inactive">Inactive Only</option>
              </select>

              <span className="text-xs text-zinc-500 dark:text-zinc-400 font-medium px-2.5 py-1.5 rounded-lg bg-gray-50 dark:bg-zinc-950 border border-gray-200 dark:border-zinc-800">
                {filteredAdminBranches.length} of {cmsBranches.length}
              </span>
            </div>

          </div>

          {/* City Pills */}
          {adminCities.length > 2 && (
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 pt-1 scrollbar-none">
              <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400 mr-1 shrink-0">
                City:
              </span>
              {adminCities.map(city => (
                <button
                  key={city}
                  onClick={() => {
                    setAdminBranchCityFilter(city);
                    setAdminBranchVisibleCount(10);
                  }}
                  className={`px-3 py-1 rounded-lg text-xs font-semibold whitespace-nowrap cursor-pointer transition-colors border ${
                    adminBranchCityFilter === city
                      ? 'bg-rose-600 text-white border-rose-500 font-bold'
                      : 'bg-gray-50 dark:bg-zinc-950 text-zinc-500 dark:text-zinc-400 border-gray-200 dark:border-zinc-800 hover:text-zinc-900 dark:hover:text-white'
                  }`}
                >
                  {city}
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      {/* No Branches Added State */}
      {cmsBranches.length === 0 ? (
        <div className="p-12 rounded-2xl bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 text-center space-y-4">
          <MapPin className="w-12 h-12 text-zinc-600 mx-auto" />
          <div className="space-y-1">
            <h3 className="text-lg font-bold text-zinc-900 dark:text-white">No Branches Added Yet</h3>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 max-w-sm mx-auto">
              Click the button below to add your first store location or franchise branch.
            </p>
          </div>
          <button
            onClick={handleAddBranch}
            className="px-5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs inline-flex items-center gap-2 shadow-lg shadow-rose-900/40 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Add First Branch</span>
          </button>
        </div>
      ) : filteredAdminBranches.length === 0 ? (
        <div className="p-12 rounded-2xl bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 text-center space-y-3">
          <Search className="w-8 h-8 text-zinc-600 mx-auto" />
          <h3 className="text-sm font-bold text-zinc-900 dark:text-white">No matching branches found</h3>
          <p className="text-xs text-zinc-500 dark:text-zinc-400">
            No branches matched your search query "{adminBranchSearch}".
          </p>
          <button
            onClick={() => {
              setAdminBranchSearch('');
              setAdminBranchCityFilter('All');
              setAdminBranchStatusFilter('all');
            }}
            className="px-4 py-2 rounded-xl bg-gray-100 dark:bg-zinc-800 hover:bg-zinc-700 text-xs font-bold text-zinc-900 dark:text-white cursor-pointer"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {visibleAdminBranches.map((br) => {
            const realIndex = cmsBranches.findIndex(b => b === br || (b.id && b.id === br.id));
            const idx = realIndex !== -1 ? realIndex : cmsBranches.indexOf(br);

            return (
              <div key={br.id || idx} className="p-5 rounded-2xl bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-gray-200 dark:border-zinc-800">
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded-md bg-rose-500/10 text-rose-600 dark:text-rose-400 font-extrabold text-[10px] uppercase tracking-wider">
                      Branch #{cmsBranches.length - idx}
                    </span>
                    <h3 className="font-bold text-sm text-zinc-900 dark:text-white truncate max-w-xs">{br.name || 'Unnamed Branch'}</h3>
                  </div>
                  <button
                    onClick={() => handleRemoveBranch(idx)}
                    className="p-2 rounded-xl bg-rose-500/10 hover:bg-rose-500 text-rose-600 dark:text-rose-400 hover:text-zinc-900 dark:hover:text-white transition-colors cursor-pointer"
                    title="Delete Branch"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-zinc-500 dark:text-zinc-400">Branch Name</label>
                    <input
                      type="text"
                      value={br.name || ''}
                      onChange={(e) => {
                        const updated = [...cmsBranches];
                        updated[idx].name = e.target.value;
                        setCmsBranches(updated);
                      }}
                      placeholder="e.g. Misis Siomai Main Headquarters"
                      className="w-full px-3 py-2 rounded-xl bg-gray-50 dark:bg-zinc-950 border border-gray-200 dark:border-zinc-800 text-xs text-zinc-900 dark:text-white focus:border-rose-500 focus:outline-none"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-zinc-500 dark:text-zinc-400">City / Region</label>
                    <input
                      type="text"
                      value={br.city || ''}
                      onChange={(e) => {
                        const updated = [...cmsBranches];
                        updated[idx].city = e.target.value;
                        setCmsBranches(updated);
                      }}
                      placeholder="e.g. Talisay City, Cebu"
                      className="w-full px-3 py-2 rounded-xl bg-gray-50 dark:bg-zinc-950 border border-gray-200 dark:border-zinc-800 text-xs text-zinc-900 dark:text-white focus:border-rose-500 focus:outline-none"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-zinc-500 dark:text-zinc-400">Full Address</label>
                  <input
                    type="text"
                    value={br.address || ''}
                    onChange={(e) => {
                      const updated = [...cmsBranches];
                      updated[idx].address = e.target.value;
                      setCmsBranches(updated);
                    }}
                    placeholder="e.g. Ramona Village, San Isidro"
                    className="w-full px-3 py-2 rounded-xl bg-gray-50 dark:bg-zinc-950 border border-gray-200 dark:border-zinc-800 text-xs text-zinc-900 dark:text-white focus:border-rose-500 focus:outline-none"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-zinc-500 dark:text-zinc-400">Contact Number(s)</label>
                    <input
                      type="text"
                      value={br.phone || ''}
                      onChange={(e) => {
                        const updated = [...cmsBranches];
                        updated[idx].phone = e.target.value;
                        setCmsBranches(updated);
                      }}
                      placeholder="e.g. 0932 2329484 / 0995 5662713"
                      className="w-full px-3 py-2 rounded-xl bg-gray-50 dark:bg-zinc-950 border border-gray-200 dark:border-zinc-800 text-xs text-zinc-900 dark:text-white focus:border-rose-500 focus:outline-none"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-zinc-500 dark:text-zinc-400">Operating Hours</label>
                    <input
                      type="text"
                      value={br.hours || ''}
                      onChange={(e) => {
                        const updated = [...cmsBranches];
                        updated[idx].hours = e.target.value;
                        setCmsBranches(updated);
                      }}
                      placeholder="e.g. 8:00 AM - 6:00 PM"
                      className="w-full px-3 py-2 rounded-xl bg-gray-50 dark:bg-zinc-950 border border-gray-200 dark:border-zinc-800 text-xs text-zinc-900 dark:text-white focus:border-rose-500 focus:outline-none"
                    />
                  </div>
                </div>

                <div className="pt-2 flex items-center justify-between border-t border-gray-200 dark:border-zinc-800/60">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={br.is_active !== false}
                      onChange={(e) => {
                        const updated = [...cmsBranches];
                        updated[idx].is_active = e.target.checked;
                        setCmsBranches(updated);
                      }}
                      className="rounded border-gray-300 dark:border-zinc-700 bg-gray-50 dark:bg-zinc-950 text-rose-600 focus:ring-rose-500"
                    />
                    <span className="text-xs text-zinc-700 dark:text-zinc-300 font-semibold">
                      Branch Active & Listed on Site
                    </span>
                  </label>
                </div>
              </div>
            );
          })}

          {/* Load More Pagination for Admin */}
          {filteredAdminBranches.length > adminBranchVisibleCount && (
            <div className="text-center pt-4">
              <button
                onClick={() => setAdminBranchVisibleCount(prev => prev + 10)}
                className="px-6 py-3 rounded-xl bg-gray-100 dark:bg-zinc-800 hover:bg-zinc-700 text-xs text-zinc-900 dark:text-white font-bold inline-flex items-center gap-2 transition-colors cursor-pointer"
              >
                <span>Load More Branches ({filteredAdminBranches.length - adminBranchVisibleCount} remaining)</span>
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
