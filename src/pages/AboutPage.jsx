import React from 'react';
import { useCMS } from '../context/CMSContext';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import MisisSiomaiLogo from '../components/MisisSiomaiLogo';
import { Target, Compass, Award, CheckCircle2, ShieldCheck, HeartHandshake, Phone, Mail, MapPin } from 'lucide-react';

export default function AboutPage({ onOpenFranchiseModal }) {
  const { cms } = useCMS();
  const { about, contact } = cms;

  return (
    <div className="min-h-screen bg-[#FFFDF7] text-zinc-900 selection:bg-rose-500 selection:text-white flex flex-col justify-between">
      <div>
        <Navbar onOpenFranchiseModal={onOpenFranchiseModal} />

        <div className="pt-28 pb-20">
          
          {/* Header Banner */}
          <section className="bg-gradient-to-b from-emerald-900 to-emerald-950 text-white py-20 relative overflow-hidden">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10 space-y-4">
              <div className="mx-auto w-24 h-24 mb-4">
                <MisisSiomaiLogo className="w-full h-full" />
              </div>
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-800/80 border border-emerald-700 text-emerald-300 text-xs font-bold uppercase tracking-widest">
                <Award className="w-4 h-4 text-emerald-400" />
                <span>Our Heritage & Purpose</span>
              </div>
              <h1 className="font-heading font-extrabold text-4xl sm:text-5xl text-white">
                About <span className="text-rose-400">{about.brand_name || 'Misis Siomai Cebu'}</span>
              </h1>
              <p className="text-base sm:text-lg text-emerald-200 max-w-2xl mx-auto font-medium">
                {about.tagline || 'Ang Paboritong Siomai ng Bayan'}
              </p>
            </div>
          </section>

          {/* Mission & Vision Section */}
          <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              
              {/* Mission Card */}
              <div className="p-8 sm:p-10 rounded-3xl bg-white border border-emerald-900/10 shadow-xl space-y-4 relative overflow-hidden group hover:border-emerald-500/30 transition-all">
                <div className="w-14 h-14 rounded-2xl bg-rose-100 text-rose-600 flex items-center justify-center shadow-md">
                  <Target className="w-7 h-7" />
                </div>
                <div className="inline-block px-3 py-1 rounded-full bg-rose-50 text-rose-800 font-extrabold text-xs uppercase tracking-wider">
                  Our Core Mission
                </div>
                <h2 className="font-heading font-extrabold text-2xl sm:text-3xl text-zinc-900">
                  Empowering Entrepreneurs
                </h2>
                <p className="text-zinc-600 leading-relaxed font-sans text-base">
                  {about.mission}
                </p>
              </div>

              {/* Vision Card */}
              <div className="p-8 sm:p-10 rounded-3xl bg-white border border-emerald-900/10 shadow-xl space-y-4 relative overflow-hidden group hover:border-emerald-500/30 transition-all">
                <div className="w-14 h-14 rounded-2xl bg-emerald-100 text-emerald-600 flex items-center justify-center shadow-md">
                  <Compass className="w-7 h-7" />
                </div>
                <div className="inline-block px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 font-extrabold text-xs uppercase tracking-wider">
                  Our Shared Vision
                </div>
                <h2 className="font-heading font-extrabold text-2xl sm:text-3xl text-zinc-900">
                  Nationwide Quality & Leadership
                </h2>
                <p className="text-zinc-600 leading-relaxed font-sans text-base">
                  {about.vision}
                </p>
              </div>

            </div>
          </section>

          {/* Brand Story */}
          <section className="py-12 bg-amber-50/40 border-y border-amber-900/5">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6 text-center">
              <h2 className="font-heading font-extrabold text-3xl sm:text-4xl text-zinc-900">
                The Misis Siomai Story
              </h2>
              <div className="w-20 h-1.5 bg-gradient-to-r from-emerald-600 to-rose-600 mx-auto rounded-full" />
              <p className="text-zinc-700 leading-relaxed text-lg font-sans">
                {about.story}
              </p>
            </div>
          </section>

          {/* Core Values */}
          <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
            <div className="text-center space-y-2">
              <h2 className="font-heading font-extrabold text-3xl text-zinc-900">Why Franchise Partners Trust Us</h2>
              <p className="text-sm text-zinc-500">Uncompromising commitment to quality and prosperity</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {(about.values || []).map((val, idx) => (
                <div key={idx} className="p-6 rounded-2xl bg-white border border-zinc-200 shadow-md space-y-3 flex flex-col items-center text-center">
                  <CheckCircle2 className="w-8 h-8 text-emerald-600" />
                  <span className="font-heading font-bold text-base text-zinc-800">{val}</span>
                </div>
              ))}
            </div>
          </section>

          {/* General Manager Info */}
          <section className="py-12 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="p-8 rounded-3xl bg-emerald-900 text-white shadow-2xl flex flex-col sm:flex-row items-center gap-6">
              <div className="w-20 h-20 rounded-full bg-emerald-800 border-2 border-emerald-400 flex items-center justify-center text-2xl font-bold font-heading shrink-0">
                LMC
              </div>
              <div className="space-y-2 text-center sm:text-left">
                <span className="px-3 py-1 rounded-full bg-emerald-800 text-emerald-300 text-xs font-bold uppercase tracking-wider">
                  General Manager & Leadership
                </span>
                <h3 className="font-heading font-extrabold text-2xl text-white">
                  {contact.general_manager || 'Lendice Marie A. Cal'}
                </h3>
                <div className="text-xs text-emerald-200 space-y-1 pt-1">
                  <p className="flex items-center justify-center sm:justify-start gap-2">
                    <MapPin className="w-4 h-4 text-emerald-400" />
                    <span>{contact.address}</span>
                  </p>
                  <p className="flex items-center justify-center sm:justify-start gap-2">
                    <Phone className="w-4 h-4 text-emerald-400" />
                    <span>{(contact.phones || []).join(' / ')}</span>
                  </p>
                  <p className="flex items-center justify-center sm:justify-start gap-2">
                    <Mail className="w-4 h-4 text-emerald-400" />
                    <span>{(contact.emails || []).join(' / ')}</span>
                  </p>
                </div>
              </div>
            </div>
          </section>

        </div>
      </div>
      <Footer />
    </div>
  );
}
