import React, { useState } from 'react';
import { MapPin, Search, Phone, Clock, Store, CheckCircle2, ShieldCheck } from 'lucide-react';
import { useCMS } from '../context/CMSContext';

export default function BranchLocator() {
  const { cms } = useCMS();
  const branches = cms.branches || [];
  const [searchTerm, setSearchTerm] = useState('');

  const filteredBranches = branches.filter(br => 
    br.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    br.address.toLowerCase().includes(searchTerm.toLowerCase()) ||
    br.city.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <section id="branches" className="py-20 md:py-28 bg-gradient-to-b from-[#FFFDF7] via-amber-50/30 to-[#FFFDF7] relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-8 border-b border-zinc-200">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold uppercase tracking-wider">
              <MapPin className="w-4 h-4 text-emerald-600" />
              Store Network
            </div>
            <h2 className="font-heading font-extrabold text-3xl sm:text-4xl lg:text-5xl text-zinc-900 tracking-tight">
              Find a <span className="text-emerald-700">Misis Siomai Branch</span>
            </h2>
            <p className="text-sm text-zinc-600 max-w-xl">
              Locate our primary distribution centers, food carts, and franchise hubs across Cebu and neighboring cities.
            </p>
          </div>

          {/* Search Box */}
          <div className="relative w-full md:w-80">
            <Search className="w-4 h-4 text-zinc-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by city or landmark..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 rounded-2xl bg-white border border-zinc-200 text-sm text-zinc-900 placeholder:text-zinc-400 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all shadow-xs"
            />
          </div>
        </div>

        {/* Branches Grid */}
        <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-6">
          {filteredBranches.map((br, idx) => (
            <div key={br.id || idx} className="p-6 rounded-3xl bg-white border border-emerald-950/10 shadow-lg space-y-4 hover:border-emerald-500/30 transition-all">
              <div className="flex items-center justify-between">
                <span className="px-2.5 py-1 rounded-full text-[10px] font-extrabold bg-emerald-100 text-emerald-800 uppercase tracking-wider">
                  {br.city}
                </span>
                <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-600">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Active Branch
                </span>
              </div>

              <div className="space-y-1">
                <h3 className="font-heading font-extrabold text-lg text-zinc-900">{br.name}</h3>
                <p className="text-xs text-zinc-600 flex items-start gap-1.5 mt-1">
                  <MapPin className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
                  <span>{br.address}</span>
                </p>
              </div>

              <div className="pt-3 border-t border-zinc-100 space-y-1.5 text-xs text-zinc-600">
                {br.phone && (
                  <div className="flex items-center gap-2 font-mono text-emerald-700 font-bold">
                    <Phone className="w-3.5 h-3.5 text-emerald-600" />
                    <span>{br.phone}</span>
                  </div>
                )}
                {br.hours && (
                  <div className="flex items-center gap-2">
                    <Clock className="w-3.5 h-3.5 text-zinc-400" />
                    <span>{br.hours}</span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
