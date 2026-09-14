import React, { useState, useMemo } from 'react';
import { 
  MapPin, Search, Phone, Clock, Store, CheckCircle2, ShieldCheck, 
  Navigation, Copy, Check, Filter, X, Building2, ChevronDown
} from 'lucide-react';
import { useCMS } from '../context/CMSContext';

export default function BranchLocator() {
  const { cms } = useCMS();
  const branches = cms.branches || [];
  
  // Filtering & Pagination state
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCity, setSelectedCity] = useState('All');
  const [statusFilter, setStatusFilter] = useState('all'); // 'all', 'active'
  const [visibleCount, setVisibleCount] = useState(9);
  const [copiedId, setCopiedId] = useState(null);

  // Extract unique cities from branches
  const cities = useMemo(() => {
    const cityList = branches
      .map(br => br.city?.trim())
      .filter(Boolean);
    return ['All', ...Array.from(new Set(cityList))];
  }, [branches]);

  // Filtered branches
  const filteredBranches = useMemo(() => {
    return branches.filter(br => {
      // City filter
      if (selectedCity !== 'All' && br.city !== selectedCity) {
        return false;
      }
      // Status filter
      if (statusFilter === 'active' && br.is_active === false) {
        return false;
      }
      // Search term
      if (!searchTerm.trim()) return true;
      const term = searchTerm.toLowerCase();
      return (
        (br.name && br.name.toLowerCase().includes(term)) ||
        (br.address && br.address.toLowerCase().includes(term)) ||
        (br.city && br.city.toLowerCase().includes(term)) ||
        (br.phone && br.phone.toLowerCase().includes(term))
      );
    });
  }, [branches, searchTerm, selectedCity, statusFilter]);

  // Paginated branches
  const displayedBranches = useMemo(() => {
    return filteredBranches.slice(0, visibleCount);
  }, [filteredBranches, visibleCount]);

  const activeCount = useMemo(() => {
    return branches.filter(b => b.is_active !== false).length;
  }, [branches]);

  // Copy address handler
  const handleCopyAddress = (br) => {
    const fullText = `${br.name}, ${br.address}, ${br.city}`;
    navigator.clipboard.writeText(fullText);
    setCopiedId(br.id || br.name);
    setTimeout(() => setCopiedId(null), 2500);
  };

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

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-10">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-8 border-b border-[#D4AF37]/30">
          <div className="space-y-4">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#D4AF37]/10 text-[#D4AF37] border border-[#D4AF37]/30 text-xs font-black uppercase tracking-widest shadow-sm">
              <MapPin className="w-4 h-4" />
              <span>Store Network • {activeCount} Active Branches</span>
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
            <p className="text-sm sm:text-base text-zinc-100 max-w-xl leading-relaxed mt-2">
              Locate our primary distribution centers, food carts, and franchise hubs across Cebu and neighboring cities.
            </p>
          </div>

          {/* Quick Stats Cards */}
          <div className="grid grid-cols-2 gap-3 shrink-0">
            <div className="p-4 rounded-2xl bg-black/30 border border-[#D4AF37]/30 text-center backdrop-blur-md">
              <div className="text-2xl sm:text-3xl font-black text-[#D4AF37] font-serif">{branches.length}</div>
              <div className="text-[10px] font-bold uppercase tracking-wider text-zinc-200 mt-0.5">Total Locations</div>
            </div>
            <div className="p-4 rounded-2xl bg-black/30 border border-[#D4AF37]/30 text-center backdrop-blur-md">
              <div className="text-2xl sm:text-3xl font-black text-[#D4AF37] font-serif">{cities.length > 1 ? cities.length - 1 : 1}</div>
              <div className="text-[10px] font-bold uppercase tracking-wider text-zinc-200 mt-0.5">Cities & Regions</div>
            </div>
          </div>
        </div>

        {/* Search & Filter Toolbar */}
        <div className="space-y-4">
          <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
            
            {/* Search Input Box */}
            <div className="relative flex-1 max-w-lg">
              <Search className="w-5 h-5 text-[#D4AF37] absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                placeholder="Search branch name, street, or landmark..."
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setVisibleCount(9);
                }}
                className="w-full pl-12 pr-10 py-3.5 rounded-2xl bg-black/30 border border-[#D4AF37]/40 text-sm text-white placeholder:text-white/60 outline-none focus:border-[#D4AF37] focus:ring-2 focus:ring-[#D4AF37]/40 transition-all shadow-inner backdrop-blur-md font-medium"
              />
              {searchTerm && (
                <button 
                  onClick={() => setSearchTerm('')}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 p-1 rounded-full text-zinc-300 hover:text-white bg-white/10 hover:bg-white/20 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Active Only Filter & Counter */}
            <div className="flex items-center gap-3 self-start md:self-auto">
              <button
                onClick={() => setStatusFilter(prev => prev === 'all' ? 'active' : 'all')}
                className={`px-4 py-3 rounded-2xl font-extrabold text-xs flex items-center gap-2 border transition-all cursor-pointer backdrop-blur-md ${
                  statusFilter === 'active'
                    ? 'bg-[#D4AF37] text-zinc-950 border-[#D4AF37] shadow-lg shadow-[#D4AF37]/30'
                    : 'bg-black/30 text-white border-[#D4AF37]/30 hover:border-[#D4AF37]'
                }`}
              >
                <Filter className="w-3.5 h-3.5" />
                <span>{statusFilter === 'active' ? 'Showing Active Only' : 'All Statuses'}</span>
              </button>

              <span className="text-xs text-zinc-200 font-semibold px-3 py-2 rounded-xl bg-black/20 border border-[#D4AF37]/20">
                {filteredBranches.length} {filteredBranches.length === 1 ? 'store' : 'stores'} found
              </span>
            </div>

          </div>

          {/* City Pill Filter Tabs */}
          {cities.length > 2 && (
            <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none pt-2">
              <span className="text-xs font-bold uppercase tracking-wider text-[#D4AF37] shrink-0 mr-1 flex items-center gap-1">
                <Building2 className="w-3.5 h-3.5" /> Filter City:
              </span>
              {cities.map((city) => (
                <button
                  key={city}
                  onClick={() => {
                    setSelectedCity(city);
                    setVisibleCount(9);
                  }}
                  className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer border ${
                    selectedCity === city
                      ? 'bg-[#D4AF37] text-zinc-950 border-[#D4AF37] shadow-md shadow-[#D4AF37]/30'
                      : 'bg-black/30 text-white/90 border-[#D4AF37]/20 hover:border-[#D4AF37]/60 hover:bg-black/40'
                  }`}
                >
                  {city === 'All' ? 'All Cities' : city}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Empty State */}
        {filteredBranches.length === 0 && (
          <div className="p-12 sm:p-16 rounded-[2rem] bg-[#FAF3E3] border-[4px] border-[#D4AF37] text-center space-y-4 shadow-xl">
            <Store className="w-12 h-12 text-[#cf030f] mx-auto opacity-70" />
            <div className="space-y-1">
              <h3 className="font-serif font-black text-2xl text-[#18572c]">No Branch Locations Found</h3>
              <p className="text-sm text-zinc-600 max-w-md mx-auto">
                No stores matched your search standard "{searchTerm}". Try clearing your search query or selecting another city.
              </p>
            </div>
            <button
              onClick={() => {
                setSearchTerm('');
                setSelectedCity('All');
                setStatusFilter('all');
              }}
              className="px-6 py-3 rounded-xl bg-[#cf030f] hover:bg-[#a6020c] text-white font-bold text-xs inline-flex items-center gap-2 shadow-lg shadow-[#cf030f]/30 transition-all cursor-pointer"
            >
              <X className="w-4 h-4" />
              <span>Reset All Filters</span>
            </button>
          </div>
        )}

        {/* Branches Grid */}
        {filteredBranches.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {displayedBranches.map((br, idx) => (
              <div 
                key={br.id || idx} 
                className="p-8 rounded-[1.5rem] bg-[#FAF3E3] shadow-xl hover:shadow-[0_20px_40px_rgba(0,0,0,0.3)] hover:-translate-y-2 transition-all relative group border-[4px] border-[#D4AF37] flex flex-col justify-between"
              >
                <div>
                  {/* Inner frame */}
                  <div className="absolute inset-2 border-[1.5px] border-[#cf030f]/30 rounded-[1rem] pointer-events-none"></div>

                  {/* Tiny Inner Corners (Fretwork) */}
                  <div className="absolute top-2.5 left-2.5 opacity-60"><FretworkCorner className="w-5 h-5 text-[#cf030f]" /></div>
                  <div className="absolute top-2.5 right-2.5 opacity-60"><FretworkCorner className="w-5 h-5 rotate-90 text-[#cf030f]" /></div>
                  <div className="absolute bottom-2.5 right-2.5 opacity-60"><FretworkCorner className="w-5 h-5 rotate-180 text-[#cf030f]" /></div>
                  <div className="absolute bottom-2.5 left-2.5 opacity-60"><FretworkCorner className="w-5 h-5 -rotate-90 text-[#cf030f]" /></div>

                  {/* Card Top Header */}
                  <div className="flex items-start justify-between relative z-10 mb-6">
                    {/* Traditional Red Seal (Chop) effect for City */}
                    <div className="relative px-2.5 py-1.5 border-[2px] border-[#cf030f] text-[#cf030f] flex items-center justify-center transform -rotate-2 bg-[#cf030f]/5 shadow-sm">
                      <div className="absolute inset-[2px] border border-[#cf030f]/40"></div>
                      <span className="text-[10px] font-black uppercase tracking-[0.2em] leading-none relative z-10">
                        {br.city}
                      </span>
                    </div>
                    
                    <span className={`inline-flex items-center gap-1.5 text-[10px] font-black uppercase tracking-wider px-3 py-1 rounded-full ${
                      br.is_active === false ? 'text-zinc-500 bg-zinc-200' : 'text-[#18572c] bg-[#18572c]/10'
                    }`}>
                      {br.is_active === false ? <Clock className="w-3 h-3 text-zinc-500" /> : <CheckCircle2 className="w-3 h-3 text-[#18572c]" />}
                      {br.is_active === false ? 'Inactive' : 'Active Store'}
                    </span>
                  </div>

                  {/* Branch Name & Address */}
                  <div className="space-y-2 relative z-10">
                    <h3 className="font-serif font-black text-2xl text-[#18572c] leading-tight group-hover:text-[#cf030f] transition-colors">
                      {br.name}
                    </h3>
                    <p className="text-sm text-zinc-700 flex items-start gap-2 mt-2 leading-relaxed">
                      <MapPin className="w-4 h-4 text-[#cf030f] shrink-0 mt-0.5" />
                      <span>{br.address}</span>
                    </p>
                  </div>

                  {/* Contact Info & Hours */}
                  <div className="pt-5 mt-5 border-t-2 border-dotted border-[#D4AF37]/60 space-y-3 text-sm text-zinc-600 relative z-10">
                    {br.phone && (
                      <a 
                        href={`tel:${br.phone.split('/')[0].trim()}`} 
                        className="flex items-center gap-3 font-bold text-[#18572c] hover:text-[#cf030f] transition-colors group/phone"
                        title="Click to call store"
                      >
                        <div className="w-7 h-7 rounded-full bg-[#D4AF37]/20 flex items-center justify-center shrink-0 group-hover/phone:bg-[#cf030f] group-hover/phone:text-white transition-colors">
                          <Phone className="w-3.5 h-3.5 text-[#cf030f] group-hover/phone:text-white" />
                        </div>
                        <span className="text-xs sm:text-sm truncate">{br.phone}</span>
                      </a>
                    )}
                    {br.hours && (
                      <div className="flex items-center gap-3 font-medium text-zinc-700">
                        <div className="w-7 h-7 rounded-full bg-[#D4AF37]/20 flex items-center justify-center shrink-0">
                          <Clock className="w-3.5 h-3.5 text-[#D4AF37]" />
                        </div>
                        <span className="text-xs sm:text-sm">{br.hours}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Card Action Footer */}
                <div className="pt-5 mt-5 border-t border-[#D4AF37]/40 flex items-center gap-2 relative z-10">
                  <a
                    href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${br.name} ${br.address} ${br.city}`)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 py-2.5 px-3 rounded-xl bg-[#cf030f] hover:bg-[#a6020c] text-white text-xs font-bold flex items-center justify-center gap-1.5 transition-all shadow-md cursor-pointer"
                  >
                    <Navigation className="w-3.5 h-3.5" />
                    <span>Get Directions</span>
                  </a>

                  <button
                    onClick={() => handleCopyAddress(br)}
                    className="py-2.5 px-3 rounded-xl bg-white border border-[#D4AF37]/50 hover:bg-[#FAF3E3] text-[#18572c] text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer shadow-sm"
                    title="Copy full branch address"
                  >
                    {copiedId === (br.id || br.name) ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-600" />
                        <span className="text-emerald-700">Copied</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5 text-[#cf030f]" />
                        <span>Copy</span>
                      </>
                    )}
                  </button>
                </div>

              </div>
            ))}
          </div>
        )}

        {/* Load More Pagination Button for Large Datasets */}
        {filteredBranches.length > visibleCount && (
          <div className="text-center pt-8">
            <button
              onClick={() => setVisibleCount(prev => prev + 9)}
              className="px-8 py-4 rounded-2xl bg-[#D4AF37] hover:bg-[#c4a02c] text-zinc-950 font-black text-sm inline-flex items-center gap-2 shadow-xl shadow-black/20 hover:scale-105 transition-all cursor-pointer"
            >
              <span>Load More Locations ({filteredBranches.length - visibleCount} remaining)</span>
              <ChevronDown className="w-4 h-4" />
            </button>
          </div>
        )}

      </div>
    </section>
  );
}

