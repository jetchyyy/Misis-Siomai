import React from 'react';
import { Share2 } from 'lucide-react';
import { useCMS } from '../context/CMSContext';
import { motion } from 'framer-motion';

export default function Socials() {
  const { cms } = useCMS();
  const contact = cms.contact || {};

  return (
    <section className="py-20 bg-[#FAF3E3] relative overflow-hidden border-t border-zinc-200">
      <div className="absolute inset-0 bg-[radial-gradient(#cf030f_1px,transparent_1px)] [background-size:30px_30px] opacity-[0.03]"></div>
      
      <motion.div 
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.7 }}
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10"
      >
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-12">
          <div className="inline-flex items-center gap-4 text-[#cf030f] text-[10px] sm:text-xs font-black uppercase tracking-widest">
            <span className="w-8 h-[2px] bg-[#cf030f]/60"></span>
            Join Our Community
            <span className="w-8 h-[2px] bg-[#cf030f]/60"></span>
          </div>
          <h2 className="font-serif font-black text-4xl sm:text-5xl lg:text-6xl text-[#18572c] tracking-tight leading-tight">
            Follow <span className="text-[#cf030f] italic">Misis Siomai</span>
          </h2>
          <p className="text-base text-zinc-700 mt-4 leading-relaxed">
            Stay updated with our latest branches, promos, and dimsum cravings.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
          <a
            href={contact.facebook_url || 'https://www.facebook.com/profile.php?id=100028835748373'}
            target="_blank" rel="noreferrer"
            className="group flex flex-col items-center gap-4 p-8 rounded-3xl bg-white border-2 border-[#D4AF37]/30 shadow-xl hover:shadow-[#18572c]/20 hover:border-[#18572c] hover:-translate-y-2 transition-all w-full max-w-xs"
          >
            <div className="w-16 h-16 rounded-full bg-[#18572c]/10 text-[#18572c] group-hover:bg-[#18572c] group-hover:text-white flex items-center justify-center transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-facebook"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>
            </div>
            <div className="text-center">
              <h3 className="font-serif font-black text-2xl text-zinc-900">Facebook</h3>
              <p className="text-sm text-zinc-500 mt-1">Official Page</p>
            </div>
          </a>
        </div>
      </motion.div>
    </section>
  );
}
