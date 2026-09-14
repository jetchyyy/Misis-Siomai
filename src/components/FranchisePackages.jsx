import React from 'react';
import { Store, Check, ArrowRight, ShieldCheck, DollarSign, Award, Zap } from 'lucide-react';
import { useCMS } from '../context/CMSContext';

export default function FranchisePackages({ onSelectPackage }) {
  const { cms } = useCMS();
  const packages = cms.packages || [];

  return (
    <section id="franchise" className="py-20 md:py-28 bg-gradient-to-b from-amber-50/30 via-[#FFFDF7] to-amber-50/20 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-100 text-rose-800 text-xs font-bold uppercase tracking-wider">
            <Zap className="w-4 h-4 text-rose-600" />
            Turnkey Business Opportunity
          </div>
          <h2 className="font-heading font-extrabold text-3xl sm:text-4xl lg:text-5xl text-zinc-900 tracking-tight">
            Choose Your <span className="text-rose-600">Franchise Package</span>
          </h2>
          <p className="text-base text-zinc-600">
            Start your own food business with our proven, low-capital turnkey franchise packages. Zero royalty fees, no monthly quotas!
          </p>
        </div>

        {/* Feature Highlights Banner */}
        <div className="mt-10 p-4 sm:p-6 rounded-3xl bg-white border border-rose-900/10 shadow-md grid grid-cols-1 md:grid-cols-3 gap-6 text-center md:text-left">
          <div className="flex items-center gap-4 justify-center md:justify-start">
            <div className="w-12 h-12 rounded-2xl bg-rose-100 text-rose-700 flex items-center justify-center shrink-0">
              <DollarSign className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-heading font-extrabold text-base text-zinc-900">₱0 Royalty Fees</h4>
              <p className="text-xs text-zinc-600">Keep 100% of your store net profits every month.</p>
            </div>
          </div>

          <div className="flex items-center gap-4 justify-center md:justify-start">
            <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center shrink-0">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-heading font-extrabold text-base text-zinc-900">Turnkey Setup</h4>
              <p className="text-xs text-zinc-600">Includes cart, equipment, initial stocks & training.</p>
            </div>
          </div>

          <div className="flex items-center gap-4 justify-center md:justify-start">
            <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
              <Award className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-heading font-extrabold text-base text-zinc-900">High Profit Margins</h4>
              <p className="text-xs text-zinc-600">Average 45% - 60% gross profit margin per order.</p>
            </div>
          </div>
        </div>

        {/* Packages Grid */}
        <div className="mt-12 grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch">
          {packages.map((pkg, idx) => {
            const isPopular = pkg.is_popular;
            return (
              <div
                key={pkg.id || idx}
                className={`glass-card rounded-3xl p-8 flex flex-col justify-between transition-all duration-300 relative bg-white ${
                  isPopular ? 'border-rose-500 shadow-xl ring-2 ring-rose-500/20' : 'border-zinc-200 hover:border-rose-400'
                }`}
              >
                {/* Popular Tag */}
                {isPopular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-gradient-to-r from-rose-600 to-amber-500 text-white font-heading font-extrabold text-xs tracking-wider shadow-md uppercase">
                    MOST POPULAR PACKAGE
                  </div>
                )}

                <div>
                  <div className="flex items-center justify-between">
                    <div className="w-12 h-12 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center">
                      <Store className="w-6 h-6" />
                    </div>
                    {pkg.badge && (
                      <span className="px-3 py-1 rounded-full text-xs font-extrabold bg-rose-100 text-rose-800">
                        {pkg.badge}
                      </span>
                    )}
                  </div>

                  <h3 className="font-heading font-extrabold text-2xl text-zinc-900 mt-4">
                    {pkg.name}
                  </h3>
                  <p className="text-xs text-zinc-500 mt-1 min-h-[36px]">
                    {pkg.description}
                  </p>

                  {/* Price */}
                  <div className="mt-6 p-4 rounded-2xl bg-rose-50/60 border border-rose-100">
                    <span className="text-xs font-semibold text-zinc-500 block uppercase tracking-wider">All-In Investment</span>
                    <div className="font-heading font-black text-3xl sm:text-4xl text-rose-600 mt-1">
                      {pkg.price}
                    </div>
                  </div>

                  {/* Inclusions */}
                  <div className="mt-6 space-y-3">
                    <h4 className="text-xs font-extrabold uppercase tracking-wider text-zinc-400">Package Inclusions:</h4>
                    {(pkg.features || []).map((item, fIdx) => (
                      <div key={fIdx} className="flex items-start gap-2 text-xs text-zinc-700 font-medium">
                        <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                        <span>{item}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Apply CTA */}
                <div className="mt-8 pt-6 border-t border-zinc-100">
                  <button
                    onClick={() => onSelectPackage(pkg.name)}
                    className={`w-full py-3.5 rounded-2xl font-heading font-extrabold text-sm transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer ${
                      isPopular
                        ? 'bg-gradient-to-r from-rose-600 to-rose-700 hover:from-rose-500 hover:to-rose-600 text-white shadow-lg shadow-rose-600/30 hover:-translate-y-0.5'
                        : 'bg-zinc-900 hover:bg-rose-600 text-white shadow-md hover:-translate-y-0.5'
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

      </div>
    </section>
  );
}
