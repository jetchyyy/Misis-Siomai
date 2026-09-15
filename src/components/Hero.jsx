import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCMS } from '../context/CMSContext';
import siomaiBg from '../assets/siomai.jpg';
import { motion, useInView, useSpring, useTransform, AnimatePresence } from 'framer-motion';

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
  const navigate = useNavigate();
  const { cms } = useCMS();
  const { home, about } = cms;

  const [currentSlide, setCurrentSlide] = useState(0);
  const slides = ['/siomai_nobg.png', '/ngohiong_nobg.png'];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 4000);
    return () => clearInterval(timer);
  }, [slides.length]);

  const heroBg = home.hero_bg_image || siomaiBg;

  return (
    <section id="hero" className="relative pt-20 pb-0 bg-[#2d1b11]">
      <div className="relative w-full max-w-[1600px] mx-auto min-h-[calc(100dvh-5rem)] flex items-center justify-start p-6 md:p-12 overflow-hidden">

        {/* Background Image with Overlay */}
        <div className="absolute inset-0 z-0">
          <img
            src={heroBg}
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
        <div className="relative z-20 w-full grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center mt-6 md:mt-0 md:px-8 lg:px-12 mx-auto">
          
          {/* Left Text Content */}
          <div className="space-y-4 sm:space-y-6 flex flex-col items-center lg:items-start text-center lg:text-left max-w-2xl mx-auto lg:mx-0">
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

            <div className="flex flex-col sm:flex-row gap-3 pt-2 w-full sm:w-auto px-4 sm:px-0">
              <button
                onClick={() => {
                  const el = document.getElementById('menu') || document.getElementById('products');
                  if (el) {
                    el.scrollIntoView({ behavior: 'smooth' });
                  } else {
                    navigate('/products');
                  }
                }}
                className="px-6 py-2.5 rounded-full bg-[#cf030f] hover:bg-[#a0020b] text-white font-bold text-sm sm:text-base transition-all shadow-xl hover:shadow-[#cf030f]/30 hover:-translate-y-1 cursor-pointer"
              >
                Explore Menu
              </button>
              <button
                onClick={() => {
                  const el = document.getElementById('franchise');
                  if (el) {
                    el.scrollIntoView({ behavior: 'smooth' });
                  } else {
                    navigate('/packages');
                  }
                }}
                className="px-6 py-2.5 rounded-full bg-[#18572c] hover:bg-[#113d1e] text-white font-bold text-sm sm:text-base border-2 border-white transition-all shadow-xl hover:-translate-y-1 cursor-pointer"
              >
                {home.cta_button || 'Explore Franchise Packages'}
              </button>
            </div>

            <div className="flex items-center justify-center lg:justify-start gap-3 mt-6 text-white/90 font-medium animate-fadeIn">
              <span className="text-sm">We are available on</span>
              <a 
                href={cms.contact?.foodpanda_url === 'https://www.foodpanda.ph/' ? 'https://www.foodpanda.ph/chain/ce9uv/misis-siomai' : (cms.contact?.foodpanda_url || 'https://www.foodpanda.ph/chain/ce9uv/misis-siomai')} 
                target="_blank" 
                rel="noreferrer"
                className="bg-[#D70F64] px-4 py-1.5 rounded-full shadow-lg flex items-center gap-2 hover:scale-105 transition-transform cursor-pointer" 
                title="Order via Foodpanda"
              >
                <span className="font-bold text-white text-sm tracking-wide">foodpanda</span>
              </a>
            </div>
          </div>

          {/* Right Image Panel */}
          <div className="hidden lg:flex justify-center items-center relative h-[400px]">
            <AnimatePresence mode="wait">
              <motion.img 
                key={currentSlide}
                src={slides[currentSlide]} 
                alt="Misis Siomai Specialties" 
                className="absolute w-full max-w-xl h-[400px] object-contain drop-shadow-2xl z-20"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0, y: [0, -15, 0] }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ 
                  opacity: { duration: 0.5 },
                  x: { duration: 0.5 },
                  y: { repeat: Infinity, duration: 4, ease: "easeInOut" }
                }}
              />
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
}
