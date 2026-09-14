import React, { useState, useEffect } from 'react';
import { supabase, TENANT_ID } from '../lib/supabase';
import { Flame, Star, ShoppingBag, CheckCircle, Loader2, Sparkles, Filter } from 'lucide-react';

const FALLBACK_PRODUCTS = [
  {
    id: '1',
    name: 'Classic Steamed Pork Siomai',
    category: 'Steamed Siomai',
    description: '100% pure tender pork with crisp jicama, steamed fresh daily in bamboo baskets.',
    price: 45.00,
    is_bestseller: true,
    image_url: 'https://images.unsplash.com/photo-1541696432-82c6da8ce7bf?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: '2',
    name: 'Signature Beef Siomai',
    category: 'Steamed Siomai',
    description: 'Hearty savory beef blended with aromatic spices and sesame oil.',
    price: 50.00,
    is_bestseller: true,
    image_url: 'https://images.unsplash.com/photo-1496116218417-1a781b1c416c?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: '3',
    name: 'Crispy Fried Japanese Nori Siomai',
    category: 'Fried Dimsum',
    description: 'Wrapped in premium roasted seaweed sheets and deep-fried to golden perfection.',
    price: 55.00,
    is_bestseller: false,
    image_url: 'https://images.unsplash.com/photo-1563245372-f21724e3856d?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: '4',
    name: 'Golden Fried Quail Egg Siomai',
    category: 'Fried Dimsum',
    description: 'Juicy savory meat wrapper stuffed with whole fresh boiled quail eggs.',
    price: 50.00,
    is_bestseller: false,
    image_url: 'https://images.unsplash.com/photo-1541696432-82c6da8ce7bf?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: '5',
    name: 'Artisan Toasted Chili Garlic Oil (Bottle)',
    category: 'Sauces & Drinks',
    description: 'Slow-cooked toasted garlic flakes infused with hot native chili and sesame.',
    price: 120.00,
    is_bestseller: true,
    image_url: 'https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: '6',
    name: 'Iced Black Gulaman Cooler',
    category: 'Sauces & Drinks',
    description: 'Traditional refreshing brown sugar and grass jelly drink, served ice-cold.',
    price: 30.00,
    is_bestseller: false,
    image_url: 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&w=600&q=80'
  }
];

export default function MenuShowcase({ onOpenInquiryModal }) {
  const [products, setProducts] = useState(FALLBACK_PRODUCTS);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchProducts() {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('products')
          .select('*')
          .eq('tenant_id', TENANT_ID)
          .order('display_order', { ascending: true });

        if (error) {
          console.warn('Supabase products fetch warning, using fallbacks:', error.message);
        } else if (data && data.length > 0) {
          setProducts(data);
        }
      } catch (err) {
        console.warn('Fetch products failed:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchProducts();
  }, []);

  const categories = ['All', 'Steamed Siomai', 'Fried Dimsum', 'Sauces & Drinks'];

  const filteredProducts = selectedCategory === 'All'
    ? products
    : products.filter(p => p.category === selectedCategory);

  return (
    <section id="menu" className="py-20 md:py-28 bg-[#FFFDF7] relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-100 text-amber-800 text-xs font-bold uppercase tracking-wider">
            <Flame className="w-4 h-4 text-amber-600" />
            Delicious Dimsum Menu
          </div>
          <h2 className="font-heading font-extrabold text-3xl sm:text-4xl lg:text-5xl text-zinc-900 tracking-tight">
            Our Signature <span className="text-rose-600">Menu Items</span>
          </h2>
          <p className="text-base text-zinc-600">
            Made with 100% pure pork & beef, wrapped tightly and steamed or fried fresh daily. Served with our famous toasted chili garlic sauce and calamansi!
          </p>
        </div>

        {/* Category Tabs Filter */}
        <div className="mt-10 flex flex-wrap items-center justify-center gap-2 sm:gap-3">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-5 py-2.5 rounded-xl font-heading font-bold text-sm transition-all duration-200 cursor-pointer ${
                selectedCategory === cat
                  ? 'bg-rose-600 text-white shadow-md shadow-rose-600/25 scale-105'
                  : 'bg-white text-zinc-700 hover:bg-rose-50 border border-zinc-200 hover:border-rose-300'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Product Cards Grid */}
        <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredProducts.map((product) => (
            <div
              key={product.id}
              className="group glass-card rounded-3xl overflow-hidden hover:shadow-xl hover:shadow-rose-950/10 transition-all duration-300 flex flex-col border border-rose-900/10 hover:-translate-y-1"
            >
              {/* Product Image Container */}
              <div className="relative h-56 overflow-hidden bg-zinc-100">
                <img
                  src={product.image_url || 'https://images.unsplash.com/photo-1541696432-82c6da8ce7bf?auto=format&fit=crop&w=600&q=80'}
                  alt={product.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-zinc-950/60 via-transparent to-transparent opacity-60 group-hover:opacity-40 transition-opacity" />

                {/* Bestseller Badge */}
                {product.is_bestseller && (
                  <div className="absolute top-4 left-4 inline-flex items-center gap-1 px-3 py-1 rounded-full bg-amber-500 text-zinc-950 font-bold text-xs shadow-md">
                    <Star className="w-3.5 h-3.5 fill-zinc-950" />
                    BESTSELLER
                  </div>
                )}

                {/* Price Pill */}
                <div className="absolute bottom-4 right-4 bg-white/95 backdrop-blur-md px-3.5 py-1.5 rounded-2xl font-heading font-extrabold text-base text-rose-600 shadow-md">
                  ₱{Number(product.price).toFixed(2)}
                </div>
              </div>

              {/* Card Body */}
              <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                <div>
                  <span className="text-[11px] font-extrabold uppercase tracking-wider text-rose-600">
                    {product.category}
                  </span>
                  <h3 className="font-heading font-extrabold text-xl text-zinc-900 mt-1 group-hover:text-rose-600 transition-colors">
                    {product.name}
                  </h3>
                  <p className="text-xs sm:text-sm text-zinc-600 mt-2 leading-relaxed">
                    {product.description}
                  </p>
                </div>

                <div className="pt-3 border-t border-zinc-100 flex items-center justify-between">
                  <span className="text-xs font-semibold text-emerald-700 flex items-center gap-1">
                    <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
                    Fresh Daily
                  </span>
                  <button
                    onClick={() => onOpenInquiryModal('bulk_order', product.name)}
                    className="px-4 py-2 rounded-xl bg-rose-50 hover:bg-rose-600 text-rose-700 hover:text-white font-heading font-bold text-xs transition-all duration-200 flex items-center gap-1.5 cursor-pointer"
                  >
                    <ShoppingBag className="w-3.5 h-3.5" />
                    Bulk Order
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
