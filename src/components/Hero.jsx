import React, { useEffect, useRef } from 'react';
import { useCMS } from '../context/CMSContext';
import siomaiBg from '../assets/siomai.webp';
import { motion, useInView, useSpring, useTransform } from 'framer-motion';

function AnimatedCounter({ text }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });
  
  const match = String(text).match(/^([^\d]*)(\d+)([^\d]*)$/);
  const prefix = match ? match[1] : '';
  const to = match ? parseInt(match[2], 10) : 0;
  const suffix = match ? match[3] : String(text);

  const spring = useSpring(0, { stiffness: 40, damping: 20 });
  const display = useTransform(spring, (current) => {
    if (!match) return suffix;
    return prefix + Math.floor(current) + suffix;
  });

  useEffect(() => {
    if (isInView && match) {
      spring.set(to);
    }
  }, [isInView, spring, to, match]);

  if (!match) return <span>{text}</span>;
  return <motion.span ref={ref}>{display}</motion.span>;
}

export default function Hero({ onOpenFranchiseModal }) {
  const { cms } = useCMS();
  const { home, about } = cms;

  return (
    <section id="hero" className="relative pt-20 pb-0 bg-[#2d1b11]">
      <div className="relative w-full max-w-[1600px] mx-auto min-h-[600px] md:min-h-[85vh] flex items-center justify-start p-6 md:p-16 overflow-hidden">
        
        {/* Background Image with Overlay */}
        <div className="absolute inset-0 z-0">
          <img 
            src={siomaiBg}
            alt="Delicious Siomai Background" 
            className="w-full h-full object-cover"
          />
          {/* Dark gradient overlay for text readability */}
          <div className="absolute inset-0 bg-gradient-to-r from-zinc-900/90 via-zinc-900/60 to-transparent"></div>
        </div>

        {/* Decorative Corner Borders */}
        <div className="absolute inset-4 md:inset-8 lg:inset-10 border-2 border-[#d4af37]/60 z-10 pointer-events-none hidden sm:block">
          {/* Top Left Corner */}
          <div className="absolute -top-3 -left-3 w-6 h-6 border-2 border-[#d4af37]/80 bg-transparent"></div>
          <div className="absolute top-2 left-2 w-6 h-6 border-t-2 border-l-2 border-[#d4af37]/80"></div>
          <div className="absolute top-3 left-3 w-4 h-4 border-t-2 border-l-2 border-[#d4af37]/60"></div>
          
          {/* Top Right Corner */}
          <div className="absolute -top-3 -right-3 w-6 h-6 border-2 border-[#d4af37]/80 bg-transparent"></div>
          <div className="absolute top-2 right-2 w-6 h-6 border-t-2 border-r-2 border-[#d4af37]/80"></div>
          <div className="absolute top-3 right-3 w-4 h-4 border-t-2 border-r-2 border-[#d4af37]/60"></div>
          
          {/* Bottom Left Corner */}
          <div className="absolute -bottom-3 -left-3 w-6 h-6 border-2 border-[#d4af37]/80 bg-transparent"></div>
          <div className="absolute bottom-2 left-2 w-6 h-6 border-b-2 border-l-2 border-[#d4af37]/80"></div>
          <div className="absolute bottom-3 left-3 w-4 h-4 border-b-2 border-l-2 border-[#d4af37]/60"></div>
          
          {/* Bottom Right Corner */}
          <div className="absolute -bottom-3 -right-3 w-6 h-6 border-2 border-[#d4af37]/80 bg-transparent"></div>
          <div className="absolute bottom-2 right-2 w-6 h-6 border-b-2 border-r-2 border-[#d4af37]/80"></div>
          <div className="absolute bottom-3 right-3 w-4 h-4 border-b-2 border-r-2 border-[#d4af37]/60"></div>
        </div>

        {/* Hero Content */}
        <div className="relative z-20 w-full max-w-3xl space-y-6 sm:space-y-8 mt-12 md:mt-0">
          
          <h1 
            className="font-serif font-black text-6xl sm:text-7xl md:text-8xl italic tracking-tight leading-[1.1]"
            style={{ 
              color: '#cf030f', 
              textShadow: `
                -2px -2px 0 #fff,  
                 2px -2px 0 #fff,
                -2px  2px 0 #fff,
                 2px  2px 0 #fff,
                 0px -2px 0 #fff,
                 0px  2px 0 #fff,
                -2px  0px 0 #fff,
                 2px  0px 0 #fff,
                 3px 5px 12px rgba(0,0,0,0.6)
              `
            }}
          >
            {home.hero_title || 'Start Your Profitable Food Cart Business Today'}
          </h1>
          
          <h2 className="text-white text-2xl sm:text-3xl md:text-4xl font-bold leading-snug drop-shadow-lg">
            {about.tagline || 'Ang Paboritong Siomai ng Bayan'}
          </h2>

          <p className="text-zinc-200 text-lg sm:text-xl font-medium max-w-2xl drop-shadow-md leading-relaxed">
            {home.hero_subtitle || 'Premium Cebuano Siomai, Inspired by Heritage. Authentic 100% pork and beef dimsum.'}
          </p>

          <div className="flex flex-col sm:flex-row gap-4 pt-4">
            <button 
              onClick={() => document.getElementById('products')?.scrollIntoView({ behavior: 'smooth' })}
              className="px-10 py-4 rounded-full bg-[#cf030f] hover:bg-[#a0020b] text-white font-bold text-lg transition-all shadow-xl hover:shadow-[#cf030f]/30 hover:-translate-y-1"
            >
              Explore Our Menu
            </button>
            <button 
              onClick={onOpenFranchiseModal}
              className="px-10 py-4 rounded-full bg-[#18572c] hover:bg-[#113d1e] text-white font-bold text-lg border-2 border-white transition-all shadow-xl hover:-translate-y-1"
            >
              {home.cta_button || 'Inquire about Franchising'}
            </button>
          </div>

        </div>
      </div>
      
      {/* Stats Counter Bar - Red to match aesthetic */}
      <div className="bg-[#cf030f] border-t-2 border-b-2 border-[#D4AF37]/40 py-10 relative z-20 shadow-2xl overflow-hidden">
        
        {/* SVG Dragon Scales Line Pattern */}
        <svg className="absolute inset-0 w-full h-full opacity-20 pointer-events-none mix-blend-screen" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="dragonScales" width="40" height="20" patternUnits="userSpaceOnUse" patternTransform="scale(2)">
              {/* Row 1 */}
              <path d="M0,0 a20,20 0 0,0 40,0" fill="none" stroke="#D4AF37" strokeWidth="1" />
              {/* Row 2 (offset for overlap) */}
              <path d="M-20,10 a20,20 0 0,0 40,0" fill="none" stroke="#D4AF37" strokeWidth="1" />
              <path d="M20,10 a20,20 0 0,0 40,0" fill="none" stroke="#D4AF37" strokeWidth="1" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#dragonScales)" />
        </svg>
        
        {/* Golden glow edges */}
        <div className="absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-[#cf030f] to-transparent pointer-events-none"></div>
        <div className="absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-[#cf030f] to-transparent pointer-events-none"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div className="space-y-2">
              <div className="font-heading font-extrabold text-4xl sm:text-5xl text-[#D4AF37]" style={{ textShadow: '2px 2px 4px rgba(0,0,0,0.2)' }}>
                <AnimatedCounter text={home.stat_branches || '50+'} />
              </div>
              <div className="text-xs sm:text-sm font-bold text-white uppercase tracking-wider">Active Stores</div>
            </div>
            <div className="space-y-2">
              <div className="font-heading font-extrabold text-4xl sm:text-5xl text-white" style={{ textShadow: '2px 2px 4px rgba(0,0,0,0.2)' }}>
                <AnimatedCounter text="10k+" />
              </div>
              <div className="text-xs sm:text-sm font-bold text-[#D4AF37] uppercase tracking-wider">Daily Pieces Served</div>
            </div>
            <div className="space-y-2">
              <div className="font-heading font-extrabold text-4xl sm:text-5xl text-[#D4AF37]" style={{ textShadow: '2px 2px 4px rgba(0,0,0,0.2)' }}>
                <AnimatedCounter text="₱0" />
              </div>
              <div className="text-xs sm:text-sm font-bold text-white uppercase tracking-wider">Royalty Fees</div>
            </div>
            <div className="space-y-2">
              <div className="font-heading font-extrabold text-4xl sm:text-5xl text-[#D4AF37]" style={{ textShadow: '2px 2px 4px rgba(0,0,0,0.2)' }}>
                <AnimatedCounter text={home.stat_satisfaction || '99%'} />
              </div>
              <div className="text-xs sm:text-sm font-bold text-white uppercase tracking-wider">Meat Guarantee</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
