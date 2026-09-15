import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCMS } from '../context/CMSContext';

const SiomaiIcon = ({ className }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M5 12c0 4.418 3.134 8 7 8s7-3.582 7-8" />
    <path d="M19 12c.5-1 .5-2 0-3-.5-1-1.5-1-2.5-1-1 0-1.5 1-2 1.5C14 9 13.5 8 12.5 8 11.5 8 11 9 10.5 9.5 10 9 9.5 8 8.5 8 7.5 8 6.5 9 6 10c-.5 1-.5 2 0 3" />
    <circle cx="12" cy="11" r="1.5" fill="currentColor" />
  </svg>
);

export default function SplashScreen({ children }) {
  const { cms, loading } = useCMS();
  const [minTimePassed, setMinTimePassed] = useState(false);

  useEffect(() => {
    // Force a minimum display time of 2.5 seconds for branding impact
    // while the CMS and images load in the background
    const timer = setTimeout(() => {
      setMinTimePassed(true);
    }, 2500);
    return () => clearTimeout(timer);
  }, []);

  // Splash screen is visible if we are still fetching data OR the minimum time hasn't passed
  const isActuallyLoading = loading || !minTimePassed;

  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 95) return prev;
        return prev + Math.random() * 15;
      });
    }, 300);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (!isActuallyLoading) {
      setProgress(100);
    }
  }, [isActuallyLoading]);

  // Render children immediately so images/assets begin downloading,
  // but keep them visually hidden if you want, or just let them sit behind the fixed splash screen.
  
  return (
    <>
      <AnimatePresence>
        {isActuallyLoading && (
          <motion.div
            key="splash"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.8, ease: "easeInOut" }}
            className="fixed inset-0 z-[9999] bg-[#18572c] flex flex-col items-center justify-center overflow-hidden"
          >
            {/* Background Pattern */}
            <svg className="absolute inset-0 w-full h-full opacity-10 pointer-events-none mix-blend-screen" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <pattern id="splashScales" width="40" height="20" patternUnits="userSpaceOnUse" patternTransform="scale(2.5)">
                  <path d="M0,0 a20,20 0 0,0 40,0" fill="none" stroke="#D4AF37" strokeWidth="1" />
                  <path d="M-20,10 a20,20 0 0,0 40,0" fill="none" stroke="#D4AF37" strokeWidth="1" />
                  <path d="M20,10 a20,20 0 0,0 40,0" fill="none" stroke="#D4AF37" strokeWidth="1" />
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#splashScales)" />
            </svg>
            
            {/* Logo animation */}
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="relative z-10 flex flex-col items-center"
            >
              <div className="mb-10">
                <img src={cms?.about?.logo_url || '/mississiomai.png'} alt="Misis Siomai Cebu Logo" className="w-48 h-48 sm:w-64 sm:h-64 object-contain drop-shadow-2xl" />
              </div>
              
              <div className="flex flex-col items-center w-full max-w-[200px] sm:max-w-[280px]">
                <div className="flex justify-center gap-3 mb-4 text-[#D4AF37]">
                  {[0, 1, 2].map((i) => (
                    <motion.div
                      key={i}
                      animate={{ y: [0, -10, 0] }}
                      transition={{ duration: 0.6, repeat: Infinity, delay: i * 0.2 }}
                    >
                      <SiomaiIcon className="w-8 h-8 drop-shadow-md" />
                    </motion.div>
                  ))}
                </div>
                
                {/* Progress bar container */}
                <div className="w-full h-2 bg-emerald-950/50 border border-[#D4AF37]/30 rounded-full overflow-hidden relative shadow-inner">
                  <motion.div 
                    className="absolute top-0 left-0 h-full bg-gradient-to-r from-[#D4AF37] to-amber-300 rounded-full shadow-[0_0_10px_rgba(212,175,55,0.5)]"
                    initial={{ width: 0 }}
                    animate={{ width: `${progress}%` }}
                    transition={{ ease: "easeOut", duration: 0.2 }}
                  />
                </div>
                <div className="mt-4 text-[#D4AF37] font-black tracking-[0.2em] uppercase text-xs sm:text-sm animate-pulse drop-shadow-md">
                  Preparing Dimsum... {Math.round(progress)}%
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* The main app content renders here and preloads in the background */}
      {children}
    </>
  );
}
