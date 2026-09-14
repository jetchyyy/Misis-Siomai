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

  // Chinese Fretwork Corner SVG
  const FretworkCorner = ({ className }) => (
    <svg className={className} width="50" height="50" viewBox="0 0 50 50" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M1 49 V 15 H 15 V 1 H 49" stroke="#D4AF37" strokeWidth="1.5" strokeOpacity="0.8"/>
      <path d="M9 41 V 23 H 23 V 9 H 41" stroke="#D4AF37" strokeWidth="1.5" strokeOpacity="0.8"/>
      <rect x="1" y="1" width="14" height="14" stroke="#D4AF37" strokeWidth="1.5" strokeOpacity="0.8"/>
    </svg>
  );

  return (
    <section id="branches" className="py-20 md:py-32 bg-[#cf030f] relative overflow-hidden border-y border-[#D4AF37]/20">
      
      {/* Subtle Background Pattern/Glow */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-[#D4AF37]/20 via-transparent to-transparent opacity-60 pointer-events-none"></div>

      {/* Full-width Inner Border Frame */}
      <div className="absolute inset-3 md:inset-6 border border-[#D4AF37]/30 pointer-events-none z-0 hidden sm:block"></div>

      {/* 4 Decorative Corners Pinned to Section Edges */}
      <div className="absolute top-2 left-2 md:top-5 md:left-5 hidden sm:block"><FretworkCorner className="w-12 h-12 md:w-16 md:h-16" /></div>
      <div className="absolute top-2 right-2 md:top-5 md:right-5 hidden sm:block"><FretworkCorner className="w-12 h-12 md:w-16 md:h-16 rotate-90" /></div>
      <div className="absolute bottom-2 right-2 md:bottom-5 md:right-5 hidden sm:block"><FretworkCorner className="w-12 h-12 md:w-16 md:h-16 rotate-180" /></div>
      <div className="absolute bottom-2 left-2 md:bottom-5 md:left-5 hidden sm:block"><FretworkCorner className="w-12 h-12 md:w-16 md:h-16 -rotate-90" /></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-8 border-b border-[#D4AF37]/30">
          <div className="space-y-4">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#D4AF37]/10 text-[#D4AF37] border border-[#D4AF37]/30 text-xs font-black uppercase tracking-widest shadow-sm">
              <MapPin className="w-4 h-4" />
              Store Network
            </div>
            <h2 className="font-serif font-black text-4xl sm:text-5xl lg:text-6xl text-white tracking-tight leading-tight">
              Find a <br className="hidden sm:block" /><span 
                className="text-[#D4AF37] italic"
                style={{ 
                  textShadow: `
                    -1px -1px 0 rgba(0,0,0,0.5),  
                     1px -1px 0 rgba(0,0,0,0.5),
                    -1px  1px 0 rgba(0,0,0,0.5),
                     1px  1px 0 rgba(0,0,0,0.5),
                     2px  4px 8px rgba(0,0,0,0.4)
                  `
                }}
              >Misis Siomai Branch</span>
            </h2>
            <p className="text-sm sm:text-base text-zinc-100 max-w-xl leading-relaxed mt-4">
              Locate our primary distribution centers, food carts, and franchise hubs across Cebu and neighboring cities.
            </p>
          </div>

          {/* Search Box */}
          <div className="relative w-full md:w-80">
            <Search className="w-5 h-5 text-[#D4AF37] absolute left-4 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by city or landmark..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3.5 rounded-2xl bg-black/20 border border-[#D4AF37]/30 text-sm text-white placeholder:text-white/60 outline-none focus:border-[#D4AF37] focus:ring-2 focus:ring-[#D4AF37]/40 transition-all shadow-inner backdrop-blur-sm font-medium"
            />
          </div>
        </div>

        {/* Branches Grid */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8">
          {filteredBranches.map((br, idx) => (
            <div key={br.id || idx} className="p-8 rounded-[1.5rem] bg-[#FAF3E3] shadow-xl hover:shadow-[0_20px_40px_rgba(0,0,0,0.3)] hover:-translate-y-2 transition-all relative group border-[4px] border-[#D4AF37]">
              
              {/* Inner frame */}
              <div className="absolute inset-2 border-[1.5px] border-[#cf030f]/30 rounded-[1rem] pointer-events-none"></div>

              {/* Tiny Inner Corners (Fretwork) */}
              <div className="absolute top-2.5 left-2.5 opacity-60"><FretworkCorner className="w-5 h-5 text-[#cf030f]" /></div>
              <div className="absolute top-2.5 right-2.5 opacity-60"><FretworkCorner className="w-5 h-5 rotate-90 text-[#cf030f]" /></div>
              <div className="absolute bottom-2.5 right-2.5 opacity-60"><FretworkCorner className="w-5 h-5 rotate-180 text-[#cf030f]" /></div>
              <div className="absolute bottom-2.5 left-2.5 opacity-60"><FretworkCorner className="w-5 h-5 -rotate-90 text-[#cf030f]" /></div>

              <div className="flex items-start justify-between relative z-10 mb-6">
                {/* Traditional Red Seal (Chop) effect for City */}
                <div className="relative px-2.5 py-1.5 border-[2px] border-[#cf030f] text-[#cf030f] flex items-center justify-center transform -rotate-2 bg-[#cf030f]/5">
                  <div className="absolute inset-[2px] border border-[#cf030f]/40"></div>
                  <span className="text-[10px] font-black uppercase tracking-[0.2em] leading-none relative z-10">
                    {br.city}
                  </span>
                </div>
                
                <span className="inline-flex items-center gap-1.5 text-[10px] font-black text-[#18572c] uppercase tracking-wider bg-[#18572c]/10 px-3 py-1 rounded-full">
                  <CheckCircle2 className="w-3 h-3" /> Active
                </span>
              </div>

              <div className="space-y-2 relative z-10">
                <h3 className="font-serif font-black text-2xl text-[#18572c] leading-tight group-hover:text-[#cf030f] transition-colors">{br.name}</h3>
                <p className="text-sm text-zinc-700 flex items-start gap-2 mt-2 leading-relaxed">
                  <MapPin className="w-4 h-4 text-[#cf030f] shrink-0 mt-0.5" />
                  <span>{br.address}</span>
                </p>
              </div>

              <div className="pt-5 mt-5 border-t-2 border-dotted border-[#D4AF37]/60 space-y-3 text-sm text-zinc-600 relative z-10">
                {br.phone && (
                  <div className="flex items-center gap-3 font-bold text-[#18572c]">
                    <div className="w-6 h-6 rounded-full bg-[#D4AF37]/20 flex items-center justify-center shrink-0">
                      <Phone className="w-3.5 h-3.5 text-[#cf030f]" />
                    </div>
                    <span>{br.phone}</span>
                  </div>
                )}
                {br.hours && (
                  <div className="flex items-center gap-3 font-medium">
                    <div className="w-6 h-6 rounded-full bg-[#D4AF37]/20 flex items-center justify-center shrink-0">
                      <Clock className="w-3.5 h-3.5 text-[#D4AF37]" />
                    </div>
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
