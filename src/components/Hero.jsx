import React from 'react';
import { Flame, CheckCircle2, ArrowRight, TrendingUp, Store, ShieldCheck, Sparkles } from 'lucide-react';

export default function Hero({ onOpenFranchiseModal }) {
  return (
    <section id="hero" className="relative pt-32 pb-20 md:pt-40 md:pb-28 overflow-hidden bg-gradient-to-b from-amber-50/50 via-[#FFFDF7] to-[#FFFDF7]">
      
      {/* Background Decorative Circles */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-br from-rose-400/10 via-amber-400/10 to-transparent rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-20 right-[-10%] w-96 h-96 bg-rose-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* Left Hero Content */}
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            
            {/* Top Proof Tag */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-rose-100/80 border border-rose-300/60 text-rose-800 text-xs font-bold shadow-xs">
              <Sparkles className="w-4 h-4 text-rose-600 animate-pulse" />
              <span>100% Real Pork & Beef • No Extenders • 50+ Branches Nationwide</span>
            </div>

            {/* Main Headline */}
            <h1 className="font-heading font-black text-4xl sm:text-5xl lg:text-6xl text-zinc-900 tracking-tight leading-[1.15]">
              Ang Paboritong <br className="hidden sm:block" />
              <span className="bg-gradient-to-r from-rose-600 via-rose-500 to-amber-500 bg-clip-text text-transparent">
                Siomai ng Bayan
              </span>
            </h1>

            {/* Subtext */}
            <p className="text-base sm:text-lg text-zinc-600 max-w-2xl mx-auto lg:mx-0 leading-relaxed font-normal">
              Indulge in juicy, authentic steamed & crispy fried dimsum crafted daily with 100% pure pork & beef. Own a high-margin food cart franchise with <strong className="text-zinc-900 font-semibold">zero royalty fees</strong> and fast return on investment!
            </p>

            {/* Bullet Proof Points */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-2 max-w-xl mx-auto lg:mx-0 text-left">
              {[
                '100% Pure Meat Quality',
                'Zero Royalty Fees',
                'Free Staff Training',
                'Turnkey Store Setup',
                'High Profit Margin',
                '3-6 Months Target ROI',
              ].map((item, idx) => (
                <div key={idx} className="flex items-center gap-2 text-xs sm:text-sm font-semibold text-zinc-800">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>{item}</span>
                </div>
              ))}
            </div>

            {/* Hero Dual Buttons */}
            <div className="pt-4 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
              <button
                onClick={onOpenFranchiseModal}
                className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-gradient-to-r from-rose-600 to-rose-700 hover:from-rose-500 hover:to-rose-600 text-white font-heading font-extrabold text-base shadow-xl shadow-rose-600/30 hover:shadow-rose-600/40 hover:-translate-y-0.5 transition-all duration-300 flex items-center justify-center gap-2 group cursor-pointer"
              >
                <span>Inquire Franchise Now</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
              <a
                href="#menu"
                className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-white border-2 border-zinc-200 hover:border-rose-300 text-zinc-800 font-heading font-bold text-base shadow-xs hover:bg-rose-50/50 transition-all duration-300 text-center"
              >
                View Menu Showcase
              </a>
            </div>

            {/* Quick Franchise Teaser Badge */}
            <div className="pt-4 flex items-center justify-center lg:justify-start gap-4 text-xs text-zinc-500">
              <div className="flex -space-x-2 overflow-hidden">
                <img className="inline-block h-8 w-8 rounded-full ring-2 ring-white" src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80" alt="Franchisee" />
                <img className="inline-block h-8 w-8 rounded-full ring-2 ring-white" src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=100&q=80" alt="Franchisee" />
                <img className="inline-block h-8 w-8 rounded-full ring-2 ring-white" src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=100&q=80" alt="Franchisee" />
              </div>
              <span className="font-medium text-zinc-700">Joined by <span className="font-bold text-rose-600">50+ successful franchisees</span> across Metro Manila & provinces!</span>
            </div>

          </div>

          {/* Right Hero Visual Showcase */}
          <div className="lg:col-span-5 relative">
            <div className="relative mx-auto max-w-md lg:max-w-none">
              
              {/* Main Image Banner */}
              <div className="relative rounded-3xl overflow-hidden shadow-2xl shadow-rose-950/15 border-4 border-white glass-card animate-float">
                <img
                  src="https://images.unsplash.com/photo-1541696432-82c6da8ce7bf?auto=format&fit=crop&w=800&q=80"
                  alt="Misis Siomai Platter"
                  className="w-full h-[400px] sm:h-[460px] object-cover hover:scale-105 transition-transform duration-700"
                />
                
                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-zinc-950/80 via-transparent to-transparent" />
                
                {/* Floating Image Text */}
                <div className="absolute bottom-6 left-6 right-6 text-white">
                  <div className="flex items-center gap-2 text-amber-400 font-bold text-xs uppercase tracking-wider mb-1">
                    <Flame className="w-4 h-4 fill-amber-400" />
                    Signature Bestseller
                  </div>
                  <h3 className="font-heading font-extrabold text-2xl">Steamed Pork & Beef Siomai</h3>
                  <p className="text-xs text-zinc-300 mt-1">Served piping hot with toasted chili garlic oil & calamansi</p>
                </div>
              </div>

              {/* Floating Badge 1: Low Capital */}
              <div className="absolute -top-6 -left-6 glass-card p-4 rounded-2xl shadow-lg border border-amber-300/40 hidden sm:flex items-center gap-3 bg-white/95">
                <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center font-bold">
                  <Store className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-[11px] font-bold uppercase tracking-wider text-zinc-500">Franchise Starts At</div>
                  <div className="font-heading font-extrabold text-lg text-zinc-900">₱99,000 All-In</div>
                </div>
              </div>

              {/* Floating Badge 2: Fast ROI */}
              <div className="absolute -bottom-6 -right-6 glass-card p-4 rounded-2xl shadow-lg border border-rose-300/40 hidden sm:flex items-center gap-3 bg-white/95">
                <div className="w-10 h-10 rounded-xl bg-rose-100 text-rose-700 flex items-center justify-center font-bold">
                  <TrendingUp className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-[11px] font-bold uppercase tracking-wider text-zinc-500">Fast ROI Target</div>
                  <div className="font-heading font-extrabold text-lg text-emerald-600">3 to 6 Months</div>
                </div>
              </div>

            </div>
          </div>

        </div>

        {/* Stats Counter Bar */}
        <div className="mt-16 pt-10 border-t border-zinc-200/80 grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          <div className="space-y-1">
            <div className="font-heading font-extrabold text-3xl sm:text-4xl text-rose-600">50+</div>
            <div className="text-xs sm:text-sm font-semibold text-zinc-600">Active Stores Nationwide</div>
          </div>
          <div className="space-y-1">
            <div className="font-heading font-extrabold text-3xl sm:text-4xl text-zinc-900">10,000+</div>
            <div className="text-xs sm:text-sm font-semibold text-zinc-600">Daily Pieces Served</div>
          </div>
          <div className="space-y-1">
            <div className="font-heading font-extrabold text-3xl sm:text-4xl text-rose-600">₱0</div>
            <div className="text-xs sm:text-sm font-semibold text-zinc-600">Royalty & Renewal Fees</div>
          </div>
          <div className="space-y-1">
            <div className="font-heading font-extrabold text-3xl sm:text-4xl text-amber-500">100%</div>
            <div className="text-xs sm:text-sm font-semibold text-zinc-600">Pure Meat Guarantee</div>
          </div>
        </div>

      </div>
    </section>
  );
}
