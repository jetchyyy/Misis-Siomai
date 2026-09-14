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

  return (
    <section id="menu" className="py-20 md:py-28 bg-[#FFFDF7] relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-10 border-b border-zinc-200/80">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-100 text-rose-800 text-xs font-bold uppercase tracking-wider">
              <Flame className="w-4 h-4 text-rose-600" />
              Signature Dimsum Menu
            </div>
            <h2 className="font-heading font-extrabold text-3xl sm:text-4xl lg:text-5xl text-zinc-900 tracking-tight">
              Our Bestselling <span className="text-rose-600">Dimsum Lineup</span>
            </h2>
            <p className="text-sm sm:text-base text-zinc-600 max-w-xl">
              Made with 100% pure seasoned pork and beef, wrapped daily for maximum juiciness and authentic flavor.
            </p>
          </div>

          {/* Category Tabs */}
          <div className="flex flex-wrap items-center gap-2 p-1.5 rounded-2xl bg-zinc-100 border border-zinc-200">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  activeCategory === cat
                    ? 'bg-rose-600 text-white shadow-md'
                    : 'text-zinc-600 hover:text-zinc-900 hover:bg-white/60'
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
              className="group glass-card rounded-3xl overflow-hidden bg-white border border-rose-900/10 shadow-lg hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
            >
              <div>
                {/* Image Box */}
                <div className="relative h-48 overflow-hidden bg-zinc-100">
                  <img
                    src={item.image_url || 'https://images.unsplash.com/photo-1541696432-82c6da8ce7bf?auto=format&fit=crop&q=80&w=600'}
                    alt={item.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  {item.is_popular && (
                    <span className="absolute top-3 left-3 px-3 py-1 rounded-full bg-gradient-to-r from-rose-600 to-amber-500 text-white text-[10px] font-extrabold uppercase tracking-wider shadow-md">
                      Bestseller
                    </span>
                  )}
                  <span className="absolute bottom-3 right-3 px-3 py-1 rounded-xl bg-zinc-950/80 backdrop-blur-md text-amber-300 font-extrabold text-xs shadow-md">
                    {item.price}
                  </span>
                </div>

                {/* Info Content */}
                <div className="p-5 space-y-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-rose-600">{item.category}</span>
                  <h3 className="font-heading font-extrabold text-lg text-zinc-900 group-hover:text-rose-600 transition-colors">
                    {item.name}
                  </h3>
                  <p className="text-xs text-zinc-500 line-clamp-2 leading-relaxed">
                    {item.description}
                  </p>
                </div>
              </div>

              {/* Order / Inquiry Action */}
              <div className="p-5 pt-0">
                <button
                  onClick={() => onOpenInquiryModal('bulk_order', item.name)}
                  className="w-full py-2.5 rounded-xl bg-rose-50 hover:bg-rose-600 text-rose-700 hover:text-white font-heading font-bold text-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <ShoppingBag className="w-3.5 h-3.5" />
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
