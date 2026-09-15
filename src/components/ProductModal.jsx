import React from 'react';
import { X } from 'lucide-react';

export default function ProductModal({ isOpen, onClose, product }) {
  if (!isOpen || !product) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />
      
      <div className="relative bg-[#FAF3E3] rounded-3xl w-full max-w-lg overflow-hidden shadow-2xl border-2 border-[#D4AF37]/50">
        
        {/* Close Button */}
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 z-20 w-8 h-8 rounded-full bg-black/20 hover:bg-black/40 text-white flex items-center justify-center transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Image */}
        <div className="relative h-64 bg-[#E8DCC4] w-full">
          <img 
            src={product.image_url || 'https://images.unsplash.com/photo-1541696432-82c6da8ce7bf?auto=format&fit=crop&q=80&w=600'} 
            alt={product.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-[#FAF3E3] to-transparent" />
          
          {product.is_popular && (
            <div className="absolute top-0 left-6 w-8 pb-3 bg-[#cf030f] shadow-lg flex flex-col items-center justify-start pt-3 z-20 rounded-b-sm">
               <span className="text-[#FAF3E3] text-[9px] font-black uppercase tracking-widest" style={{ writingMode: 'vertical-lr', transform: 'rotate(180deg)' }}>Bestseller</span>
               <div className="absolute -bottom-2 left-0 w-full h-3 bg-[#cf030f]" style={{ clipPath: 'polygon(0 0, 50% 100%, 100% 0)' }}></div>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="px-8 pb-8 pt-2 relative z-10 text-center">
          <span className="text-[10px] font-black uppercase tracking-widest text-[#cf030f]">{product.category}</span>
          
          <h3 className="font-serif font-black text-4xl text-[#18572c] mt-2 mb-4 leading-tight">
            {product.name}
          </h3>
          
          <p className="text-zinc-600 text-sm leading-relaxed mb-8">
            {product.description}
          </p>

          <div className="inline-block px-10 py-4 rounded-2xl bg-gradient-to-r from-[#cf030f] to-[#8a020a] border-2 border-[#D4AF37]/50 shadow-lg shadow-[#cf030f]/30">
            <span className="block text-[10px] font-black uppercase tracking-widest text-[#D4AF37] mb-1">
              Serving Price
            </span>
            <div className="font-serif font-black text-4xl text-white">
              {product.price}
            </div>
          </div>
        </div>
        
      </div>
    </div>
  );
}
