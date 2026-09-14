import React from 'react';
import { Store, Check, ArrowRight, ShieldCheck, DollarSign, Award, Zap } from 'lucide-react';
import { useCMS } from '../context/CMSContext';
import { motion } from 'framer-motion';

export default function FranchisePackages({ onSelectPackage }) {
  const { cms } = useCMS();
  const packages = cms.packages || [];

  return (
    <section id="franchise" className="py-20 md:py-32 bg-[#FAF3E3] relative overflow-hidden">
      
      {/* Decorative Gold Rings (Moon Gate styling) */}
      <div className="absolute -top-32 -right-32 w-96 h-96 rounded-full border-[2px] border-[#D4AF37]/20 pointer-events-none"></div>
      <div className="absolute -bottom-32 -left-32 w-[500px] h-[500px] rounded-full border-[8px] border-[#D4AF37]/10 pointer-events-none"></div>

      <motion.div 
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.7 }}
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10"
      >
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-4 text-[#cf030f] text-[10px] sm:text-xs font-black uppercase tracking-widest">
            <span className="w-8 h-[2px] bg-[#cf030f]/60"></span>
            Turnkey Business Opportunity
            <span className="w-8 h-[2px] bg-[#cf030f]/60"></span>
          </div>
          <h2 className="font-serif font-black text-4xl sm:text-5xl lg:text-6xl text-[#18572c] tracking-tight leading-tight">
            Choose Your <br className="hidden sm:block" /><span 
              className="text-[#cf030f] italic"
              style={{ 
                textShadow: `
                  -1px -1px 0 #fff,  
                   1px -1px 0 #fff,
                  -1px  1px 0 #fff,
                   1px  1px 0 #fff,
                   2px  4px 8px rgba(0,0,0,0.15)
                `
              }}
            >Franchise Package</span>
          </h2>
          <p className="text-base text-zinc-700 mt-4 leading-relaxed">
            Start your own food business with our proven, low-capital turnkey franchise packages. Zero royalty fees, no monthly quotas!
          </p>
        </div>

        {/* Feature Highlights Banner (Scroll Style) */}
        <div className="mt-14 p-6 sm:p-8 bg-[#FAF3E3] border-y-4 border-x border-[#D4AF37] shadow-sm rounded-xl grid grid-cols-1 md:grid-cols-3 gap-8 text-center md:text-left relative overflow-hidden">
          {/* Subtle pattern */}
          <div className="absolute inset-0 bg-[radial-gradient(#D4AF37_1px,transparent_1px)] [background-size:20px_20px] opacity-10"></div>

          <div className="flex items-center gap-4 justify-center md:justify-start relative z-10">
            <div className="w-14 h-14 rounded-full border-2 border-[#D4AF37] bg-white text-[#cf030f] flex items-center justify-center shrink-0 shadow-sm">
              <DollarSign className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-serif font-black text-lg text-[#18572c]">₱0 Royalty Fees</h4>
              <p className="text-sm text-zinc-600 mt-1">Keep 100% of your store net profits every month.</p>
            </div>
          </div>

          <div className="flex items-center gap-4 justify-center md:justify-start relative z-10">
            <div className="w-14 h-14 rounded-full border-2 border-[#D4AF37] bg-white text-[#cf030f] flex items-center justify-center shrink-0 shadow-sm">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-serif font-black text-lg text-[#18572c]">Turnkey Setup</h4>
              <p className="text-sm text-zinc-600 mt-1">Includes cart, equipment, initial stocks & training.</p>
            </div>
          </div>

          <div className="flex items-center gap-4 justify-center md:justify-start relative z-10">
            <div className="w-14 h-14 rounded-full border-2 border-[#D4AF37] bg-white text-[#cf030f] flex items-center justify-center shrink-0 shadow-sm">
              <Award className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-serif font-black text-lg text-[#18572c]">High Profit Margins</h4>
              <p className="text-sm text-zinc-600 mt-1">Average 45% - 60% gross profit margin per order.</p>
            </div>
          </div>
        </div>

        {/* Packages Grid */}
        <div className="mt-16 grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch">
          {packages.map((pkg, idx) => {
            const isPopular = pkg.is_popular;
            return (
              <div
                key={pkg.id || idx}
                className={`rounded-[2rem] p-8 flex flex-col justify-between transition-all duration-500 relative border ${
                  isPopular 
                    ? 'bg-gradient-to-b from-[#cf030f] to-[#8a020a] border-[#D4AF37] shadow-[0_20px_40px_-15px_rgba(207,3,15,0.4)] hover:-translate-y-2' 
                    : 'bg-white border-[#D4AF37]/30 shadow-xl hover:shadow-2xl hover:border-[#D4AF37] hover:-translate-y-2'
                }`}
              >
                {/* Popular Tag (Gold Seal) */}
                {isPopular && (
                  <div className="absolute -top-5 left-1/2 -translate-x-1/2 px-6 py-2 rounded-b-xl rounded-t-sm bg-gradient-to-b from-[#e6cd81] to-[#D4AF37] text-[#8a020a] font-black text-xs tracking-widest shadow-lg uppercase border border-[#b38e24] z-20">
                    Most Popular
                    <div className="absolute -bottom-2 left-0 w-full h-3 bg-[#D4AF37]" style={{ clipPath: 'polygon(0 0, 50% 100%, 100% 0)' }}></div>
                  </div>
                )}

                <div className="relative z-10">
                  <div className="flex items-center justify-between mb-4">
                    <div className={`w-14 h-14 rounded-full flex items-center justify-center border ${
                      isPopular ? 'bg-[#cf030f] border-[#D4AF37] text-[#D4AF37]' : 'bg-[#FAF3E3] border-[#D4AF37]/30 text-[#cf030f]'
                    }`}>
                      <Store className="w-6 h-6" />
                    </div>
                    {pkg.badge && (
                      <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border ${
                        isPopular ? 'bg-[#8a020a] text-[#D4AF37] border-[#D4AF37]/30' : 'bg-[#cf030f]/10 text-[#cf030f] border-[#cf030f]/20'
                      }`}>
                        {pkg.badge}
                      </span>
                    )}
                  </div>

                  <h3 className={`font-serif font-black text-3xl mt-4 ${isPopular ? 'text-white' : 'text-[#18572c]'}`}>
                    {pkg.name}
                  </h3>
                  <p className={`text-sm mt-3 min-h-[48px] leading-relaxed ${isPopular ? 'text-zinc-200' : 'text-zinc-600'}`}>
                    {pkg.description}
                  </p>

                  {/* Price */}
                  <div className={`mt-8 p-5 rounded-2xl border ${
                    isPopular ? 'bg-[#8a020a]/50 border-[#D4AF37]/30' : 'bg-[#FAF3E3] border-[#D4AF37]/30'
                  }`}>
                    <span className={`text-[10px] font-black uppercase tracking-widest block mb-1 ${isPopular ? 'text-[#D4AF37]' : 'text-zinc-500'}`}>
                      All-In Investment
                    </span>
                    <div className={`font-serif font-black text-4xl sm:text-4xl ${isPopular ? 'text-white' : 'text-[#cf030f]'}`}>
                      {pkg.price}
                    </div>
                  </div>

                  {/* Inclusions */}
                  <div className="mt-8 space-y-4">
                    <h4 className={`text-[10px] font-black uppercase tracking-widest ${isPopular ? 'text-[#D4AF37]' : 'text-[#18572c]'}`}>
                      Package Inclusions:
                    </h4>
                    {(pkg.features || []).map((item, fIdx) => (
                      <div key={fIdx} className="flex items-start gap-3">
                        <Check className={`w-4 h-4 shrink-0 mt-0.5 ${isPopular ? 'text-[#D4AF37]' : 'text-[#cf030f]'}`} />
                        <span className={`text-sm font-medium leading-relaxed ${isPopular ? 'text-zinc-100' : 'text-zinc-700'}`}>
                          {item}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Apply CTA */}
                <div className={`mt-10 pt-6 border-t ${isPopular ? 'border-[#D4AF37]/20' : 'border-zinc-200'}`}>
                  <button
                    onClick={() => onSelectPackage(pkg.name)}
                    className={`w-full py-4 rounded-xl font-bold text-sm transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer shadow-md ${
                      isPopular
                        ? 'bg-gradient-to-r from-[#e6cd81] to-[#D4AF37] hover:from-[#D4AF37] hover:to-[#b38e24] text-[#8a020a] hover:shadow-lg hover:shadow-[#D4AF37]/40'
                        : 'bg-[#cf030f] hover:bg-[#a6020c] text-white hover:shadow-lg hover:shadow-[#cf030f]/30'
                    }`}
                  >
                    <span>Apply for {pkg.name}</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>

      </motion.div>
    </section>
  );
}
