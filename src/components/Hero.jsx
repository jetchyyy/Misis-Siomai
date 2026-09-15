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
      <div className="relative w-full max-w-[1600px] mx-auto min-h-[100dvh] md:min-h-[75vh] flex items-center justify-start p-6 md:p-12 overflow-hidden">
        
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
        <div className="relative z-20 w-full max-w-3xl space-y-4 sm:space-y-6 mt-6 md:mt-0 md:pl-8 lg:pl-12 flex flex-col items-center md:items-start text-center md:text-left mx-auto md:mx-0">
          
          <h1 
            className="font-serif font-black text-5xl sm:text-6xl md:text-7xl lg:text-[4.5rem] italic tracking-tight leading-[1.1]"
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
          
          <h2 className="text-white text-xl sm:text-2xl md:text-3xl font-bold leading-snug drop-shadow-lg">
            {about.tagline || 'Ang Paboritong Siomai ng Bayan'}
          </h2>

          <p className="text-zinc-200 text-base sm:text-lg font-medium max-w-2xl drop-shadow-md leading-relaxed">
            {home.hero_subtitle || 'Premium Cebuano Siomai, Inspired by Heritage. Pork and beef dimsum.'}
          </p>

          <div className="flex flex-col sm:flex-row gap-3 pt-2 w-full sm:w-auto px-4 sm:px-0">
            <button 
              onClick={() => document.getElementById('products')?.scrollIntoView({ behavior: 'smooth' })}
              className="px-6 py-2.5 rounded-full bg-[#cf030f] hover:bg-[#a0020b] text-white font-bold text-sm sm:text-base transition-all shadow-xl hover:shadow-[#cf030f]/30 hover:-translate-y-1"
            >
              Explore Menu
            </button>
            <button 
              onClick={onOpenFranchiseModal}
              className="px-6 py-2.5 rounded-full bg-[#18572c] hover:bg-[#113d1e] text-white font-bold text-sm sm:text-base border-2 border-white transition-all shadow-xl hover:-translate-y-1"
            >
              {home.cta_button || 'Inquire about Franchising'}
            </button>
          </div>

          <div className="flex items-center justify-center md:justify-start gap-3 mt-6 text-white/90 font-medium animate-fadeIn">
            <span className="text-sm">We are available on</span>
            <div className="bg-[#D70F64] px-4 py-1.5 rounded-full shadow-lg flex items-center gap-2 hover:scale-105 transition-transform cursor-pointer" title="Order via Foodpanda">
              <span className="font-bold text-white text-sm tracking-wide">foodpanda</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
