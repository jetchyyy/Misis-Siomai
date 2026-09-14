import React, { useState } from 'react';
import { Flame, Star, ShoppingBag, ArrowRight, Sparkles } from 'lucide-react';
import { useCMS } from '../context/CMSContext';

export default function MenuShowcase({ onOpenInquiryModal }) {
  const { cms } = useCMS();
  const menuItems = cms.products || [];
  const [activeCategory, setActiveCategory] = useState('All');

  const categories = ['All', ...new Set(menuItems.map(item => item.category))];

  const filteredItems = activeCategory === 'All' 
    ? menuItems 
    : menuItems.filter(item => item.category === activeCategory);

  // Traditional Chinese Lantern Element
  const Lantern = ({ className, scale = 1 }) => (
    <div className={`flex flex-col items-center ${className}`} style={{ transform: `scale(${scale})`, transformOrigin: 'top center' }}>
      {/* Hanging String */}
      <div className="w-0.5 h-16 bg-[#D4AF37]/40"></div>
      {/* Top Cap */}
      <div className="w-8 h-2 bg-gradient-to-b from-[#e6cd81] to-[#D4AF37] rounded-t-sm shadow-sm"></div>
      {/* Lantern Body */}
      <div className="relative w-16 h-20 bg-gradient-to-b from-[#cf030f] to-[#8a020a] rounded-3xl flex justify-center overflow-hidden border-y-[3px] border-[#D4AF37] shadow-[0_0_25px_rgba(207,3,15,0.5)]">
        {/* Golden Vertical Lines/Ribs */}
        <div className="absolute inset-0 flex justify-evenly px-2 py-1">
          <div className="w-[1px] h-full bg-gradient-to-b from-transparent via-[#D4AF37]/50 to-transparent"></div>
          <div className="w-[1px] h-full bg-gradient-to-b from-transparent via-[#D4AF37]/70 to-transparent"></div>
          <div className="w-[1px] h-full bg-gradient-to-b from-transparent via-[#D4AF37]/50 to-transparent"></div>
        </div>
      </div>
      {/* Bottom Cap */}
      <div className="w-6 h-1.5 bg-gradient-to-b from-[#D4AF37] to-[#b38e24] rounded-b-sm"></div>
      {/* Tassels */}
      <div className="flex gap-[2px] mt-0.5 h-12">
        <div className="w-[1px] h-full bg-gradient-to-b from-[#cf030f] to-transparent opacity-80"></div>
        <div className="w-[1px] h-5/6 bg-gradient-to-b from-[#cf030f] to-transparent opacity-90 mt-1"></div>
        <div className="w-[1px] h-full bg-gradient-to-b from-[#cf030f] to-transparent opacity-80"></div>
      </div>
    </div>
  );

  return (
    <section id="menu" className="py-20 md:py-32 bg-[#18572c] relative overflow-hidden border-y border-[#D4AF37]/20">
      
      {/* Subtle Background Radial Glow */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-[#D4AF37]/15 via-transparent to-transparent opacity-70 pointer-events-none"></div>

      {/* Traditional Moon Gate Design (Subtle Background Circles) */}
      <div className="absolute top-1/2 -left-48 -translate-y-1/2 w-[600px] h-[600px] rounded-full border-[2px] border-[#D4AF37]/10 pointer-events-none hidden lg:block"></div>
      <div className="absolute top-1/2 -left-32 -translate-y-1/2 w-[500px] h-[500px] rounded-full border-[12px] border-[#D4AF37]/5 pointer-events-none hidden lg:block"></div>
      
      <div className="absolute -bottom-64 -right-48 w-[800px] h-[800px] rounded-full border-[2px] border-[#D4AF37]/10 pointer-events-none hidden lg:block"></div>

      {/* Hanging Chinese Lanterns */}
      <div className="absolute top-0 right-[15%] hidden md:block opacity-80 hover:opacity-100 transition-opacity duration-700 animate-pulse" style={{ animationDuration: '4s' }}>
        <Lantern scale={1.2} />
      </div>
      <div className="absolute top-0 right-[5%] hidden lg:block opacity-60 hover:opacity-100 transition-opacity duration-700 animate-pulse" style={{ animationDuration: '5s', animationDelay: '1s' }}>
        <Lantern scale={0.8} className="-mt-8" />
      </div>
      <div className="absolute top-0 left-[8%] hidden lg:block opacity-50 hover:opacity-100 transition-opacity duration-700 animate-pulse" style={{ animationDuration: '6s', animationDelay: '2s' }}>
        <Lantern scale={0.9} className="-mt-4" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-10 border-b border-[#D4AF37]/30">
          <div className="space-y-4">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#D4AF37]/10 border border-[#D4AF37]/30 text-[#D4AF37] text-xs font-bold uppercase tracking-widest shadow-sm">
              <Flame className="w-4 h-4" />
              Signature Dimsum Menu
            </div>
            <h2 className="font-serif font-black text-4xl sm:text-5xl lg:text-6xl text-white tracking-tight leading-tight">
              Our Bestselling <br className="hidden sm:block" /><span 
                className="text-[#cf030f] italic"
                style={{ 
                  textShadow: `
                    -1px -1px 0 #fff,  
                     1px -1px 0 #fff,
                    -1px  1px 0 #fff,
                     1px  1px 0 #fff,
                     2px  4px 8px rgba(0,0,0,0.6)
                  `
                }}
              >Dimsum Lineup</span>
            </h2>
            <p className="text-sm sm:text-base text-zinc-300 max-w-xl leading-relaxed mt-4">
              Made with 100% pure seasoned pork and beef, wrapped daily for maximum juiciness and authentic flavor.
            </p>
          </div>

          {/* Category Tabs */}
          <div className="flex flex-wrap items-center gap-2 p-1.5 rounded-2xl bg-black/20 border border-white/10 shadow-inner">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-5 py-2.5 rounded-xl text-sm font-bold transition-all cursor-pointer ${
                  activeCategory === cat
                    ? 'bg-[#cf030f] text-white shadow-lg shadow-[#cf030f]/30'
                    : 'text-zinc-300 hover:text-white hover:bg-white/10'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Menu Items Grid */}
        <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredItems.map((item, idx) => (
            <div
              key={item.id || idx}
              className="group rounded-[2rem] overflow-hidden bg-[#FAF3E3] border border-[#D4AF37]/40 shadow-xl hover:shadow-[0_20px_40px_-15px_rgba(207,3,15,0.4)] transition-all duration-500 flex flex-col justify-between hover:-translate-y-2 relative"
            >
              {/* Inner subtle gold border framing */}
              <div className="absolute inset-1.5 border border-[#D4AF37]/30 rounded-[1.6rem] pointer-events-none z-10"></div>

              <div>
                {/* Image Box */}
                <div className="relative h-56 overflow-hidden bg-[#E8DCC4]">
                  <img
                    src={item.image_url || 'https://images.unsplash.com/photo-1541696432-82c6da8ce7bf?auto=format&fit=crop&q=80&w=600'}
                    alt={item.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
                  />
                  {/* Image Gradient Overlay blending into beige card */}
                  <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-[#FAF3E3] to-transparent"></div>
                  
                  {item.is_popular && (
                    <div className="absolute top-0 right-6 w-8 pb-3 bg-[#cf030f] shadow-lg flex flex-col items-center justify-start pt-3 z-20 rounded-b-sm">
                       <span className="text-[#FAF3E3] text-[9px] font-black uppercase tracking-widest writing-vertical-lr" style={{ writingMode: 'vertical-lr', transform: 'rotate(180deg)' }}>Bestseller</span>
                       <div className="absolute -bottom-2 left-0 w-full h-3 bg-[#cf030f]" style={{ clipPath: 'polygon(0 0, 50% 100%, 100% 0)' }}></div>
                    </div>
                  )}
                  <span className="absolute bottom-4 right-5 px-4 py-1.5 rounded-full bg-[#18572c] text-[#D4AF37] font-black text-sm shadow-md border border-[#D4AF37]/40 z-20">
                    {item.price}
                  </span>
                </div>

                {/* Info Content */}
                <div className="px-7 pt-1 pb-4 space-y-3 relative z-20">
                  <span className="text-[10px] font-black uppercase tracking-widest text-[#cf030f]">{item.category}</span>
                  <h3 className="font-serif font-black text-2xl text-[#18572c] group-hover:text-[#cf030f] transition-colors leading-tight">
                    {item.name}
                  </h3>
                  <p className="text-sm text-zinc-700 line-clamp-2 leading-relaxed">
                    {item.description}
                  </p>
                </div>
              </div>

              {/* Order / Inquiry Action */}
              <div className="p-6 pt-0 mt-2 relative z-20">
                <button
                  onClick={() => onOpenInquiryModal('bulk_order', item.name)}
                  className="w-full py-3.5 rounded-xl bg-[#cf030f] hover:bg-[#a6020c] text-white font-bold text-sm transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer shadow-md shadow-[#cf030f]/20 hover:shadow-lg hover:shadow-[#cf030f]/40"
                >
                  <ShoppingBag className="w-4 h-4" />
                  <span>Order Bulk Supply</span>
                </button>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
