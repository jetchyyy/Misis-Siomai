import React from 'react';
import { Link } from 'react-router-dom';
import { useCMS } from '../context/CMSContext';
import { Phone, Mail, MapPin, Share2, Heart } from 'lucide-react';

export default function Footer() {
  const { cms } = useCMS();
  const { about, contact } = cms;

  return (
    <footer className="bg-[#FAF3E3] text-zinc-800 pt-16 pb-12 border-t-[4px] border-[#cf030f] relative overflow-hidden">
      {/* Subtle Pattern */}
      <div className="absolute inset-0 bg-[radial-gradient(#D4AF37_1px,transparent_1px)] [background-size:30px_30px] opacity-10"></div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 pb-12 border-b border-[#D4AF37]/40 items-center">
          
          {/* Brand Info */}
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
              <div className="bg-[#18572c] p-3 rounded-2xl flex items-center justify-center shrink-0 shadow-lg">
                <img src="/mississiomai.png" alt="Misis Siomai Logo" className="w-16 h-16 object-contain" />
              </div>
              <div>
                <h3 className="font-serif font-black text-3xl text-[#18572c] tracking-wide drop-shadow-sm">
                  {about.brand_name || 'Misis Siomai Cebu'}
                </h3>
                <p className="text-xs text-[#cf030f] font-black tracking-widest uppercase mt-1">
                  {about.tagline || 'Ang Paboritong Siomai ng Bayan'}
                </p>
              </div>
            </div>
          </div>

          {/* Contact Details (from Business Card) */}
          <div className="space-y-4">
            <h4 className="font-serif font-bold text-sm text-[#cf030f] uppercase tracking-widest">Official Management Contact</h4>
            <div className="p-5 rounded-2xl bg-white border border-[#D4AF37]/40 space-y-3 text-xs text-zinc-700 shadow-sm">
              <p className="font-bold text-[#18572c] text-sm font-serif">
                General Manager: <span className="text-zinc-900">{contact.general_manager || 'Lendice Marie A. Cal'}</span>
              </p>
              <div className="flex items-start gap-3 mt-4">
                <MapPin className="w-4 h-4 text-[#cf030f] shrink-0 mt-0.5" />
                <span>{contact.address}</span>
              </div>
              <div className="flex items-center gap-3 font-mono text-[#18572c] font-bold">
                <Phone className="w-4 h-4 text-[#D4AF37] shrink-0" />
                <span>{(contact.phones || []).join(' / ')}</span>
              </div>
              <div className="flex items-center gap-3 text-zinc-700">
                <Mail className="w-4 h-4 text-[#cf030f] shrink-0" />
                <span>{(contact.emails || []).join(' / ')}</span>
              </div>
              <div className="flex items-center gap-3 text-blue-600 font-semibold pt-3 border-t border-[#D4AF37]/20 mt-3">
                <Share2 className="w-4 h-4 text-blue-500 shrink-0" />
                <a href={contact.facebook_url || 'https://facebook.com/MisisSiomaiCebu'} target="_blank" rel="noreferrer" className="hover:text-blue-800 transition-colors">
                  {contact.facebook || 'Misis Siomai Cebu'}
                </a>
              </div>
            </div>
          </div>

        </div>

        {/* Bottom copyright */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-zinc-600 gap-4">
          <p>© {new Date().getFullYear()} {about.brand_name || 'Misis Siomai Cebu'}. All rights reserved.</p>
          <p className="flex items-center gap-1">
            Created by <a href="https://www.facebook.com/odysseysystems" target="_blank" rel="noreferrer" className="text-[#cf030f] hover:text-[#18572c] font-bold transition-colors ml-0.5">Odyssey</a>
          </p>
        </div>

      </div>
    </footer>
  );
}
